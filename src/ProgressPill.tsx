import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const ProgressPill: React.FC<{
	number: number;
	total: number;
	label: string;
	accentColor: string;
}> = ({number, total, label, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrance = spring({frame, fps, config: {damping: 200, mass: 0.5}});
	const translateY = interpolate(entrance, [0, 1], [-30, 0]);

	return (
		<div
			style={{
				position: 'absolute',
				top: 96,
				left: 0,
				right: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 12,
				opacity: entrance,
				transform: `translateY(${translateY}px)`,
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
					fontFamily: 'Arial, Helvetica, sans-serif',
					fontWeight: 800,
					fontSize: 26,
					color: '#EAF6F0',
					textShadow: '0 2px 6px rgba(0,0,0,0.6)',
				}}
			>
				{label}
			</div>
		</div>
	);
};
