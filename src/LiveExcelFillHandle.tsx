import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from './Background';
import {OutroCTA} from './OutroCTA';
import {Subtitles} from './Subtitles';
import {FlashCut} from './FlashCut';
import {CHROME_OFFSET_Y, ExcelChrome} from './liveexcel/ExcelChrome';
import {SheetGrid} from './liveexcel/SheetGrid';
import {MouseCursor} from './liveexcel/MouseCursor';
import {RedCircle} from './liveexcel/RedCircle';
import {EmojiPop} from './liveexcel/EmojiPop';
import {cellRect} from './liveexcel/gridLayout';
import words from './data/liveexcel/words-fillhandle.json';

const ACCENT = '#21A366';

// Timeline (frames @30fps)
const INTRO_END = 120;
const VO_START = 120;
const VO_FRAMES = 440;
const TYPE_START = 25;
const FORMULA_RESULT_ON = 78;
const CIRCLE1_START = 132;
const HANDLE_CIRCLE_START = 258;
const MOVE_START = 320;
const CLICK_1 = 402;
const CLICK_2 = 414;
const FILL_FLASH = 420;
const FILL_START = 422;
const FILL_STEP = 16;
const EMOJI_START = 500;
const OUTRO_START = 740;

const SOURCE: Record<string, string> = {
	A1: 'Prix',
	B1: 'Remise',
	A2: '100',
	A3: '250',
	A4: '80',
	A5: '150',
	A6: '300',
};

const RESULTS: Record<string, string> = {B2: '20', B3: '50', B4: '16', B5: '30', B6: '60'};

const BeatTitle: React.FC = () => {
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
				top: 150,
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
					fontSize: 58,
					lineHeight: 1.15,
					color: '#FFFFFF',
					WebkitTextStroke: '4px #000000',
					paintOrder: 'stroke fill',
					textShadow: '0 8px 0 rgba(0,0,0,0.35)',
					textTransform: 'uppercase',
				}}
			>
				Deux clics. Au lieu de cent.
			</div>
		</div>
	);
};

export const LiveExcelFillHandle: React.FC = () => {
	const frame = useCurrentFrame();

	const values: Record<string, string> = {...SOURCE};

	const typingFullText = '=A2*20%';
	if (frame >= FORMULA_RESULT_ON) {
		values.B2 = RESULTS.B2;
	}

	const filledRows = Math.max(0, Math.floor((frame - FILL_START) / FILL_STEP) + 1);
	if (frame >= FILL_START) {
		['B3', 'B4', 'B5', 'B6'].slice(0, filledRows).forEach((id) => {
			values[id] = RESULTS[id];
		});
	}

	const b2 = cellRect(1, 1);
	const b2Top = {x: b2.x, y: b2.y + CHROME_OFFSET_Y};
	const b2Center = {x: b2.x + b2.w / 2, y: b2.y + b2.h / 2 + CHROME_OFFSET_Y};
	const handlePos = {x: b2Top.x + b2.w, y: b2Top.y + b2.h};

	const b6 = cellRect(1, 5);
	const b6Right = {x: b6.x + b6.w, y: b6.y + b6.h / 2 + CHROME_OFFSET_Y};

	const zoom = interpolate(frame, [FILL_START - 10, FILL_START + 70, OUTRO_START - 80], [1, 1.1, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const zoomOrigin = {x: b2Center.x, y: b2Center.y + 90};

	const demoOpacity = interpolate(frame, [OUTRO_START - 20, OUTRO_START], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const showHandle = frame >= FORMULA_RESULT_ON && frame < OUTRO_START;

	return (
		<AbsoluteFill>
			<Background accentColor={ACCENT} />

			<BeatTitle />

			{frame < OUTRO_START && (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 260, opacity: demoOpacity}}>
					<div
						style={{
							position: 'relative',
							transform: `scale(${zoom})`,
							transformOrigin: `${zoomOrigin.x}px ${zoomOrigin.y}px`,
						}}
					>
						<ExcelChrome activeCellRef="B2" formulaBarValue={frame >= TYPE_START ? '=A2*20%' : ''}>
							<SheetGrid
								values={values}
								activeCell={frame >= FORMULA_RESULT_ON && frame < FILL_START ? 'B2' : undefined}
								resultCell={frame >= FORMULA_RESULT_ON ? 'B2' : undefined}
								typingCell={
									frame < FORMULA_RESULT_ON
										? {col: 1, row: 1, fullText: typingFullText, startFrame: TYPE_START, charsPerFrame: 0.7}
										: undefined
								}
								accentColor={ACCENT}
							/>
						</ExcelChrome>

						{showHandle && (
							<div
								style={{
									position: 'absolute',
									left: handlePos.x - 7,
									top: handlePos.y - 7,
									width: 14,
									height: 14,
									background: ACCENT,
									border: '2px solid #FFFFFF',
									boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
									zIndex: 40,
								}}
							/>
						)}

						{frame >= CIRCLE1_START && frame < CIRCLE1_START + 90 && (
							<RedCircle x={b2Top.x} y={b2Top.y} w={b2.w} h={b2.h} startFrame={CIRCLE1_START} durationFrames={90} />
						)}

						{frame >= HANDLE_CIRCLE_START && frame < HANDLE_CIRCLE_START + 60 && (
							<RedCircle
								x={handlePos.x - 16}
								y={handlePos.y - 16}
								w={32}
								h={32}
								startFrame={HANDLE_CIRCLE_START}
								durationFrames={60}
							/>
						)}

						<MouseCursor
							path={[
								{frame: MOVE_START - 20, x: handlePos.x + 120, y: handlePos.y - 220},
								{frame: MOVE_START, x: handlePos.x + 90, y: handlePos.y - 160},
								{frame: CLICK_1, x: handlePos.x, y: handlePos.y},
							]}
							clicks={[
								{frame: CLICK_1, x: handlePos.x, y: handlePos.y},
								{frame: CLICK_2, x: handlePos.x, y: handlePos.y},
							]}
						/>

						{frame >= EMOJI_START && (
							<EmojiPop emoji="✅" x={b6Right.x + 30} y={b6Right.y} startFrame={EMOJI_START} durationFrames={120} size={64} />
						)}
					</div>
				</AbsoluteFill>
			)}

			{frame >= FILL_FLASH && frame < FILL_FLASH + 8 && (
				<Sequence from={FILL_FLASH} durationInFrames={8}>
					<FlashCut color={ACCENT} durationInFrames={8} />
				</Sequence>
			)}

			<Sequence from={VO_START} durationInFrames={VO_FRAMES + 20}>
				<Audio src={staticFile('audio/vo-fillhandle.mp3')} />
				<Subtitles words={words} accentColor={ACCENT} />
			</Sequence>

			<Sequence from={OUTRO_START}>
				<OutroCTA
					title="Suis pour plus d'astuces Excel"
					subtitle="Le double-clic magique"
					accentColor={ACCENT}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};
