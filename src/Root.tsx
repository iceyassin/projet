import React from 'react';
import {Composition} from 'remotion';
import {ExcelTipsVideo} from './Composition';
import {SingleTipVideo} from './SingleTipVideo';
import {LiveExcelCtrlT} from './LiveExcelCtrlT';
import {LiveExcelAutoSum} from './LiveExcelAutoSum';
import {LiveExcelFillHandle} from './LiveExcelFillHandle';
import {LiveExcelSumIf, SUM_IF_TOTAL_FRAMES} from './LiveExcelSumIf';
import {ExcelTutorialVideo} from './TutorialComposition';
import {buildTutorialTimeline} from './tutorial/timeline';
import {SINGLE_TIP_TOTAL_FRAMES} from './tutorial/singleTipTimeline';
import {excelTipsVideoSchema, singleTipVideoSchema, tutorialVideoSchema} from './types';
import exampleData from './data/example.json';
import tutorialData from './data/tutorial-10-tips.json';
import singleTipData from './data/tips/01-navigation-rapide.json';

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;
const DURATION_IN_SECONDS = 30;

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="ExcelTipsShort"
				component={ExcelTipsVideo}
				durationInFrames={DURATION_IN_SECONDS * FPS}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				schema={excelTipsVideoSchema}
				defaultProps={excelTipsVideoSchema.parse(exampleData)}
			/>

			<Composition
				id="Excel10TipsTutorial"
				component={ExcelTutorialVideo}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				schema={tutorialVideoSchema}
				defaultProps={tutorialVideoSchema.parse(tutorialData)}
				durationInFrames={buildTutorialTimeline(
					tutorialVideoSchema.parse(tutorialData),
					FPS,
				).totalFrames}
				calculateMetadata={async ({props}) => ({
					durationInFrames: buildTutorialTimeline(props, FPS).totalFrames,
				})}
			/>

			<Composition
				id="ExcelTipSingle"
				component={SingleTipVideo}
				durationInFrames={SINGLE_TIP_TOTAL_FRAMES}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				schema={singleTipVideoSchema}
				defaultProps={singleTipVideoSchema.parse(singleTipData)}
			/>

			<Composition
				id="LiveExcelCtrlT"
				component={LiveExcelCtrlT}
				durationInFrames={598}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>

			<Composition
				id="LiveExcelAutoSum"
				component={LiveExcelAutoSum}
				durationInFrames={926}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>

			<Composition
				id="LiveExcelFillHandle"
				component={LiveExcelFillHandle}
				durationInFrames={920}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>

			<Composition
				id="LiveExcelSumIf"
				component={LiveExcelSumIf}
				durationInFrames={SUM_IF_TOTAL_FRAMES}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
		</>
	);
};
