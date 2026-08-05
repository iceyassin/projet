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
import {cellRect} from './liveexcel/gridLayout';
import words from './data/liveexcel/words-autosum.json';

const ACCENT = '#21A366';

// Timeline (frames @30fps)
const INTRO_END = 105;
const VO_START = 105;
const VO_FRAMES = 581;
const NUMBERS_START = 20;
const NUMBERS_END = 95;
const CLICK_START = 190;
const CLICK_END = 250;
const CIRCLE_START = 250;
const KEYS_ALT_START = 272;
const FORMULA_FLASH = 336;
const FORMULA_ON = 340;
const ARROW_START = 362;
const KEYS_ENTER_START = 452;
const RESULT_FLASH = 488;
const RESULT_ON = 492;
const EMOJI_START = 496;
const OUTRO_START = 776;

const FORMULA = '=SOMME(A1:A4)';

const BeatTitle: React.FC<{text: string}> = ({text}) => {
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
					fontSize: 60,
					lineHeight: 1.15,
					color: '#FFFFFF',
					WebkitTextStroke: '4px #000000',
					paintOrder: 'stroke fill',
					textShadow: '0 8px 0 rgba(0,0,0,0.35)',
					textTransform: 'uppercase',
				}}
			>
				{text}
			</div>
		</div>
	);
};

export const LiveExcelAutoSum: React.FC = () => {
	const frame = useCurrentFrame();

	const revealCount = Math.max(
		0,
		Math.floor(interpolate(frame, [NUMBERS_START, NUMBERS_END], [0, 4], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		})),
	);
	const numbers = ['125', '320', '480', '250'];
	const values: Record<string, string> = {};
	for (let i = 0; i < revealCount; i++) values[`A${i + 1}`] = numbers[i];

	if (frame >= FORMULA_ON) values.A5 = FORMULA;
	if (frame >= RESULT_ON) values.A5 = '1175';

	const a5 = cellRect(0, 4);
	const a5Top = {x: a5.x, y: a5.y + CHROME_OFFSET_Y};
	const a5Center = {x: a5.x + a5.w / 2, y: a5.y + a5.h / 2 + CHROME_OFFSET_Y};

	const zoom = interpolate(frame, [RESULT_FLASH - 10, RESULT_FLASH + 40, OUTRO_START - 60], [1, 1.16, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const demoOpacity = interpolate(frame, [OUTRO_START - 20, OUTRO_START], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	let beatTitle = 'Tu fais encore la somme à la main ?';
	if (frame >= FORMULA_ON) beatTitle = '';

	return (
		<AbsoluteFill>
			<Background accentColor={ACCENT} />

			<BeatTitle text={beatTitle} />

			{frame < OUTRO_START && (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 260, opacity: demoOpacity}}>
					<div
						style={{
							position: 'relative',
							transform: `scale(${zoom})`,
							transformOrigin: `${a5Center.x}px ${a5Center.y}px`,
						}}
					>
						<ExcelChrome activeCellRef="A5" formulaBarValue={frame >= FORMULA_ON ? FORMULA : ''}>
							<SheetGrid
								values={values}
								activeCell={frame >= CLICK_END ? 'A5' : undefined}
								resultCell={frame >= RESULT_ON ? 'A5' : undefined}
								accentColor={ACCENT}
							/>
						</ExcelChrome>

						<MouseCursor
							path={[
								{frame: CLICK_START - 15, x: a5Top.x + 40, y: a5Top.y - 140},
								{frame: CLICK_START, x: a5Top.x + 40, y: a5Top.y - 80},
								{frame: CLICK_END, x: a5Center.x, y: a5Center.y},
							]}
							clicks={[{frame: CLICK_END, x: a5Center.x, y: a5Center.y}]}
						/>

						{frame >= CIRCLE_START && frame < KEYS_ALT_START + 30 && (
							<RedCircle
								x={a5Top.x}
								y={a5Top.y}
								w={a5.w}
								h={a5.h}
								startFrame={CIRCLE_START}
								durationFrames={KEYS_ALT_START - CIRCLE_START + 30}
							/>
						)}

						<KeyOverlay keys={['ALT', '=']} startFrame={KEYS_ALT_START} holdFrames={38} accentColor={ACCENT} />
						<KeyOverlay keys={['ENTRÉE']} startFrame={KEYS_ENTER_START} holdFrames={28} accentColor={ACCENT} />

						{frame >= ARROW_START && frame < ARROW_START + 90 && (
							<ArrowCallout
								from={{x: a5Top.x - 30, y: a5Top.y + a5.h + 90}}
								to={{x: a5Top.x + 20, y: a5Top.y + a5.h - 10}}
								startFrame={ARROW_START}
								durationFrames={90}
							/>
						)}

						{frame >= EMOJI_START && (
							<EmojiPop
								emoji="✅"
								x={a5Top.x + a5.w + 10}
								y={a5Center.y}
								startFrame={EMOJI_START}
								durationFrames={110}
								size={70}
							/>
						)}
					</div>
				</AbsoluteFill>
			)}

			{frame >= FORMULA_FLASH && frame < FORMULA_FLASH + 8 && (
				<Sequence from={FORMULA_FLASH} durationInFrames={8}>
					<FlashCut color={ACCENT} durationInFrames={8} />
				</Sequence>
			)}
			{frame >= RESULT_FLASH && frame < RESULT_FLASH + 8 && (
				<Sequence from={RESULT_FLASH} durationInFrames={8}>
					<FlashCut color={ACCENT} durationInFrames={8} />
				</Sequence>
			)}

			<Sequence from={VO_START} durationInFrames={VO_FRAMES + 20}>
				<Audio src={staticFile('audio/vo-autosum.mp3')} />
				<Subtitles words={words} accentColor={ACCENT} />
			</Sequence>

			<Sequence from={OUTRO_START}>
				<OutroCTA
					title="Suis pour plus d'astuces Excel"
					subtitle="La somme automatique en 2 touches"
					accentColor={ACCENT}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};
