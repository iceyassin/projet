import type {TutorialVideoProps} from '../types';

export type TimelineStep = TutorialVideoProps['steps'][number] & {
	hookStart: number;
	hookFrames: number;
	revealStart: number;
	revealFrames: number;
};

export type TutorialTimeline = {
	introFrames: number;
	steps: TimelineStep[];
	outroStart: number;
	outroFrames: number;
	totalFrames: number;
};

/**
 * Calcule les offsets de frames (intro -> [hook, révélation] x N -> outro) à partir
 * des durées en secondes de chaque étape. Utilisé à la fois par `calculateMetadata`
 * (pour connaître la durée totale de la composition) et par la composition elle-même
 * (pour positionner chaque `<Sequence>`).
 */
export const buildTutorialTimeline = (
	props: Pick<TutorialVideoProps, 'steps' | 'introSeconds' | 'outroSeconds'>,
	fps: number,
): TutorialTimeline => {
	const introFrames = Math.round(props.introSeconds * fps);
	let cursor = introFrames;

	const steps: TimelineStep[] = props.steps.map((step) => {
		const hookFrames = Math.round(step.hookSeconds * fps);
		const revealFrames = Math.round(step.revealSeconds * fps);
		const hookStart = cursor;
		const revealStart = hookStart + hookFrames;
		cursor = revealStart + revealFrames;
		return {...step, hookStart, hookFrames, revealStart, revealFrames};
	});

	const outroStart = cursor;
	const outroFrames = Math.round(props.outroSeconds * fps);
	const totalFrames = outroStart + outroFrames;

	return {introFrames, steps, outroStart, outroFrames, totalFrames};
};
