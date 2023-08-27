import { Geometry } from "./geometry.js";

/**
 * @typedef {(number | boolean | Float32Array | Float64Array | Uint16Array | Uint32Array)} UniformValue
 * @typedef {(number | boolean | Float32Array | Float64Array | Uint16Array | Uint32Array)} AttributeValue
 */

// class UniformData {
//   /**
//    * @type {number}
//    */
//   location;
//   /**
//    * @type {UniformValue}
//    */
//   value;
// }

// class AttributeData {
//   /**
//    * @type {number}
//    */
//   location;
//   /**
//    * @type {AttributeValue}
//    */
//   value;
// }

class ObjectData {
  /**
   * @type {Geometry}
   */
  geometry;
  /**
   * @type {WebGLVertexArrayObject}
   */
  vao;
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
   * @type {ObjectData[]}
   */
  #objects = [];

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
    this.#programs.main.initUniforms('time', 'resolution');
    this.#programs.main.initAttributes('position');
  }

  /**
   * @param {Geometry} geometry
   */
  addObject(geometry) {
    const gl = this.#gl;
    const programData = this.#programs.main;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);
    const {attributes} = programData;
    gl.enableVertexAttribArray(attributes.position);
    gl.vertexAttribPointer(attributes.position, 3, gl.FLOAT, false, 0, 0);
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    const objectData = new ObjectData();
    objectData.geometry = geometry;
    objectData.vao = vao;
    this.#objects.push(objectData)
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
   * @param {DOMHighResTimeStamp} timestamp
   */
  render(timestamp) {
    const gl = this.#gl;
    gl.clearColor(0, 0.5, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const {program, uniforms, attributes} = this.#programs.main;
    gl.useProgram(program);
    gl.uniform1f(uniforms.time, timestamp);
    gl.uniform2f(uniforms.resolution, gl.canvas.width, gl.canvas.height);
    for (const {vao, geometry} of this.#objects) {
      gl.bindVertexArray(vao);
      gl.drawElements(gl.TRIANGLES, geometry.indices.length, gl.UNSIGNED_SHORT, 0);
    }
    gl.bindVertexArray(null);
  }
}
