// Add the following if sourcing from the minified JS file from the
// glMatrix GitHub repository. If sourcing from the CDN, then this
// line is not needed.
//const mat4 = glMatrix.mat4;

class App {
  constructor(canvas) {
    this._canvas = canvas;
    let gl = canvas.getContext('webgl');
    if (!gl) {
      throw 'GL error: Unable to get WebGL context.';
    }
    this._gl = gl;
    
    let vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vsSource);
    gl.compileShader(vShader);
    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
      let message = `VShader error: ${gl.getShaderInfoLog(vShader)}`;
      gl.deleteShader(vShader);
      throw message;
    }
    
    let fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fsSource);
    gl.compileShader(fShader);
    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
      let message = `FShader error: ${gl.getShaderInfoLog(fShader)}`;
      gl.deleteShader(fShader);
      throw message;
    }
    
    let program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.deleteShader(vShader);
    gl.deleteShader(fShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw `Program error: ${gl.getProgramInfoLog(program)}`;
    }
    this._programs = {
      main: program,
    };
    
    this._locations = {
      aPosition: gl.getAttribLocation(program, 'aPosition'),
      uMouse: gl.getUniformLocation(program, 'uMouse'),
      uOffset: gl.getUniformLocation(program, 'uOffset'),
      uZoom: gl.getUniformLocation(program, 'uZoom'),
      uTime: gl.getUniformLocation(program, 'uTime'),
      uResolution: gl.getUniformLocation(program, 'uResolution'),
      uModelView: gl.getUniformLocation(program, 'uModelView'),
      uProjection: gl.getUniformLocation(program, 'uProjection'),
    };
    
    this.resize();
    let w = 20;
    let h = 20;
    let positionVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionVBO);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -w, +h,
        +w, +h,
        -w, -h,
        +w, -h,
      ]),
      gl.STATIC_DRAW
    );
    this._buffers = {
      position: positionVBO,
    };
    
    this._mouse = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      pressed: false,
    };
    this._offset = {
      dx: 0,
      dy: 0,
    };
    this._zoom = {
      level: 0,
      maxLevel: 3,
      minLevel: -3,
      actual: 1,
    };
    
    this._loop = new Loop(this._draw.bind(this));
  }
  
  _draw(elapsed) {
    let gl = this._gl;
    let canvas = this._canvas;
    let programs = this._programs;
    let locations = this._locations;
    let buffers = this._buffers;
    let mouse = this._mouse;
    let offset = this._offset;
    let zoom = this._zoom;
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    const projectionMatrix = mat4.create();
    mat4.perspective(
      projectionMatrix,
      45 * Math.PI / 180,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    const modelViewMatrix = mat4.create();
    mat4.translate(
      modelViewMatrix,
      modelViewMatrix,
      [0.0, 0.0, -1.0]
    );
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      locations.aPosition,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(locations.aPosition);
    gl.useProgram(programs.main);
    
    gl.uniform2f(locations.uMouse, mouse.x, canvas.clientHeight - mouse.y);
    gl.uniform2f(locations.uOffset, -offset.dx, offset.dy);
    gl.uniform1f(locations.uZoom, zoom.actual);
    gl.uniform1f(locations.uTime, elapsed);
    gl.uniform2f(locations.uResolution, canvas.clientWidth, canvas.clientHeight);
    gl.uniformMatrix4fv(locations.uProjection, false, projectionMatrix);
    gl.uniformMatrix4fv(locations.uModelView, false, modelViewMatrix);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    return true;
  }
  
  resize() {
    let canvas = this._canvas;
    let gl = this._gl;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    gl.viewport(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  }
  
  mouseMove(x, y, dx, dy) {
    let mouse = this._mouse;
    let offset = this._offset;
    let zoom = this._zoom;
    mouse.x = x;
    mouse.y = y;
    mouse.dx = dx;
    mouse.dy = dy;
    if (mouse.pressed) {
      offset.dx += mouse.dx * zoom.actual;
      offset.dy += mouse.dy * zoom.actual;
    }
  }
  
  pressMouse() {
    this._mouse.pressed = true;
  }
  
  releaseMouse() {
    this._mouse.pressed = false;
  }
  
  zoom(amount) {
    let zoom = this._zoom;
    zoom.level += amount;
    if (zoom.level < zoom.minLevel) {
      zoom.level = zoom.minLevel;
    } else if (zoom.level > zoom.maxLevel) {
      zoom.level = zoom.maxLevel;
    }
    zoom.actual = 2**zoom.level;
  }
  
  start() {
    this._loop.resume();
  }
}

let app;
window.addEventListener('load', (_) => {
  let canvas = document.getElementById('cvs');
  app = new App(canvas);
  
  canvas.addEventListener('mousemove', (event) => {
    app.mouseMove(
      event.clientX,
      event.clientY,
      event.movementX,
      event.movementY
    );
  });
  
  canvas.addEventListener('mousedown', (event) => {
    canvas.classList.remove('grab');
    canvas.classList.add('grabbing');
    app.pressMouse();
  });
  
  canvas.addEventListener('mouseup', (event) => {
    canvas.classList.remove('grabbing');
    canvas.classList.add('grab');
    app.releaseMouse();
  });
  
  canvas.addEventListener('mouseout', (_) => {
    canvas.classList.remove('grabbing');
    canvas.classList.add('grab');
    app.releaseMouse();
  });
  
  canvas.addEventListener('wheel', (event) => {
    app.zoom(event.deltaY * -0.003);
  });
  
  app.start();
});

window.addEventListener('resize', (_) => {
  app.resize();
});
