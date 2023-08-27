class Application {
  constructor(canvas) {
    this._state = new ApplicationState();
    const gl = GLEngine2DComplex.getGLFromCanvas(canvas);
    this._gle = new GLEngine2DComplex(gl);
    this.onResize(canvas.width, canvas.height);
    const interval = 10;
    this._timer = new IntervalTimer((timestamp) => {
      this._update(timestamp);
      this._draw();
    }, interval);
  }
  
  onResize(width, height) {
    this._state.width = width;
    this._state.height = height;
    this._gle.resize(width, height);
  }
  
  _update(timestamp) {
    this._state.timestamp = timestamp;
  }
  
  _draw() {
    this._gle.render(this._state);
  }
  
  run() {
    this._timer.resume();
  }
}
