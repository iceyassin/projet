import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/** Pop de touches clavier en bas de l'écran, ex: "CTRL" + "T" — apparaît, tient, disparaît. */
export const KeyOverlay: React.FC<{
	keys: string[];
	startFrame: number;
	holdFrames?: number;
	accentColor: string;
}> = ({keys, startFrame, holdFrames = 30, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const local = frame - startFrame;

	if (local < 0 || local > holdFrames + 15) return null;

	const entrance = spring({frame: local, fps, config: {damping: 14, mass: 0.5, stiffness: 260}});
	const exit = interpolate(local, [holdFrames, holdFrames + 15], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(entrance, [0, 1], [0.5, 1]) * exit;

	return (
		<div
			style={{
				position: 'absolute',
				bottom: 210,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				gap: 14,
				opacity: exit,
				transform: `scale(${scale})`,
				zIndex: 60,
			}}
		>
			{keys.map((k, i) => (
				<React.Fragment key={i}>
					<div
						style={{
							padding: '16px 28px',
							borderRadius: 16,
							background: 'linear-gradient(180deg, #2A2F2E 0%, #1A1E1D 100%)',
							border: `3px solid ${accentColor}`,
							boxShadow: '0 10px 0 0 rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1)',
							color: '#FFFFFF',
							fontFamily: 'Arial, Helvetica, sans-serif',
							fontWeight: 900,
							fontSize: 36,
						}}
					>
						{k}
					</div>
					{i < keys.length - 1 && (
						<span style={{color: '#FFFFFF', fontSize: 32, fontWeight: 800}}>+</span>
					)}
				</React.Fragment>
			))}
		</div>
	);
};
