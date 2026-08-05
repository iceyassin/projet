import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ExcelData} from './types';

const RecapKeyCap: React.FC<{children: React.ReactNode; accentColor: string}> = ({
	children,
	accentColor,
}) => (
	<div
		style={{
			padding: '20px 34px',
			borderRadius: 18,
			background: 'linear-gradient(180deg, #2A2F2E 0%, #1A1E1D 100%)',
			border: `3px solid ${accentColor}`,
			boxShadow: '0 10px 0 0 rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
			color: '#F4FBF8',
			fontFamily: 'Arial, Helvetica, sans-serif',
			fontWeight: 900,
			fontSize: 46,
			letterSpacing: 1,
		}}
	>
		{children}
	</div>
);

/** Récap plein écran : restitue l'essentiel en très gros pour mémorisation + sauvegarde. */
export const RecapBeat: React.FC<{
	label?: string;
	excelData: ExcelData;
	accentColor: string;
}> = ({label, excelData, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({frame, fps, config: {damping: 200, mass: 0.6}});
	const scale = interpolate(entrance, [0, 1], [0.85, 1]);

	const savePulse = 1 + Math.sin(frame / 6) * 0.05;

	const heroShortcut = excelData.shortcuts?.[0]?.keys ?? excelData.shortcut;
	const extraCount = (excelData.shortcuts?.length ?? 0) - 1;

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
				padding: '0 60px',
				textAlign: 'center',
				gap: 40,
				opacity: entrance,
				transform: `scale(${scale})`,
			}}
		>
			{label && (
				<div
					style={{
						fontFamily: 'Arial, Helvetica, sans-serif',
						fontWeight: 800,
						fontSize: 28,
						color: '#B9CFC5',
						textTransform: 'uppercase',
						letterSpacing: 2,
					}}
				>
					{label}
				</div>
			)}

			{excelData.category === 'formula' && excelData.formula && (
				<div
					style={{
						background: '#0F1917',
						border: `3px solid ${accentColor}`,
						borderRadius: 20,
						padding: '30px 34px',
						fontFamily: 'Consolas, Menlo, monospace',
						fontWeight: 700,
						fontSize: 50,
						color: accentColor,
						boxShadow: `0 0 60px ${accentColor}44`,
					}}
				>
					{excelData.formula}
				</div>
			)}

			{excelData.category === 'shortcut' && heroShortcut && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 18,
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 16,
							flexWrap: 'wrap',
						}}
					>
						{heroShortcut.split('+').map((key, i, arr) => (
							<React.Fragment key={i}>
								<RecapKeyCap accentColor={accentColor}>{key.trim()}</RecapKeyCap>
								{i < arr.length - 1 && (
									<span style={{color: '#F4FBF8', fontSize: 38, fontWeight: 800}}>
										+
									</span>
								)}
							</React.Fragment>
						))}
					</div>
					{extraCount > 0 && (
						<div
							style={{
								fontFamily: 'Arial, Helvetica, sans-serif',
								fontWeight: 700,
								fontSize: 24,
								color: '#B9CFC5',
							}}
						>
							+ {extraCount} autre{extraCount > 1 ? 's' : ''} raccourci
							{extraCount > 1 ? 's' : ''} vu{extraCount > 1 ? 's' : ''} plus haut
						</div>
					)}
				</div>
			)}

			<div
				style={{
					transform: `scale(${savePulse})`,
					padding: '18px 34px',
					borderRadius: 999,
					background: `${accentColor}22`,
					border: `2px solid ${accentColor}`,
					color: '#EAF6F0',
					fontFamily: 'Arial, Helvetica, sans-serif',
					fontWeight: 800,
					fontSize: 26,
				}}
			>
				🔖 Enregistre cette astuce
			</div>
		</div>
	);
};
