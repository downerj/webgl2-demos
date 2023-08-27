class IntervalTimer {
  constructor(callback, interval) {
    let previous = 0;
    this._handle = null;
    // Using a lambda expression obviates the need for `.bind(this)`.
    this._onTick = (timestamp) => {
      const elapsed = timestamp - previous;
      if (elapsed >= interval) {
        const status = callback(timestamp);
        if (status === false) {
          this._cancel();
          return;
        }
        previous = timestamp;
      }
      this._update();
    };
  }

  _update() {
    this._handle = window.requestAnimationFrame(this._onTick);
  }
  
  _cancel() {
    window.cancelAnimationFrame(this._handle);
    this._handle === null;
  }
  
  resume() {
    if (this._handle !== null) {
      return;
    }
    
    this._update();
  }
  
  suspend() {
    if (this._handle === null) {
      return;
    }
    
    this._cancel();
  }
}
