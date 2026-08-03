import 'dotenv/config';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import axios from 'axios';
import express from 'express';
import {renderExcelVideo} from './render.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = path.join(__dirname, 'public', 'audio');
const OUT_DIR = path.join(__dirname, 'out');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const DEFAULT_VOICE_ID =
	process.env.ELEVENLABS_VOICE_ID ?? '21m00Tcm4TlvDq8ikWAM';

/* -------------------------------------------------------------------------- */
/*                              Voix-off (ElevenLabs)                         */
/* -------------------------------------------------------------------------- */

/**
 * Génère la voix-off via ElevenLabs (endpoint "with-timestamps") et renvoie
 * à la fois le chemin du fichier audio et le timing mot par mot précis,
 * dérivé de l'alignement caractère par caractère renvoyé par l'API.
 */
async function synthesizeWithElevenLabs(script, voiceId, apiKey) {
	const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`;

	const {data} = await axios.post(
		url,
		{
			text: script,
			model_id: 'eleven_multilingual_v2',
			voice_settings: {stability: 0.5, similarity_boost: 0.75},
		},
		{
			headers: {
				'xi-api-key': apiKey,
				'Content-Type': 'application/json',
			},
		},
	);

	await mkdir(AUDIO_DIR, {recursive: true});
	const fileName = `voiceover-${randomUUID()}.mp3`;
	const filePath = path.join(AUDIO_DIR, fileName);
	await writeFile(filePath, Buffer.from(data.audio_base64, 'base64'));

	const words = alignmentToWordTimings(data.alignment);

	return {
		audioUrl: `audio/${fileName}`, // servi via staticFile() côté Remotion (dossier /public)
		words,
	};
}

/** Convertit l'alignement caractère par caractère d'ElevenLabs en mots chronométrés. */
function alignmentToWordTimings(alignment) {
	const {characters, character_start_times_seconds, character_end_times_seconds} =
		alignment;

	const words = [];
	let current = '';
	let start = null;

	for (let i = 0; i < characters.length; i++) {
		const char = characters[i];
		const isSpace = /\s/.test(char);

		if (!isSpace) {
			if (current === '') start = character_start_times_seconds[i];
			current += char;
		}

		const isLastChar = i === characters.length - 1;
		if ((isSpace || isLastChar) && current !== '') {
			words.push({
				text: current,
				start: Number(start.toFixed(3)),
				end: Number(character_end_times_seconds[i - (isSpace ? 1 : 0)].toFixed(3)),
			});
			current = '';
			start = null;
		}
	}

	return words;
}

/**
 * Estimation naïve du timing mot par mot lorsqu'aucun alignement précis n'est
 * disponible (ex : audioUrl fourni directement, sans passer par ElevenLabs).
 * Recommandé : fournir `words` explicitement pour une synchro parfaite.
 */
function estimateWordTimings(script, wordsPerSecond = 2.4) {
	const tokens = script.trim().split(/\s+/).filter(Boolean);
	let t = 0;
	return tokens.map((text) => {
		const duration = 1 / wordsPerSecond;
		const start = t;
		const end = t + duration * 0.82;
		t += duration;
		return {text, start: Number(start.toFixed(2)), end: Number(end.toFixed(2))};
	});
}

/* -------------------------------------------------------------------------- */
/*                                   Pipeline                                 */
/* -------------------------------------------------------------------------- */

/**
 * Pipeline complet : voix-off (si besoin) -> timing des sous-titres -> rendu Remotion.
 *
 * @param {object} payload - { title, script, excelData, audioUrl?, elevenLabsVoiceId?, words?, accentColor? }
 */
export async function generateVideo(payload) {
	const {
		title,
		script,
		excelData,
		audioUrl: providedAudioUrl,
		elevenLabsVoiceId,
		words: providedWords,
		accentColor = '#21A366',
		outputFileName,
	} = payload;

	if (!title || !script || !excelData) {
		throw new Error(
			'Payload invalide : title, script et excelData sont obligatoires.',
		);
	}

	let audioUrl = providedAudioUrl;
	let words = providedWords;

	if (!audioUrl && ELEVENLABS_API_KEY) {
		console.log('🎙️  Génération de la voix-off via ElevenLabs...');
		const result = await synthesizeWithElevenLabs(
			script,
			elevenLabsVoiceId ?? DEFAULT_VOICE_ID,
			ELEVENLABS_API_KEY,
		);
		audioUrl = result.audioUrl;
		words = words ?? result.words;
	}

	if (!words || words.length === 0) {
		console.log(
			'ℹ️  Aucun timing fourni, estimation approximative des sous-titres...',
		);
		words = estimateWordTimings(script);
	}

	const inputProps = {
		title,
		script,
		excelData: {category: 'formula', ...excelData},
		words,
		audioUrl,
		accentColor,
	};

	const outputPath = await renderExcelVideo({
		inputProps,
		outputFileName,
		outDir: OUT_DIR,
	});

	return {outputPath, inputProps};
}

/* -------------------------------------------------------------------------- */
/*                          CLI  &  Webhook (pour n8n)                        */
/* -------------------------------------------------------------------------- */

const isMainModule = () => {
	if (!process.argv[1]) return false;
	return import.meta.url === `file://${path.resolve(process.argv[1])}`;
};

async function runCli() {
	const dataPath = process.argv[2];
	if (!dataPath) {
		console.error(
			'Usage : node generate-video.js <chemin-vers-payload.json>\n' +
				'    ou : node generate-video.js --serve [--port 3000]',
		);
		process.exit(1);
	}

	const raw = await readFile(path.resolve(dataPath), 'utf-8');
	const payload = JSON.parse(raw);

	try {
		const {outputPath} = await generateVideo(payload);
		console.log(`\n🎉 Terminé. Vidéo disponible : ${outputPath}`);
	} catch (err) {
		console.error('❌ Échec de la génération :', err);
		process.exit(1);
	}
}

function runWebhookServer() {
	const app = express();
	app.use(express.json({limit: '5mb'}));
	app.use('/out', express.static(OUT_DIR));

	const portFlagIndex = process.argv.indexOf('--port');
	const port =
		(portFlagIndex !== -1 && Number(process.argv[portFlagIndex + 1])) ||
		Number(process.env.PORT) ||
		3000;

	app.get('/health', (_req, res) => res.json({status: 'ok'}));

	// Endpoint appelé par n8n (HTTP Request node) avec le JSON de l'astuce Excel.
	app.post('/generate', async (req, res) => {
		const secret = process.env.WEBHOOK_SECRET;
		if (secret && req.header('x-webhook-secret') !== secret) {
			return res.status(401).json({success: false, error: 'Unauthorized'});
		}

		try {
			const {outputPath} = await generateVideo(req.body);
			const fileName = path.basename(outputPath);
			res.json({
				success: true,
				file: fileName,
				path: outputPath,
				url: `${req.protocol}://${req.get('host')}/out/${fileName}`,
			});
		} catch (err) {
			console.error('❌ Échec du webhook /generate :', err);
			res.status(500).json({success: false, error: err.message});
		}
	});

	app.listen(port, () => {
		console.log(`🪝  Webhook prêt sur http://localhost:${port}/generate`);
		console.log(`    (n8n : HTTP Request -> POST http://<host>:${port}/generate)`);
	});
}

if (isMainModule()) {
	if (process.argv.includes('--serve')) {
		runWebhookServer();
	} else {
		await runCli();
	}
}
