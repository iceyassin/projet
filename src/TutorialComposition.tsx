import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Background} from './Background';
import {IntroHook} from './IntroHook';
import {OutroCTA} from './OutroCTA';
import {TopProgressBar} from './TopProgressBar';
import {TutorialStep} from './TutorialStep';
import {buildTutorialTimeline} from './tutorial/timeline';
import type {TutorialVideoProps} from './types';

const resolveAudioSrc = (url?: string) => {
	if (!url) return undefined;
	if (url.startsWith('http://') || url.startsWith('https://')) return url;
	return staticFile(url);
};

export const ExcelTutorialVideo: React.FC<TutorialVideoProps> = ({
	introTitle,
	introSubtitle,
	outroTitle,
	outroSubtitle,
	accentColor = '#21A366',
	steps,
	introSeconds = 3,
	outroSeconds = 3,
	musicUrl,
}) => {
	const {fps} = useVideoConfig();
	const timeline = buildTutorialTimeline({steps, introSeconds, outroSeconds}, fps);
	const musicSrc = resolveAudioSrc(musicUrl);

	return (
		<AbsoluteFill>
			<Background accentColor={accentColor} />

			{musicSrc && <Audio src={musicSrc} volume={0.35} />}

			<Sequence from={0} durationInFrames={timeline.introFrames}>
				<IntroHook
					title={introTitle}
					subtitle={introSubtitle}
					accentColor={accentColor}
					stepCount={steps.length}
				/>
			</Sequence>

			{timeline.steps.map((step) => (
				<TutorialStep
					key={step.number}
					step={step}
					total={steps.length}
					accentColor={accentColor}
				/>
			))}

			<Sequence from={timeline.outroStart} durationInFrames={timeline.outroFrames}>
				<OutroCTA title={outroTitle} subtitle={outroSubtitle} accentColor={accentColor} />
			</Sequence>

			<TopProgressBar accentColor={accentColor} />
		</AbsoluteFill>
	);
};
