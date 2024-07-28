export class GraphicsEngine3D {
  /**
   * @type {WebGL2RenderingContext}
   */
  #gl;
  #bgColor = [0, .5, 1];
  #isInitialized = false;
  /**
   * @type {WebGLProgram}
   */
  #programMain;

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#gl = canvas.getContext('webgl2');
    if (!this.#gl) {
      throw 'Unable to get WebGL2 context';
    }
  }

  /**
   *
   */
  async initialize() {
    const resV = await fetch('./main.vert');
    if (!resV.ok) {
      throw 'Failed to fetch main vertex shader.';
    }
    const resF = await fetch('./main.frag');
    if (!resF.ok) {
      throw 'Failed to fetch main fragment shader.';
    }
    const srcV = (await resV.text()).trim();
    const srcF = (await resF.text()).trim();
    const program = this.#createProgram(srcV, srcF);
    if (!program) {
      throw 'Failed to create program';
    }
    this.#programMain = program;
    this.#isInitialized = true;
  }

  /**
   * @param {string} vertexSource
   * @param {string} fragmentSource
   * @returns {WebGLProgram}
   */
  #createProgram(vertexSource, fragmentSource) {
    const gl = this.#gl;
    const shaderV = this.#createShader(vertexSource, gl.VERTEX_SHADER);
    const shaderF = this.#createShader(fragmentSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, shaderV);
    gl.attachShader(program, shaderF);
    gl.linkProgram(program);
    const status = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!status) {
      const logP = gl.getProgramInfoLog(program);
      const logV = gl.getShaderInfoLog(shaderV);
      const logF = gl.getShaderInfoLog(shaderF);
      console.error('Error linking program:', logP);
      if (logV) {
        console.error('Vertex shader log:', logV);
      }
      if (logF) {
        console.error('Fragment shader log:', logF);
      }
    }
    gl.detachShader(program, shaderV);
    gl.detachShader(program, shaderF);
    gl.deleteShader(shaderV);
    gl.deleteShader(shaderF);
    return status ? program : null;
  }

  /**
   * @param {string} source
   * @param {GLenum} type
   */
  #createShader(source, type) {
    const gl = this.#gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  /**
   * @returns {boolean}
   */
  get isInitialized() {
    return this.#isInitialized;
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  resizeToFit() {
    const gl = this.#gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }

  /**
   * @param {DOMHighResTimeStamp} timestamp
   */
  update(timestamp) {
    
  }

  /**
   *
   */
  render() {
    const gl = this.#gl;
    {
      const [r, g, b] = this.#bgColor;
      gl.clearColor(r, g, b, 1);
    }
    gl.enable(gl.DEPTH_TEST);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const program = this.#programMain;
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
