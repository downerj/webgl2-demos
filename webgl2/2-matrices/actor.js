export class Actor {
  /**
   * @type {Float32Array}
   */
  #position;
  /**
   * @type {Float32Array}
   */
  #rotation;
  /**
   * @type {Float32Array}
   */
  #color;
  
  /**
   * @param {Object} geometry
   * @param {Object} param1
   * @param {number} param1.x
   * @param {number} param1.y
   * @param {number} param1.z
   * @param {number} param1.ax
   * @param {number} param1.ay
   * @param {number} param1.az
   * @param {number} param1.r
   * @param {number} param1.g
   * @param {number} param1.b
   */
  constructor({x = 0, y = 0, z = 0, ax = 0, ay = 0, az = 0, r = 0, g = 0, b = 0} = {}) {
    this.#position = new Float32Array([x, y, z]);
    this.#rotation = new Float32Array([ax, ay, az]);
    this.#color = new Float32Array([r/255, g/255, b/255]);
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

  get rotation() {
    return this.#rotation;
  }

  get ax() {
    return this.#rotation[0];
  }

  get ay() {
    return this.#rotation[1];
  }

  get az() {
    return this.#rotation[2];
  }

  get color() {
    return this.#color;
  }

  get r() {
    return this.#color[0];
  }

  get g() {
    return this.#color[1];
  }
  
  get b() {
    return this.#color[2];
  }

  set x(value) {
    this.#position[0] = value;
  }

  set y(value) {
    this.#position[1] = value;
  }

  set z(value) {
    this.#position[2] = value;
  }

  set ax(value) {
    this.#rotation[0] = value;
  }

  set ay(value) {
    this.#rotation[1] = value;
  }
  
  set az(value) {
    this.#rotation[2] = value;
  }

  set r(value) {
    this.#color[0] = value;
  }

  set g(value) {
    this.#color[1] = value;
  }

  set b(value) {
    this.#color[2] = value;
  }
}
