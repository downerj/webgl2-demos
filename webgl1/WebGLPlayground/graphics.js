class Graphics {
  static #VERTICES = [
    // Bottom left
    -1, -1,
    // Top left
    -1, 1,
    // Bottom right
    1, -1,
    // Top right
    1, 1,
  ];
  static #INDICES = [
    // Left triangle
    0, 3, 1,
    // Right triangle
    0, 2, 3,
  ];
  #gl;
  #program;
  #locations = {
    attribute: {
      position: null,
    },
    uniform: {
      time: null,
    },
  };
  #buffers = {
    vertex: null,
    index: null,
  };
  
  static getGLContext(canvas, {antialias = true} = {}) {
    for (const api of ['webgl2', 'webgl']) {
      const gl = canvas.getContext(api);
      if (gl) {
        return gl;
      }
    }
    throw 'Unable to get WebGL context from canvas';
  }
  
  constructor(gl) {
    this.#gl = gl;
    if (gl instanceof WebGL2RenderingContext) {
      console.log('Using WebGL 2');
    } else {
      console.log('Using WebGL');
    }
    const [vertexSource, fragmentSource] = makeShaderSources(gl);
    this.#program = this.#createProgram(vertexSource, fragmentSource);
    if (!this.#program) {
      return;
    }
    for (const name in this.#locations.attribute) {
      this.#locations.attribute[name] = gl.getAttribLocation(this.#program, name);
    }
    for (const name in this.#locations.uniform) {
      this.#locations.uniform[name] = gl.getUniformLocation(this.#program, name);
    }
    
    this.#buffers.vertex = this.#createBuffer(
      gl.ARRAY_BUFFER,
      new Float32Array(Graphics.#VERTICES),
      gl.STATIC_DRAW
    );
    this.#buffers.index = this.#createBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint8Array(Graphics.#INDICES),
      gl.STATIC_DRAW
    );
  }
  
  resize(width, height) {
    this.#gl.viewport(0, 0, width, height);
  }
  
  #createShader(type, source) {
    const gl = this.#gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }
  
  #createProgram(vSource, fSource) {
    const gl = this.#gl;
    const vShader = this.#createShader(gl.VERTEX_SHADER, vSource);
    const fShader = this.#createShader(gl.FRAGMENT_SHADER, fSource);
    let program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
      console.error(`Vertex shader log: ${gl.getShaderInfoLog(vShader)}`);
      console.error(`Fragment shader log: ${gl.getShaderInfoLog(fShader)}`);
      program = null;
    }
    gl.detachShader(program, vShader);
    gl.detachShader(program, fShader);
    gl.deleteShader(vShader);
    gl.deleteShader(fShader);
    return program;
  }
  
  #createBuffer(target, data, usage) {
    const gl = this.#gl;
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, usage);
    gl.bindBuffer(target, null);
    return buffer;
  }
  
  render(timestamp) {
    const gl = this.#gl;
    const program = this.#program;
    const locations = this.#locations;
    const buffers = this.#buffers;
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
    gl.vertexAttribPointer(
      locations.attribute.position, // index
      2, // size
      gl.FLOAT, // type (because we used Float32Array)
      false, // normalized
      0, // stride
      0, // offset
    );
    gl.enableVertexAttribArray(locations.attribute.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
    
    gl.useProgram(program);
    
    gl.uniform1f(locations.uniform.time, timestamp);
    
    gl.drawElements(
      gl.TRIANGLES, // mode
      Graphics.#INDICES.length, // count
      gl.UNSIGNED_BYTE, // type (because we used Uint8Array)
      0 // offset
    );
  }
}
