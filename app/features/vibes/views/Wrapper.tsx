import * as React from 'react';

import { GraphicsEngine } from '../graphics/engine';
import { AudioEngine } from '../audio/engine';
import { Loop } from '../loop';

import { Context as VibesContext } from '../context';
import { Vibes } from './Vibes';

export function Wrapper() {
  const graphics = React.useRef(new GraphicsEngine());
  const audio = React.useRef(new AudioEngine());
  const loop = React.useRef(new Loop(graphics.current, audio.current));

  return (
    <VibesContext.Provider
      value={{ graphics: graphics.current, audio: audio.current, loop: loop.current }}
    >
      <Vibes />
    </VibesContext.Provider>
  );
}
