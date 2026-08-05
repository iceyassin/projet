import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Background} from './Background';
import {ExcelCard} from './ExcelCard';
import {BigCaption} from './BigCaption';
import {FlashCut} from './FlashCut';
import {OutroCTA} from './OutroCTA';
import {RecapBeat} from './RecapBeat';
import {RelatableBeat} from './RelatableBeat';
import {SlowMethodCard} from './SlowMethodCard';
import {TipIntro} from './TipIntro';
import {buildSingleTipTimeline} from './tutorial/singleTipTimeline';
import type {SingleTipVideoProps} from './types';

const CenteredCard: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill
		style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 90}}
	>
		{children}
	</AbsoluteFill>
);

export const SingleTipVideo: React.FC<SingleTipVideoProps> = ({
	number,
	total,
	label,
	seriesTitle,
	hook,
	reveal,
	accentColor = '#21A366',
}) => {
	const t = buildSingleTipTimeline();

	return (
		<AbsoluteFill>
			<Background accentColor={accentColor} />

			<Sequence from={t.introStart} durationInFrames={t.problemStart - t.introStart}>
				<TipIntro
					number={number}
					total={total}
					seriesTitle={seriesTitle}
					headline={hook.caption}
					accentColor={accentColor}
				/>
			</Sequence>

			<Sequence from={t.problemStart} durationInFrames={t.relatableStart - t.problemStart}>
				<CenteredCard>
					<SlowMethodCard
						description={hook.description}
						tediumTarget={hook.tediumTarget}
						tediumUnit={hook.tediumUnit}
					/>
				</CenteredCard>
				<BigCaption text={label} color="#FF8A8A" bottom={150} startFrame={4} fontSize={54} />
			</Sequence>

			{hook.relatable && (
				<Sequence
					from={t.relatableStart}
					durationInFrames={t.flashStart - t.relatableStart}
				>
					<RelatableBeat text={hook.relatable} accentColor={accentColor} />
				</Sequence>
			)}

			<Sequence from={t.flashStart} durationInFrames={t.revealStart - t.flashStart}>
				<FlashCut
					color={accentColor}
					durationInFrames={t.revealStart - t.flashStart}
				/>
			</Sequence>

			<Sequence from={t.revealStart} durationInFrames={t.recapStart - t.revealStart}>
				<CenteredCard>
					<ExcelCard excelData={reveal.excelData} accentColor={accentColor} />
				</CenteredCard>
				<BigCaption text={reveal.caption} color={accentColor} bottom={130} startFrame={6} />
			</Sequence>

			<Sequence from={t.recapStart} durationInFrames={t.outroStart - t.recapStart}>
				<RecapBeat label={label} excelData={reveal.excelData} accentColor={accentColor} />
			</Sequence>

			<Sequence from={t.outroStart} durationInFrames={t.totalFrames - t.outroStart}>
				<OutroCTA
					title="Suis pour plus d'astuces Excel"
					subtitle="Une nouvelle astuce chaque jour"
					accentColor={accentColor}
					seriesLabel={`Astuce ${number}/${total} terminée ✅`}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};
