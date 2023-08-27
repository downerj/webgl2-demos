class GLEngine2DComplex {
  static getGLFromCanvas(canvas, options = {}) {
    let gl = null;
    for (const type of ['webgl', 'webgl-experimental']) {
      gl = canvas.getContext(type, options);
      if (gl !== null) {
        return gl;
      }
    }
    throw 'Unable to get WebGL context';
  }

  constructor(gl, appState) {
    this._gl = gl;
    this._program = this._initializeProgram(mainVertexSource, mainFragmentSource);

    this._locations = {
      attributes: this._getAttributeLocations(
        this._program,
        'aPosition',
      ),
      uniforms: this._getUniformLocations(
        this._program,
        'uTime',
        'uMouse',
        'uResolution',
        'uOffset',
        'uZoom',
      ),
    };
    
    // These are for the display rectangle.
    // It's a simple flat rectangle with no depth and no Z-position, so we'll use just
    // 2 values (x, y) per vertex.
    this._vertices = [
      -1.0, -1.0, // Bottom-left
      +1.0, -1.0, // Bottom-right
      +1.0, +1.0, // Top-right
      -1.0, +1.0, // Top-left
    ];
    this._indices = [
      0, 1, 2, // Bottom-right triangle
      0, 2, 3, // Top-left triangle
    ];
    this._buffers = {
      vertex: this._initializeBuffer(
        gl.ARRAY_BUFFER,
        new Float32Array(this._vertices),
        gl.STATIC_DRAW
      ),
      index: this._initializeBuffer(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(this._indices),
        gl.STATIC_DRAW
      ),
    };
  }

  resize(width, height) {
    this._gl.viewport(0, 0, width, height);
  }

  render(appState) {
    const gl = this._gl;
    const program = this._program;
    const locations = this._locations;
    const vertices = this._vertices;
    const indices = this._indices;
    const buffers = this._buffers;

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Opaque black
    gl.clearDepth(1.0); // (1.0 is default)
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
    gl.vertexAttribPointer(
      locations.attributes.aPosition,
      2, // Number of components (2 = vec2)
      gl.FLOAT, // Type
      false, // Normalized? (N/A for gl.FLOAT)
      0, // Stride (0 = assumed to be tightly packed)
      0 // Offset (0 = start at first vertex)
    );
    gl.enableVertexAttribArray(locations.attributes.aPosition);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);

    gl.useProgram(program);
    
    gl.uniform1f(
      locations.uniforms.uTime,
      appState.timestamp
    );
    gl.uniform2f(
      locations.uniforms.uMouse,
      appState.mouseX,
      appState.mouseY
    );
    gl.uniform2f(
      locations.uniforms.uResolution,
      appState.width,
      appState.height
    );
    gl.uniform2f(
      locations.uniforms.uOffset,
      appState.offsetDX,
      appState.offsetDY
    );
    gl.uniform1f(
      locations.uniforms.uZoom,
      appState.zoom
    );

    gl.drawElements(
      gl.TRIANGLES,
      this._indices.length,
      gl.UNSIGNED_SHORT, // Type
      0 // Offset (0 = start at first element)
    );
  }

  _initializeProgram(vertexSource, fragmentSource) {
    const gl = this._gl;
    const vertexShader = this._initializeShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this._initializeShader(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`GL link error: ${gl.getProgramInfoLog(program)}`);
      console.error(`Vertex shader log: ${gl.getShaderInfoLog(vertexShader)}`);
      console.error(`Fragment shader log: ${gl.getShaderInfoLog(fragmentShader)}`);
      program = null;
    }
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;   
  }

  _initializeShader(type, source) {
    const gl = this._gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  _getAttributeLocations(program, ...attributeNames) {
    const gl = this._gl;
    return Object.fromEntries(attributeNames.map(attribute => [
      attribute,
      gl.getAttribLocation(program, attribute),
    ]));
  }

  _getUniformLocations(program, ...uniformNames) {
    const gl = this._gl;
    return Object.fromEntries(uniformNames.map(uniform => [
      uniform,
      gl.getUniformLocation(program, uniform),
    ]));
  }

  _initializeBuffer(target, data, usage) {
    const gl = this._gl;
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, usage);
    return buffer;
  }
}
