import * as THREE from 'three';
import gsap from 'gsap';

import { AudioEngine } from '../../../audio/engine';
import { Object } from '../Object';

import vertexShader from './shaders/fireflies.vert';
import fragmentShader from './shaders/fireflies.frag';

import { PLAYING_EVENT } from '../../../audio/events/PlayingEvent';
import { BEAT_EVENT } from '../../../audio/events/BeatEvent';

interface Uniforms {
  uTime: { type?: string; value: number };
  uDisplacement1: { type?: string; value: number };
  uDisplacement2: { type?: string; value: number };
  uTexture: { type?: string; value: THREE.Texture };
}

export class Fireflies extends Object {
  private _audio: AudioEngine;
  private _uniforms: Uniforms;

  constructor(texture: THREE.Texture, audio: AudioEngine) {
    const particle = new THREE.PlaneGeometry(8, 8);
    const geometry = new THREE.InstancedBufferGeometry();
    const particles = 8000;

    geometry.setAttribute('position', particle.getAttribute('position'));
    geometry.instanceCount = particles;
    geometry.index = particle.index;

    const positions = new Float32Array(particles * 3);
    const randoms = new Float32Array(particles);

    for (let i = 0; i < particles; i++) {
      let x = (Math.random() - 0.5) * 1000;
      let y = (Math.random() - 0.5) * 1000;
      let z = (Math.random() - 0.5) * 1000;

      positions.set([x, y, z], i * 3);
      randoms.set([Math.random()], i);
    }

    geometry.setAttribute('instance', new THREE.InstancedBufferAttribute(positions, 3));
    geometry.setAttribute('random', new THREE.InstancedBufferAttribute(randoms, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;

    super({ mesh, geometry, material });

    this._audio = audio;
    this._uniforms = {
      uTime: {
        value: 0
      },
      uDisplacement1: {
        value: 0
      },
      uDisplacement2: {
        value: 0
      },
      uTexture: {
        value: texture
      },
    };

    this._material.uniforms.uTime = this._uniforms.uTime;
    this._material.uniforms.uDisplacement1 = this._uniforms.uDisplacement1;
    this._material.uniforms.uDisplacement2 = this._uniforms.uDisplacement2;
    this._material.uniforms.uTexture = this._uniforms.uTexture;
    
    this._addListeners();
  }

  public update({ delta, time }: { delta: any; time: any; }): void {
    this._uniforms.uTime.value = time;
  }

  private _addListeners() {
    /* all this motion probably better implemented with a physics engine */

    this._audio.addEventListener(PLAYING_EVENT, ({ playing }) => {
      if (playing) {
        const previous = this._uniforms.uDisplacement1.value;

        const timeline = gsap.timeline();
        timeline
          .to(this._uniforms.uDisplacement1, { value: previous + 1.0, duration: 1.0, ease: 'power3.out', easeIn: 1.4 })
          .to(this._uniforms.uDisplacement1, { value: 0.0, duration: 3.0, ease: 'power1.in', easeIn: 0.8 })
          .to(this._uniforms.uDisplacement1, { value: -0.4, duration: 1.0, ease: 'power1.out', easeIn: 0.8 })
          .to(this._uniforms.uDisplacement1, { value: 0.0, duration: 6.0, ease: 'power1.in' });
      }
    });

    this._audio.mix.addEventListener(BEAT_EVENT, (event) => {
      if (event.intensity < 0.36) {
        return;
      }

      const intensity = 0.3 + event.intensity;
      const previous = -this._uniforms.uDisplacement2.value;
      const displacement = previous + intensity;

      gsap.to(this._uniforms.uDisplacement2, {
        value: displacement,
        duration: 1.8 * (1.0 + displacement),
        ease: 'power3.out',
        overwrite: true,
      });
    });
  }
}