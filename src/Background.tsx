import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const Background: React.FC<{accentColor?: string}> = ({
	accentColor = '#21A366',
}) => {
	const frame = useCurrentFrame();

	// Léger défilement de la grille pour donner de la vie au fond sans distraire.
	const gridShift = interpolate(frame, [0, 900], [0, -120], {
		extrapolateRight: 'clamp',
	});

	// Pulsation douce du halo central (respiration).
	const glowOpacity = interpolate(
		Math.sin(frame / 45),
		[-1, 1],
		[0.12, 0.28],
	);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#0B1210',
				overflow: 'hidden',
			}}
		>
			{/* Dégradé de fond façon feuille de calcul sombre */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(120% 90% at 50% 0%, #132420 0%, #0B1210 55%, #070B0A 100%)',
				}}
			/>

			{/* Halo vert pulsant derrière la carte principale */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(closest-side, ${accentColor}${Math.round(
						glowOpacity * 255,
					)
						.toString(16)
						.padStart(2, '0')} 0%, rgba(0,0,0,0) 70%)`,
					transform: 'translateY(-6%)',
				}}
			/>

			{/* Grille façon cellules Excel, très discrète */}
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${accentColor}1a 1px, transparent 1px), linear-gradient(90deg, ${accentColor}1a 1px, transparent 1px)`,
					backgroundSize: '54px 54px',
					transform: `translateY(${gridShift}px)`,
					maskImage:
						'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 100%)',
					WebkitMaskImage:
						'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 100%)',
				}}
			/>

			{/* Ligne d'accent façon barre d'outils Excel en haut */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 10,
					background: `linear-gradient(90deg, ${accentColor}, #14532d)`,
					boxShadow: `0 0 40px 4px ${accentColor}55`,
				}}
			/>

			{/* Vignette pour concentrer le regard vers le centre */}
			<AbsoluteFill
				style={{
					boxShadow: 'inset 0 0 260px 90px rgba(0,0,0,0.55)',
				}}
			/>
		</AbsoluteFill>
	);
};
