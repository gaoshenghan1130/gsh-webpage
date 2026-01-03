"use client";

import { useEffect, useRef } from "react";

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true });
    if (!gl) return;

    /* ------------------ resize ------------------ */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      if (!canvas) throw new Error("Canvas not found");
      if (!gl) throw new Error("WebGL context not available");
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener("resize", resize);

    /* ------------------ shaders ------------------ */
    const vertex = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    const fragment = `
      precision highp float;
      varying vec2 vUv;
      uniform vec2 uMouse;
      uniform float uTime;

      float noise(vec2 p) {
        return sin(p.x * 10.0) * sin(p.y * 10.0);
      }

      void main() {
        vec2 uv = vUv;
        vec2 m = uMouse;
        float d = distance(uv, m);

        float wave = sin(d * 30.0 - uTime * 3.0);
        float strength = exp(-d * 10.0);

        vec3 col = vec3(
          0.1 + strength * wave,
          0.3 + strength,
          0.6 + strength * 0.5
        );

        gl_FragColor = vec4(col, 0.3); // 增加透明度，让视频/背景能透出
      }
    `;

    function compileShader(type: number, src: string) {
      if (!gl) throw new Error("WebGL context not available");
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertex);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragment);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    /* ------------------ quad ------------------ */
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const pos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uTime = gl.getUniformLocation(program, "uTime");

    /* ------------------ mouse ------------------ */
    let mx = 0.5;
    let my = 0.5;

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX / window.innerWidth;
      my = 1 - e.clientY / window.innerHeight;
    }
    window.addEventListener("mousemove", onMouseMove);

    /* ------------------ loop ------------------ */
    const start = performance.now();
    let raf = 0;

    function loop(t: number) {
      if (!gl) throw new Error("WebGL context not available");
      gl.uniform1f(uTime, (t - start) * 0.001);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    }

    loop(start);

    /* ------------------ cleanup ------------------ */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-gray-900"
    />
  );
}
