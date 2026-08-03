import {z} from 'zod';

/**
 * Un mot chronométré, utilisé pour les sous-titres façon "karaoke".
 * start/end sont en secondes, relatifs au début de la vidéo.
 */
export const wordTimingSchema = z.object({
	text: z.string(),
	start: z.number().nonnegative(),
	end: z.number().nonnegative(),
});

export type WordTiming = z.infer<typeof wordTimingSchema>;

export const excelDataSchema = z.object({
	/** Ex: "XLOOKUP", "Tableaux croisés dynamiques" */
	formulaName: z.string().optional(),
	/** Ex: "=XLOOKUP(A2,B:B,C:C)" */
	formula: z.string().optional(),
	/** Ex: "CTRL + SHIFT + L" */
	shortcut: z.string().optional(),
	/** Texte court décrivant l'état "avant" (ex: "Recherche manuelle") */
	before: z.string().optional(),
	/** Texte court décrivant l'état "après" (ex: "Résultat instantané") */
	after: z.string().optional(),
	/** 'formula' affiche la barre de formule, 'shortcut' met en avant les touches */
	category: z.enum(['formula', 'shortcut']).default('formula'),
});

export type ExcelData = z.infer<typeof excelDataSchema>;

export const excelTipsVideoSchema = z.object({
	title: z.string(),
	script: z.string(),
	excelData: excelDataSchema,
	/** Timing mot par mot pour les sous-titres karaoke. Peut être généré automatiquement. */
	words: z.array(wordTimingSchema).default([]),
	/** URL publique ou chemin local (staticFile) vers la voix-off */
	audioUrl: z.string().optional(),
	/** Couleur d'accent principale (thème Excel = vert). */
	accentColor: z.string().default('#21A366'),
});

export type ExcelTipsVideoProps = z.infer<typeof excelTipsVideoSchema>;
