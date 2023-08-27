class Camera {
  constructor() {
    // The position is stored as the additive inverse (negative) of the
    // logical/actual position to facilitate translation in the GL engine.
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
  }

  returnToOrigin() {
    this.position = [0, 0, 0];
  }

  get x() {
    return -this.position[0];
  }

  set x(value) {
    this.position[0] = -value;
  }

  get y() {
    return -this.position[1];
  }

  set y(value) {
    this.position[1] = -value;
  }

  get z() {
    return -this.position[2];
  }

  set z(value) {
    this.position[2] = -value;
  }

  get pitchValue() {
    return this.rotation[0];
  }

  set pitchValue(value) {
    this.rotation[0] = value;
  }

  get yawValue() {
    return this.rotation[1];
  }

  set yawValue(value) {
    this.rotation[1] = value;
  }

  get rollValue() {
    return this.rotation[2];
  }

  set rollValue(value) {
    this.rotation[2] = value;
  }

  strafeLR(speed) {
    const cosA = Math.cos(this.rotation[1] * RADIANS);
    const sinA = Math.sin(this.rotation[1] * RADIANS);
    this.position[0] -= speed * cosA;
    this.position[2] -= speed * sinA;
  }

  strafeFB(speed) {
    const cosA = Math.cos(this.rotation[1] * RADIANS);
    const sinA = Math.sin(this.rotation[1] * RADIANS);
    this.position[0] += speed * sinA;
    this.position[2] -= speed * cosA;
  }

  strafeLeft(speed) {
    this.strafeLR(-speed);
  }

  strafeRight(speed) {
    this.strafeLR(speed);
  }

  walkForward(speed) {
    this.strafeFB(-speed);
  }

  walkBackward(speed) {
    this.strafeFB(speed);
  }

  ascend(speed) {
    this.position[1] -= speed;
  }

  descend(speed) {
    this.position[1] += speed;
  }

  pitch(speed) {
    this.rotation[0] += speed;
    if (this.rotation[0] >= 90) {
      this.rotation[0] = 90;
    } else if (this.rotation[0] <= -90) {
      this.rotation[0] = -90;
    }
  }

  pitchUp(speed) {
    this.pitch(-speed);
  }

  pitchDown(speed) {
    this.pitch(speed);
  }

  yaw(speed) {
    this.rotation[1] += speed;
    this.rotation[1] %= 360;
    if (this.rotation[1] < 0) {
      this.rotation[1] += 360;
    }
  }

  yawLeft(speed) {
    this.yaw(-speed);
  }

  yawRight(speed) {
    this.yaw(speed);
  }

  roll(speed) {
    this.rotation[2] += speed;
    if (this.rotation[2] >= 90) {
      this.rotation[2] = 90;
    } else if (this.rotation[2] <= -90) {
      this.rotation[2] = -90;
    }
  }

  rollCCW(speed) {
    this.roll(-speed);
  }

  rollCW(speed) {
    this.roll(speed);
  }
}

