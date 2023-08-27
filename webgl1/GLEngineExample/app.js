class Application {
  constructor(canvas) {
    // TODO: Make this its own class.
    this.light = {
      ambient: [0.3, 0.3, 0.3],
      color: [1, 1, 1],
      direction: [0.85, 0.8, 0.75],
    };
    this.camera = new Camera();
    const gl = GLEngine.getGLFromCanvas(canvas);
    this._gle = new GLEngine(gl, this.light, this.camera);
    this.onResize(canvas.width, canvas.height);
    
    this._interval = 10;
    this._entities = [];
    for (let x = 0; x < 100; x++) {
      const cube = new Cube({
        x: randomInteger(-100, 100),
        y: randomInteger(-100, 100),
        z: randomInteger(-100, 100),
        yaw: randomInteger(0, 180),
        pitch: randomInteger(0, 180),
        roll: randomInteger(0, 180),
        yawSpeed: randomInteger(-2, 2) / this._interval / 10,
        pitchSpeed: randomInteger(-2, 2) / this._interval / 10,
        rollSpeed: randomInteger(-2, 2) / this._interval / 10,
      });
      this._entities.push(cube);
      this._gle.pushEntity({
        position: cube.position,
        rotation: cube.rotation,
        vertices: Cube.VERTICES,
        normals: Cube.NORMALS,
        textureCoordinates: Cube.TEXTURE_COORDINATES,
        indices: Cube.INDICES,
      });
    }
    
    this._actions = {
      strafeLeft: false,
      strafeRight: false,
      ascend: false,
      descend: false,
      walkForward: false,
      walkBackward: false,
      pitchUp: false,
      pitchDown: false,
      yawLeft: false,
      yawRight: false,
      rollCCW: false,
      rollCW: false,
    };
    this._speeds = {
      strafe: 5 / this._interval,
      rotate: 10 / this._interval, // degrees
    };
  }

  run() {
    loopInterval(this.loop_onTick.bind(this), this._interval);
  }

  onResize(width, height) {
    this._gle.resize(width, height);
  }

  onMouseMove(x, y) {
    const camera = this.camera;
    camera.yawRight(x / this._interval);
    camera.pitchDown(y / this._interval);
  }

  onKeyEvent(key, pressed) {
    const actions = this._actions;
    switch (key) {
      case 'a':
      case 'ArrowLeft':
        actions.strafeLeft = pressed;
        break;
      case 'd':
      case 'ArrowRight':
        actions.strafeRight = pressed;
        break;
      case 's':
      case 'ArrowDown':
        actions.walkBackward = pressed;
        break;
      case 'w':
      case 'ArrowUp':
        actions.walkForward = pressed;
        break;
      case ' ':
      case 'Spacebar':
        actions.ascend = pressed;
        break;
      case 'Shift':
        actions.descend = pressed;
        break;
    }
  }

  onKeyDown(key) {
    this.onKeyEvent(key, true);
  }

  onKeyUp(key) {
    this.onKeyEvent(key, false);
  }

  loop_onTick(timestamp) {
    this.update(timestamp);
    this.draw();
  }

  update(timestamp) {
    const speeds = this._speeds;
    const light = this.light;
    const camera = this.camera;
    const actions = this._actions;
    const entities = this._entities;

    for (const entity of entities) {
      entity.update();
    }

    if (actions.strafeLeft) {
      camera.strafeLeft(speeds.strafe);
    } else if (actions.strafeRight) {
      camera.strafeRight(speeds.strafe);
    }
    if (actions.ascend) {
      camera.ascend(speeds.strafe); 
    } else if (actions.descend) {
      camera.descend(speeds.strafe);
    }
    if (actions.walkForward) {
      camera.walkForward(speeds.strafe);
    } else if (actions.walkBackward) {
      camera.walkBackward(speeds.strafe);
    }
    if (actions.yawLeft) {
      camera.yawLeft(speeds.rotate);
    } else if (actions.yawRight) {
      camera.yawRight(speeds.rotate);
    }
    if (actions.pitchUp) {
      camera.pitchUp(speeds.rotate);
    } else if (actions.pitchDown) {
      camera.pitchDown(speeds.rotate);
    }
  }

  draw() {
    this._gle.render();
  }
}


