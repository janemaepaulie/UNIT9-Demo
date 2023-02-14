uniform float uIntensity;

varying vec3 vNormal;

void main() {
  float depth = dot(vec3(1.0), vNormal);
  float inner = (1.0 - pow(depth,3.0));

  inner = mix(inner, 1.0, uIntensity);

  vec3 purple = vec3(0.6, 0.0, 0.48);
  vec3 burn = mix(purple, vec3(1.0, 0.3, 0.6), inner);
  vec3 toned = mix(burn, purple, 0.3);

  gl_FragColor = vec4(vec3(toned), 1.0);
}