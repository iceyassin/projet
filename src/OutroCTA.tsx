import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const OutroCTA: React.FC<{
	title: string;
	subtitle?: string;
	accentColor: string;
	seriesLabel?: string;
}> = ({title, subtitle, accentColor, seriesLabel}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({frame, fps, config: {damping: 200, mass: 0.6}});
	const scale = interpolate(entrance, [0, 1], [0.8, 1]);

	const pulse = 1 + Math.sin(frame / 6) * 0.04;

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
				{seriesLabel && (
					<div
						style={{
							padding: '8px 22px',
							borderRadius: 999,
							background: `${accentColor}22`,
							border: `2px solid ${accentColor}`,
							color: accentColor,
							fontFamily: 'Arial, Helvetica, sans-serif',
							fontWeight: 800,
							fontSize: 22,
						}}
					>
						{seriesLabel}
					</div>
				)}
				<div
					style={{
						fontFamily: '"Arial Black", Arial, Helvetica, sans-serif',
						fontWeight: 900,
						fontSize: 66,
						lineHeight: 1.15,
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
							fontWeight: 700,
							fontSize: 30,
							color: '#EAF6F0',
						}}
					>
						{subtitle}
					</div>
				)}

				<div
					style={{
						transform: `scale(${pulse})`,
						marginTop: 10,
						padding: '22px 46px',
						borderRadius: 999,
						background: accentColor,
						color: '#0B1210',
						fontFamily: 'Arial, Helvetica, sans-serif',
						fontWeight: 900,
						fontSize: 38,
						display: 'flex',
						alignItems: 'center',
						gap: 14,
						boxShadow: `0 20px 50px ${accentColor}66`,
					}}
				>
					<span>＋</span> S'ABONNER
				</div>
			</div>
		</div>
	);
};
