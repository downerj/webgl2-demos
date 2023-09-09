import { Actor } from './actor.js';
import { Camera } from './camera.js';
import { Cube } from './geometry.js';
import { Graphics } from './graphics.js';
import { AnimationTimer } from './timer.js';

const KEY_UP = 0;
const KEY_DOWN = 1;
const KEY_DEBOUNCED = 2;

class WebGL2Example {
  /**
   * @type {HTMLCanvasElement}
   */
  #canvas;
  /**
   * @type {Camera}
   */
  #camera;
  /**
   * @type {Graphics}
   */
  #graphics;
  /**
   * @type {AnimationTimer}
   */
  #timer = new AnimationTimer(this.#tick.bind(this), 10);
  /**
   * @type {Actor[]}
   */
  #cubeActors = [
    new Actor({r: 255}),
    new Actor({x: 3, g: 255}),
    new Actor({y: 3, b: 255}),
    new Actor({x: 3, y: 3, r: 255, g: 255}),
  ];

  /**
   * @type {{
   *   forward: number,
   *   backward: number,
   *   left: number,
   *   right: number,
   *   up: number,
   *   down: number
   * }}
   */
  #keyActions = {
    forward: KEY_UP,
    backward: KEY_UP,
    left: KEY_UP,
    right: KEY_UP,
    up: KEY_UP,
    down: KEY_UP,
  };

  /**
   * @type {{dx: number, dy: number, dz: number}}
   */
  #walkSpeed = {
    dx: 0.1,
    dy: 0.1,
    dz: 0.1,
  };

  /**
   * @type {{pitch: number, yaw: number, roll: number}}
   */
  #lookFactor = {
    pitch: 0.1,
    yaw: 0.1,
    roll: 0.1,
  }
  
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#canvas = canvas;
    this.#camera = new Camera({fov: 45, z: 5,});
    this.#graphics = new Graphics(canvas);
    this.#graphics.useCamera(this.#camera);
  }

  async init() {
    await this.#graphics.init();
    this.#graphics.addActors(this.#cubeActors, Cube); 
  }

  /**
   * @param {DOMHighResTimeStamp} timestamp
   */
  #tick(timestamp) {
    this.#update();
    this.#graphics.render(timestamp);
  }

  #update() {
    if (this.#keyActions.forward === KEY_DOWN) {
      this.#camera.walkForward(this.#walkSpeed.dz);
    } else if (this.#keyActions.backward === KEY_DOWN) {
      this.#camera.walkBackward(this.#walkSpeed.dz);
    }
    if (this.#keyActions.left === KEY_DOWN) {
      this.#camera.walkLeft(this.#walkSpeed.dx);
    } else if (this.#keyActions.right === KEY_DOWN) {
      this.#camera.walkRight(this.#walkSpeed.dx);
    }
    if (this.#keyActions.up === KEY_DOWN) {
      this.#camera.walkUp(this.#walkSpeed.dy);
    } else if (this.#keyActions.down === KEY_DOWN) {
      this.#camera.walkDown(this.#walkSpeed.dy);
    }
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.#graphics.resize(width, height);
  }

  /**
   * @param {string} key
   * @returns {string | null}
   */
  #getActionFromKey(key) {
    if (key === 'w') {
      return 'forward';
    } else if (key === 's') {
      return 'backward';
    } else if (key === 'a') {
      return 'left';
    } else if (key === 'd') {
      return 'right';
    } else if (key === ' ') {
      return 'up';
    } else if (key === 'Shift') {
      return 'down';
    }
    return null;
  }

  /**
   * @param {string} key
   */
  pressKey(key) {
    const action = this.#getActionFromKey(key);
    if (action != null && this.#keyActions[action] !== KEY_DEBOUNCED) {
      this.#keyActions[action] = KEY_DOWN;
    }
  }

  /**
   * @param {string} key
   */
  debounceKey(key) {
    const action = this.#getActionFromKey(key);
    if (action != null) {
      this.#keyActions[action] = KEY_DEBOUNCED;
    }
  }

  /**
   * @param {string} key
   */
  releaseKey(key) {
    const action = this.#getActionFromKey(key);
    if (action != null) {
      this.#keyActions[action] = KEY_UP;
    }
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  moveMouse(dx, dy) {
    if (document.pointerLockElement !== this.#canvas) {
      return;
    }
    this.#camera.yawRight(dx * this.#lookFactor.yaw);
    this.#camera.pitchUp(dy * this.#lookFactor.pitch);
  }

  run() {
    this.#timer.resume();
  }

  pause() {
    this.#timer.suspend();
  }
}

function resizeCanvas(canvas) {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}

window.addEventListener('load', async () => {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById('cvs');
  const example = new WebGL2Example(canvas);
  window.addEventListener('resize', () => {
    resizeCanvas(canvas);
    example.resize(canvas.width, canvas.height);
  });
  canvas.addEventListener('click', () => {
    if (document.pointerLockElement !== canvas) {
      canvas.requestPointerLock();
    }
  });
  window.addEventListener('keydown', (event) => {
    example.pressKey(event.key);
  });
  window.addEventListener('keyup', (event) => {
    example.releaseKey(event.key);
  });
  window.addEventListener('mousemove', (event) => {
    example.moveMouse(event.movementX, event.movementY);
  });
  resizeCanvas(canvas);
  example.resize(canvas.width, canvas.height);
  await example.init();
  window.addEventListener('focus', () => {
    console.log('Window in focus');
    example.run();
  });
  window.addEventListener('blur', () => {
    console.log('Window out of focus');
    example.pause();
  });
  example.run();
});
