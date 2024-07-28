import { GraphicsEngine3D } from './graphics.js';
import { AnimationLoop } from './loop.js';

class Application {
  /**
   * @type {HTMLCanvasElement}
   */
  #canvas;
  /**
   * @type {GraphicsEngine3D}
   */
  #g3d;
  /**
   * @type {AnimationLoop}
   */
  #loop;

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#canvas = canvas;
    this.#g3d = new GraphicsEngine3D(canvas);
    this.resizeToFit();
    this.#loop = new AnimationLoop(this.#onTick.bind(this), 30);
  }

  /**
   *
   */
  async run() {
    if (!this.#g3d.isInitialized) {
      try {
        await this.#g3d.initialize();
      } catch (e) {
        console.error('Failed to initialize WebGL2:', e);
        return;
      }
    }
    this.#loop.resume();
  }

  /**
   *
   */
  resizeToFit() {
    const canvas = this.#canvas;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    this.#g3d.resizeToFit();
  }

  /**
   * @param {DOMHighResTimeStamp} timestamp
   */
  #onTick(timestamp) {
    this.#g3d.update(timestamp);
    this.#g3d.render();
  }
}

window.addEventListener('load', () => {
  /**
   * @type {HTMLCanvasElement}
   */
  const cvs = document.getElementById('cvs');
  const app = new Application(cvs);

  window.addEventListener('resize', () => {
    app.resizeToFit();
  });

  app.run();
});
