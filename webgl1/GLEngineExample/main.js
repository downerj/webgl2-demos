const elementByID = document.getElementById.bind(document);

const objects = {};
function window_onLoad() {
  const cvs = elementByID('cvs');
  const app = new Application(cvs);
  objects.app = app;
  // TODO: Make dedicated HeadsUpDisplay class.
  const hud = elementByID('hud');
  const infoTable = elementByID('infoTable');
  const canvasWidthLabel = elementByID('canvasWidthLabel');
  const canvasHeightLabel = elementByID('canvasHeightLabel');
  const lightAmbientRedLabel = elementByID('lightAmbientRedLabel');
  const lightAmbientGreenLabel = elementByID('lightAmbientGreenLabel');
  const lightAmbientBlueLabel = elementByID('lightAmbientBlueLabel');
  const lightRedLabel = elementByID('lightRedLabel');
  const lightGreenLabel = elementByID('lightGreenLabel');
  const lightBlueLabel = elementByID('lightBlueLabel');
  const lightXLabel = elementByID('lightXLabel');
  const lightYLabel = elementByID('lightYLabel');
  const lightZLabel = elementByID('lightZLabel');
  const cameraXLabel = elementByID('cameraXLabel');
  const cameraYLabel = elementByID('cameraYLabel');
  const cameraZLabel = elementByID('cameraZLabel');
  const cameraPitchLabel = elementByID('cameraPitchLabel');
  const cameraYawLabel = elementByID('cameraYawLabel');
  const timeLabel = elementByID('timeLabel');

  const keys = {
    i: false, // For info table in HUD
  };

  function toggleInfo() {
    infoTable.hidden = !infoTable.hidden;
  }

  function window_onResize() {
    cvs.width = cvs.parentElement.clientWidth;
    cvs.height = cvs.parentElement.clientHeight;
    app.onResize(cvs.width, cvs.height);
    canvasWidthLabel.textContent = cvs.width;
    canvasHeightLabel.textContent = cvs.height;
  }

  function window_onKeyDown({key,}) {
    if (key === 'i' && !keys.i) {
      keys.i = true;
      toggleInfo();
      return;
    }
    app.onKeyDown(key);
  }

  function window_onKeyUp({key,}) {
    keys[key] = false;
    app.onKeyUp(key);
  }

  function cvs_onMouseMove({movementX, movementY,}) {
    const x = movementX;
    const y = movementY;
    app.onMouseMove(x, y);
  }

  function hud_onClick(event) {
    if (document.pointerLockElement !== cvs) {
      cvs.requestPointerLock();
    }
  }

  function app_onUpdate(timestamp) {
    lightAmbientRedLabel.textContent = Math.floor(app.light.ambient[0] * 0xff)
      .toString(16)
      .padStart(2, '0');
    lightAmbientGreenLabel.textContent = Math.floor(app.light.ambient[1] * 0xff)
      .toString(16)
      .padStart(2, '0');
    lightAmbientBlueLabel.textContent = Math.floor(app.light.ambient[2] * 0xff)
      .toString(16)
      .padStart(2, '0');
    lightRedLabel.textContent = Math.floor(app.light.color[0] * 0xff)
      .toString(16)
      .padStart(2, '0');
    lightGreenLabel.textContent = Math.floor(app.light.color[1] * 0xff)
      .toString(16)
      .padStart(2, '0');
    lightBlueLabel.textContent = Math.floor(app.light.color[2] * 0xff)
      .toString(16)
      .padStart(2, '0');
    lightXLabel.textContent = app.light.direction[0].toFixed(2);
    lightYLabel.textContent = app.light.direction[1].toFixed(2);
    lightZLabel.textContent = app.light.direction[2].toFixed(2);
    cameraXLabel.textContent = app.camera.x.toFixed(1);
    cameraYLabel.textContent = app.camera.y.toFixed(1);
    cameraZLabel.textContent = app.camera.z.toFixed(1);
    cameraPitchLabel.textContent = app.camera.pitchValue.toFixed(1);
    cameraYawLabel.textContent = app.camera.yawValue.toFixed(1);
    timeLabel.textContent = timestampToHHMMSS(timestamp);
  }

  window.addEventListener('resize', window_onResize);
  window.addEventListener('keydown', window_onKeyDown);
  window.addEventListener('keyup', window_onKeyUp);
  cvs.addEventListener('mousemove', cvs_onMouseMove);
  hud.addEventListener('click', hud_onClick);

  window_onResize();
  app.run();
  loopInterval(app_onUpdate.bind(this), 100);
}

window.addEventListener('load', window_onLoad);

