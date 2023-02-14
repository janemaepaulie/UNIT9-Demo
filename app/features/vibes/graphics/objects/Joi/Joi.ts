import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import gsap from 'gsap';

import { AudioEngine } from '../../../audio/engine';
import { PLAYING_EVENT } from '../../../audio/events/PlayingEvent';
import { BEAT_EVENT } from '../../../audio/events/BeatEvent';

import { ObjectGroup } from '../ObjectGroup';

import joiFragmentShader from './shaders/joi.frag';
// import joiGlowFragmentShader from './shaders/joi.glow.frag';

interface Uniforms {
  uTime: { type?: string; value: number; };
  uIntensity: { type?: string; value: number };
  uBpm: { type?: string; value: number; }
}

const DEFAULT_TIMESCALE = 0.46;

export class Joi extends ObjectGroup {
  private _audio: AudioEngine;
  private _mixers: THREE.AnimationMixer[];
  private _uniforms: Uniforms;

  private _chest: THREE.Bone;
  private _followPosition: THREE.Vector3;

  public get followPosition(): THREE.Vector3 {
    return this._followPosition;
  }

  constructor(fbx: THREE.Group, position: THREE.Vector3, audio: AudioEngine) {
    let chest;
    let material;

    fbx.traverse((child) => {
      if (child instanceof THREE.SkinnedMesh) {
        if (child.name === 'Beta_Joints') {
          fbx.remove(child);
        }

        child.material.onBeforeCompile = (shader) => {
          shader.fragmentShader = joiFragmentShader;

          shader.uniforms.uTime = this._uniforms.uTime;
          shader.uniforms.uIntensity = this._uniforms.uIntensity;
          shader.uniforms.uBpm = this._uniforms.uBpm;
        };

        chest = SkeletonUtils.getBoneByName('mixamorigSpine2', child.skeleton);
        material = child.material;
      }
    });

    super({ group: fbx, material });

    // const glow = SkeletonUtils.clone(fbx);
    // glow.scale.setScalar(1.06);
    // glow.position.sub(new THREE.Vector3(0.0, 10.0, 0.0));
    // glow.traverse((child) => {
    //   if (child instanceof SkinnedMesh) {
    //     child.material = material.clone();
        
    //     child.material.onBeforeCompile = (shader) => {
    //       shader.fragmentShader = joiGlowFragmentShader;
    //       shader.uniforms.uTime = this._uniforms.uTime;

    //       shader.vertexShader = shader.vertexShader.replace(
    //         `varying vec3 vViewPosition;`,
    //         `
    //         varying vec3 vViewPosition;
    //         varying vec3 vPos;
    //         uniform float uTime;

    //         float rand(float n){return fract(sin(n) * 43758.5453123);}
    //         `
    //       );

    //       shader.vertexShader = shader.vertexShader.replace(
    //         `#include <begin_vertex>`,
    //         `
    //         #include <begin_vertex>
    //         vPos = position;
    //         transformed.y += 6.0 * rand(vPos.z);
    //         `
    //       );
    //     };
    //   }
    // });
    // this.add(glow);

    this._audio = audio;
    this._mixers = [];

    this._mixers.push(new THREE.AnimationMixer(fbx));
    // this._mixers.push(new THREE.AnimationMixer(glow));

    this.position.copy(position);

    this._uniforms = {
      uTime: {
        value: 0,
      },
      uIntensity: {
        value: 0,
      },
      uBpm: {
        value: 0,
      }
    };

    const dance1 = this._mixers[0].clipAction(fbx.animations[0]);
    // const dance2 = this._mixers[1].clipAction(fbx.animations[0]);

    dance1.play();
    // dance2.play();
    this._mixers[0].timeScale = 0.0;
    // this._mixers[1].timeScale = 0.0;

    /* move Joi from t-shape to initial animation frame */
    this._mixers[0].update(0);
    // this._mixers[1].update(0);

    this._chest = chest;
    this._followPosition = new THREE.Vector3;
    this._chest.getWorldPosition(this._followPosition);

    this._addListeners();
  }

  public update({ delta, time }): void {
    this._mixers.forEach(mixer => mixer.update(delta));
    this._chest.getWorldPosition(this._followPosition);

    this._uniforms.uTime.value = time;
  }

  private _addListeners() {
    this._audio.addEventListener(PLAYING_EVENT, ({ playing }) => {
      if (playing) {
        this._mixers[0].timeScale = DEFAULT_TIMESCALE;
        // this._mixers[1].timeScale = DEFAULT_TIMESCALE;
      } else {
        this._mixers[0].timeScale = 0.0;
        // this._mixers[1].timeScale = 0.0;
      }
    });

    this._audio.mix.addEventListener(BEAT_EVENT, (event) => {
      const intensity = 0.3 + event.intensity;

      gsap.fromTo(
        this._uniforms.uIntensity,
        {
          value: Math.min(this._uniforms.uIntensity.value + intensity, 1.0),
          delay: 0.4,
        },
        {
          value: 0.0,
          duration: 1.4 * (0.6 + intensity)
        });
    });
  }
}