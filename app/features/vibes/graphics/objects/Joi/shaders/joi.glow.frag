uniform float uTime;
uniform float uBpm;

varying vec3 vNormal;

void main() {
  float warp = abs(sin(uTime / 300.0) * sin(uTime / 400.0) * sin(uTime / 1000.0));

  vec4 flicker = vec4(
    warp * vNormal.y,
    0.0,
    0.0,
    0.0
  );

  vec4 bpmFlicker = vec4(
    warp * sin(uBpm),
    0.0,
    warp * sin(uBpm),
    0.0
  );

  vec3 pink = vec3(0.78, 0.3, 0.6);
  float intensity = pow(0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 3.0 );

  vec3 toned = intensity * pink;

  gl_FragColor =
    vec4(toned, 1.0 * intensity) *
    (vec4(1.0) + flicker + bpmFlicker);
}