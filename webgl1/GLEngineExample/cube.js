class Cube {
  constructor({
    x = 0, y = 0, z = 0,
    pitch = 0, yaw = 0, roll = 0,
    pitchSpeed = 0, yawSpeed = 0, rollSpeed = 0,
  }) {
    this.position = [x, y, z];
    this.rotation = [pitch, yaw, roll];
    this.rotationSpeed = [pitchSpeed, yawSpeed, rollSpeed];
  }

  update() {
    this.rotation[0] += this.rotationSpeed[0];
    this.rotation[1] += this.rotationSpeed[1];
    this.rotation[2] += this.rotationSpeed[2];
  }

  get x() {
    return this.position[0];
  }

  set x(value) {
    this.position[0] = value;
  }

  get y() {
    return this.position[1];
  }

  set y(value) {
    this.position[1] = value;
  }

  get z() {
    return this.position[2];
  }

  set z(value) {
    this.position[2] = value;
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
 
}

Cube.VERTICES = [
  // Front face
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,

  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // Right face
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
]; 

Cube.NORMALS = [
  // Front
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,

  // Back
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,

  // Top
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,

  // Bottom
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,

  // Right
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,

  // Left
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0
];

Cube.TEXTURE_COORDINATES = [
  // Front
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  
  // Back
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  
  // Top
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  
  // Bottom
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  
  // Right
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  
  // Left
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
];

Cube.INDICES = [
  0,  1,  2,      0,  2,  3,    // Front
  4,  5,  6,      4,  6,  7,    // Back
  8,  9,  10,     8,  10, 11,   // Top
  12, 13, 14,     12, 14, 15,   // Bottom
  16, 17, 18,     16, 18, 19,   // Right
  20, 21, 22,     20, 22, 23,   // Left
];

