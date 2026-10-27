import './style.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { content as c } from './content.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelector('#app').innerHTML = `
<div id="scene" aria-hidden="true"></div><div class="shade"></div><div class="grain"></div>
<header><a class="brand" href="#"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5h14L8 12h14L7 21l6-7H2l7-7H2Z" fill="currentColor"/></svg>${c.title}<sup>01</sup></a><span class="byline">A DIGITAL ESCAPE BY ${c.author.toUpperCase()}</span><a class="back" href="${c.portfolio}">BACK TO PORTFOLIO <span>↗</span></a></header>
<main><section class="hero"><div class="hero-copy"><p class="eyebrow"><i></i>${c.eyebrow}</p><h1>${c.headline[0]}<br><span>${c.headline[1]}</span></h1><p class="intro">${c.intro}</p><button class="enter" id="enter">ENTER THE CURRENT <span>↗</span></button></div><div class="coordinates"><span>EST. 2026</span><span>IMAGINATION / IN MOTION</span><span class="orbit-icon">✳</span></div><div class="hero-foot"><a href="#story">SCROLL TO GO DEEPER <span>↓</span></a><span>LIGHT. SPACE. VELOCITY.</span></div></section>
<section class="story" id="story"><p class="eyebrow">01 / THE FEELING</p><h2>Somewhere between<br><em>here</em> and <em>what’s next.</em></h2><div class="story-bottom"><p>${c.note}</p><div><span class="label">TAKE THE WHEEL</span><p>Change the atmosphere.<br>Engage warp. Lose track of time.</p><a href="${c.source}" target="_blank" rel="noopener">EXPLORE THE SOURCE ↗</a></div></div><footer><span>© 2026 ${c.author} / PERSONAL DESIGN STUDY</span><a href="./credits.html">CREDITS ↗</a></footer></section></main>
<aside class="deck" aria-label="Experience controls"><div class="worlds" aria-label="Atmosphere">${c.worlds.map((w,i)=>`<button data-world="${i}" aria-pressed="${i===0}"><span class="world-dot" style="--swatch:${w.light}"></span><span>${w.name}</span></button>`).join('')}</div><div class="drive"><button id="pause" aria-label="${reduced?'Play':'Pause'} motion">${reduced?'▶':'Ⅱ'}</button><button id="warp" aria-pressed="false"><span class="warp-icon">⏩</span><span id="warp-label">ENGAGE WARP</span></button><span class="velocity"><b id="speed">120</b><small>KM/H · SIMULATED</small></span></div></aside><button id="exit" hidden>EXIT EXPERIENCE <span>ESC ↗</span></button><div id="fallback" role="status" hidden>This experience needs WebGL. Try a browser with hardware acceleration enabled.</div>`;
// This is a personal concept, so no registered trademark claim.
document.querySelector('.brand sup').textContent = '01';
let activeWorld=0, boosted=false, paused=reduced, focused=false;
const $=s=>document.querySelector(s);
function boost(v){boosted=v;$('#warp').setAttribute('aria-pressed',v);$('#warp-label').textContent=v?'RETURN TO CRUISE':'ENGAGE WARP';document.body.classList.toggle('boosted',v);}
function focus(v){focused=v;document.body.classList.toggle('immersed',v);$('#exit').hidden=!v;if(v)$('#exit').focus();else $('#enter').focus();}
$('#enter').onclick=()=>focus(true);$('#exit').onclick=()=>focus(false);
$('#warp').onclick=()=>boost(!boosted);
$('#pause').onclick=()=>{paused=!paused;$('#pause').textContent=paused?'▶':'Ⅱ';$('#pause').setAttribute('aria-label',paused?'Play motion':'Pause motion');};
addEventListener('keydown',e=>{if(e.key==='Escape')focus(false);if(e.code==='Space'&&e.target===document.body){e.preventDefault();boost(true);}});
addEventListener('keyup',e=>{if(e.code==='Space'&&e.target===document.body)boost(false);});
addEventListener('blur',()=>boost(false));
let setWorld=()=>{};
document.querySelectorAll('[data-world]').forEach(b=>b.onclick=()=>{activeWorld=Number(b.dataset.world);document.querySelectorAll('[data-world]').forEach(x=>x.setAttribute('aria-pressed',x===b));setWorld(activeWorld);});

