class Loop {
  constructor(callback) {
    this._callback = callback;
    this._startTime = 0;
    this._handle = null;
  }
  
  _iterate(timestamp) {
    if (this._startTime === 0) {
      this._startTime = timestamp;
    }
    
    let elapsed = timestamp - this._startTime;
    let status = this._callback(elapsed);
    if (status === false) {
      this._cancel();
      return;
    }
    this._update();
  }
  
  _update() {
    this._handle = window.requestAnimationFrame(this._iterate.bind(this));
  }
  
  _cancel() {
    window.cancelAnimationFrame(this._handle);
    this._handle === null;
    this._startTime = 0;
  }
  
  resume() {
    if (this._handle !== null) {
      return;
    }
    
    this._update();
  }
  
  pause() {
    if (this._handle === null) {
      return;
    }
    
    this._cancel();
  }
}
