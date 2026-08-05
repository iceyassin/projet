import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export type CursorKeyframe = {frame: number; x: number; y: number};
export type ClickEvent = {frame: number; x: number; y: number};

/** Curseur de souris animé le long d'un chemin de points-clés, avec ripple au clic. */
export const MouseCursor: React.FC<{
	path: CursorKeyframe[];
	clicks?: ClickEvent[];
}> = ({path, clicks = []}) => {
	const frame = useCurrentFrame();

	const inputRange = path.map((p) => p.frame);
	const x = interpolate(frame, inputRange, path.map((p) => p.x), {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const y = interpolate(frame, inputRange, path.map((p) => p.y), {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const firstFrame = path[0]?.frame ?? 0;
	const lastFrame = path[path.length - 1]?.frame ?? 0;
	const visible = frame >= firstFrame - 5 && frame <= lastFrame + 25;
	const opacity = interpolate(frame, [firstFrame - 5, firstFrame, lastFrame, lastFrame + 25], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	if (!visible) return null;

	return (
		<>
			<div style={{position: 'absolute', left: x, top: y, opacity, zIndex: 50}}>
				<svg width="46" height="46" viewBox="0 0 46 46" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'}}>
					<path
						d="M6 3 L6 34 L14 27 L20 40 L26 37 L20 24 L31 24 Z"
						fill="#FFFFFF"
						stroke="#111"
						strokeWidth={2.5}
						strokeLinejoin="round"
					/>
				</svg>
			</div>

			{clicks.map((click, i) => {
				const local = frame - click.frame;
				if (local < 0 || local > 22) return null;
				const scale = interpolate(local, [0, 22], [0.3, 2.2]);
				const rippleOpacity = interpolate(local, [0, 22], [0.7, 0]);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: click.x - 20,
							top: click.y - 20,
							width: 40,
							height: 40,
							borderRadius: '50%',
							border: '4px solid #21A366',
							transform: `scale(${scale})`,
							opacity: rippleOpacity,
							zIndex: 49,
						}}
					/>
				);
			})}
		</>
	);
};
