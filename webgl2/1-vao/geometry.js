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

export class Rectangle extends Geometry {
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
