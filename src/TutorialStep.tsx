import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {BigCaption} from './BigCaption';
import {ExcelCard} from './ExcelCard';
import {FlashCut} from './FlashCut';
import {ProgressPill} from './ProgressPill';
import {SlowMethodCard} from './SlowMethodCard';
import type {TimelineStep} from './tutorial/timeline';

const CenteredCard: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill
		style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 90}}
	>
		{children}
	</AbsoluteFill>
);

export const TutorialStep: React.FC<{
	step: TimelineStep;
	total: number;
	accentColor: string;
}> = ({step, total, accentColor}) => {
	return (
		<>
			<Sequence from={step.hookStart} durationInFrames={step.hookFrames}>
				<ProgressPill
					number={step.number}
					total={total}
					label={step.label}
					accentColor={accentColor}
				/>
				<CenteredCard>
					<SlowMethodCard
						description={step.hook.description}
						tediumTarget={step.hook.tediumTarget}
						tediumUnit={step.hook.tediumUnit}
					/>
				</CenteredCard>
				<BigCaption text={step.hook.caption} color="#FF8A8A" bottom={150} startFrame={4} />
			</Sequence>

			<Sequence from={step.revealStart} durationInFrames={8}>
				<FlashCut color={accentColor} durationInFrames={8} />
			</Sequence>

			<Sequence from={step.revealStart} durationInFrames={step.revealFrames}>
				<ProgressPill
					number={step.number}
					total={total}
					label={step.label}
					accentColor={accentColor}
				/>
				<CenteredCard>
					<ExcelCard excelData={step.reveal.excelData} accentColor={accentColor} />
				</CenteredCard>
				<BigCaption
					text={step.reveal.caption}
					color={accentColor}
					bottom={130}
					startFrame={6}
				/>
			</Sequence>
		</>
	);
};
