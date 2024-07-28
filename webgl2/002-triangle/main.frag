#version 300 es

// Boilerplate code.

#ifdef GL_ES
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif // GL_FRAGMENT_PRECISION_HIGH
#endif // GL_ES

#if __VERSION__ <= 130
#define oFragColor gl_FragColor
#else
out vec4 oFragColor;
#endif // __VERSION__

#if __VERSION__ > 130
#define varying in
#endif // __VERSION__

varying vec3 vVertexColor;

void setColor(const in vec4, out vec4);

void main(void) {
  setColor(gl_FragCoord, oFragColor);
}

// Custom code.

void setColor(const in vec4 fragCoord, out vec4 fragColor) {
  fragColor = vec4(vVertexColor, 1.);
}
