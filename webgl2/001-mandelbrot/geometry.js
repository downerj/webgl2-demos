export class Geometry {
  /**
   * @returns {Float32Array | Float64Array}
   */
  get vertices() {
    return null;
  }
  /**
   * @returns {Uint16Array | Uint32Array}
   */
  get indices() {
    return null;
  }
}

export class Square extends Geometry {
  #position;

  constructor({x = 0, y = 0, z = 0} = {}) {
    super();
    this.#position = [x, y, z];
  }

  get vertices() {
    return new Float32Array([
      // Bottom left
      -1, -1, -1,
      // Bottom right
      1, -1, -1,
      // Top right
      1, 1, -1,
      // Top left
      -1, 1, -1,
    ]);
  }

  get indices() {
    return new Uint16Array([
      // Bottom right triangle
      0, 1, 2,
      // Top left triangle
      0, 2, 3,
    ]);
  }
}

export class Cube extends Geometry {
  /**
   * @type {[number, number, number]}
   */
  #position;

  /**
   * @param {{x: number, y: number, z: number}}
   */
  constructor({x = 0, y = 0, z = 0} = {}) {
    super();
    this.#position = [x, y, z];
  }

  /**
   * @returns {Float32Array}
   */
  get vertices() {
    return new Float32Array([
      // Front Bottom Left
      -1, -1, -1,
      // Front Bottom Right
      1, -1, -1,
      // Front Top Right
      1, 1, -1,
      // Front Top Left
      -1, 1, -1,
      // Back Bottom Left
      -1, -1, 1,
      // Back Bottom Right
      1, -1, 1,
      // Back Top Right
      1, 1, 1,
      // Back Top Left
      -1, 1, 1,
    ]);
  }

  /**
   * @returns {Uint16Array}
   */
  get indices() {
    return new Uint16Array([
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
  }
}
