## Demo for Unit9 / Le Polish Bureau

Node version used : `18.x.x`

Install dependencies with:
```bash
npm install
# or
yarn install
```

Make sure there's music available in `app/features/vibes/audio/tracks` named `track.mp3`

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes 

I'm very new to graphics and creative development (but not React and engineering). This was an attempt to pick up Three.js and brush up on the basics of shaders within ~six weeks, and this is what I ended up with. Here's what I would do having more time and/or knowledge:

### Things I'd improve:
- There’s weirdness going on with the alpha channel of the particles, but I don’t know how to fix that. Adding `transparent: false` to their ShaderMaterial exposes the problem
- Much of the BeatDetector could potentially be replaced by a call to Essentia's [OnsetDetection](https://essentia.upf.edu/reference/streaming_OnsetDetection.html) method, but is that fun? (it's easier to extend the algorithm if we have our own)
- Onset detection is realtime because I wanted it to be, but for applied uses, a preanalyzed onset graph might work better as it enables robust post processing of peaks and thresholds. This can be generated while the file is loading. Then, all we have to do is follow the time marker
- Particles need more interesting motion and lifetime, I liked the FBO particles approach in theory but haven't experimented with it yet
- Better handling of touch events with aftertouch velocity

### Things I'd add:
- Realtime tempo analysis and adjustment based on [autocorrelation](http://webhome.csc.uvic.ca/~gtzan/output/taslp2014-tempo-gtzan.pdf). Make model dance to the tempo (perceptually), synchronize particle flow to the BPM too
- Improve beat detection algorithm, this one is a basic spectral flux algorithm but could be extended with additional parameters to increase precision and richness of extracted data... e.g., imitate instrument separation by listening to frequency bands rather than the whole spectrum
- Add texturing and distorted [glow](https://www.indiewire.com/wp-content/uploads/2017/06/blade-runner-20491.jpg) to the model, the glow could be displaced to the beat
- Let visitors upload their own music
- Evolve visual effects based on scroll position, infatuated with midwam.com

## Technologies used

React
Three.js
Essentia.js
Next.js
Styled Components
TypeScript
