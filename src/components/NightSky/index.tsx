import {useEffect, useRef, type ReactNode} from 'react';
import styles from './styles.module.css';

const VERT = 'attribute vec2 aPos; void main(){ gl_Position = vec4(aPos,0.0,1.0); }';

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

const float HORIZON=-0.05;
const vec3 MOON_C=vec3(0.98,0.93,0.78);
const vec3 GLOW_C=vec3(0.90,0.82,0.60);
const vec3 LAMP_C=vec3(1.00,0.72,0.36);
const float MOON_R=0.050;
const float BOAT_S=0.084;
// Sea slopes: S0 is the glint size (the moon's own width), VAR the slope
// variance of the full wave field, SLOPE scales the noise to match VAR.
const float S0=0.05;
const float VAR=0.020;
const float SLOPE=0.18;

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

// Sky colour at height e above the horizon (screen units), with a haze band.
vec3 skyGrad(float e){
  vec3 c=mix(vec3(0.046,0.094,0.190),vec3(0.010,0.024,0.062),pow(clamp(e/0.55,0.0,1.0),0.75));
  return c+vec3(0.030,0.045,0.070)*exp(-e*18.0);
}

// Wave height on the sea plane. w is (across, away) in camera heights; k fades
// each octave out once it gets smaller than a pixel.
float seaH(vec2 w,float t,vec4 k){
  float h=0.0;
  h+=k.x*0.50*vnoise(vec2(w.x*0.72,w.y*1.3)+vec2(t*0.10,t*0.35));
  h+=k.y*0.26*vnoise(vec2(w.x*1.6,w.y*2.9)+vec2(-t*0.14,t*0.55));
  h+=k.z*0.13*vnoise(vec2(w.x*3.4,w.y*6.1)+vec2(t*0.20,t*0.80));
  h+=k.w*0.07*vnoise(vec2(w.x*7.2,w.y*13.0)+vec2(-t*0.27,t*1.10));
  return h;
}

float seg(vec2 p,vec2 a,vec2 b){
  vec2 pa=p-a; vec2 ba=b-a;
  return length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0));
}

// Sloop seen side-on, bow to the left, waterline at y=0, about 1.8 long.
// Returns (hull and rigging, sails, lamps, moonlit deck edge). aa is one pixel.
vec4 boat(vec2 b,float aa){
  float x=b.x; float y=b.y;
  const float MX=-0.08;
  // hull: sheer line on top, raked bow and a short stern overhang below
  float top=0.17+0.07*x*x+0.05*max(-x,0.0)*max(-x,0.0);
  float bot=max((-0.70-x)*0.97,(x-0.62)*0.6);
  float hull=smoothstep(-aa,aa,top-y)*smoothstep(-aa,aa,y-bot)
    *smoothstep(-aa,aa,x+1.0)*smoothstep(-aa,aa,0.80-x);
  float ch=0.085*smoothstep(-0.40,-0.20,x)*smoothstep(0.30,0.24,x);
  float cabin=smoothstep(-aa,aa,top+ch-y)*smoothstep(-aa,aa,y-top+0.02)*step(0.002,ch);
  // spars and stays, never thinner than a pixel
  float mw=max(0.012,aa*0.7);
  float mast=smoothstep(mw+aa,mw-aa*0.2,abs(x-MX))*smoothstep(-aa,aa,y-0.2)*smoothstep(-aa,aa,1.84-y);
  float boom=smoothstep(mw+aa,mw-aa*0.2,seg(b,vec2(MX,0.42),vec2(0.64,0.40)));
  float lw=max(0.005,aa*0.45);
  float stay=0.55*smoothstep(lw+aa,lw,min(
    seg(b,vec2(-0.97,0.29),vec2(MX,1.55)),
    seg(b,vec2(MX,1.84),vec2(0.78,0.22))));
  float body=clamp(max(max(hull,cabin),max(max(mast,boom),stay)),0.0,1.0);
  // mainsail with a curved leech, jib set just aft of the forestay
  float tm=clamp((y-0.45)/1.33,0.0,1.0);
  float leech=mix(0.61,MX+0.02,tm)+0.075*sin(3.14159*tm)*(1.0-0.35*tm);
  float mainS=smoothstep(-aa,aa,x-MX-mw)*smoothstep(-aa,aa,leech-x)
    *smoothstep(-aa,aa,y-0.45)*smoothstep(-aa,aa,1.78-y);
  float tj=clamp((y-0.30)/1.23,0.0,1.0);
  float luff=mix(-0.943,MX+0.007,tj);
  float jleech=mix(-0.17,MX-0.03,tj)-0.05*sin(3.14159*tj);
  float jib=smoothstep(-aa,aa,x-luff)*smoothstep(-aa,aa,jleech-x)*smoothstep(-aa,aa,y-0.34);
  float sail=max(mainS,jib);
  // two cabin windows and a masthead light
  vec2 wq=vec2(abs(x+0.03)-0.10,y-top-0.045);
  float win=smoothstep(aa,-aa,max(abs(wq.x)-0.05,abs(wq.y)-0.016));
  float lamp=win+0.8*smoothstep(0.035,0.0,length(b-vec2(MX,1.86)));
  float rim=hull*smoothstep(0.035,0.0,top-y);
  return vec4(body,sail,lamp,rim);
}

