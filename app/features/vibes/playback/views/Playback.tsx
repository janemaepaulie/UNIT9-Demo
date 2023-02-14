import * as React from 'react';
import styled, { css } from 'styled-components';
import { media } from '../../../../utils/Media';

import { Assets, SCENE_LOADED_EVENT } from '../../../../utils/Assets';
import { Context as VibesContext } from '../../context';

import arrow from './images/arrow.png';

const Wrapper = styled.div<{ isLoaded: boolean }>`
  position: fixed;
  bottom: 0;
  right: 1.8em;

  visibility: hidden;
  opacity: 0;
  z-index: 3;

  transition: opacity 0.6s ease-in;
  cursor: pointer;

  ${props => props.isLoaded && css`visibility: unset; opacity: 1;`}
  ${media.tablet} {
    right: 1em;
  }
`;

const Wave = styled.div`
  display: block;
  width: 160px;
  height: 60px;

  cursor: pointer;
`;

const Disclaimer = styled.div`
  position: absolute;

  color: #fff;
  text-transform: lowercase;
  font-family: 'Handwriting';

  opacity: 0.3;

  span {
    display: inline-block;
    transform: translate(48px, -34px) rotate(8deg);
  }
`

const Arrow = styled.img`
  position: absolute;
  
  width: 100px;
  top: -60px;
  left: -14px;
  transform: rotate(-16deg);
`;

export const Playback = React.forwardRef((props, ref: any) => {
  const { audio } = React.useContext(VibesContext);

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInstructed, setIsInstructed] = React.useState(false);

  function handleClick(event) {
    event.preventDefault();
    audio.isPlaying ? audio.pause() : audio.play();

    if (!isInstructed) setIsInstructed(true);
  }

  React.useEffect(() => {
    const listener = () => setIsLoaded(true);

    Assets.instance.addEventListener(SCENE_LOADED_EVENT, listener);
    return () => Assets.instance.removeEventListener(SCENE_LOADED_EVENT, listener);
  }, []);

  return (
      <Wrapper onClick={handleClick} isLoaded={isLoaded}>
        {
          !isInstructed && (
            <Disclaimer>
              <Arrow src={arrow.src} />
              <span>Press here!</span>
            </Disclaimer>
          )
        }
        <Wave ref={ref} />
      </Wrapper>
  );
});