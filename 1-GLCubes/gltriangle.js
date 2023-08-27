function mat4_identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  
  return out;
}

function mat4_create() {
  const out = new Array(16);
  return mat4_identity(out);
}

function mat4_copy(out, src) {
  out[0] = src[0];
  out[1] = src[1];
  out[2] = src[2];
  out[3] = src[3];
  out[4] = src[4];
  out[5] = src[5];
  out[6] = src[6];
  out[7] = src[7];
  out[8] = src[8];
  out[9] = src[9];
  out[10] = src[10];
  out[11] = src[11];
  out[12] = src[12];
  out[13] = src[13];
  out[14] = src[14];
  out[15] = src[15];

  return out;
}

function mat4_translate(out, src, translation) {
  if (out !== src) {
    mat4_copy(out, src);
  }
  out[12] += translation[0];
  out[13] += translation[1];
  out[14] += translation[2];

  return out;
}

function mat4_scale(out, src, scale) {
  if (out !== src) {
    mat4_copy(out, src);
  }
  out[0] *= scale[0];
  out[5] *= scale[1];
  out[10] *= scale[2];
  
  return out;
}

const DEG_TO_RAD = Math.PI / 180.0;

function mat4_perspective(out, fovy, aspect, near, far) {
  const f = 1/Math.tan(fovy/2);
  const nf = 1/(near - far);
  out[0] = f/aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (near + far) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * near * far * nf;
  out[15] = 0;

  return out;
}

function animate(callback, interval) {
  let handle = null;
  let previous = 0;

  function cancel() {
    window.cancelAnimationFrame(handle);
    handle = null;
  }

  function update() {
    handle = window.requestAnimationFrame(tick.bind(this));
  }

  function tick(timestamp) {
    if (timestamp - previous >= interval) {
      previous = timestamp;
      const status = callback(timestamp);
      if (!status) {
        cancel();
        return;
      }
    }
    update();
  }

  return {
    resume() {
      if (handle === null) {
        update();
        return true;
      }
      return false;
    },
    suspend() {
      if (handle !== null) {
        cancel();
        return true;
      }
      return false;
    },
  };
}

const KEY_UP = 0;
const KEY_DOWN = 1;
const KEY_TOGGLED = 2;

let gl = null;
const app = {
  width: 0,
  height: 0,
  program: null,
  locations: {
    position: null,
    colorIn: null,
    projection: null,
    model: null,
  },
  buffers: {
    vertex: null,
    color: null,
    index: null,
  },
  matrices: {
    projection: mat4_create(),
    diamondModel: mat4_create(),
  },
  animator: null,
  cameraScale: 100,
  diamondPosition: [0, 0, -8],
  keys: {
    a: KEY_UP,
    d: KEY_UP,
    s: KEY_UP,
    w: KEY_UP,
  },
};

const DIAMOND_SPEED = 0.1;
function update(timestamp) {
  if (app.keys.a === KEY_DOWN) {
    app.diamondPosition[0] -= DIAMOND_SPEED;
  } else if (app.keys.d === KEY_DOWN) {
    app.diamondPosition[0] += DIAMOND_SPEED;
  }
  if (app.keys.s === KEY_DOWN) {
    app.diamondPosition[1] -= DIAMOND_SPEED;
  } else if (app.keys.w === KEY_DOWN) {
    app.diamondPosition[1] += DIAMOND_SPEED;
  }
  return g_render(timestamp);
}

function window_onLoad() {
  const cvs = document.getElementById('cvs');
  window_onResize();
  gl = cvs.getContext('webgl') ?? cvs.getContext('webgl-experimental');
  if (!gl) {
    throw 'Unable to get WebGL context';
  }
  g_initialize();
  app.animator = animate(update, 10);
  app.animator.resume();
}

function window_onResize() {
  const cvs = document.getElementById('cvs');
  cvs.width = cvs.parentElement.clientWidth;
  cvs.height = cvs.parentElement.clientHeight;
}

function window_onKeyDown(event) {
  if (app.keys[event.key] !== KEY_TOGGLED) {
    app.keys[event.key] = KEY_DOWN;
  }
}

function window_onKeyUp(event) {
  app.keys[event.key] = KEY_UP;
}

const vertexSourceMain = `#version 100
precision highp float;

attribute vec3 position;
attribute vec3 colorIn;

uniform mat4 projection;
uniform mat4 model;

varying vec3 color;

void main() {
  gl_Position = projection * model * vec4(position, 1.0);
  color = colorIn;
}
`;

