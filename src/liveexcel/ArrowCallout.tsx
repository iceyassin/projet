import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

/** Flèche courbe animée (dessin progressif) pointant d'un point A vers un point B. */
export const ArrowCallout: React.FC<{
	from: {x: number; y: number};
	to: {x: number; y: number};
	startFrame: number;
	durationFrames?: number;
	color?: string;
}> = ({from, to, startFrame, durationFrames = 70, color = '#FF3B30'}) => {
	const frame = useCurrentFrame();
	const local = frame - startFrame;
	if (local < 0 || local > durationFrames) return null;

	const drawIn = interpolate(local, [0, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const fadeOut = interpolate(local, [durationFrames - 12, durationFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const midX = (from.x + to.x) / 2;
	const midY = Math.min(from.y, to.y) - 70;
	const path = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

	const pathLength = 300;

	// Angle de la pointe de flèche, approximé via la tangente au point d'arrivée.
	const angle = (Math.atan2(to.y - midY, to.x - midX) * 180) / Math.PI;

	return (
		<svg
			style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'visible', opacity: fadeOut, zIndex: 56}}
		>
			<path
				d={path}
				fill="none"
				stroke={color}
				strokeWidth={7}
				strokeLinecap="round"
				strokeDasharray={pathLength}
				strokeDashoffset={pathLength * (1 - drawIn)}
			/>
			{drawIn > 0.9 && (
				<polygon
					points="0,-12 24,0 0,12"
					fill={color}
					transform={`translate(${to.x}, ${to.y}) rotate(${angle})`}
				/>
			)}
		</svg>
	);
};
