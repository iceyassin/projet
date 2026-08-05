import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

/** Fine barre de progression globale en haut de l'écran (repère de rétention). */
export const TopProgressBar: React.FC<{accentColor: string}> = ({accentColor}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: 10,
				background: 'rgba(255,255,255,0.12)',
			}}
		>
			<div
				style={{
					height: '100%',
					width: `${progress * 100}%`,
					background: accentColor,
					boxShadow: `0 0 20px 2px ${accentColor}aa`,
				}}
			/>
		</div>
	);
};
