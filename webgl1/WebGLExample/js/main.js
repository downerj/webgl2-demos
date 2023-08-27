"use strict";

/**
 * 
 * @type {(elementId: string) => HTMLElement}
 */
const byId = document.getElementById.bind(document);

/**
 * @type CanvasApplication
 */
let app;

/**
 * 
 * @param {Event} _
 */
function window_onLoad(_) {
  /**
   * @type {HTMLCanvasElement}
   */
  let canvas = byId('canvas');
  
  /**
   * @type {HTMLDivElement}
   */
  let container = canvas.parentElement;

  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  app = new CanvasApplication(canvas);
  app.run();
}

window.addEventListener('load', window_onLoad);
