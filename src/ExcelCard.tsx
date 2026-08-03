import React from 'react';
import {
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import type {ExcelData} from './types';

const KeyCap: React.FC<{children: React.ReactNode; accentColor: string}> = ({
	children,
	accentColor,
}) => (
	<div
		style={{
			padding: '14px 26px',
			borderRadius: 14,
			background: 'linear-gradient(180deg, #2A2F2E 0%, #1A1E1D 100%)',
			border: `2px solid ${accentColor}66`,
			boxShadow:
				'0 6px 0 0 rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
			color: '#F4FBF8',
			fontFamily: 'Arial, Helvetica, sans-serif',
			fontWeight: 800,
			fontSize: 34,
			letterSpacing: 1,
		}}
	>
		{children}
	</div>
);

const useTypedText = (fullText: string, startFrame: number, durationInFrames: number) => {
	const frame = useCurrentFrame();
	const progress = interpolate(
		frame,
		[startFrame, startFrame + durationInFrames],
		[0, fullText.length],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	const visibleChars = Math.floor(progress);
	const isDone = visibleChars >= fullText.length;
	return {visible: fullText.slice(0, visibleChars), isDone};
};

export const ExcelCard: React.FC<{
	excelData: ExcelData;
	startFrame?: number;
	accentColor?: string;
}> = ({excelData, startFrame = 0, accentColor = '#21A366'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const {
		formula = '',
		formulaName,
		shortcut,
		before,
		after,
		category = 'formula',
	} = excelData;

	// Entrée en zoom progressif (spring) + léger fade.
	const entrance = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 200, mass: 0.6, stiffness: 120},
	});
	const scale = interpolate(entrance, [0, 1], [0.85, 1]);
	const opacity = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const typingStart = startFrame + 18;
	const {visible: typedFormula, isDone} = useTypedText(
		formula,
		typingStart,
		Math.min(60, Math.max(20, formula.length * 2)),
	);

	const showCursor = !isDone && Math.floor(frame / 10) % 2 === 0;

	const resultPulse = interpolate(
		frame,
		[typingStart + 60, typingStart + 78],
		[0, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	return (
		<div
			style={{
				transform: `scale(${scale})`,
				opacity,
				width: 900,
				borderRadius: 28,
				overflow: 'hidden',
				boxShadow:
					'0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)',
				fontFamily: 'Arial, Helvetica, sans-serif',
			}}
		>
			{/* Barre de titre façon fenêtre Excel */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					padding: '18px 26px',
					background: '#1B1F1E',
				}}
			>
				<div style={{width: 16, height: 16, borderRadius: 999, background: '#FF5F57'}} />
				<div style={{width: 16, height: 16, borderRadius: 999, background: '#FEBC2E'}} />
				<div style={{width: 16, height: 16, borderRadius: 999, background: '#28C840'}} />
				<div
					style={{
						marginLeft: 16,
						color: '#DDEDE7',
						fontWeight: 700,
						fontSize: 22,
						opacity: 0.85,
					}}
				>
					{formulaName ?? 'Astuce Excel'}
				</div>
				<div
					style={{
						marginLeft: 'auto',
						width: 30,
						height: 30,
						borderRadius: 8,
						background: accentColor,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#0B1210',
						fontWeight: 900,
						fontSize: 16,
					}}
				>
					X
				</div>
			</div>

			{/* Barre de formule */}
			{category === 'formula' && (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 18,
						background: '#F5F7F6',
						padding: '22px 26px',
						borderBottom: '1px solid #E1E5E3',
					}}
				>
					<div
						style={{
							fontStyle: 'italic',
							fontWeight: 700,
							color: accentColor,
							fontSize: 26,
						}}
					>
						fx
					</div>
					<div
						style={{
							flex: 1,
							background: '#FFFFFF',
							border: `2px solid ${accentColor}`,
							borderRadius: 10,
							padding: '16px 20px',
							fontFamily: 'Consolas, Menlo, monospace',
							fontSize: 30,
							fontWeight: 700,
							color: '#12241D',
							whiteSpace: 'pre',
							overflow: 'hidden',
						}}
					>
						{typedFormula}
						{showCursor ? '|' : ' '}
					</div>
				</div>
			)}

			{/* Mini grille de cellules pour donner le contexte "feuille de calcul" */}
			<div
				style={{
					background: '#FFFFFF',
					padding: '10px 26px 26px',
				}}
			>
				<MiniSheet accentColor={accentColor} highlight={resultPulse} />
			</div>

			{/* Raccourci clavier */}
			{category === 'shortcut' && shortcut && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 14,
						background: '#12191700',
						padding: '36px 26px 30px',
						flexWrap: 'wrap',
					}}
				>
					{shortcut.split('+').map((key, i, arr) => (
						<React.Fragment key={i}>
							<KeyCap accentColor={accentColor}>{key.trim()}</KeyCap>
							{i < arr.length - 1 && (
								<span style={{color: '#F4FBF8', fontSize: 30, fontWeight: 800}}>
									+
								</span>
							)}
						</React.Fragment>
					))}
				</div>
			)}

			{/* Avant / Après */}
			{(before || after) && (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 20,
						padding: '0 26px 34px',
						background: category === 'formula' ? '#FFFFFF' : 'transparent',
					}}
				>
					{before && (
						<div
							style={{
								padding: '12px 20px',
								borderRadius: 12,
								background: '#3a1f1f',
								color: '#FFD6D6',
								fontWeight: 700,
								fontSize: 22,
								border: '2px solid #7a3b3b',
							}}
						>
							✗ {before}
						</div>
					)}
					{before && after && (
						<div style={{color: accentColor, fontSize: 28, fontWeight: 900}}>→</div>
					)}
					{after && (
						<div
							style={{
								padding: '12px 20px',
								borderRadius: 12,
								background: `${accentColor}22`,
								color: '#D9FBEA',
								fontWeight: 700,
								fontSize: 22,
								border: `2px solid ${accentColor}`,
								transform: `scale(${interpolate(resultPulse, [0, 1], [0.9, 1])})`,
							}}
						>
							✓ {after}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

const MiniSheet: React.FC<{accentColor: string; highlight: number}> = ({
	accentColor,
	highlight,
}) => {
	const cols = ['A', 'B', 'C', 'D'];
	const rows = [1, 2, 3];

	return (
		<div
			style={{
				border: '1px solid #E1E5E3',
				borderRadius: 8,
				overflow: 'hidden',
			}}
		>
			<div style={{display: 'flex', background: '#EFF3F1'}}>
				<div style={{width: 46}} />
				{cols.map((c) => (
					<div
						key={c}
						style={{
							flex: 1,
							textAlign: 'center',
							padding: '8px 0',
							fontSize: 18,
							fontWeight: 700,
							color: '#6B7A75',
						}}
					>
						{c}
					</div>
				))}
			</div>
			{rows.map((r) => (
				<div key={r} style={{display: 'flex', borderTop: '1px solid #EEF1EF'}}>
					<div
						style={{
							width: 46,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: '#EFF3F1',
							fontSize: 18,
							fontWeight: 700,
							color: '#6B7A75',
						}}
					>
						{r}
					</div>
					{cols.map((c, i) => {
						const isResult = r === 2 && i === cols.length - 1;
						return (
							<div
								key={c}
								style={{
									flex: 1,
									height: 40,
									borderLeft: '1px solid #EEF1EF',
									background: isResult
										? `${accentColor}${Math.round(highlight * 55)
												.toString(16)
												.padStart(2, '0')}`
										: 'transparent',
									transition: 'background 0.2s',
								}}
							/>
						);
					})}
				</div>
			))}
		</div>
	);
};