const fragmentSourceMain = `#version 100
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;

const triangles = {
  vertices: [
    // Front
    0, 0, -1,
    // Bottom
    0, -1, 0,
    // Right
    1, 0, 0,
    // Back
    0, 0, 1,
    // Top
    0, 1, 0,
    // Left
    -1, 0, 0,
  ],
  colors: [
    // Front: Red
    1, 0, 0,
    // Bottom: Green
    0, 1, 0,
    // Right: Blue
    0, 0, 1,
    // Back: Cyan
    0, 1, 1,
    // Top: Magenta
    1, 0, 1,
    // Left: Yellow
    1, 1, 0,
  ],
  indices: [
    // Top right front
    4, 2, 0,
    // Bottom right front
    0, 2, 1,
    // Bottom right back
    1, 2, 3,
    // Top right back
    3, 2, 4,
    // Top left back
    4, 5, 3,
    // Bottom left back
    3, 5, 1,
    // Bottom left front
    1, 5, 0,
    // Top left front
    0, 5, 4,
  ],
};

function g_resize() {
  const canvasWidth = gl.canvas.clientWidth;
  const canvasHeight = gl.canvas.clientHeight;
  if (app.width !== canvasWidth || app.height !== canvasHeight) {
    app.width = canvasWidth;
    app.height = canvasHeight;
    gl.viewport(0, 0, app.width, app.height);
    
    const fovy = 45 * DEG_TO_RAD;
    const aspect = canvasHeight / canvasWidth;
    const near = -1;
    const far = 1;
    mat4_perspective(app.matrices.projection, fovy, aspect, near, far);

    /*
    const cameraWidth = canvasWidth/app.cameraScale;
    const cameraHeight = canvasHeight/app.cameraScale;
    const cameraDepth = Math.min(cameraWidth, cameraHeight);
    mat4_identity(app.matrices.projection);
    mat4_scale(
      app.matrices.projection,
      app.matrices.projection,
      [2/cameraWidth, 2/cameraHeight, -2/cameraDepth]
    );
    mat4_translate(
      app.matrices.projection,
      app.matrices.projection,
      [-1, -1, -1]
    );
    app.diamondPosition[0] = cameraWidth/2;
    app.diamondPosition[1] = cameraHeight/2;
    app.diamondPosition[2] = -cameraDepth/2;
    */
  }
}

function g_initialize() {
  g_resize();

  const program = g_createProgram(vertexSourceMain, fragmentSourceMain);
  if (!program) {
    throw `Failed to link GL program`;
  }
  app.program = program;
  app.locations.position = gl.getAttribLocation(program, 'position');
  app.locations.colorIn = gl.getAttribLocation(program, 'colorIn');
  app.locations.projection = gl.getUniformLocation(program, 'projection');
  app.locations.model = gl.getUniformLocation(program, 'model');
  app.buffers.vertex = g_createBuffer(
    gl.ARRAY_BUFFER,
    new Float32Array(triangles.vertices),
    gl.STATIC_DRAW
  );
  app.buffers.color = g_createBuffer(
    gl.ARRAY_BUFFER,
    new Float32Array(triangles.colors),
    gl.STATIC_DRAW
  );
  app.buffers.index = g_createBuffer(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(triangles.indices),
    gl.STATIC_DRAW
  );
  
  gl.frontFace(gl.CW);
}

function g_createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function g_createProgram(vertexSource, fragmentSource) {
  const vertexShader = g_createShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = g_createShader(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const status = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!status) {
    const programLog = gl.getProgramInfoLog(program);
    const vertexLog = gl.getShaderInfoLog(vertexShader);
    const fragmentLog = gl.getShaderInfoLog(fragmentShader);
    console.error(`Program log: ${programLog}`);
    if (vertexLog.length > 0) {
      console.error(`Vertex log: ${vertexLog}`);
    }
    if (fragmentLog.length > 0) {
      console.error(`Fragment log: ${fragmentLog}`);
    }
  }
  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  return status ? program : null;
}

function g_createBuffer(target, data, usage) {
  const buffer = gl.createBuffer(target);
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, usage);
  gl.bindBuffer(target, null);
  return buffer;
}

function g_render(timestamp) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  g_resize();

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  
  gl.useProgram(app.program);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, app.buffers.vertex);
  gl.vertexAttribPointer(
    app.locations.position,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(app.locations.position);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, app.buffers.color);
  gl.vertexAttribPointer(
    app.locations.colorIn,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(app.locations.colorIn);
  
  mat4_identity(app.matrices.diamondModel);
  mat4_translate(
    app.matrices.diamondModel,
    app.matrices.diamondModel,
    app.diamondPosition
  );
  
  gl.uniformMatrix4fv(app.locations.projection, false, app.matrices.projection);
  gl.uniformMatrix4fv(app.locations.model, false, app.matrices.diamondModel);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, app.buffers.index);
  gl.drawElements(
    gl.TRIANGLES,
    triangles.indices.length,
    gl.UNSIGNED_SHORT,
    0
  );

  return true;
}

window.addEventListener('load', window_onLoad);
window.addEventListener('resize', window_onResize);
window.addEventListener('keydown', window_onKeyDown);
window.addEventListener('keyup', window_onKeyUp);

