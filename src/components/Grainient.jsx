import { useEffect, useRef } from "react";
import "./Grainient.css";

const vertexShader = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}`;

const fragmentShader = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i),f),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0)),f-vec2(1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o,vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);
  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;
  float frequency=uWarpFrequency;
  float amplitude=uWarpAmplitude/max(uWarpStrength,0.001);
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  float blendX=(tuv*Rot(radians(uBlendAngle))).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  vec3 layer1=mix(uColor3,uColor2,S(edge0,edge1,blendX));
  vec3 layer2=mix(uColor2,uColor1,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(0.5-b+s,-0.3-b-s,tuv.y));
  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;
  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  o=vec4(clamp(col,0.0,1.0),1.0);
}
void main(){vec4 color=vec4(0.0);mainImage(color,gl_FragCoord.xy);fragColor=color;}`;

const hexToRgb = (hex) => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255]
    : [1, 1, 1];
};

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const Grainient = ({
  timeSpeed = 0.25,
  colorBalance = 0,
  warpStrength = 1,
  warpFrequency = 5,
  warpSpeed = 2,
  warpAmplitude = 50,
  blendAngle = 0,
  blendSoftness = 0.05,
  rotationAmount = 500,
  noiseScale = 2,
  grainAmount = 0.1,
  grainScale = 2,
  grainAnimated = false,
  contrast = 1.5,
  gamma = 1,
  saturation = 1,
  centerX = 0,
  centerY = 0,
  zoom = 0.9,
  color1 = "#FF9FFC",
  color2 = "#5227FF",
  color3 = "#B497CF",
  className = "",
}) => {
  const containerRef = useRef(null);
  const propsRef = useRef({});

  propsRef.current = { timeSpeed, colorBalance, warpStrength, warpFrequency, warpSpeed, warpAmplitude, blendAngle, blendSoftness, rotationAmount, noiseScale, grainAmount, grainScale, grainAnimated, contrast, gamma, saturation, centerX, centerY, zoom, color1, color2, color3 };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) {
      container.classList.add("grainient-container--fallback");
      return undefined;
    }
    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return undefined;
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniform = (name) => gl.getUniformLocation(program, name);
    const uniforms = Object.fromEntries(["iResolution", "iTime", "uTimeSpeed", "uColorBalance", "uWarpStrength", "uWarpFrequency", "uWarpSpeed", "uWarpAmplitude", "uBlendAngle", "uBlendSoftness", "uRotationAmount", "uNoiseScale", "uGrainAmount", "uGrainScale", "uGrainAnimated", "uContrast", "uGamma", "uSaturation", "uCenterOffset", "uZoom", "uColor1", "uColor2", "uColor3"].map((name) => [name, uniform(name)]));
    container.appendChild(canvas);
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    const startedAt = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId = 0;
    let running = true;
    const draw = (now) => {
      const p = propsRef.current;
      gl.useProgram(program);
      gl.uniform1f(uniforms.iTime, (now - startedAt) * 0.001);
      gl.uniform1f(uniforms.uTimeSpeed, reduceMotion ? 0 : p.timeSpeed);
      gl.uniform1f(uniforms.uColorBalance, p.colorBalance);
      gl.uniform1f(uniforms.uWarpStrength, p.warpStrength);
      gl.uniform1f(uniforms.uWarpFrequency, p.warpFrequency);
      gl.uniform1f(uniforms.uWarpSpeed, p.warpSpeed);
      gl.uniform1f(uniforms.uWarpAmplitude, p.warpAmplitude);
      gl.uniform1f(uniforms.uBlendAngle, p.blendAngle);
      gl.uniform1f(uniforms.uBlendSoftness, p.blendSoftness);
      gl.uniform1f(uniforms.uRotationAmount, p.rotationAmount);
      gl.uniform1f(uniforms.uNoiseScale, p.noiseScale);
      gl.uniform1f(uniforms.uGrainAmount, p.grainAmount);
      gl.uniform1f(uniforms.uGrainScale, p.grainScale);
      gl.uniform1f(uniforms.uGrainAnimated, p.grainAnimated && !reduceMotion ? 1 : 0);
      gl.uniform1f(uniforms.uContrast, p.contrast);
      gl.uniform1f(uniforms.uGamma, p.gamma);
      gl.uniform1f(uniforms.uSaturation, p.saturation);
      gl.uniform2f(uniforms.uCenterOffset, p.centerX, p.centerY);
      gl.uniform1f(uniforms.uZoom, p.zoom);
      gl.uniform3fv(uniforms.uColor1, hexToRgb(p.color1));
      gl.uniform3fv(uniforms.uColor2, hexToRgb(p.color2));
      gl.uniform3fv(uniforms.uColor3, hexToRgb(p.color3));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frameId = reduceMotion || !running ? 0 : requestAnimationFrame(draw);
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running && !frameId && !reduceMotion) frameId = requestAnimationFrame(draw);
      if (!running && frameId) cancelAnimationFrame(frameId);
    };
    document.addEventListener("visibilitychange", onVisibility);
    frameId = requestAnimationFrame(draw);
    return () => {
      running = false;
      if (frameId) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.remove();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <div ref={containerRef} className={`grainient-container ${className}`.trim()} />;
};

export default Grainient;
