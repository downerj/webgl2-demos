class ApplicationState {
  constructor({
    mouseX = 0,
    mouseY = 0,
    width = 0,
    height = 0,
    timestamp = 0,
    offsetDX = 0,
    offsetDY = 0,
    zoom = 1.0,
  } = {}) {
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.width = width;
    this.height = height;
    this.timestamp = timestamp;
    this.offsetDX = offsetDX;
    this.offsetDY = offsetDY;
    this.zoom = zoom;
  }
}
