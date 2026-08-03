import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const COMPOSITION_ID = 'ExcelTipsShort';
const ENTRY_POINT = path.join(__dirname, 'src', 'index.ts');

// Permet de pointer vers un binaire Chrome/Chromium déjà installé (ex : environnements
// sandboxés sans accès au téléchargeur de Remotion). Sinon, Remotion télécharge
// automatiquement Chrome Headless Shell au premier rendu.
const BROWSER_EXECUTABLE =
	process.env.REMOTION_BROWSER_EXECUTABLE ??
	(existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

/**
 * Bundle la composition Remotion et rend la vidéo d'astuce Excel en .mp4.
 *
 * @param {object} options
 * @param {object} options.inputProps - Props de la composition (title, script, excelData, words, audioUrl, accentColor).
 * @param {string} [options.outputFileName] - Nom du fichier .mp4 de sortie.
 * @param {string} [options.outDir] - Dossier de sortie (par défaut ./out).
 * @param {(progress: number) => void} [options.onProgress] - Callback de progression (0 à 1).
 * @returns {Promise<string>} Chemin absolu du fichier vidéo généré.
 */
export async function renderExcelVideo({
	inputProps,
	outputFileName = `excel-tip-${Date.now()}.mp4`,
	outDir = path.join(__dirname, 'out'),
	onProgress,
} = {}) {
	if (!inputProps) {
		throw new Error(
			'inputProps est requis (title, script, excelData, words, ...)',
		);
	}

	console.log('📦 Bundling de la composition Remotion...');
	const bundleLocation = await bundle({
		entryPoint: ENTRY_POINT,
		webpackOverride: (config) => config,
	});

	console.log('🎬 Sélection de la composition...');
	const composition = await selectComposition({
		serveUrl: bundleLocation,
		id: COMPOSITION_ID,
		inputProps,
		browserExecutable: BROWSER_EXECUTABLE,
	});

	const outputLocation = path.join(outDir, outputFileName);

	console.log(`🚀 Rendu en cours -> ${outputLocation}`);
	await renderMedia({
		composition,
		serveUrl: bundleLocation,
		codec: 'h264',
		outputLocation,
		inputProps,
		browserExecutable: BROWSER_EXECUTABLE,
		onProgress: ({progress}) => {
			process.stdout.write(`\r   Progression: ${Math.round(progress * 100)}%`);
			onProgress?.(progress);
		},
	});
	process.stdout.write('\n');

	console.log(`✅ Vidéo générée : ${outputLocation}`);
	return outputLocation;
}

const isMainModule = () => {
	if (!process.argv[1]) return false;
	return import.meta.url === `file://${path.resolve(process.argv[1])}`;
};

// Exécution directe en CLI : node render.js [chemin/vers/data.json] [nomSortie.mp4]
if (isMainModule()) {
	const dataPath =
		process.argv[2] ?? path.join(__dirname, 'src', 'data', 'example.json');
	const outputFileName = process.argv[3];

	const raw = await readFile(path.resolve(dataPath), 'utf-8');
	const inputProps = JSON.parse(raw);

	renderExcelVideo({inputProps, outputFileName}).catch((err) => {
		console.error('❌ Échec du rendu :', err);
		process.exit(1);
	});
}
