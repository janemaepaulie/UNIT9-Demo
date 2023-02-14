import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';

import { Assets, SCENE_LOADED_EVENT } from '../../../utils/Assets';

import { Context as VibesContext } from '../context';
import { Playback } from '../playback/views/Playback';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const RendererEl = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  z-index: 1;
`;

const Loading = styled.div`
  position: fixed;
  margin: auto;

  width: 100%;
  height: 100%;
  
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;

  z-index: 3;
  pointer-events: none;
`;

const animation = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div<{ isLoaded: boolean }>`
  width: 36px;
  height: 36px;
  display: inline-block;

  border-radius: 50%;
  border-top: 4px solid #FFF;
  border-right: 4px solid transparent;

  box-sizing: border-box;
  animation: ${animation} 1s linear infinite;

  opacity: 1;
  transition: opacity 0.1s ease-out;

  ${props => props.isLoaded && css`opacity: 0;`}
`;

export function Vibes() {
  const { loop } = React.useContext(VibesContext);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const rendererEl = React.useRef();
  const playbackEl = React.useRef();

  React.useEffect(() => {
    loop.begin(rendererEl.current, playbackEl.current);

    const listener = () => setIsLoaded(true);
    Assets.instance.addEventListener(SCENE_LOADED_EVENT, listener);

    return () => {
      loop.end();
      Assets.instance.removeEventListener(SCENE_LOADED_EVENT, listener);
    };
  }, []);

  return (
    <Wrapper>
      <Loading>
        <Loader isLoaded={isLoaded} />
      </Loading>

      <RendererEl ref={rendererEl} />
      <Playback ref={playbackEl} />
    </Wrapper>
  );
}
