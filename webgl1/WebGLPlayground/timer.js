class IntervalTimer {
  #callback;
  #interval;
  #handle;
  #previous;
  
  constructor(callback, interval) {
    this.#callback = callback;
    this.#interval = interval;
    this.#handle = null;
    this.#previous = 0;
  }
  
  #tick(timestamp) {
    const elapsed = timestamp - this.#previous;
    if (elapsed >= this.#interval) {
      this.#previous = timestamp;
      const status = this.#callback(timestamp);
      if (!status) {
        this.#cancel();
        return;
      }
    }
    this.#update();
  }

  #update() {
    this.#handle = window.requestAnimationFrame(this.#tick.bind(this));
  }
  
  #cancel() {
    window.cancelAnimationFrame(this.#handle);
    this.#handle === null;
  }
  
  resume() {
    if (this.#handle !== null) {
      return;
    }
    
    this.#update();
  }
  
  suspend() {
    if (this.#handle === null) {
      return;
    }
    
    this.#cancel();
  }
}
