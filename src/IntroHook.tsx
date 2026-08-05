import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const IntroHook: React.FC<{
	title: string;
	subtitle?: string;
	accentColor: string;
	stepCount: number;
}> = ({title, subtitle, accentColor, stepCount}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({frame, fps, config: {damping: 200, mass: 0.6}});
	const scale = interpolate(entrance, [0, 1], [0.8, 1]);

	// Petit compteur "1, 2, 3... 10" qui défile pour teaser le contenu.
	const tickerIndex =
		1 + (Math.floor(frame / 4) % stepCount);

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '0 70px',
				textAlign: 'center',
			}}
		>
			<div
				style={{
					opacity: entrance,
					transform: `scale(${scale})`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 34,
				}}
			>
				<div
					style={{
						width: 150,
						height: 150,
						borderRadius: 32,
						background: `${accentColor}22`,
						border: `4px solid ${accentColor}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 72,
						fontWeight: 900,
						color: accentColor,
						fontFamily: 'Arial, Helvetica, sans-serif',
					}}
				>
					{tickerIndex}
				</div>

				<div
					style={{
						fontFamily: '"Arial Black", Arial, Helvetica, sans-serif',
						fontWeight: 900,
						fontSize: 80,
						lineHeight: 1.1,
						color: '#FFFFFF',
						WebkitTextStroke: '4px #000000',
						paintOrder: 'stroke fill',
						textShadow: '0 10px 0 rgba(0,0,0,0.35)',
						textTransform: 'uppercase',
					}}
				>
					{title}
				</div>

				{subtitle && (
					<div
						style={{
							fontFamily: 'Arial, Helvetica, sans-serif',
							fontWeight: 800,
							fontSize: 34,
							color: accentColor,
						}}
					>
						{subtitle}
					</div>
				)}
			</div>
		</div>
	);
};
