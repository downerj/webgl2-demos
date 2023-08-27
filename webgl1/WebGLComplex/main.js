let cvs;
let app;

function window_onLoad() {
  cvs = document.getElementById('cvs');
  window_onResize();
  app = new Application(cvs);
  app.run();
}

function window_onResize() {
  cvs.width = cvs.parentElement.clientWidth;
  cvs.height = cvs.parentElement.clientHeight;
  if (app !== undefined) {
    app.onResize(cvs.width, cvs.height);
  }
}

window.addEventListener('load', window_onLoad);
window.addEventListener('resize', window_onResize);
