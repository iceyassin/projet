import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const TipIntro: React.FC<{
	number: number;
	total: number;
	seriesTitle: string;
	headline: string;
	accentColor: string;
}> = ({number, total, seriesTitle, headline, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({frame, fps, config: {damping: 200, mass: 0.6}});
	const scale = interpolate(entrance, [0, 1], [0.82, 1]);

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
					gap: 30,
				}}
			>
				<div
					style={{
						padding: '10px 26px',
						borderRadius: 999,
						background: accentColor,
						color: '#0B1210',
						fontFamily: 'Arial, Helvetica, sans-serif',
						fontWeight: 900,
						fontSize: 28,
						letterSpacing: 1,
						boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
					}}
				>
					ASTUCE {number}/{total}
				</div>

				<div
					style={{
						fontFamily: '"Arial Black", Arial, Helvetica, sans-serif',
						fontWeight: 900,
						fontSize: 74,
						lineHeight: 1.12,
						color: '#FFFFFF',
						WebkitTextStroke: '4px #000000',
						paintOrder: 'stroke fill',
						textShadow: '0 10px 0 rgba(0,0,0,0.35)',
						textTransform: 'uppercase',
					}}
				>
					{headline}
				</div>

				<div
					style={{
						fontFamily: 'Arial, Helvetica, sans-serif',
						fontWeight: 700,
						fontSize: 26,
						color: '#B9CFC5',
					}}
				>
					{seriesTitle}
				</div>
			</div>
		</div>
	);
};
