const vsSource = `
#version 100
precision mediump float;

attribute vec4 aPosition;

uniform mat4 uModelView;
uniform mat4 uProjection;

void main(void) {
  gl_Position = uProjection * uModelView * aPosition;
}
`;

