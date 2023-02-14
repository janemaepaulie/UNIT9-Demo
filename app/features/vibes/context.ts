import * as React from 'react';

import { Loop } from './loop';

import { GraphicsEngine } from './graphics/engine';
import { AudioEngine } from './audio/engine';

interface VibesContext {
  graphics: GraphicsEngine;
  audio: AudioEngine;
  loop: Loop;
}

export const Context = React.createContext<VibesContext>({
  graphics: null,
  audio: null,
  loop: null,
});