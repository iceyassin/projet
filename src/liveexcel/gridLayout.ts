/** Constantes de mise en page partagées par la grille et les overlays (souris, cercle, flèche). */
export const COLS = ['A', 'B', 'C', 'D', 'E'];
export const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const HEADER_W = 64;
export const HEADER_H = 56;
export const CELL_W = 150;
export const CELL_H = 68;

export const GRID_W = HEADER_W + COLS.length * CELL_W;
export const GRID_H = HEADER_H + ROWS.length * CELL_H;

/** Rectangle (relatif à l'origine de la grille) d'une cellule, en index 0-based. */
export const cellRect = (colIndex: number, rowIndex: number) => ({
	x: HEADER_W + colIndex * CELL_W,
	y: HEADER_H + rowIndex * CELL_H,
	w: CELL_W,
	h: CELL_H,
});

export const cellCenter = (colIndex: number, rowIndex: number) => {
	const r = cellRect(colIndex, rowIndex);
	return {x: r.x + r.w / 2, y: r.y + r.h / 2};
};

/** ex: cellId(0,0) -> "A1" */
export const cellId = (colIndex: number, rowIndex: number) =>
	`${COLS[colIndex]}${ROWS[rowIndex]}`;
