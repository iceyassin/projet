import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CELL_H, CELL_W, COLS, GRID_H, GRID_W, HEADER_H, HEADER_W, ROWS, cellRect} from './gridLayout';

export type CellRange = {startCol: number; startRow: number; endCol: number; endRow: number};

const inRange = (col: number, row: number, range?: CellRange) => {
	if (!range) return false;
	return (
		col >= range.startCol && col <= range.endCol && row >= range.startRow && row <= range.endRow
	);
};

/**
 * Feuille de calcul réaliste : en-têtes A-E / 1-9, cellules avec bordures fines,
 * sélection verte façon Excel, style "Tableau" (bandes + en-tête coloré) sur une plage,
 * et un effet de frappe progressive sur une cellule active.
 */
export const SheetGrid: React.FC<{
	values: Record<string, string>;
	activeCell?: string;
	selectedRange?: CellRange;
	tableRange?: CellRange;
	resultCell?: string;
	typingCell?: {col: number; row: number; fullText: string; startFrame: number; charsPerFrame?: number};
	accentColor: string;
}> = ({values, activeCell, selectedRange, tableRange, resultCell, typingCell, accentColor}) => {
	const frame = useCurrentFrame();

	let typedValue: string | undefined;
	if (typingCell) {
		const progress = interpolate(
			frame,
			[typingCell.startFrame, typingCell.startFrame + typingCell.fullText.length / (typingCell.charsPerFrame ?? 0.6)],
			[0, typingCell.fullText.length],
			{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
		);
		typedValue = typingCell.fullText.slice(0, Math.floor(progress));
	}

	return (
		<div style={{position: 'relative', width: GRID_W, height: GRID_H}}>
			{/* Fond + bordures de la grille */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: '#FFFFFF',
					borderRadius: 4,
					overflow: 'hidden',
					boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
				}}
			/>

			{/* Coin vide au-dessus des numéros de ligne */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: HEADER_W,
					height: HEADER_H,
					background: '#EFF3F1',
					borderRight: '1px solid #D7DDDA',
					borderBottom: '1px solid #D7DDDA',
				}}
			/>

			{/* En-têtes de colonnes */}
			{COLS.map((c, ci) => (
				<div
					key={c}
					style={{
						position: 'absolute',
						left: HEADER_W + ci * CELL_W,
						top: 0,
						width: CELL_W,
						height: HEADER_H,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: '#EFF3F1',
						borderRight: '1px solid #D7DDDA',
						borderBottom: '1px solid #D7DDDA',
						fontFamily: 'Arial, Helvetica, sans-serif',
						fontWeight: 700,
						fontSize: 22,
						color: '#5B6B65',
					}}
				>
					{c}
				</div>
			))}

			{/* Numéros de lignes */}
			{ROWS.map((r, ri) => (
				<div
					key={r}
					style={{
						position: 'absolute',
						left: 0,
						top: HEADER_H + ri * CELL_H,
						width: HEADER_W,
						height: CELL_H,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: '#EFF3F1',
						borderRight: '1px solid #D7DDDA',
						borderBottom: '1px solid #D7DDDA',
						fontFamily: 'Arial, Helvetica, sans-serif',
						fontWeight: 700,
						fontSize: 20,
						color: '#5B6B65',
					}}
				>
					{r}
				</div>
			))}

			{/* Cellules */}
			{ROWS.map((r, ri) =>
				COLS.map((c, ci) => {
					const id = `${c}${r}`;
					const rect = cellRect(ci, ri);
					const isActive = activeCell === id;
					const isSelected = inRange(ci, ri, selectedRange);
					const isTableHeader = tableRange && ri === tableRange.startRow && inRange(ci, ri, tableRange);
					const isTableBody = tableRange && ri > tableRange.startRow && inRange(ci, ri, tableRange);
					const isBanded = isTableBody && (ri - tableRange!.startRow) % 2 === 0;
					const isResult = resultCell === id;
					const isTyping = typingCell && typingCell.col === ci && typingCell.row === ri;

					let background = '#FFFFFF';
					if (isTableHeader) background = accentColor;
					else if (isBanded) background = `${accentColor}17`;
					else if (isSelected) background = `${accentColor}22`;
					if (isResult) background = `${accentColor}33`;

					return (
						<div
							key={id}
							style={{
								position: 'absolute',
								left: rect.x,
								top: rect.y,
								width: rect.w,
								height: rect.h,
								borderRight: '1px solid #E7EBE9',
								borderBottom: '1px solid #E7EBE9',
								background,
								display: 'flex',
								alignItems: 'center',
								justifyContent: isTableHeader ? 'space-between' : 'flex-start',
								padding: '0 14px',
								boxSizing: 'border-box',
								outline: isActive ? `3px solid ${accentColor}` : 'none',
								outlineOffset: -2,
								zIndex: isActive ? 2 : 1,
							}}
						>
							<span
								style={{
									fontFamily: isResult || isTyping ? 'Consolas, Menlo, monospace' : 'Arial, Helvetica, sans-serif',
									fontWeight: isTableHeader ? 700 : 600,
									fontSize: 24,
									color: isTableHeader ? '#FFFFFF' : '#1B2622',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'clip',
								}}
							>
								{isTyping ? typedValue : values[id]}
							</span>
							{isTableHeader && (
								<span style={{color: '#FFFFFF', fontSize: 16}}>▾</span>
							)}
						</div>
					);
				}),
			)}
		</div>
	);
};
