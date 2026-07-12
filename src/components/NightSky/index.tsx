import {useEffect, useRef, type ReactNode} from 'react';
import styles from './styles.module.css';

const VERT = 'attribute vec2 aPos; void main(){ gl_Position = vec4(aPos,0.0,1.0); }';

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

float hash21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }

float vnoise(vec2 p){
  vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
  float a=hash21(i); float b=hash21(i+vec2(1.0,0.0));
  float c=hash21(i+vec2(0.0,1.0)); float d=hash21(i+vec2(1.0,1.0));
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

float starLayer(vec2 uv,float density,float thr,float sp,float t){
  vec2 g=uv*density; vec2 id=floor(g); vec2 gv=fract(g)-0.5;
  float n=hash21(id); if(n<thr) return 0.0;
  vec2 off=(vec2(hash21(id+7.1),hash21(id+3.7))-0.5)*0.75;
  float d=length(gv-off);
  float core=smoothstep(0.10,0.0,d);
  float tw=0.55+0.45*sin(t*sp+n*40.0);
  return core*tw*smoothstep(thr,1.0,n);
}

float triC(vec2 p,vec2 a,vec2 b,vec2 c){
  float d1=(p.x-b.x)*(a.y-b.y)-(a.x-b.x)*(p.y-b.y);
  float d2=(p.x-c.x)*(b.y-c.y)-(b.x-c.x)*(p.y-c.y);
  float d3=(p.x-a.x)*(c.y-a.y)-(c.x-a.x)*(p.y-a.y);
  float mn=min(min(d1,d2),d3); float mx=max(max(d1,d2),d3);
  return (mn>=0.0||mx<=0.0)?1.0:0.0;
}
float quadC(vec2 p,vec2 a,vec2 b,vec2 c,vec2 d){
  float s1=(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x);
  float s2=(c.x-b.x)*(p.y-b.y)-(c.y-b.y)*(p.x-b.x);
  float s3=(d.x-c.x)*(p.y-c.y)-(d.y-c.y)*(p.x-c.x);
  float s4=(a.x-d.x)*(p.y-d.y)-(a.y-d.y)*(p.x-d.x);
  float mn=min(min(s1,s2),min(s3,s4));
  float mx=max(max(s1,s2),max(s3,s4));
  return (mn>=0.0||mx<=0.0)?1.0:0.0;
}

float boatShape(vec2 b){
  // hull: trapezoid, wide flat deck up top narrowing to a flat bottom ( \____/ )
  float hull=quadC(b,vec2(-0.85,0.32),vec2(0.85,0.32),vec2(0.42,-0.05),vec2(-0.42,-0.05));
  // tall mast
  float mast=(abs(b.x)<0.022 && b.y>0.30 && b.y<1.5)?1.0:0.0;
  // mainsail (aft, large triangle): masthead, tack at boom, clew
  float mainsail=triC(b,vec2(0.03,1.46),vec2(0.03,0.30),vec2(0.62,0.30));
  // jib (forward, smaller triangle): head on forestay, tack near bow
  float jib=triC(b,vec2(-0.02,1.12),vec2(-0.02,0.30),vec2(-0.52,0.28));
  return clamp(hull+mast+mainsail+jib,0.0,1.0);
}

void main(){
  vec2 frag=gl_FragCoord.xy; vec2 uv=frag/uRes;
  vec2 p=(frag-0.5*uRes)/uRes.y; float t=uTime;
  float horizon=-0.05;
  vec3 skyTop=vec3(0.012,0.030,0.075);
  vec3 skyHor=vec3(0.055,0.115,0.235);
  vec3 seaHi=vec3(0.070,0.150,0.250);
  vec3 seaLo=vec3(0.020,0.050,0.100);
  vec3 moonC=vec3(0.98,0.93,0.78);
  vec3 glowC=vec3(0.90,0.82,0.60);
  vec2 moonPos=vec2(0.42,0.24);

  // sky gradient
  float skyT=clamp((p.y-horizon)/0.55,0.0,1.0);
  vec3 sky=mix(skyHor,skyTop,skyT);
  float hg=exp(-abs(p.x-moonPos.x)*1.4)*exp(-abs(p.y-horizon)*5.0);
  sky+=glowC*hg*0.10;

  // stars (three depth layers), fade toward horizon
  vec2 suv=uv*vec2(uRes.x/uRes.y,1.0);
  float sf=0.0;
  sf+=starLayer(suv,14.0,0.86,2.2,t)*0.9;
  sf+=starLayer(suv,26.0,0.90,3.1,t+1.7)*0.7;
  sf+=starLayer(suv,44.0,0.93,4.3,t+4.0)*0.5;
  float skyMask=smoothstep(horizon-0.02,horizon+0.10,p.y);
  sky+=vec3(0.85,0.90,1.0)*sf*skyMask;

  // moon
  float md=length(p-moonPos);
  float disc=smoothstep(0.088,0.083,md);
  vec2 shPos=moonPos+vec2(0.030,0.020);
  float shd=smoothstep(0.086,0.081,length(p-shPos));
  float crescent=clamp(disc-shd,0.0,1.0);
  float glow=exp(-md*13.0)*0.55+exp(-md*4.5)*0.14;
  sky+=glowC*glow;

  // sea: fine horizontal wave streaks catching the moonlight
  float depth=clamp((horizon-p.y)/0.55,0.0,1.0);
  vec3 sea=mix(seaHi,seaLo,depth);
  float fy=mix(70.0,20.0,depth);
  vec2 q=vec2(p.x*3.0, p.y*fy);
  float h=vnoise(q+vec2(t*0.12,-t*0.7));
  h+=0.50*vnoise(q*2.1+vec2(-t*0.09,-t*1.1));
  h+=0.25*vnoise(q*4.3+vec2(t*0.05,-t*1.5));
  h/=1.75;
  float crest=smoothstep(0.52,0.78,h);
  float fine=smoothstep(0.62,0.72,h);
  float lit=exp(-abs(p.x-moonPos.x)*0.9)*exp(-depth*1.6);
  float ambient=exp(-depth*2.2)*0.4+0.25;
  vec3 glint=mix(vec3(0.50,0.68,0.82),moonC,lit);
  sea+=glint*crest*(0.10+0.55*lit)*ambient;
  sea+=moonC*fine*lit*0.5;
  sea=mix(sea,seaLo,smoothstep(0.45,0.0,h)*0.22);
  float rx=abs(p.x-moonPos.x+(h-0.5)*0.10);
  float band=smoothstep(0.05+depth*0.30,0.0,rx);
  sea+=moonC*band*exp(-depth*2.6)*(0.25+0.75*crest)*0.5;

  // compose (living horizon line)
  float hw=0.004*sin(p.x*9.0-t*0.7);
  float seaMask=smoothstep(horizon+0.004+hw,horizon-0.004+hw,p.y);
  vec3 col=mix(sky,sea,seaMask);
  col=mix(col,moonC,crescent);

  // sailboat + reflection, rendered in-scene so it sits on the water
  vec2 bp=vec2(0.40,horizon); float bs=0.075;
  float aboveW=step(horizon,p.y);
  vec2 bl=(p-bp)/bs;
  float boat=boatShape(bl);
  col=mix(col,vec3(0.0),boat*aboveW);
  vec2 br=vec2((p.x-bp.x)/bs+(h-0.5)*0.7, -(p.y-horizon)/bs);
  float boatR=boatShape(br);
  float rfade=exp(-(horizon-p.y)*7.0);
  col=mix(col,vec3(0.0),boatR*(1.0-aboveW)*rfade*0.6);

  // subtle vignette
  col*=1.0-0.25*pow(length(uv-0.5),2.2);
  gl_FragColor=vec4(col,1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-console
    console.error(gl.getShaderInfoLog(s));
  }
  return s;
}

export default function NightSky(): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;

    const glCtx = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    // No WebGL: the CSS gradient fallback on the canvas stays visible.
    if (!glCtx) return;
    const gl: WebGLRenderingContext = glCtx;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    let running = true;
    let raf = 0;
    function frame(ts: number) {
      if (!running) return;
      gl.uniform1f(uTime, ts * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }

    let io: IntersectionObserver | null = null;
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    if (reduce) {
      // Single still frame, no animation loop.
      gl.uniform1f(uTime, 8.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              if (!running) {
                running = true;
                raf = requestAnimationFrame(frame);
              }
            } else {
              running = false;
            }
          });
        },
        {threshold: 0},
      );
      io.observe(canvas);
      document.addEventListener('visibilitychange', onVisibility);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      io?.disconnect();
      const ext = gl.getExtension('WEBGL_lose_context');
      ext?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.sky} aria-hidden="true" />;
}
