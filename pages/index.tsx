import * as React from 'react';

import { Vibes } from '../app/features/vibes';
import { About } from '../app/features/about';
import { Footer } from '../app/components/footer/Footer';

export default function Index() {
  return (
    <>
      <Vibes />
      <About />
      <Footer />
    </>
  );
}
