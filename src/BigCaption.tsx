import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Bandeau de texte gras, contour noir, très lisible sur mobile — utilisé pour les
 * accroches "avant/après" du tutoriel. Contrairement aux sous-titres karaoke,
 * il n'y a pas de voix-off : le texte apparaît en un seul bloc (léger pop d'échelle).
 */
export const BigCaption: React.FC<{
	text: string;
	color?: string;
	bottom?: number;
	fontSize?: number;
	startFrame?: number;
}> = ({text, color = '#FFFFFF', bottom = 150, fontSize = 64, startFrame = 0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 200, mass: 0.5, stiffness: 180},
	});

	if (frame < startFrame) return null;

	const scale = interpolate(entrance, [0, 1], [0.85, 1]);

	return (
		<div
			style={{
				position: 'absolute',
				left: 50,
				right: 50,
				bottom,
				textAlign: 'center',
				opacity: entrance,
				transform: `scale(${scale})`,
			}}
		>
			<span
				style={{
					display: 'inline-block',
					fontFamily: '"Arial Black", Arial, Helvetica, sans-serif',
					fontWeight: 900,
					fontSize,
					lineHeight: 1.15,
					color,
					WebkitTextStroke: '8px #000000',
					paintOrder: 'stroke fill',
					textShadow: '0 6px 0 rgba(0,0,0,0.35)',
					textTransform: 'uppercase',
				}}
			>
				{text}
			</span>
		</div>
	);
};
