uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying float vRandom;
varying float vWarp;

void main() {
  vec4 texture = texture2D(uTexture, vUv);
  vec4 flicker = vec4(
    texture.rgb,
    texture.a * abs(vWarp)
  );

  float distance = distance(vPosition, gl_FragCoord.xyz) / 800.0;

  vec3 purple = vec3(0.26, 0.05, 0.27) * vRandom;
  vec4 toned = mix(flicker, vec4(purple, flicker.a), 0.3 * distance);

  gl_FragColor = vec4(toned.rgb, toned.a * vRandom);
}