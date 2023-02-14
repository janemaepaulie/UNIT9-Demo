import * as React from 'react';
import styled, { css } from 'styled-components';

import { Assets, SCENE_LOADED_EVENT } from '../../../utils/Assets';
import { media } from '../../../utils/Media';

const Wrapper = styled.section<{ isLoaded: boolean }>`
  width: 100%;
  height: 100%;

  position: absolute;

  opacity: 0;
  visibility: hidden;
  z-index: 2;

  transition: opacity 0.6s ease-in;

  ${props => props.isLoaded && css`visibility: unset; opacity: 1;`}
`;

const Area = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  text-align: left;
  margin: 0 auto;

  line-height: 1.5em;
`;

const Text = styled.div`
  width: 30%;
  color: #fff;

  margin-left: 30%;
  margin-top: -10%;

  h1 {
    margin-bottom: 1.8em;
    font-weight: 800;
  }

  small {
    font-size: 0.625em;
    opacity: 0.4;
  }

  p + p {
    margin-top: 0.625em;
  }

  ${media.tablet} {
    width: 100%;
    margin: auto 0;
    padding: 0 8%;

    font-size: 1.125em;
  }
`;

export function About() {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const listener = () => setIsLoaded(true);

    Assets.instance.addEventListener(SCENE_LOADED_EVENT, listener);
    return () => Assets.instance.removeEventListener(SCENE_LOADED_EVENT, listener);
  }, []);

  return (
    <Wrapper isLoaded={isLoaded}>
      <Area>
        <Text>
          <h1>Hi!</h1>
          <p>This is an engineering demo for UNIT9 <small>/</small> Le Polish Bureau. Built with React and Three.js 💕</p>
          <p>Use the wheel (or trackpad) to rotate the model and position the camera. There's music in the bottom right!</p>
          <p>WebAudio and realtime onset detection are applied to analyze the track, light up the model, and move particles to the beat. The rest is not too impressive, but I promise I learn pretty fast<br /><small>(p.s. tempo is not analyzed in this demo)</small></p>
        </Text>
      </Area>
    </Wrapper>
  );
};