export class AnimationLoop {
  /**
   * @type {(timestamp: DOMHighResTimeStamp) => void}
   */
  #callback;
  /**
   * @type {number}
   */
  #interval;
  #previous = 0;
  /**
   * @type {number?}
   */
  #handle;

  /**
   * @param {(timestamp: DOMHighResTimeStamp) => void} callback
   * @param {number} interval
   */
  constructor(callback, interval) {
    if (typeof callback !== 'function') {
      throw 'Callback argument must be a function';
    }
    if (typeof interval !== 'number') {
      throw 'Interval argument must be a number';
    }
    this.#callback = callback;
    this.#interval = interval;
  }

  /**
   *
   */
  resume() {
    if (this.#handle != null) {
      return;
    }
    this.#update();
  }

  /**
   *
   */
  suspend() {
    if (this.#handle == null) {
      return;
    }
    this.#clear();
  }

  /**
   *
   */
  #update() {
    this.#handle = requestAnimationFrame(this.#onTick.bind(this));
  }

  /**
   *
   */
  #clear() {
    cancelAnimationFrame(this.#handle);
    this.#handle = null;
  }

  /**
   * @param {DOMHighResTimeStamp} timestamp
   */
  #onTick(timestamp) {
    if (timestamp - this.#previous >= this.#interval) {
      this.#previous = timestamp;
      this.#callback();
    }
    this.#update();
  }
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
