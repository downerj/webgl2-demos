import { Graphics } from './graphics.js'
import { AnimationTimer } from './timer.js';
import { Square } from './geometry.js';

class WebGL2Example {
  /**
   * @type {HTMLCanvasElement}
   */
  #canvas;
  /**
   * @type {Graphics}
   */
  #graphics;
  /**
   * @type {AnimationTimer}
   */
  #timer = new AnimationTimer(this.#tick.bind(this), 20);
  /**
   * @type {{[name: string]: Geometry}}
   */
  #geometry = {
    square: new Square(),
  };
  
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#canvas = canvas;
    this.#graphics = new Graphics(canvas);
  }

  /**
   * @param {DOMHighResTimeStamp} timestamp
   */
  #tick(timestamp) {
    this.#graphics.render(timestamp);
  }

  /**
   * @param {number} width 
   * @param {number} height 
   */
  resize(width, height) {
    this.#graphics.resize(width, height);
  }

  async run() {
    await this.#graphics.init();
    for (const [_key, geometry] of Object.entries(this.#geometry)) {
      this.#graphics.addObject(geometry); 
    }
    this.#timer.resume();
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
  resizeCanvas(canvas);
  example.resize(canvas.width, canvas.height);
  await example.run();
});
