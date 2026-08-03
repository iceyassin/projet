import React from 'react';
import {Composition} from 'remotion';
import {ExcelTipsVideo} from './Composition';
import {excelTipsVideoSchema} from './types';
import exampleData from './data/example.json';

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
		</>
	);
};
