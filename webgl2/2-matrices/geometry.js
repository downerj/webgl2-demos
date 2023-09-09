export class Geometry {
  /**
   * @returns {Float32Array | Float64Array}
   */
  static get vertices() {
    return null;
  }

  /**
   * @returns {Uint16Array | Uint32Array}
   */
  static get indices() {
    return null;
  }

  /**
   * @returns {Uint16Array | Uint32Array}
   */
  get indices() {
    return null;
  }

  /**
   * @returns {Float32Array | Float64Array}
   */
  get vertices() {
    return null;
  }
}

export class Cube extends Geometry {
  /**
   * @type {Float32Array}
   */
  static #vertices = new Float32Array([
    // Front Bottom Left
    -1, -1, 1,
    // Front Bottom Right
    1, -1, 1,
    // Front Top Right
    1, 1, 1,
    // Front Top Left
    -1, 1, 1,
    // Back Bottom Left
    -1, -1, -1,
    // Back Bottom Right
    1, -1, -1,
    // Back Top Right
    1, 1, -1,
    // Back Top Left
    -1, 1, -1,
  ]);

  /**
   * @type {Uint16Array}
   */
  static #indices = new Uint16Array([
    // Front
    0, 1, 2,
    0, 2, 3,
    // Right
    1, 5, 6,
    1, 6, 2,
    // Bottom
    4, 5, 1,
    4, 1, 0,
    // Back
    5, 4, 7,
    5, 7, 6,
    // Left
    4, 0, 3,
    4, 3, 7,
    // Top
    3, 2, 6,
    3, 6, 7,
  ]);

  /**
   * @returns {Float32Array}
   */
  static get vertices() {
    return Cube.#vertices;
  }

  /**
   * @returns {Uint16Array}
   */
  static get indices() {
    return Cube.#indices;
  }

  /**
   * @returns {Float32Array}
   */
  get vertices() {
    return Cube.#vertices;
  }

  /**
   * @returns {Uint16Array}
   */
  get indices() {
    return Cube.#indices;
  }
}
