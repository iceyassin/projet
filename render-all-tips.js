import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readdir, readFile} from 'node:fs/promises';
import {renderExcelVideo} from './render.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TIPS_DIR = path.join(__dirname, 'src', 'data', 'tips');

/**
 * Rend les 10 vidéos mono-astuce (une par fichier JSON dans src/data/tips/),
 * chacune >= 30s, avec la composition "ExcelTipSingle".
 *
 * Usage : node render-all-tips.js
 */
async function main() {
	const files = (await readdir(TIPS_DIR)).filter((f) => f.endsWith('.json')).sort();

	console.log(`🎬 ${files.length} vidéos à générer depuis ${TIPS_DIR}\n`);

	const outputs = [];
	for (const file of files) {
		const raw = await readFile(path.join(TIPS_DIR, file), 'utf-8');
		const inputProps = JSON.parse(raw);
		const outputFileName = file.replace('.json', '.mp4');

		console.log(`\n=== [${inputProps.number}/${inputProps.total}] ${inputProps.label} ===`);
		const outputPath = await renderExcelVideo({
			inputProps,
			compositionId: 'ExcelTipSingle',
			outputFileName,
		});
		outputs.push(outputPath);
	}

	console.log(`\n🎉 ${outputs.length} vidéos générées :`);
	outputs.forEach((o) => console.log(`   - ${o}`));
}

main().catch((err) => {
	console.error('❌ Échec du rendu par lot :', err);
	process.exit(1);
});