void main(){
  vec2 frag=gl_FragCoord.xy; vec2 uv=frag/uRes;
  vec2 p=(frag-0.5*uRes)/uRes.y; float t=uTime;
  float px=1.5/uRes.y;
  // keep the moon and the boat on screen on narrow viewports
  vec2 moonPos=vec2(min(0.40,0.5*uRes.x/uRes.y-0.24),0.25);
  float e=p.y-HORIZON;

  // sky, with moonlit haze above the horizon
  vec3 sky=skyGrad(max(e,0.0));
  sky+=GLOW_C*0.05*exp(-abs(p.x-moonPos.x)*2.2)*exp(-max(e,0.0)*9.0);

  // crescent moon: a disc minus an offset disc, glow centred on the lit limb
  vec2 shOff=vec2(0.019,0.013);
  float md=length(p-moonPos);
  float disc=smoothstep(MOON_R+px,MOON_R-px,md);
  float shd=smoothstep(MOON_R*0.98+px,MOON_R*0.98-px,length(p-moonPos-shOff));
  float crescent=clamp(disc-shd,0.0,1.0);
  float gd=length(p-moonPos+shOff*1.6);
  float glow=exp(-gd*20.0)*0.30+exp(-gd*5.5)*0.10;

  // stars (three depth layers), dimmed by haze, the glow and the moon's disc
  vec2 suv=uv*vec2(uRes.x/uRes.y,1.0);
  float sf=0.0;
  sf+=starLayer(suv,14.0,0.86,2.2,t)*0.9;
  sf+=starLayer(suv,26.0,0.90,3.1,t+1.7)*0.7;
  sf+=starLayer(suv,44.0,0.93,4.3,t+4.0)*0.5;
  sky+=vec3(0.85,0.90,1.0)*sf*smoothstep(0.0,0.16,e)*(1.0-disc)*(1.0-clamp(glow*2.5,0.0,1.0));

  float dark=disc*(1.0-crescent);
  sky+=GLOW_C*glow*(1.0-0.15*dark);
    sky=mix(sky,MOON_C*(0.90+0.10*vnoise((p-moonPos)*70.0)),crescent);

  // sea: a flat plane seen in perspective, shaded from its wave slopes
  float dy=max(-e,0.0008);
  float z=1.0/dy;
  vec2 w=vec2(p.x*z,z);
  float fz=z*z/uRes.y; // how much sea one pixel covers
  vec4 k=1.0-smoothstep(0.12,0.45,fz*vec4(1.3,2.9,6.1,13.0));
  float ep=0.02+fz;
  float h0=seaH(w,t,k);
  vec2 s=vec2(seaH(w+vec2(ep,0.0),t,k)-h0,seaH(w+vec2(0.0,ep),t,k)-h0)/ep*SLOPE;
  // slow wind patches roughen some stretches of water more than others
  float gust=vnoise(vec2(w.x*0.05,w.y*0.16)+vec2(t*0.015,t*0.03));
  gust=mix(0.5,gust,1.0-smoothstep(0.15,0.5,fz*0.16));
  // waves too small to draw still scatter light, so they widen the highlight
  float lost=dot(1.0-k*k,vec4(0.25))*VAR*(0.6+0.8*gust);

  vec3 d=normalize(vec3(p.x,-dy,1.0));
  vec3 m=normalize(vec3(moonPos.x,moonPos.y-HORIZON,1.0));
  vec3 n=normalize(vec3(-s.x,1.0,-s.y));
  float fres=0.04+0.96*pow(1.0-max(dot(-d,n),0.0),5.0);
  vec3 r=reflect(d,n);
  float rz=max(r.z,0.2);
  float re=max(r.y,0.0)/rz;
  vec3 refl=skyGrad(re)*(0.78+0.24*gust);
  refl+=GLOW_C*0.10*exp(-abs(r.x/rz-moonPos.x)*3.0)*exp(-abs(re-m.y/m.z)*3.0);
  vec3 sea=mix(vec3(0.006,0.016,0.036),refl,fres);

  // moon glitter: lit where the wave slope mirrors the moon to the eye
  vec3 hv=normalize(m-d);
  vec2 ds=-hv.xz/hv.y-s;
  float sx2=S0*S0+0.35*lost; float sz2=S0*S0+lost;
  float glit=exp(-0.5*(ds.x*ds.x/sx2+ds.y*ds.y/sz2))*S0*S0/sqrt(sx2*sz2);
  sea+=MOON_C*glit*1.3;

  vec3 col=mix(sky,sea,smoothstep(px,-px,e));

  // sailboat on the water, rocking a little
  vec2 bp=vec2(moonPos.x+0.125,HORIZON-0.038);
  float aa=1.0/(BOAT_S*uRes.y);
  vec2 q=(p-bp)/BOAT_S;
  float above=smoothstep(-aa,aa,q.y);
  float rock=0.022*sin(t*0.7)+0.010*sin(t*1.31+1.0);
  vec2 b=vec2(q.x*cos(rock)-q.y*sin(rock),q.x*sin(rock)+q.y*cos(rock));
  vec4 bt=boat(b,aa);
  vec3 sailC=mix(vec3(0.070,0.090,0.130),vec3(0.165,0.185,0.220),0.2+0.6*smoothstep(0.3,1.7,b.y));
  sailC*=1.0-0.12*step(0.93,fract(b.y*5.5)); // panel seams
  col=mix(col,sailC,bt.y*above);
  col=mix(col,vec3(0.012,0.018,0.032)+MOON_C*0.22*bt.w,bt.x*above);
  col+=LAMP_C*bt.z*above;

  // its reflection: mirrored, smeared by the ripples, fading with depth
  float wob=vnoise(vec2(p.x*120.0,p.y*420.0-t*1.2))-0.5;
  vec4 br=boat(vec2(q.x+wob*0.10*(1.0-q.y*1.5),-q.y*0.85),aa*2.0);
  float rf=exp(q.y*0.9)*(1.0-above);
  col=mix(col,col*0.30,clamp(br.x+br.y*0.8,0.0,1.0)*rf*0.8);
  col+=LAMP_C*br.z*rf*0.5;

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

    // Refuse a CPU-emulated context: this shader is too heavy to run without a GPU.
    const glOpts = {failIfMajorPerformanceCaveat: true};
    const glCtx = (canvas.getContext('webgl', glOpts) ||
      canvas.getContext('experimental-webgl', glOpts)) as WebGLRenderingContext | null;
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
