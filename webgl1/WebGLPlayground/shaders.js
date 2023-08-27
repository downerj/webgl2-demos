const VERTEX_PRECISION = `
precision highp float;`;

const FRAGMENT_PRECISION = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif`;

const HSV2RGB_FUNC = `
// https://stackoverflow.com/a/17897228/9904700
vec3 hsv2rgb(in vec3 c)
{
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}`;

const FRAGMENT_DEFINES = `
#define PI 3.14159265358979323846`;

const GET_COLOR_FUNC = `
void getColor(out vec4 fragColor) {
  float x = gl_FragCoord.x;
  float y = gl_FragCoord.y;
  // Draw a diagonal rainbow.
  float hue = mod((y - x) / 1000.0 + time / (3000.0 * PI), 1.0);
  float sat = 1.0;
  float lum = 1.0;
  vec3 c = vec3(hue, sat, lum);
  fragColor = vec4(hsv2rgb(c), 1.0);
}`;

function makeShaderSources(gl, getColorFuncSource = null) {
  let vertexSource;
  let fragmentSource;
  if (gl instanceof WebGL2RenderingContext) {
    vertexSource = `#version 300 es
${VERTEX_PRECISION}
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;
    fragmentSource = `#version 300 es
${FRAGMENT_PRECISION}
${FRAGMENT_DEFINES}
uniform float time;
out vec4 color;
${HSV2RGB_FUNC}
${getColorFuncSource ?? GET_COLOR_FUNC}

void main() {
  getColor(color);
}`;
  } else {
    vertexSource = `#version 100
${VERTEX_PRECISION}
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;
    fragmentSource = `#version 100
${FRAGMENT_PRECISION}
${FRAGMENT_DEFINES}
uniform float time;
${HSV2RGB_FUNC}
${getColorFuncSource ?? GET_COLOR_FUNC}

void main() {
  getColor(gl_FragColor);
}`;
  }
  return [vertexSource, fragmentSource,];
}
