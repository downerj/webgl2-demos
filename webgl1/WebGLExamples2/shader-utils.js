const usSource = `
#version 100
precision mediump float;

#define PI 3.14159265359
#define SAT_RATIO 0.0625

const vec2 R = vec2(1.0, 0.0);
const vec2 I = vec2(0.0, 1.0);

uniform vec2 uMouse;
uniform vec2 uOffset;
uniform float uZoom;
uniform float uTime;
uniform vec2 uResolution;

// https://stackoverflow.com/a/17897228/9904700
vec3 hsv2rgb(vec3 c)
{
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 getColor(vec2 point) {
  float x = point.x;
  float y = point.y;
  float r = sqrt(x*x + y*y);
  float a = atan(y, x) * 180.0 / PI;
  
  float h = a / 360.0;
  float s = 1.0 - pow(SAT_RATIO, r);
  float v = 1.0;
  
  return hsv2rgb(vec3(h, s, v));
}

float degToRad(float degrees) {
  return degrees * PI / 180.0;
}

float radToDeg(float radians) {
  return radians * 180.0 / PI;
}

vec2 cMul(vec2 a, vec2 b) {
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

vec2 cDiv(vec2 a, vec2 b) {
  float d = b.x*b.x + b.y*b.y;
  return vec2((a.x*b.x + a.y*b.y)/d, (a.y*b.x - a.x*b.y)/d);
}

float cLen(vec2 z) {
  return sqrt(z.x*z.x + z.y*z.y);
}

float cArg(vec2 z) {
  return atan(z.y, z.x);
}

vec2 cPolar(float r, float th) {
  return vec2(r*cos(th), r*sin(th));
}

vec2 cUnit(vec2 z) {
  float d = sqrt(z.x*z.x + z.y*z.y);
  return vec2(z.x/d, z.y/d);
}

vec2 cRotate(vec2 z, float degrees) {
  float r = cLen(z);
  float th = cArg(z);
  return cPolar(r, th + degToRad(degrees));
}
`;
