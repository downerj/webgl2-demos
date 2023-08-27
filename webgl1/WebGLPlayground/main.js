class Application {
  static #INTERVAL = 10;
  #graphics;
  #timer;
  
  constructor(canvas) {
    this.#graphics = new Graphics(Graphics.getGLContext(canvas));
    this.#timer = new IntervalTimer(this.#tick.bind(this), Application.#INTERVAL);
  }
  
  #tick(timestamp) {
    this.#update();
    this.#draw(timestamp);
    return true;
  }
  
  #update() {
    
  }
  
  #draw(timestamp) {
    this.#graphics.render(timestamp);
  }
  
  resize(width, height) {
    this.#graphics.resize(width, height);
  }
  
  run() {
    this.#timer.resume();
  }
}

let canvas;
let app;

function window_onLoad(_event = null) {
  canvas = document.getElementById('cvs');
  app = new Application(canvas);
  window_onResize();
  app.run();
}

function window_onResize(_event = null) {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight - 5;
  app.resize(canvas.width, canvas.height);
}

window.addEventListener('load', window_onLoad);
window.addEventListener('resize', window_onResize);
