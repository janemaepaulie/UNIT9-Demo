import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.h1`
  position: fixed;
  bottom: 0.8em;
  left: 0.8em;

  margin: 0;
  color: #fff;

  font-size: 1em;
  font-weight: 300;

  z-index: 3;
  mix-blend-mode: overlay;

  b {
    font-weight: 700;
  }
`;

export function Footer(props) {
  return (
    <Wrapper>
      by <b>Paulie Jean</b>
    </Wrapper>
  );
}