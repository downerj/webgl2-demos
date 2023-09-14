import { Actor } from "./actor.js";
import { Camera } from "./camera.js";
import { Cube, Geometry } from "./geometry.js";
const { mat4 } = glMatrix;

class ObjectData {
  /**
   * @type {Geometry}
   */
  geometry;
  /**
   * @type {WebGLVertexArrayObject}
   */
  vao;
  /**
   * @type {WebGLBuffer}
   */
  vbo;
  /**
   * @type {WebGLBuffer}
   */
  ibo;
}

class ProgramData {
  /**
   * @type {WebGL2RenderingContext}
   */
  #gl;
  /**
   * @type {WebGLProgram}
   */
  #program;
  /**
   * @type {{[name: string]: number}}
   */
  #uniforms = {};
  /**
   * @type {{[name: string]: number}}
   */
  #attributes = {};

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string[]} vertexSources
   * @param {string[]} fragmentSources
   */
  constructor(gl, vertexSources, fragmentSources) {
    this.#gl = gl;
    this.#program = this.createProgram(vertexSources, fragmentSources);
    gl.useProgram(this.#program);
  }

  initUniforms(...names) {
    const gl = this.#gl;
    for (const name of names) {
      this.#uniforms[name] = gl.getUniformLocation(this.#program, name);
    }
  }

  initAttributes(...names) {
    const gl = this.#gl;
    for (const name of names) {
      this.#attributes[name] = gl.getAttribLocation(this.#program, name);
    }
  }

  /**
   * @returns {{[name: string]: number}}
   */
  get uniforms() {
    return this.#uniforms;
  }

  /**
   * @returns {{[name: string]: number}}
   */
  get attributes() {
    return this.#attributes;
  }

  /**
   * @returns {WebGLProgram}
   */
  get program() {
    return this.#program;
  }

  /**
   * @param {string[]} sources
   * @param {number} type (WebGL2RenderingContext).VERTEX_SHADER|FRAGMENT_SHADER
   */
  createShader(sources, type) {
    const gl = this.#gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sources.join('\n'));
    gl.compileShader(shader);
    return shader;
  }

  /**
   * @param {string[]} vertexSources
   * @param {string[]} fragmentSources
   */
  createProgram(vertexSources, fragmentSources) {
    const gl = this.#gl;
    const vertexShader = this.createShader(vertexSources, gl.VERTEX_SHADER);
    const fragmentShader = this.createShader(fragmentSources, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linkStatus) {
      const programLog = gl.getProgramInfoLog(program);
      const vertexLog = gl.getShaderInfoLog(vertexShader);
      const fragmentLog = gl.getShaderInfoLog(fragmentShader);
      console.error('Error linking program: ', programLog);
      if (vertexLog.length > 0) {
        console.error('Vertex shader log: ', vertexLog);
      }
      if (fragmentLog.length > 0 && vertexLog !== fragmentLog) {
        console.error('Fragment shader log: ', fragmentLog);
      }
    }
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!linkStatus) {
      throw 'Failed to link program';
    }
    return program;
  }
}

export class Graphics {
  /**
   * @type {WebGL2RenderingContext}
   */
  #gl;

  /**
   * @type {{[name: string]: ProgramData}}
   */
  #programs = {
    main: null,
  };

  /**
   * @type {{actor: Actor, data: ObjectData}[]}
   */
  #actors = [];

  /**
   * @type {{
   *   [className: string]: ObjectData
   * }}
   */
  #objectMap = {};

  /**
   * @type {{
   *   view: Float32Array,
   *   projection: Float32Array,
   *   model: Float32Array,
   * }}
   */
  #matrices = {
    projection: mat4.create(),
    view: mat4.create(),
    model: mat4.create(),
  };

  /**
   * @type {Camera}
   */
  #camera = null;

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    const gl = canvas.getContext('webgl2');
    if (gl == null) {
      throw 'Unable to get WebGL2 context';
    }
    this.#gl = gl;
  }

  /**
   * @returns {WebGL2RenderingContext}
   */
  get gl() {
    return this.#gl;
  }

  async init() {
    const gl = this.#gl;
    const vertexSource = await (await fetch('./main.vert', {cache: 'no-store'})).text();
    const fragmentSource = await (await fetch('./main.frag', {cache: 'no-store'})).text();
    this.#programs.main = new ProgramData(gl, [vertexSource], [fragmentSource]);
    this.#programs.main.initUniforms('model', 'view', 'projection', 'color');
    this.#programs.main.initAttributes('vertex');
    this.#initObjects();
  }

  #initObjects() {
    const gl = this.#gl;
    const classTypes = [Cube];
    for (const type of classTypes) {
      const gl = this.#gl;
      const {attributes} = this.#programs.main;

      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      
      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, type.vertices, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(attributes.vertex);
      gl.vertexAttribPointer(attributes.vertex, 3, gl.FLOAT, false, 0, 0);

      const ibo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, type.indices, gl.STATIC_DRAW);

      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      const data = new ObjectData();
      data.geometry = type;
      data.vao = vao;
      data.vbo = vbo;
      data.ibo = ibo;
      this.#objectMap[type.name] = data;
    }
  }

  /**
   * @param {Actor[]} actors
   * @param {Geometry} geometry
   */
  addActors(actors, geometry) {
    const data = this.#objectMap[geometry.name];
    for (const actor of actors) {
      this.#actors.push({actor, data});
    }
  }

  /**
   * @param {Camera} camera
   */
  useCamera(camera) {
    this.#camera = camera;
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    const gl = this.#gl;
    gl.viewport(0, 0, width, height);
  }

  /**
   * @param {DOMHighResTimeStamp} _timestamp
   */
  render(_timestamp) {
    const gl = this.#gl;
    gl.clearColor(0, .5, 1, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const {program, uniforms} = this.#programs.main;
    gl.useProgram(program);

    if (this.#camera != null) {
      const {projectionMatrix, viewMatrix} = this.#camera;
      gl.uniformMatrix4fv(uniforms.projection, false, projectionMatrix);
      gl.uniformMatrix4fv(uniforms.view, false, viewMatrix);
    }

    const {model} = this.#matrices;
    for (const {actor, data} of this.#actors) {
      const {position, ax, ay, az, color} = actor;
      const {vao, ibo, geometry} = data;
      const {indices} = geometry;
      gl.bindVertexArray(vao);
      mat4.identity(model);
      mat4.translate(model, model, position);
      mat4.rotateX(model, model, ax);
      mat4.rotateY(model, model, ay);
      mat4.rotateZ(model, model, az);
      gl.uniformMatrix4fv(uniforms.model, false, model);
      gl.uniform3fv(uniforms.color, color);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
}
