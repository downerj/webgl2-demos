"use strict";

/**
 * 
 */
class AnimationTimer {
  /**
   * 
   * @param {() => boolean} callback 
   * @param {number} interval 
   */
  constructor(callback, interval) {
    /**
     * @type {() => boolean}
     */
    this._callback = callback;

    /**
     * @type {number}
     */
    this._interval = interval;

    /**
     * @type {number}
     */
    this._previous = 0;

    /**
     * @type {?number}
     */
    this._handle = null;

    /**
     * @type {(timestamp: number) => void}
     */
    this._tickCallback = this.onTick.bind(this);
  }

  /**
   * 
   * @param {number} timestamp 
   */
  onTick(timestamp) {
    /**
     * @type {number}
     */
    let elapsed = timestamp - this._previous;

    if (elapsed >= this._interval) {
      this._previous = timestamp;

      /**
       * @type {boolean}
       */
      let status = this._callback();

      if (!status) {
        this.pause();
        return;
      }
    }
    this.fireNextFrame();
  }

  /**
   * 
   */
  fireNextFrame() {
    this._handle = window.requestAnimationFrame(this._tickCallback);
  }

  /**
   * 
   */
  resume() {
    if (this._handle !== null) {
      return;
    }
    this.fireNextFrame();
  }
  
  /**
   * 
   */
  pause() {
    if (this._handle === null) {
      return;
    }
    window.cancelAnimationFrame(this._handle);
    this._handle = null;
  }
}
