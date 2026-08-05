import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

/** Flash bref (quelques frames) pour ponctuer une transition — effet "cut" dynamique. */
export const FlashCut: React.FC<{color?: string; durationInFrames?: number}> = ({
	color = '#FFFFFF',
	durationInFrames = 8,
}) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(
		frame,
		[0, durationInFrames * 0.35, durationInFrames],
		[0.85, 0.4, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: color,
				opacity,
				pointerEvents: 'none',
			}}
		/>
	);
};
