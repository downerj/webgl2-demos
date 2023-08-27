const mainVertexSource = `#version 100
precision highp float;

attribute vec2 aPosition;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const mainFragmentSource = `#version 100
precision highp float;

#define PI 3.14159265359
#define SAT_RATIO 0.0625
#define DEG_TO_RAD 0.017453292519943295
#define RAD_TO_DEG 57.29577951308232

const vec2 R = vec2(1.0, 0.0);
const vec2 I = vec2(0.0, 1.0);

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec2 uOffset;
uniform float uZoom;

// https://stackoverflow.com/a/17897228/9904700
vec3 hsv2rgb(in vec3 c)
{
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 getColor(in vec2 point) {
  float x = point.x;
  float y = point.y;
  float r = sqrt(x*x + y*y);
  float a = atan(y, x) * 180.0 / PI;
  
  float h = a / 360.0;
  float s = 1.0 - pow(SAT_RATIO, r);
  float v = 1.0;
  
  return hsv2rgb(vec3(h, s, v));
}

vec2 cMul(in vec2 a, in vec2 b) {
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

vec2 cDiv(in vec2 a, in vec2 b) {
  float d = b.x*b.x + b.y*b.y;
  return vec2((a.x*b.x + a.y*b.y)/d, (a.y*b.x - a.x*b.y)/d);
}

float cLen(in vec2 z) {
  return sqrt(z.x*z.x + z.y*z.y);
}

float cArg(in vec2 z) {
  return atan(z.y, z.x);
}

vec2 cPolar(in float r, in float th) {
  return vec2(r*cos(th), r*sin(th));
}

vec2 cUnit(in vec2 z) {
  float d = sqrt(z.x*z.x + z.y*z.y);
  return vec2(z.x/d, z.y/d);
}

vec2 cRotate(in vec2 z, in float degrees) {
  float r = cLen(z);
  float th = cArg(z);
  return cPolar(r, th + (degrees * DEG_TO_RAD));
}

vec2 func(in vec2 z) {
  vec2 a = cMul(z, z) - R;
  vec2 b = z - 2.0*R - I;
  vec2 b2 = cMul(b, b);
  vec2 d = cMul(z, z) + 2.0*R + 2.0*I;
  vec2 o = cDiv(cMul(a, b2), d);
  float angle = mod(uTime / 20.0, 360.0);
  return cRotate(o, angle);
}

void main() {
  vec2 center = uResolution*0.5;
  vec2 z = gl_FragCoord.xy - center;
  float ratio = 0.1*min(uResolution.x, uResolution.y);
  vec2 o = func((z*uZoom + uOffset)/ratio);
  gl_FragColor = vec4(getColor(o), 1.0);
}
`;
