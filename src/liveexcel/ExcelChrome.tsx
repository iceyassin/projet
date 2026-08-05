import React from 'react';
import {GRID_W} from './gridLayout';

export const TITLE_BAR_H = 54;
export const RIBBON_H = 53;
export const FORMULA_BAR_H = 60;
/** Hauteur totale de l'habillage au-dessus de la grille — à additionner aux coordonnées
 * issues de `gridLayout` pour positionner correctement les overlays (souris, cercle, flèche). */
export const CHROME_OFFSET_Y = TITLE_BAR_H + RIBBON_H + FORMULA_BAR_H;

/** Habillage "fenêtre Excel" réaliste : barre de titre, onglets de ruban, barre de formule. */
export const ExcelChrome: React.FC<{
	activeCellRef?: string;
	formulaBarValue?: string;
	children: React.ReactNode;
}> = ({activeCellRef = 'A1', formulaBarValue = '', children}) => {
	return (
		<div
			style={{
				width: GRID_W,
				borderRadius: 16,
				overflow: 'hidden',
				boxShadow: '0 40px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
				fontFamily: 'Arial, Helvetica, sans-serif',
			}}
		>
			<div
				style={{
					height: TITLE_BAR_H,
					boxSizing: 'border-box',
					background: '#1B1F1E',
					padding: '0 20px',
					display: 'flex',
					alignItems: 'center',
					gap: 10,
				}}
			>
				<div style={{width: 14, height: 14, borderRadius: 999, background: '#FF5F57'}} />
				<div style={{width: 14, height: 14, borderRadius: 999, background: '#FEBC2E'}} />
				<div style={{width: 14, height: 14, borderRadius: 999, background: '#28C840'}} />
				<div style={{marginLeft: 14, color: '#DDEDE7', fontWeight: 700, fontSize: 17, opacity: 0.85}}>
					Classeur1 - Excel
				</div>
			</div>

			<div
				style={{
					height: RIBBON_H,
					boxSizing: 'border-box',
					background: '#F5F7F6',
					padding: '10px 20px 0',
					display: 'flex',
					gap: 22,
					borderBottom: '1px solid #E1E5E3',
				}}
			>
				{['Fichier', 'Accueil', 'Insertion', 'Formules', 'Données'].map((tab, i) => (
					<div
						key={tab}
						style={{
							paddingBottom: 10,
							fontSize: 16,
							fontWeight: i === 1 ? 800 : 600,
							color: i === 1 ? '#12241D' : '#6B7A75',
							borderBottom: i === 1 ? '3px solid #21A366' : '3px solid transparent',
						}}
					>
						{tab}
					</div>
				))}
			</div>

			<div
				style={{
					height: FORMULA_BAR_H,
					boxSizing: 'border-box',
					display: 'flex',
					alignItems: 'center',
					gap: 14,
					background: '#F5F7F6',
					padding: '0 20px',
					borderBottom: '1px solid #E1E5E3',
				}}
			>
				<div
					style={{
						minWidth: 56,
						textAlign: 'center',
						padding: '6px 10px',
						background: '#FFFFFF',
						border: '1px solid #D7DDDA',
						borderRadius: 6,
						fontFamily: 'Consolas, Menlo, monospace',
						fontWeight: 700,
						fontSize: 18,
						color: '#12241D',
					}}
				>
					{activeCellRef}
				</div>
				<div style={{fontStyle: 'italic', fontWeight: 700, color: '#21A366', fontSize: 20}}>fx</div>
				<div
					style={{
						flex: 1,
						background: '#FFFFFF',
						border: '1px solid #D7DDDA',
						borderRadius: 6,
						padding: '10px 14px',
						fontFamily: 'Consolas, Menlo, monospace',
						fontSize: 20,
						fontWeight: 700,
						color: '#12241D',
						whiteSpace: 'pre',
						overflow: 'hidden',
						minHeight: 24,
					}}
				>
					{formulaBarValue}
				</div>
			</div>

			<div style={{position: 'relative'}}>{children}</div>
		</div>
	);
};
