import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from './Background';
import {OutroCTA} from './OutroCTA';
import {Subtitles} from './Subtitles';
import {FlashCut} from './FlashCut';
import {CHROME_OFFSET_Y, ExcelChrome} from './liveexcel/ExcelChrome';
import {SheetGrid} from './liveexcel/SheetGrid';
import {MouseCursor} from './liveexcel/MouseCursor';
import {KeyOverlay} from './liveexcel/KeyOverlay';
import {RedCircle} from './liveexcel/RedCircle';
import {EmojiPop} from './liveexcel/EmojiPop';
import {ArrowCallout} from './liveexcel/ArrowCallout';
import {cellCenter, cellRect} from './liveexcel/gridLayout';
import words from './data/liveexcel/words-ctrlt.json';

const ACCENT = '#21A366';

// Timeline (frames @30fps)
const INTRO_END = 75;
const VO_START = 75;
const VO_FRAMES = 343;
const SELECT_START = 90;
const SELECT_END = 160;
const CIRCLE_START = 160;
const KEYS_START = 178;
const TABLE_FLASH = 226;
const TABLE_ON = 230;
const EMOJI_START = 234;
const ARROW_START = 268;
const OUTRO_START = 478;

const VALUES: Record<string, string> = {
	A1: 'Produit',
	B1: 'Ventes',
	A2: 'Stylos',
	B2: '120',
	A3: 'Cahiers',
	B3: '85',
	A4: 'Classeurs',
	B4: '64',
	A5: 'Agrafes',
	B5: '39',
};

const TableTitle: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrance = spring({frame, fps, config: {damping: 200, mass: 0.6}});
	const exit = interpolate(frame, [INTRO_END - 15, INTRO_END], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				top: 170,
				left: 60,
				right: 60,
				textAlign: 'center',
				opacity: entrance * exit,
				transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
			}}
		>
			<div
				style={{
					fontFamily: '"Arial Black", Arial, Helvetica, sans-serif',
					fontWeight: 900,
					fontSize: 62,
					lineHeight: 1.15,
					color: '#FFFFFF',
					WebkitTextStroke: '4px #000000',
					paintOrder: 'stroke fill',
					textShadow: '0 8px 0 rgba(0,0,0,0.35)',
					textTransform: 'uppercase',
				}}
			>
				Le raccourci qui impressionne tout le monde
			</div>
		</div>
	);
};

export const LiveExcelCtrlT: React.FC = () => {
	const frame = useCurrentFrame();

	// Sélection qui "grandit" comme un glisser-déposer, de A1 jusqu'à B(2+n).
	const revealedRows = Math.max(
		1,
		Math.floor(interpolate(frame, [SELECT_START, SELECT_END], [1, 5], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		})),
	);
	const selectedRange = {startCol: 0, startRow: 0, endCol: 1, endRow: revealedRows - 1};
	const tableRange = frame >= TABLE_ON ? {startCol: 0, startRow: 0, endCol: 1, endRow: 4} : undefined;

	// Toutes les coordonnées de `gridLayout` sont relatives au coin haut-gauche de la
	// GRILLE ; on ajoute CHROME_OFFSET_Y pour tenir compte de la barre de titre + ruban
	// + barre de formule au-dessus, et obtenir des coordonnées valables dans le wrapper.
	const rawTopLeft = cellRect(0, 0);
	const rawBottomRight = cellRect(1, 4);
	const selTopLeft = {x: rawTopLeft.x, y: rawTopLeft.y + CHROME_OFFSET_Y};
	const selBottomRight = {x: rawBottomRight.x, y: rawBottomRight.y + CHROME_OFFSET_Y, w: rawBottomRight.w, h: rawBottomRight.h};
	const circleRect = {
		x: selTopLeft.x,
		y: selTopLeft.y,
		w: selBottomRight.x + selBottomRight.w - selTopLeft.x,
		h: selBottomRight.y + selBottomRight.h - selTopLeft.y,
	};

	const filterIconPos = (() => {
		const r = cellRect(1, 0);
		return {x: r.x + r.w - 20, y: r.y + r.h / 2 + CHROME_OFFSET_Y};
	})();

	const emojiAnchor = {x: cellCenter(1, 0).x + 10, y: cellCenter(1, 0).y + CHROME_OFFSET_Y - 40};

	// Léger zoom caméra sur l'en-tête de colonne B au moment où on montre les filtres.
	const zoom = interpolate(frame, [ARROW_START - 10, ARROW_START + 40, ARROW_START + 90], [1, 1.12, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const zoomOriginX = filterIconPos.x;
	const zoomOriginY = filterIconPos.y + 120;

	// La feuille s'efface juste avant le CTA final pour ne pas se superposer au texte.
	const demoOpacity = interpolate(frame, [OUTRO_START - 20, OUTRO_START], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<Background accentColor={ACCENT} />

			<TableTitle />

			{frame < OUTRO_START && (
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 260, opacity: demoOpacity}}>
				<div
					style={{
						position: 'relative',
						transform: `scale(${zoom})`,
						transformOrigin: `${zoomOriginX}px ${zoomOriginY}px`,
					}}
				>
					<ExcelChrome activeCellRef={revealedRows > 1 ? 'A1:B5' : 'A1'} formulaBarValue="">
						<SheetGrid
							values={VALUES}
							selectedRange={frame < TABLE_ON ? selectedRange : undefined}
							tableRange={tableRange}
							accentColor={ACCENT}
						/>
					</ExcelChrome>

					<MouseCursor
						path={[
							{frame: SELECT_START - 10, x: selTopLeft.x - 40, y: selTopLeft.y - 40},
							{frame: SELECT_START, x: selTopLeft.x + 10, y: selTopLeft.y + 10},
							{frame: SELECT_END, x: selBottomRight.x + selBottomRight.w - 15, y: selBottomRight.y + selBottomRight.h - 15},
						]}
					/>

					{frame >= CIRCLE_START && frame < TABLE_ON && (
						<RedCircle {...circleRect} startFrame={CIRCLE_START} durationFrames={KEYS_START - CIRCLE_START + 40} />
					)}

					<KeyOverlay keys={['CTRL', 'T']} startFrame={KEYS_START} holdFrames={40} accentColor={ACCENT} />

					{frame >= EMOJI_START && (
						<EmojiPop
							emoji="✅"
							x={emojiAnchor.x}
							y={emojiAnchor.y}
							startFrame={EMOJI_START}
							durationFrames={ARROW_START - EMOJI_START - 4}
							size={70}
						/>
					)}

					{frame >= ARROW_START && frame < TABLE_ON + 220 && (
						<ArrowCallout
							from={{x: filterIconPos.x - 10, y: filterIconPos.y + 110}}
							to={{x: filterIconPos.x, y: filterIconPos.y + 22}}
							startFrame={ARROW_START}
							durationFrames={90}
						/>
					)}
				</div>
			</AbsoluteFill>
			)}

			{frame >= TABLE_FLASH && frame < TABLE_FLASH + 8 && (
				<Sequence from={TABLE_FLASH} durationInFrames={8}>
					<FlashCut color={ACCENT} durationInFrames={8} />
				</Sequence>
			)}

			<Sequence from={VO_START} durationInFrames={VO_FRAMES + 20}>
				<Audio src={staticFile('audio/vo-ctrlt.mp3')} />
				<Subtitles words={words} accentColor={ACCENT} />
			</Sequence>

			<Sequence from={OUTRO_START}>
				<OutroCTA
					title="Suis pour plus d'astuces Excel"
					subtitle="Le raccourci qui change tout"
					accentColor={ACCENT}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};
