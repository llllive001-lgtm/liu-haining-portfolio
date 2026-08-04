import{r as h,j as Q}from"./index-Cwxkp7ey.js";const ee=`#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}`,oe=`#version 300 es
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
void main(){vec4 color=vec4(0.0);mainImage(color,gl_FragCoord.xy);fragColor=color;}`,g=r=>{const u=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r);return u?[parseInt(u[1],16)/255,parseInt(u[2],16)/255,parseInt(u[3],16)/255]:[1,1,1]},G=(r,u,s)=>{const f=r.createShader(u);return r.shaderSource(f,s),r.compileShader(f),r.getShaderParameter(f,r.COMPILE_STATUS)?f:(r.deleteShader(f),null)},re=({timeSpeed:r=.25,colorBalance:u=0,warpStrength:s=1,warpFrequency:f=5,warpSpeed:W=2,warpAmplitude:E=50,blendAngle:P=0,blendSoftness:q=.05,rotationAmount:I=500,noiseScale:L=2,grainAmount:M=.1,grainScale:O=2,grainAnimated:U=!1,contrast:_=1.5,gamma:N=1,saturation:X=1,centerX:j=0,centerY:z=0,zoom:D=.9,color1:Z="#FF9FFC",color2:V="#5227FF",color3:Y="#B497CF",className:k=""})=>{const p=h.useRef(null),A=h.useRef({});return A.current={timeSpeed:r,colorBalance:u,warpStrength:s,warpFrequency:f,warpSpeed:W,warpAmplitude:E,blendAngle:P,blendSoftness:q,rotationAmount:I,noiseScale:L,grainAmount:M,grainScale:O,grainAnimated:U,contrast:_,gamma:N,saturation:X,centerX:j,centerY:z,zoom:D,color1:Z,color2:V,color3:Y},h.useEffect(()=>{const c=p.current;if(!c)return;const n=document.createElement("canvas"),e=n.getContext("webgl2",{alpha:!0,antialias:!1,powerPreference:"low-power"});if(!e){c.classList.add("grainient-container--fallback");return}const d=G(e,e.VERTEX_SHADER,ee),v=G(e,e.FRAGMENT_SHADER,oe);if(!d||!v)return;const a=e.createProgram();if(e.attachShader(a,d),e.attachShader(a,v),e.linkProgram(a),!e.getProgramParameter(a,e.LINK_STATUS))return;e.useProgram(a);const x=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,x),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const C=e.getAttribLocation(a,"position");e.enableVertexAttribArray(C),e.vertexAttribPointer(C,2,e.FLOAT,!1,0,0);const H=o=>e.getUniformLocation(a,o),t=Object.fromEntries(["iResolution","iTime","uTimeSpeed","uColorBalance","uWarpStrength","uWarpFrequency","uWarpSpeed","uWarpAmplitude","uBlendAngle","uBlendSoftness","uRotationAmount","uNoiseScale","uGrainAmount","uGrainScale","uGrainAnimated","uContrast","uGamma","uSaturation","uCenterOffset","uZoom","uColor1","uColor2","uColor3"].map(o=>[o,H(o)]));c.appendChild(n);const R=()=>{const o=c.getBoundingClientRect(),m=Math.min(window.devicePixelRatio||1,1.15);n.width=Math.max(1,Math.floor(o.width*m)),n.height=Math.max(1,Math.floor(o.height*m)),e.viewport(0,0,n.width,n.height),e.uniform2f(t.iResolution,n.width,n.height)},y=new ResizeObserver(R);y.observe(c),R();const $=performance.now(),b=window.matchMedia("(prefers-reduced-motion: reduce)").matches,F=b?.22:1,K=1e3/(b?20:30);let i=0,l=!0,w=0,T=null;const J=o=>{o!==T&&(T=o,e.uniform1f(t.uTimeSpeed,o.timeSpeed*F),e.uniform1f(t.uColorBalance,o.colorBalance),e.uniform1f(t.uWarpStrength,o.warpStrength),e.uniform1f(t.uWarpFrequency,o.warpFrequency),e.uniform1f(t.uWarpSpeed,o.warpSpeed),e.uniform1f(t.uWarpAmplitude,o.warpAmplitude),e.uniform1f(t.uBlendAngle,o.blendAngle),e.uniform1f(t.uBlendSoftness,o.blendSoftness),e.uniform1f(t.uRotationAmount,o.rotationAmount),e.uniform1f(t.uNoiseScale,o.noiseScale),e.uniform1f(t.uGrainAmount,o.grainAmount),e.uniform1f(t.uGrainScale,o.grainScale),e.uniform1f(t.uGrainAnimated,o.grainAnimated?F:0),e.uniform1f(t.uContrast,o.contrast),e.uniform1f(t.uGamma,o.gamma),e.uniform1f(t.uSaturation,o.saturation),e.uniform2f(t.uCenterOffset,o.centerX,o.centerY),e.uniform1f(t.uZoom,o.zoom),e.uniform3fv(t.uColor1,g(o.color1)),e.uniform3fv(t.uColor2,g(o.color2)),e.uniform3fv(t.uColor3,g(o.color3)))},S=o=>{if(o-w>=K){const m=A.current;e.useProgram(a),J(m),e.uniform1f(t.iTime,(o-$)*.001),e.drawArrays(e.TRIANGLES,0,3),w=o}i=l?requestAnimationFrame(S):0},B=()=>{l=!document.hidden,l&&!i&&(i=requestAnimationFrame(S)),!l&&i&&(cancelAnimationFrame(i),i=0)};return document.addEventListener("visibilitychange",B),i=requestAnimationFrame(S),()=>{l=!1,i&&cancelAnimationFrame(i),y.disconnect(),document.removeEventListener("visibilitychange",B),n.remove(),e.deleteBuffer(x),e.deleteProgram(a),e.deleteShader(d),e.deleteShader(v)}},[]),Q.jsx("div",{ref:p,className:`grainient-container ${k}`.trim()})};export{re as default};
