const fsSource = usSource + `
#define FUNC2

#ifdef FUNC1
vec2 func(vec2 z) {
  float angle = mod(uTime / 20.0, 360.0);
  return cRotate(z, -angle);
}
#endif

#ifdef FUNC2
vec2 func(vec2 z) {
  vec2 a = cMul(z, z) - R;
  vec2 b = z - 2.0*R - I;
  vec2 b2 = cMul(b, b);
  vec2 d = cMul(z, z) + 2.0*R + 2.0*I;
  vec2 o = cDiv(cMul(a, b2), d);
  // float angle = mod(uTime / 20.0, 360.0);
  return o;
}
#endif

#ifdef FUNC3
vec2 func(vec2 z) {
  vec2 o = cMul(cMul(z, z), z) - R;
  // float angle = mod(uTime / 20.0, 360.0);
  return o;
}
#endif

void main(void) {
  vec2 center = uResolution*0.5;
  vec2 z = gl_FragCoord.xy - center;
  float ratio = 0.1*min(uResolution.x, uResolution.y);
  vec2 z1 = (z*uZoom + uOffset)/ratio;
  vec2 o = func(z1);
  gl_FragColor = vec4(getColor(o), 1.0);
}
`;
