import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

/** Cercle rouge pulsant pour attirer l'œil sur une zone précise (coordonnées du parent). */
export const RedCircle: React.FC<{
	x: number;
	y: number;
	w: number;
	h: number;
	startFrame: number;
	durationFrames?: number;
}> = ({x, y, w, h, startFrame, durationFrames = 60}) => {
	const frame = useCurrentFrame();
	const local = frame - startFrame;
	if (local < 0 || local > durationFrames) return null;

	const drawIn = interpolate(local, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const pulse = 1 + Math.sin(local / 5) * 0.03;
	const fadeOut = interpolate(local, [durationFrames - 10, durationFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const pad = 14;
	const rx = ((w + pad * 2) / 2) * pulse;
	const ry = ((h + pad * 2) / 2) * pulse;
	// Approximation de Ramanujan pour le périmètre d'une ellipse.
	const circumference = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));

	return (
		<svg
			style={{
				position: 'absolute',
				left: x - pad,
				top: y - pad,
				width: w + pad * 2,
				height: h + pad * 2,
				overflow: 'visible',
				opacity: fadeOut,
				zIndex: 55,
			}}
		>
			<ellipse
				cx={(w + pad * 2) / 2}
				cy={(h + pad * 2) / 2}
				rx={rx}
				ry={ry}
				fill="none"
				stroke="#FF3B30"
				strokeWidth={6}
				strokeDasharray={circumference}
				strokeDashoffset={circumference * (1 - drawIn)}
				strokeLinecap="round"
			/>
		</svg>
	);
};
