const {cos, sin, PI} = Math;
const D2R = PI / 180;

export class Camera {
  fov;
  aspect;
  near;
  far;
  x;
  y;
  z;
  pitch;
  yaw;
  roll;

  /**
   * @param {Object} param
   * @param {number} param.fov
   * @param {number} param.aspect
   * @param {number} param.near
   * @param {number} param.far
   * @param {number} param.x
   * @param {number} param.y
   * @param {number} param.pitch
   * @param {number} param.yaw
   * @param {number} param.roll
   */
  constructor({
    fov = 90,
    aspect = 1,
    near = 0.1,
    far = 100,
    x = 0,
    y = 0,
    z = 0,
    pitch = 0,
    yaw = 0,
    roll = 0
  } = {}) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.x = x;
    this.y = y;
    this.z = z;
    this.pitch = pitch;
    this.yaw = yaw;
    this.roll = roll;
  }

  walkXRelative(dx) {
    const c = cos(this.yaw * D2R);
    const s = sin(this.yaw * D2R);
    this.x += dx * c;
    this.z += dx * s;
  }

  walkYRelative(dy) {
    this.y += dy;
  }

  walkZRelative(dz) {
    const c = cos(this.yaw * D2R);
    const s = sin(this.yaw * D2R);
    this.x -= dz * s;
    this.z += dz * c; 
  }

  walkLeft(dx) {
    this.walkXRelative(-dx);
  }

  walkRight(dx) {
    this.walkXRelative(dx);
  }

  walkForward(dz) {
    this.walkZRelative(-dz);
  }

  walkBackward(dz) {
    this.walkZRelative(dz);
  }

  walkUp(dy) {
    this.walkYRelative(dy);
  }

  walkDown(dy) {
    this.walkYRelative(-dy);
  }

  pitchUp(degrees) {
    this.pitch += degrees;
    if (this.pitch >= 90) {
      this.pitch = 90;
    } else if (this.pitch <= -90) {
      this.pitch = -90;
    }
  }
  
  yawRight(degrees) {
    this.yaw += degrees;
    this.yaw %= 360;
    while (this.yaw < 0) {
      this.yaw += 360;
    }
  }
  
  rollLeft(degrees) {
    this.roll += degrees;
    this.roll %= 360;
    while (this.roll < 0) {
      this.roll += 360;
    }
  }
}
