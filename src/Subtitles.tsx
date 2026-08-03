import React, {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {WordTiming} from './types';

const WORDS_PER_GROUP = 4;

const Word: React.FC<{
	word: WordTiming;
	isActive: boolean;
	hasPassed: boolean;
	accentColor: string;
}> = ({word, isActive, hasPassed, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const startFrame = word.start * fps;

	const pop = spring({
		frame: frame - startFrame,
		fps,
		config: {damping: 12, mass: 0.4, stiffness: 260},
		durationInFrames: 10,
	});

	const scale = isActive ? interpolate(pop, [0, 1], [1, 1.16]) : 1;

	return (
		<span
			style={{
				display: 'inline-block',
				transform: `scale(${scale})`,
				color: isActive || hasPassed ? accentColor : '#FFFFFF',
				WebkitTextStroke: '10px #000000',
				paintOrder: 'stroke fill',
				textShadow: '0 6px 0 rgba(0,0,0,0.35)',
				marginRight: 18,
				transition: 'color 0.05s linear',
			}}
		>
			{word.text}
		</span>
	);
};

export const Subtitles: React.FC<{
	words: WordTiming[];
	accentColor?: string;
}> = ({words, accentColor = '#3DDC84'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const time = frame / fps;

	const {activeIndex, group} = useMemo(() => {
		if (!words.length) {
			return {activeIndex: -1, group: [] as WordTiming[]};
		}

		let idx = words.findIndex((w) => time >= w.start && time < w.end);
		if (idx === -1) {
			// Entre deux mots (ou avant/après tout le script) : on garde le dernier mot prononcé visible.
			idx = words.reduce(
				(acc, w, i) => (w.start <= time ? i : acc),
				0,
			);
		}

		const groupIndex = Math.floor(idx / WORDS_PER_GROUP);
		const start = groupIndex * WORDS_PER_GROUP;
		return {
			activeIndex: idx,
			group: words.slice(start, start + WORDS_PER_GROUP),
		};
	}, [words, time]);

	if (!words.length || activeIndex === -1) {
		return null;
	}

	// Ne rien afficher avant le tout premier mot.
	if (time < words[0].start) {
		return null;
	}

	return (
		<div
			style={{
				position: 'absolute',
				left: 60,
				right: 60,
				bottom: 260,
				display: 'flex',
				justifyContent: 'center',
				flexWrap: 'wrap',
				fontFamily: '"Arial Black", Arial, Helvetica, sans-serif',
				fontWeight: 900,
				fontSize: 76,
				lineHeight: 1.15,
				textAlign: 'center',
				textTransform: 'uppercase',
			}}
		>
			{group.map((w, i) => {
				const globalIndex = words.indexOf(w);
				return (
					<Word
						key={`${w.text}-${globalIndex}`}
						word={w}
						isActive={globalIndex === activeIndex}
						hasPassed={globalIndex < activeIndex}
						accentColor={accentColor}
					/>
				);
			})}
		</div>
	);
};
