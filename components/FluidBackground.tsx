"use client";

import { useEffect, useRef } from "react";

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      if (!canvas || !gl) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    resize();
    window.addEventListener("resize", resize);

    // ---------------- shaders ----------------
    const vertexSrc = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos,0.0,1.0);
      }
    `;

    // fragment shader: 高度场 + 张力 + 阻尼 + 鼠标扰动
    const fragmentSrc = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uPrevHeight;
      uniform vec3 uWaves[16]; // x,y,startTime
      uniform float uTime;

      float mushroom(vec2 uv, vec2 c, float t) {
        vec2 p = uv - c;
        float d = length(p);

        float rise = exp(-d * 12.0) * exp(-t * 3.0);          // 距离衰减加快，时间衰减加快
        float cap  = sin(40.0*(d - t*0.7)) * exp(-20.0*abs(d - t*0.7)); // 波纹更密集、传播快
        float stem = exp(-d * 40.0) * (1.0 - smoothstep(0.0,0.2,t));   // stem 更小

        return stem*0.6 + cap*0.2 + rise*p.y*1.0;             // 缩小整体幅度
      }

      void main() {
        float h = texture2D(uPrevHeight, vUv).r;

        // 累加历史波纹
        for (int i=0; i<16; i++) {
          float t = uTime - uWaves[i].z;
          if(t>0.0){
            h += mushroom(vUv, uWaves[i].xy, t);
          }
        }

        // 渲染灰度流体
        gl_FragColor = vec4(vec3(0.5 + h*0.5), 1.0);
      }
    `;

    function compile(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, vertexSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posLoc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // ---------------- FBO ----------------
    function createFBO() {
      if (!gl) throw new Error("WebGL not initialized");
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        tex,
        0,
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      return { fbo, tex };
    }

    let ping = createFBO();
    let pong = createFBO();

    const uPrevHeight = gl.getUniformLocation(prog, "uPrevHeight");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uWaves = gl.getUniformLocation(prog, "uWaves");

    const MAX_WAVES = 16;
    const waves = new Array(MAX_WAVES).fill(0).map(() => [0, 0, -100]);
    let waveIndex = 0;

    function addWave(x: number, y: number) {
      waves[waveIndex][0] = x;
      waves[waveIndex][1] = y;
      waves[waveIndex][2] = performance.now() * 0.001;
      waveIndex = (waveIndex + 1) % MAX_WAVES;
    }

    window.addEventListener("mousemove", (e) => {
      addWave(e.clientX / width, 1 - e.clientY / height);
    });

    function loop() {
      if (!gl) return;
      const t = performance.now() * 0.001;

      gl.bindFramebuffer(gl.FRAMEBUFFER, pong.fbo);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, ping.tex);
      gl.uniform1i(uPrevHeight, 0);
      gl.uniform1f(uTime, t);
      gl.uniform3fv(uWaves, new Float32Array(waves.flat()));

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // 渲染到屏幕
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, pong.tex);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      [ping, pong] = [pong, ping];
      requestAnimationFrame(loop);
    }

    loop();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
}
