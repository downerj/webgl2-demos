"use strict";

/**
 * 
 */
class CanvasApplication {
  /**
   * 
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    /**
     * @type {?WebGLRenderingContext}
     */
    let gl = canvas.getContext('webgl');

    if (gl === null) {
      throw 'Error getting WebGL context.';
    }

    /**
     * @type {HTMLCanvasElement}
     */
    this._canvas = canvas;

    /**
     * @type {WebGLRenderingContext}
     */
    this._graphics = gl;

    /**
     * @type {AnimationTimer}
     */
    this._timer = new AnimationTimer(
      this._onTick.bind(this),
      CanvasApplication._INTERVAL
    );

    /**
     * @type {InputHandler}
     */
    this._inputHandler = new InputHandler(canvas);

    /**
     * @type {?WebGLProgram}
     */
    this._shaderProgram = null;

    this._initializeGL();
  }

  /**
   * 
   */
  _initializeGL() {
    /**
     * @type {WebGLRenderingContext}
     */
    let gl = this._graphics

    /**
     * @type {WebGLShader}
     */
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    
    gl.shaderSource(vertexShader, vsMain);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      /**
       * @type {string}
       */
      let message = gl.getShaderInfoLog(vertexShader);
      
      throw `Error compiling the vertex shader: ${message}`;
    }

    /**
     * @type {WebGLShader}
     */
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(fragmentShader, fsMain);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      /**
       * @type {string}
       */
      let message = gl.getShaderInfoLog(fragmentShader);
      
      throw `Error compiling the fragment shader: ${message}`;
    }

    /**
     * @type {WebGLProgram}
     */
    let shaderProgram = gl.createProgram();
    
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      /**
       * @type {string}
       */
      let message = gl.getProgramInfoLog(shaderProgram);

      throw `Error linking the shader program: ${message}`;
    }

    this._shaderProgram = shaderProgram;
  }

  /**
   * @returns {boolean} 
   */
  _onTick() {
    this._handleInput();
    this._update();
    this._draw();

    return true;
  }

  /**
   * 
   */
  _handleInput() {
    /**
     * @type {InputHandler}
     */
    let input = this._inputHandler;
  }

  /**
   * 
   */
  _update() {}

  /**
   * 
   */
  _draw() {
    /**
     * @type {WebGLRenderingContext}
     */
    let gl = this._graphics;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  /**
   * 
   */
  run() {
    this._timer.resume();
  }
}
CanvasApplication._INTERVAL = 50;
