const { cos, sin, PI } = Math;
const D2R = PI / 180;
const { mat3, mat4, vec3, vec4 } = glMatrix;

export class Camera {
  #fovy;
  #aspect;
  #near;
  #far;

  #initFovy;
  #initNear;
  #initFar;
  #initX;
  #initY;
  #initZ;
  #initPitch;
  #initYaw;
  #initRoll;

  #origin = vec4.create();
  #position = vec4.create();
  #rightVec = vec4.create();
  #upVec = vec4.create();
  #lookVec = vec4.create();
  #workingMat = mat4.create();
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

    this.reset();
  }

  #updateProjectionMatrix() {
    mat4.identity(this.#projectionMatrix);
    mat4.perspective(this.#projectionMatrix, this.#fovy, this.#aspect, this.#near, this.#far);
  }

  #updateViewMatrix() {
    mat4.lookAt(this.#viewMatrix, this.#origin, this.#lookVec, this.#upVec);
    mat4.translate(this.#viewMatrix, this.#viewMatrix, this.#position);
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

  get position() {
    return this.#position;
  }

  get x() {
    return this.#position[0];
  }

  get y() {
    return this.#position[1];
  }

  get z() {
    return this.#position[2];
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
    this.#updateProjectionMatrix();
    
    vec4.set(this.#rightVec, 1, 0, 0, 1);
    vec4.set(this.#upVec, 0, 1, 0, 1);
    vec4.set(this.#lookVec, 0, 0, 1, 1);
    this.#doPitch(this.#initPitch);
    this.#doYaw(this.#initYaw);
    this.#doRoll(this.#initRoll);
    vec4.set(this.#position, this.#initX, this.#initY, this.#initZ, 1);
    mat4.identity(this.#viewMatrix);
    this.#updateViewMatrix();
  }

  resize(width, height) {
    this.#aspect = width/height;
    this.#updateProjectionMatrix();
  }

  walkXRelative(dx) {
    // const c = cos(this.#yaw * D2R);
    // const s = sin(this.#yaw * D2R);
    // this.#x += dx * c;
    // this.#z += dx * s;
    // this.#updateViewMatrix();
  }

  walkYRelative(dy) {
    // this.#y += dy;
    // this.#updateViewMatrix();
  }

  walkZRelative(dz) {
    // const c = cos(this.#yaw * D2R);
    // const s = sin(this.#yaw * D2R);
    // this.#x -= dz * s;
    // this.#z += dz * c;
    // this.#updateViewMatrix();
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

  flyXRelative(dx) {
    // const dr = vec4.create();
    // dr[0] = dx;
    // const m = mat4.create();
    // mat4.invert(m, this.#viewMatrix);
    // vec4.transformMat4(dr, dr, m);
    // this.#x += dr[0];
    // this.#y += dr[1];
    // this.#z += dr[2];
    // this.#updateViewMatrix();
  }

  flyYRelative(dy) {
    // const dr = vec4.create();
    // dr[1] = dy;
    // const m = mat4.create();
    // mat4.invert(m, this.#viewMatrix);
    // vec4.transformMat4(dr, dr, m);
    // this.#x += dr[0];
    // this.#y += dr[1];
    // this.#z += dr[2];
    // this.#updateViewMatrix();
  }

  flyZRelative(dz) {
    // const dr = vec4.create();
    // dr[2] = dz;
    // const m = mat4.create();
    // mat4.invert(m, this.#viewMatrix);
    // vec4.transformMat4(dr, dr, m);
    // this.#x += dr[0];
    // this.#y += dr[1];
    // this.#z += dr[2];
    // this.#updateViewMatrix();
  }

  #doPitch(degrees) {
    mat4.fromRotation(this.#workingMat, degrees * D2R, this.#rightVec);
    vec4.transformMat4(this.#upVec, this.#upVec, this.#workingMat);
    vec4.transformMat4(this.#lookVec, this.#lookVec, this.#workingMat);
  }

  #doYaw(degrees) {
    mat4.fromRotation(this.#workingMat, -degrees * D2R, this.#upVec);
    vec4.transformMat4(this.#rightVec, this.#rightVec, this.#workingMat);
    vec4.transformMat4(this.#lookVec, this.#lookVec, this.#workingMat);
  }

  #doRoll(degrees) {
    mat4.fromRotation(this.#workingMat, degrees * D2R, this.#lookVec);
    vec4.transformMat4(this.#rightVec, this.#rightVec, this.#workingMat);
    vec4.transformMat4(this.#upVec, this.#upVec, this.#workingMat);
  }

  pitchUp(degrees) {
    this.#doPitch(degrees);
    // this.#pitch += degrees;
    // this.#pitch %= 360;
    // while (this.#pitch < 0) {
    //   this.#pitch += 360;
    // }
    // if (this.#pitch >= 90) {
    //   this.#pitch = 90;
    // } else if (this.#pitch <= -90) {
    //   this.#pitch = -90;
    // }
    this.#updateViewMatrix();
  }
  
  yawRight(degrees) {
    this.#doYaw(degrees);
    // this.#yaw += degrees;
    // this.#yaw %= 360;
    // while (this.#yaw < 0) {
    //   this.#yaw += 360;
    // }
    this.#updateViewMatrix();
  }
  
  rollLeft(degrees) {
    this.#doRoll(degrees);
    // this.#roll += degrees;
    // this.#roll %= 360;
    // while (this.#roll < 0) {
    //   this.#roll += 360;
    // }
    this.#updateViewMatrix();
  }
}
