import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Background} from './Background';
import {OutroCTA} from './OutroCTA';
import {Subtitles} from './Subtitles';
import {FlashCut} from './FlashCut';
import {CHROME_OFFSET_Y, ExcelChrome} from './liveexcel/ExcelChrome';
import {SheetGrid} from './liveexcel/SheetGrid';
import {MouseCursor} from './liveexcel/MouseCursor';
import {KeyOverlay} from './liveexcel/KeyOverlay';
import {EmojiPop} from './liveexcel/EmojiPop';
import {cellCenter, cellRect, GRID_W} from './liveexcel/gridLayout';
import words from './data/liveexcel/words-sumif.json';

const ACCENT = '#21A366';

// Timeline (frames @30fps) — dérivé des frontières de phrase de la voix-off réelle.
const VO_FRAMES = 889;
const OUTRO_HOLD = 60;
export const SUM_IF_TOTAL_FRAMES = VO_FRAMES + OUTRO_HOLD;

const PROBLEM_END = 272;
const TRANSITION_END = 373;
const RULE_START = 620;
const RULE_END = 814;
const OUTRO_START = 814;

// Construction progressive de la formule
const SEG1_START = 373;
const SEG1_END = 413; // "=SOMME.SI("
const SEG2_END = 443; // sélection A2:A6
const SEG3_END = 488; // ;"Karim";
const SEG4_END = 518; // sélection B2:B6
const SEG5_END = 528; // )
const RESULT_ON = 551;
const EMOJI_START = 556;

const SOURCE: Record<string, string> = {
	A1: 'Vendeur',
	B1: 'Ventes',
	A2: 'Karim',
	B2: '1200',
	A3: 'Sara',
	B3: '950',
	A4: 'Yassine',
	B4: '800',
	A5: 'Karim',
	B5: '1500',
	A6: 'Léa',
	B6: '700',
	D1: 'Total Karim',
};

const formulaAt = (frame: number): string => {
	if (frame < SEG1_START) return '';
	if (frame < SEG1_END) {
		const n = Math.floor(interpolate(frame, [SEG1_START, SEG1_END], [0, 10], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}));
		return '=SOMME.SI('.slice(0, n);
	}
	let text = '=SOMME.SI(';
	if (frame < SEG2_END) return text;
	text += 'A2:A6';
	if (frame < SEG3_END) {
		const seg = ';"Karim";';
		const n = Math.floor(interpolate(frame, [SEG2_END, SEG3_END], [0, seg.length], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}));
		return text + seg.slice(0, n);
	}
	text += ';"Karim";';
	if (frame < SEG4_END) return text;
	text += 'B2:B6';
	if (frame < SEG5_END) {
		const n = Math.floor(interpolate(frame, [SEG4_END, SEG5_END], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}));
		return text + (n >= 1 ? ')' : '');
	}
	return `${text})`;
};

const MiniCalc: React.FC<{total: number; visible: boolean}> = ({total, visible}) => {
	if (!visible) return null;
	return (
		<div
			style={{
				position: 'absolute',
				right: -16,
				bottom: -46,
				padding: '12px 22px',
				borderRadius: 14,
				background: '#7A2020',
				boxShadow: 'inset 0 0 0 2px #C24949, 0 12px 24px rgba(0,0,0,0.4)',
				color: '#FFFFFF',
				fontFamily: 'Consolas, Menlo, monospace',
				fontWeight: 800,
				fontSize: 30,
				zIndex: 45,
			}}
		>
			= {total.toLocaleString('fr-FR')} 😩
		</div>
	);
};

