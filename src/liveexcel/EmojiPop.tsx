import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/** Emoji géant qui pop à une position donnée (coordonnées du parent). */
export const EmojiPop: React.FC<{
	emoji: string;
	x: number;
	y: number;
	startFrame: number;
	size?: number;
	/** Si fourni, l'emoji s'estompe après ce nombre de frames au lieu de rester indéfiniment. */
	durationFrames?: number;
}> = ({emoji, x, y, startFrame, size = 90, durationFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const local = frame - startFrame;
	if (local < 0) return null;
	if (durationFrames && local > durationFrames) return null;

	const entrance = spring({frame: local, fps, config: {damping: 10, mass: 0.5, stiffness: 300}});
	const scale = interpolate(entrance, [0, 1], [0, 1.15]);
	const settle = local > 14 ? 1 + Math.sin((local - 14) / 8) * 0.04 : scale;
	const fadeOut = durationFrames
		? interpolate(local, [durationFrames - 12, durationFrames], [1, 0], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 1;

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				fontSize: size,
				opacity: fadeOut,
				transform: `translate(-50%, -50%) scale(${local > 14 ? settle : scale})`,
				filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.4))',
				zIndex: 70,
			}}
		>
			{emoji}
		</div>
	);
};
