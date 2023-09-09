#version 300 es

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 color;

in vec3 vertexColor;

vec4 hsv2rgba(in vec3 hsv) {
  float h = hsv.x;
  float s = hsv.y;
  float v = hsv.z;
  vec3 k = vec3(1.0, 2.0/3.0, 1.0/3.0);
  vec3 p = clamp(abs(6.0*fract(h - k) - 3.0) - 1.0, 0.0, 1.0);
  return vec4(v * mix(k.xxx, p, s), 1.0);
}

out vec4 fragColor;

void main() {
  // fragColor = vec4(color, 1.0);
  fragColor = vec4(vertexColor, 1.0);
}