export const LiveExcelSumIf: React.FC = () => {
	const frame = useCurrentFrame();

	const clicks = [
		{frame: 100, cell: cellCenter(1, 1), total: 1200},
		{frame: 150, cell: cellCenter(1, 4), total: 2700},
		{frame: 200, cell: cellCenter(1, 2), total: 3650},
		{frame: 250, cell: cellCenter(1, 5), total: 4350},
	];
	const lastClick = [...clicks].reverse().find((c) => frame >= c.frame);

	const values: Record<string, string> = {...SOURCE};
	const formulaText = formulaAt(frame);
	if (frame >= SEG1_START && frame < RESULT_ON) values.D2 = formulaText;
	if (frame >= RESULT_ON) values.D2 = '2 700';

	const d2 = cellRect(3, 1);
	const d2Top = {x: d2.x, y: d2.y + CHROME_OFFSET_Y};
	const d2Center = {x: d2.x + d2.w / 2, y: d2.y + d2.h / 2 + CHROME_OFFSET_Y};

	const formulaBarCenter = {x: GRID_W / 2, y: 137};
	const transitionZoom = interpolate(
		frame,
		[PROBLEM_END, PROBLEM_END + 45, TRANSITION_END],
		[1, 1.1, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	const selectA = frame >= SEG1_END && frame < SEG2_END ? {startCol: 0, startRow: 1, endCol: 0, endRow: 5} : undefined;
	const selectB = frame >= SEG3_END && frame < SEG4_END ? {startCol: 1, startRow: 1, endCol: 1, endRow: 5} : undefined;

	// Chemin de la souris : hook erratique -> clics dispersés -> repos -> glisser colonnes.
	const a2 = {x: cellCenter(0, 1).x, y: cellCenter(0, 1).y + CHROME_OFFSET_Y};
	const a6 = {x: cellCenter(0, 5).x, y: cellCenter(0, 5).y + CHROME_OFFSET_Y};
	const b2 = {x: cellCenter(1, 1).x, y: cellCenter(1, 1).y + CHROME_OFFSET_Y};
	const b6 = {x: cellCenter(1, 5).x, y: cellCenter(1, 5).y + CHROME_OFFSET_Y};

	const mousePath = [
		{frame: 0, x: cellCenter(2, 3).x, y: cellCenter(2, 3).y + CHROME_OFFSET_Y},
		{frame: 15, x: cellCenter(0, 5).x, y: cellCenter(0, 5).y + CHROME_OFFSET_Y},
		{frame: 30, x: cellCenter(3, 2).x, y: cellCenter(3, 2).y + CHROME_OFFSET_Y},
		{frame: 45, x: cellCenter(1, 4).x, y: cellCenter(1, 4).y + CHROME_OFFSET_Y},
		{frame: 55, x: cellCenter(2, 1).x, y: cellCenter(2, 1).y + CHROME_OFFSET_Y},
		...clicks.map((c) => ({frame: c.frame, x: c.cell.x, y: c.cell.y + CHROME_OFFSET_Y})),
		{frame: SEG1_START, x: formulaBarCenter.x, y: formulaBarCenter.y},
		{frame: SEG1_END, x: a2.x, y: a2.y - 40},
		{frame: SEG2_END, x: a6.x, y: a6.y},
		{frame: SEG3_END, x: b2.x, y: b2.y - 40},
		{frame: SEG4_END, x: b6.x, y: b6.y},
	];

	const demoOpacity = interpolate(frame, [OUTRO_START - 15, OUTRO_START], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Texte règle clignotant
	const ruleLocal = frame - RULE_START;
	const ruleVisible = frame >= RULE_START && frame < RULE_END;
	const ruleBlink = Math.floor(ruleLocal / 12) % 2 === 0;

	return (
		<AbsoluteFill>
			<Background accentColor={ACCENT} />

			{frame < OUTRO_START && (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 260, opacity: demoOpacity}}>
					<div
						style={{
							position: 'relative',
							transform: `scale(${transitionZoom})`,
							transformOrigin: `${formulaBarCenter.x}px ${formulaBarCenter.y}px`,
						}}
					>
						<ExcelChrome activeCellRef="D2" formulaBarValue={formulaText}>
							<SheetGrid
								values={values}
								activeCell={frame >= SEG1_START && frame < RESULT_ON ? 'D2' : undefined}
								resultCell={frame >= RESULT_ON ? 'D2' : undefined}
								selectedRange={selectA ?? selectB}
								accentColor={ACCENT}
							/>
						</ExcelChrome>

						{frame >= 90 && frame < PROBLEM_END && lastClick && (
							<MiniCalc total={lastClick.total} visible />
						)}

						<MouseCursor path={mousePath} clicks={clicks.map((c) => ({frame: c.frame, x: c.cell.x, y: c.cell.y + CHROME_OFFSET_Y}))} />

						{frame >= RESULT_ON && (
							<EmojiPop emoji="✅" x={d2Top.x + d2.w + 10} y={d2Center.y} startFrame={EMOJI_START} durationFrames={120} size={64} />
						)}
					</div>
				</AbsoluteFill>
			)}

			{frame >= RESULT_ON && frame < RESULT_ON + 8 && (
				<Sequence from={RESULT_ON} durationInFrames={8}>
					<FlashCut color={ACCENT} durationInFrames={8} />
				</Sequence>
			)}

			<KeyOverlay keys={['ENTRÉE']} startFrame={SEG5_END + 2} holdFrames={20} accentColor={ACCENT} />

			{ruleVisible && (
				<div
					style={{
						position: 'absolute',
						left: 60,
						right: 60,
						top: 700,
						textAlign: 'center',
						opacity: ruleBlink ? 1 : 0.25,
					}}
				>
					<div
						style={{
							display: 'inline-block',
							padding: '24px 34px',
							borderRadius: 20,
							background: '#0F1917',
							border: `4px solid ${ACCENT}`,
							fontFamily: '"Arial Black", Arial, Helvetica, sans-serif',
							fontWeight: 900,
							fontSize: 46,
							color: ACCENT,
							boxShadow: `0 0 60px ${ACCENT}55`,
						}}
					>
						SOMME.SI = ADDITION + CONDITION
					</div>
				</div>
			)}

			<Audio src={staticFile('audio/vo-sumif.mp3')} />
			<Sequence from={0} durationInFrames={OUTRO_START}>
				<Subtitles words={words} accentColor={ACCENT} />
			</Sequence>

			<Sequence from={OUTRO_START}>
				<OutroCTA
					title="Suis pour une astuce Excel par jour"
					subtitle="SOMME.SI : additionner selon une condition"
					accentColor={ACCENT}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};
