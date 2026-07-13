/* engine.js — WebGL unit-layer renderer.
 *
 * A fixed population of N point sprites. Object constancy is structural:
 * units are never created or destroyed after boot; every visual change is a
 * tween between per-identity attribute buffers (A -> B) interpolated on the
 * GPU. Interrupting a tween retargets from the *current interpolated values*
 * (computed once on the CPU), never from the stale start state — the same
 * interrupt semantics d3 named transitions give SVG.
 */

const VERT = `
precision mediump float;
attribute vec2 aPosA;
attribute vec2 aPosB;
attribute vec4 aColA;
attribute vec4 aColB;
attribute float aSizeA;
attribute float aSizeB;
attribute float aStagger;
uniform float uT;        // master transition progress 0..1
uniform float uStagger;  // fraction of the timeline used for per-unit offsets
uniform vec2 uRes;       // canvas CSS pixel size
uniform float uDpr;
varying vec4 vColor;

float easeCubicOut(float x) {
  float p = 1.0 - x;
  return 1.0 - p * p * p;
}

void main() {
  float span = max(1.0 - uStagger, 0.0001);
  float u = clamp((uT - aStagger * uStagger) / span, 0.0, 1.0);
  float e = easeCubicOut(u);
  vec2 p = mix(aPosA, aPosB, e);
  vec4 c = mix(aColA, aColB, e);
  float s = mix(aSizeA, aSizeB, e);
  vec2 clip = (p / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = max(s, 0.0) * uDpr;
  vColor = c;
}`;

const FRAG = `
precision mediump float;
varying vec4 vColor;
void main() {
  vec2 d = gl_PointCoord - vec2(0.5);
  float dist = length(d) * 2.0;
  float alpha = (1.0 - smoothstep(0.82, 1.0, dist)) * vColor.a;
  if (alpha < 0.004) discard;
  gl_FragColor = vec4(vColor.rgb * alpha, alpha); // premultiplied
}`;

function easeCubicOutJs(x) {
  const p = 1 - x;
  return 1 - p * p * p;
}

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh));
  }
  return sh;
}

/**
 * A "state" is the full per-identity target set:
 *   { x, y: Float32Array(N), color: Float32Array(4N) rgba 0..1, size: Float32Array(N) }
 */
