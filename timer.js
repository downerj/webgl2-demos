export class AnimationTimer {
  /**
   * @type {(timestamp: DOMHighResTimeStamp) => boolean | undefined}
   */
  #callback;
  /**
   * @type {number}
   */
  #interval;
  /**
   * @type {number}
   */
  #handle = null;
  /**
   * @type {number}
   */
  #previous = 0;

  /**
   * @param {(timestamp: DOMHighResTimeStamp) => boolean | undefined} callback
   * @param {number} interval
   */
  constructor(callback, interval) {
    this.#callback = callback;
    this.#interval = interval;
  }

  resume() {
    if (this.#handle != null) {
      return;
    }
    this.#update();
  }

  suspend() {
    if (this.#handle == null) {
      return;
    }
    this.#clear();
  }

  #update() {
    this.#handle = window.requestAnimationFrame(this.#tick.bind(this));
  }

  #clear() {
    window.cancelAnimationFrame(this.#handle);
    this.#handle = null;
  }

  /**
   * @param {DOMHighResTimeStamp} timestamp
   */
  #tick(timestamp) {
    if (timestamp - this.#previous >= this.#interval) {
      this.#previous = timestamp;
      if (this.#callback(timestamp) === false) {
        this.#clear();
        return;
      }
    }
    this.#update();
  }
}
