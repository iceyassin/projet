/**
 * Timeline fixe (en frames, @30fps) pour une vidéo mono-astuce.
 * Chaque bloc apporte un vrai contenu (pas de remplissage) pour dépasser
 * confortablement les 30 secondes minimum imposées pour CHAQUE vidéo :
 *
 *   intro (3.5s) -> problème (4s) -> relatable (3s) -> flash -> révélation (11s)
 *   -> récap plein écran (5s) -> outro / CTA (4s)  =  923 frames ≈ 30.77s
 */
export const SINGLE_TIP_FPS = 30;

export const SINGLE_TIP_FRAMES = {
	intro: 105,
	problem: 120,
	relatable: 90,
	flash: 8,
	reveal: 330,
	recap: 150,
	outro: 120,
} as const;

export const buildSingleTipTimeline = () => {
	let cursor = 0;
	const introStart = cursor;
	cursor += SINGLE_TIP_FRAMES.intro;
	const problemStart = cursor;
	cursor += SINGLE_TIP_FRAMES.problem;
	const relatableStart = cursor;
	cursor += SINGLE_TIP_FRAMES.relatable;
	const flashStart = cursor;
	cursor += SINGLE_TIP_FRAMES.flash;
	const revealStart = cursor;
	cursor += SINGLE_TIP_FRAMES.reveal;
	const recapStart = cursor;
	cursor += SINGLE_TIP_FRAMES.recap;
	const outroStart = cursor;
	cursor += SINGLE_TIP_FRAMES.outro;

	return {
		introStart,
		problemStart,
		relatableStart,
		flashStart,
		revealStart,
		recapStart,
		outroStart,
		totalFrames: cursor,
	};
};

export const SINGLE_TIP_TOTAL_FRAMES = buildSingleTipTimeline().totalFrames;
