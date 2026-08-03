import {existsSync} from 'node:fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(1);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');

// Utilise un Chrome/Chromium déjà présent sur la machine si disponible, pour éviter
// un téléchargement réseau (utile en CI ou en environnement sandboxé).
const localChromium =
	process.env.REMOTION_BROWSER_EXECUTABLE ??
	(existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

if (localChromium) {
	Config.setBrowserExecutable(localChromium);
}
