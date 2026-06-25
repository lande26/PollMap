import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const shaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec2 move;

#define R resolution
#define T time
#define FC gl_FragCoord.xy

float rnd(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  float a = rnd(i);
  float b = rnd(i + vec2(1.0, 0.0));
  float c = rnd(i + vec2(0.0, 1.0));
  float d = rnd(i + 1.0);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float t = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    t += a * noise(p);
    p = m * p * 1.45;
    a *= 0.5;
  }
  return t;
}

void main() {
  vec2 uv = (FC - 0.5 * R) / min(R.x, R.y);
  vec2 drift = move / max(R, vec2(1.0));
  vec2 p = uv * 1.25 + vec2(T * 0.035, -T * 0.018) + drift * 0.2;

  float n1 = fbm(p * 2.2);
  float n2 = fbm((p + vec2(3.2, -1.7)) * 1.6);
  float band = smoothstep(0.18, 0.92, n1 * 0.65 + n2 * 0.35);
  float vignette = smoothstep(1.4, 0.15, length(uv));

  vec3 base = vec3(0.04, 0.05, 0.08);
  vec3 warm = vec3(0.73, 0.54, 0.42);
  vec3 cool = vec3(0.35, 0.52, 0.56);
  vec3 highlight = mix(warm, cool, clamp(uv.x * 0.5 + 0.5, 0.0, 1.0));

  vec3 col = base;
  col += highlight * band * 0.26;
  col += warm * smoothstep(0.55, 0.98, n2) * 0.1;
  col *= vignette;

  O = vec4(col, 1.0);
}`;

function AnimatedShaderHero({
  badge,
  title,
  accentTitle,
  subtitle,
  primaryAction,
  secondaryAction,
  sideContent,
}) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl2', { antialias: true, alpha: false });
    if (!gl) return undefined;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed');
      }
      return shader;
    };

    const vertexShader = compile(
      gl.VERTEX_SHADER,
      `#version 300 es
      in vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }`,
    );
    const fragmentShader = compile(gl.FRAGMENT_SHADER, shaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Shader link failed');
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, 'position');
    const resolutionUniform = gl.getUniformLocation(program, 'resolution');
    const timeUniform = gl.getUniformLocation(program, 'time');
    const moveUniform = gl.getUniformLocation(program, 'move');

    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (now) => {
      gl.useProgram(program);
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      gl.uniform1f(timeUniform, now * 0.001);
      gl.uniform2f(moveUniform, pointerRef.current.x, pointerRef.current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameRef.current = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left - rect.width / 2,
        y: event.clientY - rect.top - rect.height / 2,
      };
    };

    resize();
    frameRef.current = window.requestAnimationFrame(render);
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.cancelAnimationFrame(frameRef.current);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,27,0.9),rgba(8,11,18,0.95))] shadow-[0_24px_64px_rgba(0,0,0,0.2)]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,14,0.18),rgba(6,8,14,0.66))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-100/20 to-transparent" />

      <div className="relative z-10 grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.82fr)] lg:px-10 lg:py-10">
        <div className="max-w-4xl">
          {badge ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(255,255,255,0.055)] px-4 py-2 text-sm font-medium text-[#f5d8b2] backdrop-blur-md"
            >
              {badge}
            </motion.div>
          ) : null}

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="max-w-4xl font-display text-[3.25rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[4.5rem] lg:text-[5.5rem]"
          >
            {title}
            {' '}
            <span className="font-accent text-[#f5dfc0]">{accentTitle}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-[1.18rem]"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            {primaryAction}
            {secondaryAction}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
        >
          {sideContent}
        </motion.div>
      </div>
    </section>
  );
}

export default AnimatedShaderHero;
