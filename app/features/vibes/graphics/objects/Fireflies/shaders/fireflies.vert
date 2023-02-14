uniform float uTime;
uniform float uDisplacement1;
uniform float uDisplacement2;

attribute vec3 instance;
attribute float random;

varying vec2 vUv;
varying vec3 vPosition;
varying float vRandom;
varying float vWarp;

float remap(float x, float fromMin, float fromMax, float toMin, float toMax) {
  return toMin + (x - fromMin) * (toMax - toMin) / (fromMax - fromMin);
}

void main() {
  float length = abs(position.x);
  float warp = sin(uTime / 1000.0 * random);

  vWarp = warp;

  float u = remap(position.x, -(length), length, 0.0, 1.0);
  float v = remap(position.y, -(length), length, 0.0, 1.0);
  vUv = vec2(u, v);

  vPosition = position;
  vRandom = random;

  float move = warp * length * 3.0 + vRandom;
  vec4 play = vec4(uDisplacement1 * vRandom);
  vec4 beat = vec4(
    uDisplacement2 / 1.6 * cos(vRandom * 6.0) * 100.0 * vRandom,
    uDisplacement2 / 1.8 * sin(vRandom * 6.0) * 100.0 * vRandom,
    uDisplacement2 * sin(vRandom * 6.0) * 10.0 * vRandom,
    0.0
  );

  vec4 local =
    vec4(instance, 1.0) +
    vec4(move, move, move, 1.0) + 
    -play +
    -beat;

  vec4 view = modelMatrix * viewMatrix * local;

  vec3 closer = position + vec3(0.0, 0.0, 100.0);
  vec3 randomized = closer + vec3(vRandom * 10.0);
  vec4 transformed = view + vec4(randomized, 0.0);

  gl_Position = projectionMatrix * transformed;
}
