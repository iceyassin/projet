import React from 'react';
import {
	AbsoluteFill,
	Audio,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Background} from './Background';
import {ExcelCard} from './ExcelCard';
import {Subtitles} from './Subtitles';
import type {ExcelTipsVideoProps} from './types';

const TITLE_INTRO_END = 45;
const CARD_START = 30;

const TitleCard: React.FC<{title: string; accentColor: string}> = ({
	title,
	accentColor,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({frame, fps, config: {damping: 200, mass: 0.6}});
	const exitOpacity = interpolate(
		frame,
		[TITLE_INTRO_END - 12, TITLE_INTRO_END],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	const translateY = interpolate(entrance, [0, 1], [40, 0]);

	return (
		<div
			style={{
				position: 'absolute',
				top: 150,
				left: 60,
				right: 60,
				textAlign: 'center',
				opacity: entrance * exitOpacity,
				transform: `translateY(${translateY}px)`,
			}}
		>
			<div
				style={{
					display: 'inline-block',
					padding: '10px 24px',
					borderRadius: 999,
					background: `${accentColor}22`,
					border: `2px solid ${accentColor}`,
					color: accentColor,
					fontFamily: 'Arial, Helvetica, sans-serif',
					fontWeight: 800,
					fontSize: 26,
					letterSpacing: 2,
					marginBottom: 22,
					textTransform: 'uppercase',
				}}
			>
				Astuce Excel
			</div>
			<div
				style={{
					fontFamily: '"Arial Black", Arial, Helvetica, sans-serif',
					fontWeight: 900,
					fontSize: 68,
					lineHeight: 1.08,
					color: '#FFFFFF',
					WebkitTextStroke: '3px #000000',
					paintOrder: 'stroke fill',
					textShadow: '0 8px 0 rgba(0,0,0,0.35)',
				}}
			>
				{title}
			</div>
		</div>
	);
};

const resolveAudioSrc = (audioUrl?: string) => {
	if (!audioUrl) return undefined;
	if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
		return audioUrl;
	}
	return staticFile(audioUrl);
};

export const ExcelTipsVideo: React.FC<ExcelTipsVideoProps> = ({
	title,
	excelData,
	words,
	audioUrl,
	accentColor = '#21A366',
}) => {
	const audioSrc = resolveAudioSrc(audioUrl);

	return (
		<AbsoluteFill>
			<Background accentColor={accentColor} />

			{audioSrc && <Audio src={audioSrc} />}

			<TitleCard title={title} accentColor={accentColor} />

			<AbsoluteFill
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					paddingBottom: 120,
				}}
			>
				<ExcelCard
					excelData={excelData}
					startFrame={CARD_START}
					accentColor={accentColor}
				/>
			</AbsoluteFill>

			<Subtitles words={words} accentColor={accentColor} />
		</AbsoluteFill>
	);
};
