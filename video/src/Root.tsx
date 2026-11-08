import React from 'react';
import { Composition } from 'remotion';
import { Main, DURATION, FPS } from './Main';

export const RemotionRoot: React.FC = () => (
  <Composition id="NurAjandaReels" component={Main} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
);
