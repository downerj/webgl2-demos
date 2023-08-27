"use strict";

/**
 * 
 */
class MouseMap {
  /**
   * 
   */
  constructor() {
    this.buttons = 0;
    this.x = 0;
    this.y = 0;
  }
}

/**
 * 
 */
class InputHandler {
  /**
   * 
   * @param {HTMLElement} element 
   */
  constructor(element) {
    /**
     * @type {{ [key: string]: boolean }}
     */
    this.keys = {};

    /**
     * @type {MouseMap}
     */
    this.mouse = new MouseMap();

    element.addEventListener('keydown', this.onKeyDown.bind(this));
    element.addEventListener('keyup', this.onKeyUp.bind(this));
    element.addEventListener('mousedown', this.onMouseDown.bind(this));
    element.addEventListener('mouseup', this.onMouseUp.bind(this));
    element.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  /**
   * 
   * @param {KeyboardEvent} event 
   */
  onKeyDown(event) {
    /**
     * @type {string}
     */
    let key = event.key;

    if (!(key in this.keys)) {
      this.keys[key] = true;
    }
  }

  /**
   * 
   * @param {KeyboardEvent} event 
   */
  onKeyUp(event) {
    /**
     * @type {string}
     */
    let key = event.key;

    if (key in this.keys) {
      delete this.keys[key];
    }
  }

  /**
   * 
   * @param {MouseEvent} event 
   */
  onMouseDown(event) {
    this.mouse.buttons |= event.buttons;
    this.mouse.x = event.x;
    this.mouse.y = event.y;
  }

  /**
   * 
   * @param {MouseEvent} event 
   */
  onMouseUp(event) {
    this.mouse.buttons ^= event.buttons;
    this.mouse.x = event.x;
    this.mouse.y = event.y;
  }

  /**
   * 
   * @param {MouseEvent} event 
   */
  onMouseMove(event) {
    this.mouse.x = event.x;
    this.mouse.y = event.y;
  }

  /**
   * 
   * @param {MouseEvent} key 
   */
  debounceKey(key) {
    if (key in this.keys) {
      this.keys[key] = false;
    }
  }

  /**
   * 
   * @param {string} key 
   * @returns {boolean} 
   */
  isKeyDown(key) {
    return (key in this.keys) && (this.keys[key]);
  }

  /**
   * 
   * @param  {...string} keys 
   * @returns {boolean} 
   */
  areKeysDown(...keys) {
    for (let key of keys) {
      if (!this.keys[key]) {
        return false;
      }
    }
    return true;
  }

  /**
   * 
   * @param {number} buttonMask 
   * @returns {boolean} 
   */
  areMouseButtonDown(buttonMask) {
    return (buttonMask & this.mouse.buttons) !== 0;
  }

  /**
   * @type {number}
   */
  get mouseX() {
    return this.mouse.x;
  }

  /**
   * @type {number}
   */
  get mouseY() {
    return this.mouse.y;
  }
}
