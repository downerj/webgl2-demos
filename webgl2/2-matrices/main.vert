#version 300 es

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

in vec4 vertex;
out vec3 vertexColor;

void main(void) {
  gl_Position = projection * view * model * vertex;
  vertexColor = vertex.xyz;
}
