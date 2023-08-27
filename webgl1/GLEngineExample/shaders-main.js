const mainVertexSource = `
attribute vec4 aPosition;
attribute vec3 aNormal;
attribute vec2 aTextureCoordinates;

uniform vec3 uAmbientLight;
uniform vec3 uLightColor;
uniform vec3 uLightDirection;
uniform mat4 uNormal;
uniform mat4 uModelViewProjection;
uniform mat4 uProjection;

varying highp vec2 vTextureCoordinates;
varying highp vec3 vLighting;

void main(void) {
  gl_Position = uModelViewProjection * aPosition;
  vTextureCoordinates = aTextureCoordinates;
  highp vec4 transformedNormal = uNormal * vec4(aNormal, 1.0);
  highp float directional = max(dot(transformedNormal.xyz, normalize(uLightDirection)), 0.0);
  vLighting = uAmbientLight + (uLightColor * directional);
}
`;

const mainFragmentSource = `
uniform sampler2D uSampler;

varying highp vec2 vTextureCoordinates;
varying highp vec3 vLighting;

void main(void) {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoordinates);
  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}
`;