try { startScene(); } catch(error) { $('#fallback').hidden=false; console.error(error); }
function startScene(){
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,700);
 const renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;$('#scene').append(renderer.domElement);
 const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
 const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.8,.7,.65);composer.addPass(bloom);composer.addPass(new OutputPass());
 const lightMat=new THREE.MeshBasicMaterial({color:'#24ddff'}),pinkMat=new THREE.MeshBasicMaterial({color:'#ff338e'});
 const curve=z=>Math.sin(z*.018)*7;
 const uniforms={uLight:{value:new THREE.Color('#24ddff')},uPink:{value:new THREE.Color('#ff338e')},uTime:{value:0}};
 const road=new THREE.Mesh(new THREE.PlaneGeometry(400,650),new THREE.ShaderMaterial({uniforms,vertexShader:`varying vec3 vWorld;void main(){vec4 p=modelMatrix*vec4(position,1.);vWorld=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}`,fragmentShader:`varying vec3 vWorld;uniform vec3 uLight;uniform vec3 uPink;uniform float uTime;
 void main(){float x=vWorld.x-sin(vWorld.z*.018)*7.;float z=vWorld.z+uTime;float a=abs(x);vec3 col=vec3(.006,.007,.018);float edge=exp(-abs(a-11.)*2.4);float reflection=exp(-abs(a-11.)*.27)*.10;col+=(x>0.?uPink:uLight)*(edge*2.+reflection);float lane=exp(-abs(mod(x+2.75,5.5)-2.75)*20.)*step(a,10.5);float dash=step(.48,fract(z*.035));col+=uLight*lane*dash*.4;float cross=pow(max(0.,1.-abs(sin(z*.2))),18.);col+=uPink*cross*.035*step(11.,a);col+=uLight*exp(-abs(a-14.)*4.)*.6;float fog=exp(-max(0.,-vWorld.z)*.008);gl_FragColor=vec4(col*fog,1.);}`}));
 road.rotation.x=-Math.PI/2;road.position.set(0,-.05,-200);scene.add(road);
 // Individually recycled arches create a real, navigable depth field.
 const arches=[]; const archPoints=[];
 for(let i=0;i<=40;i++){let t=i/40*Math.PI;archPoints.push(new THREE.Vector3(Math.cos(t)*15,Math.sin(t)*19,0));}
 const archGeometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(archPoints),48,.065,5,false);
 const archSupports=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(archPoints),48,.26,6,false);
 const supportMat=new THREE.MeshBasicMaterial({color:'#080d20'});
 for(let i=0;i<18;i++){const g=new THREE.Group();g.add(new THREE.Mesh(archSupports,supportMat));const neon=new THREE.Mesh(archGeometry,i%3===0?pinkMat:lightMat);neon.position.z=.3;g.add(neon);g.userData.z=-i*19;arches.push(g);scene.add(g);}
 const rand=(a,b)=>a+Math.random()*(b-a);
 const towerBody=new THREE.MeshBasicMaterial({color:'#070b19'});
 const towerGeo=new THREE.BoxGeometry(1,1,1),towers=[];
 for(let i=0;i<100;i++){const g=new THREE.Group();const w=rand(2,6),h=rand(6,48),d=rand(2,7);const body=new THREE.Mesh(towerGeo,towerBody);body.scale.set(w,h,d);body.position.y=h/2;g.add(body);
 const neon=new THREE.Mesh(towerGeo,i%3===0?pinkMat:lightMat);neon.scale.set(.065,h,.065);neon.position.set(-w/2,h/2,d/2);g.add(neon);const top=new THREE.Mesh(towerGeo,pinkMat);top.scale.set(w,.07,.07);top.position.set(0,h,d/2);g.add(top);
 g.userData={z:rand(-370,15),x:rand(20,110)*(i%2?1:-1)};scene.add(g);towers.push(g);}
 // Light streaks live on the road; their changing length makes acceleration tangible.
 const trails=[];
 for(let i=0;i<65;i++){const m=new THREE.Mesh(towerGeo,i%2?lightMat:pinkMat);m.userData={z:rand(-330,0),x:rand(-9.6,9.6),len:rand(2,10)};m.scale.set(rand(.025,.08),.04,m.userData.len);m.position.y=.08;scene.add(m);trails.push(m);}
 const sunMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uColor:{value:new THREE.Color('#ff7652')}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 vUv;uniform vec3 uColor;void main(){vec2 p=vUv-.5;float r=length(p);float disk=1.-smoothstep(.36,.365,r);float bands=smoothstep(.06,.09,abs(sin(vUv.y*84.)));float mask=mix(bands,1.,smoothstep(.48,.7,vUv.y));float halo=exp(-r*7.)*.12;vec3 col=mix(vec3(1.,.12,.22),uColor,vUv.y)*1.4;gl_FragColor=vec4(col,disk*mask+halo);}`});
 const sun=new THREE.Mesh(new THREE.PlaneGeometry(128,128),sunMat);sun.position.set(10,34,-410);scene.add(sun);
 // Deterministic vertex stars keep the sky legible without external image assets.
 const starPos=[];for(let i=0;i<900;i++)starPos.push(rand(-250,250),rand(20,180),rand(-490,-150));
 const starsGeo=new THREE.BufferGeometry();starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({size:.28,color:'#b7b4ff',transparent:true,opacity:.65}));scene.add(stars);
 setWorld=i=>{const w=c.worlds[i];scene.background=new THREE.Color(w.sky);lightMat.color.set(w.light).multiplyScalar(1.8);pinkMat.color.set(w.second).multiplyScalar(1.7);uniforms.uLight.value.set(w.light);uniforms.uPink.value.set(w.second);sunMat.uniforms.uColor.value.set(w.sun);document.documentElement.style.setProperty('--accent',w.accent);};setWorld(activeWorld);
 let prev=performance.now(),distance=0,velocity=1,px=0,py=0;
 addEventListener('pointermove',e=>{px=e.clientX/innerWidth-.5;py=e.clientY/innerHeight-.5;});
 addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);});
 renderer.setAnimationLoop(now=>{const dt=Math.min((now-prev)/1000,.05);prev=now;if(document.hidden)return;
 velocity=THREE.MathUtils.damp(velocity,boosted?4:1,2.5,dt);if(!paused)distance+=dt*19*velocity;
 uniforms.uTime.value=distance;const scroll=Math.min(scrollY/innerHeight,1);
 camera.position.set(px*.8,3.2-scroll*.7-py*.3,11);camera.lookAt(1.3+px*.7,5-scroll*2,-95);camera.fov=THREE.MathUtils.damp(camera.fov,boosted?92:62,3,dt);camera.updateProjectionMatrix();
 arches.forEach(g=>{const z=((g.userData.z+distance)%342+342)%342-325;g.position.set(curve(z),0,z);g.rotation.y=Math.cos(z*.018)*.12;});
 towers.forEach(g=>{const z=((g.userData.z+distance*.65)%400+400)%400-380;g.position.set(g.userData.x+curve(z),0,z);});
 trails.forEach(g=>{const z=((g.userData.z+distance*1.7)%350+350)%350-330;g.position.x=curve(z)+g.userData.x;g.position.z=z;g.scale.z=g.userData.len*velocity;});
 bloom.strength=boosted?1.05:.72;$('#speed').textContent=paused?'0':Math.round(120*velocity);composer.render();
 });
 addEventListener('pagehide',()=>{renderer.setAnimationLoop(null);composer.dispose();renderer.dispose();});
}