export function createEngine(canvas, N) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
  });
  if (!gl) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(prog));
  }
  gl.useProgram(prog);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const loc = {
    aPosA: gl.getAttribLocation(prog, 'aPosA'),
    aPosB: gl.getAttribLocation(prog, 'aPosB'),
    aColA: gl.getAttribLocation(prog, 'aColA'),
    aColB: gl.getAttribLocation(prog, 'aColB'),
    aSizeA: gl.getAttribLocation(prog, 'aSizeA'),
    aSizeB: gl.getAttribLocation(prog, 'aSizeB'),
    aStagger: gl.getAttribLocation(prog, 'aStagger'),
    uT: gl.getUniformLocation(prog, 'uT'),
    uStagger: gl.getUniformLocation(prog, 'uStagger'),
    uRes: gl.getUniformLocation(prog, 'uRes'),
    uDpr: gl.getUniformLocation(prog, 'uDpr'),
  };

  // CPU-side copies of the A and B states (interleaved as separate arrays).
  const A = { pos: new Float32Array(N * 2), color: new Float32Array(N * 4), size: new Float32Array(N) };
  const B = { pos: new Float32Array(N * 2), color: new Float32Array(N * 4), size: new Float32Array(N) };

  // Per-unit stagger offsets: a deterministic hash of identity, so replays
  // are identical and scrubbing backwards mirrors forwards.
  const stagger = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let h = i * 2654435761 % 4294967296;
    h = (h ^ (h >> 16)) >>> 0;
    stagger[i] = (h % 1000) / 999;
  }

  function makeBuf(data, dynamic) {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
    return b;
  }

  const buf = {
    posA: makeBuf(A.pos, true), posB: makeBuf(B.pos, true),
    colA: makeBuf(A.color, true), colB: makeBuf(B.color, true),
    sizeA: makeBuf(A.size, true), sizeB: makeBuf(B.size, true),
    stagger: makeBuf(stagger, false),
  };

  function attach(b, l, comps) {
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.enableVertexAttribArray(l);
    gl.vertexAttribPointer(l, comps, gl.FLOAT, false, 0, 0);
  }
  attach(buf.posA, loc.aPosA, 2);
  attach(buf.posB, loc.aPosB, 2);
  attach(buf.colA, loc.aColA, 4);
  attach(buf.colB, loc.aColB, 4);
  attach(buf.sizeA, loc.aSizeA, 1);
  attach(buf.sizeB, loc.aSizeB, 1);
  attach(buf.stagger, loc.aStagger, 1);

  function upload(which) {
    const s = which === 'A' ? A : B;
    gl.bindBuffer(gl.ARRAY_BUFFER, which === 'A' ? buf.posA : buf.posB);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, s.pos);
    gl.bindBuffer(gl.ARRAY_BUFFER, which === 'A' ? buf.colA : buf.colB);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, s.color);
    gl.bindBuffer(gl.ARRAY_BUFFER, which === 'A' ? buf.sizeA : buf.sizeB);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, s.size);
  }

  let t = 1;                // current interpolation position
  let stag = 0.35;          // stagger fraction for the current transition
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let cssW = 0, cssH = 0;
  let raf = null;
  let anim = null;          // {start, duration, onDone}
  let dirty = true;

  function writeState(dst, state) {
    for (let i = 0; i < N; i++) {
      dst.pos[i * 2] = state.x[i];
      dst.pos[i * 2 + 1] = state.y[i];
      dst.size[i] = state.size[i];
    }
    dst.color.set(state.color);
  }

  // Freeze the current interpolated values into A (the retarget step).
  function bakeCurrentIntoA() {
    if (t >= 1) { A.pos.set(B.pos); A.color.set(B.color); A.size.set(B.size); return; }
    if (t <= 0) return; // A already is the current state
    const span = Math.max(1 - stag, 0.0001);
    for (let i = 0; i < N; i++) {
      const u = Math.min(Math.max((t - stagger[i] * stag) / span, 0), 1);
      const e = easeCubicOutJs(u);
      for (let c = 0; c < 2; c++) {
        A.pos[i * 2 + c] += (B.pos[i * 2 + c] - A.pos[i * 2 + c]) * e;
      }
      for (let c = 0; c < 4; c++) {
        A.color[i * 4 + c] += (B.color[i * 4 + c] - A.color[i * 4 + c]) * e;
      }
      A.size[i] += (B.size[i] - A.size[i]) * e;
    }
  }

  function render(now) {
    raf = null;
    if (anim) {
      const p = Math.min((now - anim.start) / anim.duration, 1);
      t = p;
      if (p >= 1) {
        const done = anim.onDone;
        anim = null;
        if (done) done();
      }
      dirty = true;
    }
    if (dirty) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(loc.uT, t);
      gl.uniform1f(loc.uStagger, stag);
      gl.uniform2f(loc.uRes, cssW, cssH);
      gl.uniform1f(loc.uDpr, dpr);
      gl.drawArrays(gl.POINTS, 0, N);
      dirty = false;
    }
    if (anim) schedule();
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(render);
  }

  const engine = {
    N,
    /** First paint / hard set: A = B = state, no motion. */
    setState(state) {
      writeState(A, state);
      writeState(B, state);
      upload('A'); upload('B');
      anim = null; t = 1; dirty = true;
      schedule();
    },
    /** Animated move to a new state; interrupts retarget from current values. */
    transitionTo(state, opts = {}) {
      bakeCurrentIntoA();
      writeState(B, state);
      upload('A'); upload('B');
      stag = opts.stagger !== undefined ? opts.stagger : 0.35;
      const duration = opts.duration !== undefined ? opts.duration : 750;
      if (duration <= 0) { anim = null; t = 1; dirty = true; schedule(); return; }
      anim = { start: performance.now(), duration, onDone: opts.onDone };
      t = 0; dirty = true;
      schedule();
    },
    /** Prepare a scrubbed pair; drive with setScrub(t). */
    scrubBetween(stateA, stateB, opts = {}) {
      writeState(A, stateA);
      writeState(B, stateB);
      upload('A'); upload('B');
      stag = opts.stagger !== undefined ? opts.stagger : 0.35;
      anim = null; t = 0; dirty = true;
      schedule();
    },
    setScrub(v) {
      t = Math.min(Math.max(v, 0), 1);
      anim = null; dirty = true;
      schedule();
    },
    resize(w, h) {
      cssW = w; cssH = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      dirty = true;
      schedule();
    },
    redraw() { dirty = true; schedule(); },
  };
  return engine;
}
