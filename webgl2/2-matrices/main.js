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
    new Actor({x: -1.5, y: -1.5, z: -1.5}),
    new Actor({x: 1.5, y: -1.5, z: -1.5}),
    new Actor({x: -1.5, y: 1.5, z: -1.5}),
    new Actor({x: 1.5, y: 1.5, z: -1.5}),
    new Actor({x: -1.5, y: -1.5, z: 1.5}),
    new Actor({x: 1.5, y: -1.5, z: 1.5}),
    new Actor({x: -1.5, y: 1.5, z: 1.5}),
    new Actor({x: 1.5, y: 1.5, z: 1.5}),
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
    rollLeft: KEY_UP,
    rollRight: KEY_UP,
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
    pitch: 0.05,
    yaw: 0.05,
    roll: 1,
  };

  /**
   * @type {(timestamp: DOMHighResTimeStamp) => void}
   */
  #callback;
  
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#canvas = canvas;
    this.#camera = new Camera({fovy: 45, x: 5, y: 5, z: 5, pitch: 35, yaw: 315});
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
    this.#update(timestamp);
    this.#graphics.render(timestamp);
  }

  #update(timestamp) {
    if (this.#keyActions.forward === KEY_DOWN) {
      this.#camera.flyZRelative(-this.#walkSpeed.dz);
    } else if (this.#keyActions.backward === KEY_DOWN) {
      this.#camera.flyZRelative(this.#walkSpeed.dz);
    }
    if (this.#keyActions.left === KEY_DOWN) {
      this.#camera.flyXRelative(-this.#walkSpeed.dx);
    } else if (this.#keyActions.right === KEY_DOWN) {
      this.#camera.flyXRelative(this.#walkSpeed.dx);
    }
    if (this.#keyActions.up === KEY_DOWN) {
      this.#camera.flyYRelative(this.#walkSpeed.dy);
    } else if (this.#keyActions.down === KEY_DOWN) {
      this.#camera.flyYRelative(-this.#walkSpeed.dy);
    }
    if (this.#keyActions.rollLeft === KEY_DOWN) {
      this.#camera.rollLeft(-this.#lookFactor.roll);
    } else if (this.#keyActions.rollRight === KEY_DOWN) {
      this.#camera.rollLeft(this.#lookFactor.roll);
    }

    if (this.#callback != null) {
      this.#callback(timestamp);
    }
  }

  /**
   * @param {(timestamp: DOMHighResTimeStamp) => void} callback
   */
  setUpdateCallback(callback) {
    this.#callback = callback;
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.#camera.resize(width, height);
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
    } else if (key === 'q') {
      return 'rollLeft';
    } else if (key === 'e') {
      return 'rollRight';
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
    this.#camera.yawRight(dx * this.#lookFactor.yaw);
    this.#camera.pitchUp(dy * this.#lookFactor.pitch);
  }

  run() {
    this.#timer.resume();
  }

  pause() {
    this.#timer.suspend();
  }

  get camera() {
    return this.#camera;
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
    if (document.pointerLockElement !== canvas) {
      return;
    }
    example.pressKey(event.key);
  });
  window.addEventListener('keyup', (event) => {
    if (document.pointerLockElement !== canvas) {
      return;
    }
    example.releaseKey(event.key);
  });
  window.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement !== canvas) {
      return;
    }
    example.moveMouse(event.movementX, event.movementY);
  });
  resizeCanvas(canvas);
  example.resize(canvas.width, canvas.height);
  await example.init();

  const lblCameraPosition = document.getElementById('lblCameraPosition');
  const lblCameraRotation = document.getElementById('lblCameraRotation');
  const lblCameraAspect = document.getElementById('lblCameraAspect');
  const lblCameraFOVY = document.getElementById('lblCameraFOVY');
  example.setUpdateCallback((_timestamp) => {
    const {x, y, z, pitch, yaw, roll, fovy} = example.camera;
    const {width, height} = canvas;
    lblCameraPosition.innerText = `(${x.toFixed(2)} / ${y.toFixed(2)} / ${z.toFixed(2)})`;
    lblCameraRotation.innerHTML = `(${pitch.toFixed(2)}&deg; / ${yaw.toFixed(2)}&deg; / ${roll.toFixed(2)}&deg;)`;
    lblCameraAspect.innerText = `(${width} / ${height})`;
    lblCameraFOVY.innerText = fovy.toFixed(2);
  });
  const lblStatus = document.getElementById('lblStatus');
  window.addEventListener('focus', () => {
    console.log('Window in focus');
    lblStatus.innerText = 'Running';
    example.run();
  });
  window.addEventListener('blur', () => {
    console.log('Window out of focus');
    lblStatus.innerText = 'Paused';
    example.pause();
  });
  const btResetCamera = document.getElementById('btResetCamera');
  btResetCamera.addEventListener('click', () => {
    example.camera.reset();
  });
  lblStatus.innerText = 'Running';
  example.run();
});
