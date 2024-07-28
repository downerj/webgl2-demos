#version 300 es

#if __VERSION__ > 130
#define attribute in
#define varying out
#endif // __VERSION__

const vec3 points[3] = vec3[3](
  vec3(0., 1., 0.),
  vec3(-1., -1., 0.),
  vec3(1., -1., 0.)
);

const vec3 colors[3] = vec3[3](
  vec3(1., 0., 0.),
  vec3(0., 1., 0.),
  vec3(0., 0., 1.)
);

varying vec3 vVertexColor;

void main(void) {
  gl_Position = vec4(points[gl_VertexID], 1.);
  vVertexColor = colors[gl_VertexID];
}
