const { cos, sin, PI } = Math;
const D2R = PI / 180;
const { mat4, vec4 } = glMatrix;

export class Camera {
  #fovy;
  #aspect;
  #near;
  #far;
  #x;
  #y;
  #z;
  #pitch;
  #yaw;
  #roll;

  #initFovy;
  #initNear;
  #initFar;
  #initX;
  #initY;
  #initZ;
  #initPitch;
  #initYaw;
  #initRoll;

  #projectionMatrix = mat4.create();
  #viewMatrix = mat4.create();

  /**
   * @param {Object} param
   * @param {number} param.fovy
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
    fovy = 90,
    aspect = 1,
    near = 0.1,
    far = 100,
    x = 0,
    y = 0,
    z = 0,
    pitch = 0,
    yaw = 0,
    roll = 0,
  } = {}) {
    this.#initFovy = fovy;
    this.#initNear = near;
    this.#initFar = far;
    this.#initX = x;
    this.#initY = y;
    this.#initZ = z;
    this.#initPitch = pitch;
    this.#initYaw = yaw;
    this.#initRoll = roll;

    this.#fovy = fovy;
    this.#aspect = aspect;
    this.#near = near;
    this.#far = far;
    this.#x = x;
    this.#y = y;
    this.#z = z;
    this.#pitch = pitch;
    this.#yaw = yaw;
    this.#roll = roll;

    this.#updateProjectionMatrix();
    this.#updateViewMatrix();
  }

  #updateProjectionMatrix() {
    mat4.identity(this.#projectionMatrix);
    mat4.perspective(this.#projectionMatrix, this.#fovy, this.#aspect, this.#near, this.#far);
  }

  #updateViewMatrix() {
    mat4.identity(this.#viewMatrix);
    mat4.rotateX(this.#viewMatrix, this.#viewMatrix, this.#pitch * D2R);
    mat4.rotateY(this.#viewMatrix, this.#viewMatrix, this.#yaw * D2R);
    mat4.rotateZ(this.#viewMatrix, this.#viewMatrix, this.#roll * D2R);
    mat4.translate(this.#viewMatrix, this.#viewMatrix, [-this.#x, -this.#y, -this.#z]);
  }

  get fovy() {
    return this.#fovy;
  }

  get aspect() {
    return this.#aspect;
  }

  get near() {
    return this.#near;
  }

  get far() {
    return this.#far;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get z() {
    return this.#z;
  }

  get pitch() {
    return this.#pitch;
  }

  get yaw() {
    return this.#yaw;
  }

  get roll() {
    return this.#roll;
  }

  get projectionMatrix() {
    return this.#projectionMatrix;
  }

  get viewMatrix() {
    return this.#viewMatrix;
  }

  reset() {
    this.#fovy = this.#initFovy;
    this.#near = this.#initNear;
    this.#far = this.#initFar;
    this.#x = this.#initX;
    this.#y = this.#initY;
    this.#z = this.#initZ;
    this.#pitch = this.#initPitch;
    this.#yaw = this.#initYaw;
    this.#roll = this.#initRoll;

    this.#updateProjectionMatrix();
    this.#updateViewMatrix();
  }

  resize(width, height) {
    this.#aspect = width/height;
    this.#updateProjectionMatrix();
  }

  walkXRelative(dx) {
    const c = cos(this.#yaw * D2R);
    const s = sin(this.#yaw * D2R);
    this.#x += dx * c;
    this.#z += dx * s;
    this.#updateViewMatrix();
  }

  walkYRelative(dy) {
    this.#y += dy;
    this.#updateViewMatrix();
  }

  walkZRelative(dz) {
    const c = cos(this.#yaw * D2R);
    const s = sin(this.#yaw * D2R);
    this.#x -= dz * s;
    this.#z += dz * c;
    this.#updateViewMatrix();
  }

  walkLeft(dx) {
    this.walkXRelative(-dx);
    this.#updateViewMatrix();
  }

  walkRight(dx) {
    this.walkXRelative(dx);
    this.#updateViewMatrix();
  }

  walkForward(dz) {
    this.walkZRelative(-dz);
    this.#updateViewMatrix();
  }

  walkBackward(dz) {
    this.walkZRelative(dz);
    this.#updateViewMatrix();
  }

  walkUp(dy) {
    this.walkYRelative(dy);
    this.#updateViewMatrix();
  }

  walkDown(dy) {
    this.walkYRelative(-dy);
    this.#updateViewMatrix();
  }

  flyXRelative(dx) {
    const dr = vec4.create();
    dr[0] = dx;
    const m = mat4.create();
    mat4.invert(m, this.#viewMatrix);
    vec4.transformMat4(dr, dr, m);
    this.#x += dr[0];
    this.#y += dr[1];
    this.#z += dr[2];
    this.#updateViewMatrix();
  }

  flyYRelative(dy) {
    const dr = vec4.create();
    dr[1] = dy;
    const m = mat4.create();
    mat4.invert(m, this.#viewMatrix);
    vec4.transformMat4(dr, dr, m);
    this.#x += dr[0];
    this.#y += dr[1];
    this.#z += dr[2];
    this.#updateViewMatrix();
  }

  flyZRelative(dz) {
    const dr = vec4.create();
    dr[2] = dz;
    const m = mat4.create();
    mat4.invert(m, this.#viewMatrix);
    vec4.transformMat4(dr, dr, m);
    this.#x += dr[0];
    this.#y += dr[1];
    this.#z += dr[2];
    this.#updateViewMatrix();
  }

  pitchUp(degrees) {
    this.#pitch += degrees;
    this.#pitch %= 360;
    while (this.#pitch < 0) {
      this.#pitch += 360;
    }
    // if (this.#pitch >= 90) {
    //   this.#pitch = 90;
    // } else if (this.#pitch <= -90) {
    //   this.#pitch = -90;
    // }
    this.#updateViewMatrix();
  }
  
  yawRight(degrees) {
    this.#yaw += degrees;
    this.#yaw %= 360;
    while (this.#yaw < 0) {
      this.#yaw += 360;
    }
    this.#updateViewMatrix();
  }
  
  rollLeft(degrees) {
    this.#roll += degrees;
    this.#roll %= 360;
    while (this.#roll < 0) {
      this.#roll += 360;
    }
    this.#updateViewMatrix();
  }
}
