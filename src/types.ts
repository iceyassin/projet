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

export const shortcutEntrySchema = z.object({
	/** Petit label au-dessus des touches, ex: "Sélectionner toute la feuille" */
	label: z.string().optional(),
	/** Ex: "CTRL + A" */
	keys: z.string(),
});

export type ShortcutEntry = z.infer<typeof shortcutEntrySchema>;

export const excelDataSchema = z.object({
	/** Ex: "XLOOKUP", "Tableaux croisés dynamiques" */
	formulaName: z.string().optional(),
	/** Ex: "=XLOOKUP(A2,B:B,C:C)" */
	formula: z.string().optional(),
	/** Ex: "CTRL + SHIFT + L" (un seul raccourci) */
	shortcut: z.string().optional(),
	/** Plusieurs raccourcis à afficher en pile (prioritaire sur `shortcut` si fourni) */
	shortcuts: z.array(shortcutEntrySchema).optional(),
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

/* -------------------------------------------------------------------------- */
/*                       Tutoriel multi-astuces (sans voix-off)               */
/* -------------------------------------------------------------------------- */

export const tutorialHookSchema = z.object({
	/** Bandeau affiché pendant la phase "méthode lente", ex: "LA MÉTHODE LENTE" */
	caption: z.string(),
	/** Phrase courte décrivant ce que fait la méthode manuelle */
	description: z.string(),
	/** Nombre vers lequel le compteur de pénibilité s'anime (ex: 500) */
	tediumTarget: z.number(),
	/** Unité affichée après le compteur (ex: "lignes copiées à la main") */
	tediumUnit: z.string(),
	/** Phrase "on a tous vécu ça", utilisée dans les vidéos mono-astuce */
	relatable: z.string().optional(),
});

export const tutorialRevealSchema = z.object({
	/** Bandeau affiché pendant la révélation, ex: "LA MÉTHODE RAPIDE" */
	caption: z.string(),
	excelData: excelDataSchema,
});

export const tutorialStepSchema = z.object({
	number: z.number(),
	/** Ex: "Navigation rapide" */
	label: z.string(),
	hook: tutorialHookSchema,
	reveal: tutorialRevealSchema,
	/** Durée de la phase "méthode lente", en secondes */
	hookSeconds: z.number().default(2.5),
	/** Durée de la phase "révélation", en secondes */
	revealSeconds: z.number().default(3.5),
});

export type TutorialStep = z.infer<typeof tutorialStepSchema>;

export const tutorialVideoSchema = z.object({
	introTitle: z.string(),
	introSubtitle: z.string().optional(),
	outroTitle: z.string(),
	outroSubtitle: z.string().optional(),
	accentColor: z.string().default('#21A366'),
	steps: z.array(tutorialStepSchema),
	introSeconds: z.number().default(3),
	outroSeconds: z.number().default(3),
	/** URL publique ou chemin local (staticFile) vers une musique de fond, optionnel */
	musicUrl: z.string().optional(),
});

export type TutorialVideoProps = z.infer<typeof tutorialVideoSchema>;

/* -------------------------------------------------------------------------- */
/*             Vidéo mono-astuce autonome (>= 30s, une astuce par fichier)    */
/* -------------------------------------------------------------------------- */

export const singleTipVideoSchema = z.object({
	number: z.number(),
	total: z.number().default(10),
	label: z.string(),
	/** Titre de la série affiché en intro, ex: "10 raccourcis Excel que 99% des gens ignorent" */
	seriesTitle: z.string(),
	hook: tutorialHookSchema,
	reveal: tutorialRevealSchema,
	accentColor: z.string().default('#21A366'),
});

export type SingleTipVideoProps = z.infer<typeof singleTipVideoSchema>;
