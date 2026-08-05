import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/** Bref instant "on a tous vécu ça" entre le problème et la solution — crée l'adhésion. */
export const RelatableBeat: React.FC<{text: string; accentColor: string}> = ({
	text,
	accentColor,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({frame, fps, config: {damping: 200, mass: 0.5}});
	const scale = interpolate(entrance, [0, 1], [0.8, 1]);
	const wobble = Math.sin(frame / 8) * 1.5;

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '0 80px',
				textAlign: 'center',
			}}
		>
			<div
				style={{
					opacity: entrance,
					transform: `scale(${scale}) rotate(${wobble}deg)`,
					display: 'inline-block',
					padding: '40px 46px',
					borderRadius: 28,
					background: `${accentColor}1f`,
					border: `3px solid ${accentColor}`,
				}}
			>
				<div
					style={{
						fontFamily: '"Arial Black", Arial, Helvetica, sans-serif',
						fontWeight: 900,
						fontSize: 58,
						lineHeight: 1.2,
						color: '#FFFFFF',
						WebkitTextStroke: '4px #000000',
						paintOrder: 'stroke fill',
						textShadow: '0 8px 0 rgba(0,0,0,0.35)',
					}}
				>
					{text}
				</div>
			</div>
		</div>
	);
};
