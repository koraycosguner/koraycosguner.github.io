"use client";
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {stations} from './content';

export default function Classroom({onSelect,onFallback,unlocked,band=false}:{onSelect:(station:string,item?:string)=>void;onFallback:()=>void;unlocked:boolean;band?:boolean}) {
 const host=useRef<HTMLDivElement>(null);const move=useRef<(x:number,z:number)=>void>(()=>{});const reset=useRef<()=>void>(()=>{});const [hover,setHover]=useState('Selecciona una persona o un objeto');const selection=useRef(onSelect);
 useEffect(()=>{selection.current=onSelect},[onSelect]);
 useEffect(()=>{
  const element=host.current!;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});}catch{onFallback();return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;renderer.setClearColor('#c1d8d1');element.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','3D classroom. Drag to look, use movement controls, or choose a station from the accessible list.');renderer.domElement.tabIndex=0;
  const scene=new THREE.Scene();scene.background=new THREE.Color('#c1d8d1');scene.fog=new THREE.Fog('#c1d8d1',22,42);const camera=new THREE.PerspectiveCamera(48,1,.1,100);camera.position.set(7.5,5.8,9);
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1,0);controls.enableDamping=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;controls.minDistance=1;controls.maxDistance=20;controls.maxPolarAngle=Math.PI*.49;controls.update();
  scene.add(new THREE.HemisphereLight(0xfff7e9,0x78928b,1.05));const sun=new THREE.DirectionalLight(0xffe2b4,3.1);sun.position.set(-5,10,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0003;sun.shadow.normalBias=.03;sun.shadow.radius=4;sun.shadow.camera.left=-9;sun.shadow.camera.right=9;sun.shadow.camera.top=9;sun.shadow.camera.bottom=-9;scene.add(sun);const fill=new THREE.DirectionalLight(0xcde8ff,.65);fill.position.set(5,4,5);scene.add(fill);
  const materials:THREE.Material[]=[];const geometries:THREE.BufferGeometry[]=[];const textures:THREE.Texture[]=[];const selectable:THREE.Object3D[]=[];
  function mesh(geometry:THREE.BufferGeometry,color:string,x:number,y:number,z:number,parent:THREE.Object3D=scene){geometries.push(geometry);const m=new THREE.MeshStandardMaterial({color,roughness:.8});materials.push(m);const o=new THREE.Mesh(geometry,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
  const box=(w:number,h:number,d:number,c:string,x:number,y:number,z:number,parent:THREE.Object3D=scene)=>mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(w,h,d)*.16),c,x,y,z,parent);
  function tag(o:THREE.Object3D,station:string,item?:string){o.userData={station,item};selectable.push(o);return o;}
  function label(text:string,x:number,y:number,z:number,station:string){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d')!;ctx.fillStyle='#173c43';ctx.beginPath();ctx.roundRect(3,3,506,122,28);ctx.fill();ctx.strokeStyle='#f4d48c';ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='white';ctx.font='bold 38px sans-serif';ctx.textAlign='center';ctx.fillText(text,256,79);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;textures.push(texture);const material=new THREE.SpriteMaterial({map:texture,depthTest:true,toneMapped:false});materials.push(material);const sprite=new THREE.Sprite(material);sprite.position.set(x,y,z);sprite.scale.set(1.8,.45,1);scene.add(sprite);tag(sprite,station);}
  box(11,.2,10,'#967054',0,-.1,0);
  for(let row=0;row<20;row++)for(let col=0;col<5;col++){const wood=['#d8ae7e','#cda376','#dfb88b','#d2aa7e'][(row+col)%4];box(2.17,.025,.48,wood,-4.4+col*2.2,.015,-4.75+row*.5);}
  box(4,.015,2.7,'#60968c',0,.035,-2.9);for(const x of [-1.85,1.85])box(.055,.015,2.5,'#f3d58f',x,.05,-2.9);
  box(11,4,.18,'#f0e9d8',0,2,-5);box(.18,4,10,'#e8d9bb',-5.5,2,0);box(11,.14,.18,'#b68159',0,.16,-4.85);box(11,.12,.18,'#fff3d8',0,3.88,-4.85);box(.14,.14,10,'#b68159',-5.36,.16,0);
  for(const z of [-3,0,3]){tag(box(.05,1.5,1.7,'#a6d8df',-5.38,2.35,z),'supplies','ventana');box(.18,.12,1.95,'#e8c59c',-5.26,1.56,z);box(.14,1.78,.1,'#fff8e7',-5.29,2.35,z-.86);box(.14,1.78,.1,'#fff8e7',-5.29,2.35,z+.86);box(.08,.06,1.9,'#faf8ea',-5.32,2.35,z);box(.08,1.65,.05,'#faf8ea',-5.32,2.35,z);}
  box(4.2,1.9,.13,'#b08662',0,2.2,-4.83);tag(box(4,1.7,.14,'#f5f7ee',0,2.2,-4.72),'doctor','pizarra');for(let i=0;i<3;i++)box(.6,.025,.025,['#328f89','#dc8d63','#6b7fab'][i],-.9+i*.85,1.39,-4.61);box(4.2,.1,.24,'#dbbb83',0,1.3,-4.75);label(band?'¡Somos músicos!':'Mis clases y mis compañeros',0,3.35,-4.6,'doctor');
  tag(box(.9,2.8,.13,unlocked?'#e5a63e':'#718595',-4,1.4,-4.78),'band','puerta');label(unlocked?'Sala de música':'Música · 4 misiones',-4,3.05,-4.5,'band');
  const clock=tag(mesh(new THREE.CylinderGeometry(.37,.37,.08,32),'#faf8ea',3,3,-4.8),'supplies','reloj');clock.rotation.x=Math.PI/2;box(.025,.25,.02,'#173342',3,3.11,-4.73);box(.22,.025,.02,'#173342',3.1,3,-4.72);
  function desk(x:number,z:number,color='#d5ac7c'){
    tag(box(1.65,.13,.9,color,x,1,z),'supplies','escritorio');box(1.5,.06,.75,'#a97e53',x,.91,z);
    for(const dx of [-.65,.65])for(const dz of [-.32,.32])box(.055,.95,.055,'#536d73',x+dx,.5,z+dz);
    tag(box(.68,.13,.67,'#3b716e',x,.56,z+1),'supplies','silla');box(.69,.67,.12,'#3b716e',x,.96,z+1.27);
    for(const dx of [-.26,.26]){box(.055,.56,.055,'#657f7f',x+dx,.26,z+.76);box(.055,.95,.055,'#657f7f',x+dx,.48,z+1.23);}
  }
  for(const x of [-2.3,0,2.3])for(const z of [0,2.7])desk(x,z);desk(-3,-3,'#d5ac7c');
  function plant(x:number,z:number,height=1){
    mesh(new THREE.CylinderGeometry(.28,.21,.4,24),'#c58862',x,.22,z);mesh(new THREE.CylinderGeometry(.245,.245,.025,24),'#4d3e32',x,.43,z);
    mesh(new THREE.CylinderGeometry(.025,.04,height,8),'#526941',x,.43+height/2,z);
    for(let i=0;i<7;i++){const angle=i*2.4;const leaf=mesh(new THREE.SphereGeometry(.2,10,8),i%2?'#3c8060':'#76a476',x+Math.sin(angle)*.22,.8+i*.09,z+Math.cos(angle)*.22);leaf.scale.set(.6,1.7,.5);leaf.rotation.z=Math.sin(angle)*.6;}
  }
  plant(-4.65,-3.7);plant(4.8,-3.7,1.4);plant(-4.7,2.8);
  // Open bookcase, corkboard, and printed school materials make the room feel lived in.
  box(1.3,2.3,.55,'#ae7c54',4.7,1.15,-2.6);for(const y of [.2,.85,1.5,2.15])box(1.35,.09,.6,'#d2aa7c',4.7,y,-2.6);
  for(let level=0;level<3;level++)for(let i=0;i<6;i++){const h=.34+(i%3)*.07;box(.12,h,.34,['#428d88','#d79765','#657f9e','#e3c07b'][i%4],4.25+i*.17,.3+level*.65+h/2,-2.52);}
  box(1.5,1.08,.06,'#c49a70',-2.4,2.7,-4.77);for(let i=0;i<4;i++)box(.29,.42,.035,['#f6df99','#91c7ba','#f3ad8c','#c5cfed'][i],-2.88+i*.32,2.68+(i%2)*.12,-4.71);
  function person(name:string,color:string,x:number,z:number,station:string){
    const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
    const body=tag(mesh(new THREE.CapsuleGeometry(.245,.38,6,16),color,0,1.04,0,g),station);body.scale.set(1,.94,.7);
    tag(mesh(new THREE.SphereGeometry(.255,24,20),'#c28e68',0,1.62,.025,g),station);mesh(new THREE.SphereGeometry(.26,24,16),'#3d302b',0,1.72,-.015,g).scale.set(1,.6,1);
    for(const dx of [-.085,.085]){mesh(new THREE.SphereGeometry(.035,12,8),'#fffaf0',dx,1.65,.252,g);mesh(new THREE.SphereGeometry(.017,10,8),'#293432',dx,1.65,.279,g);mesh(new THREE.SphereGeometry(.035,10,8),'#db9e87',dx*1.5,1.57,.235,g);}
    const smile=mesh(new THREE.TorusGeometry(.068,.012,6,16,Math.PI),'#7b4b40',0,1.545,.26,g);smile.rotation.z=Math.PI;
    for(const dx of [-.12,.12]){box(.16,.53,.18,'#344d62',dx,.38,0,g);box(.21,.12,.32,'#f1ecdd',dx,.09,.06,g);}
    for(const dx of [-.29,.29]){const arm=mesh(new THREE.CapsuleGeometry(.08,.37,4,12),color,dx,.97,0,g);arm.rotation.z=dx<0?-.18:.18;mesh(new THREE.SphereGeometry(.075,12,8),'#c28e68',dx*1.1,.68,.025,g);}
    if(name==='Ana'){for(const dx of [-.085,.085])mesh(new THREE.TorusGeometry(.051,.009,6,16),'#503d44',dx,1.65,.285,g);box(.06,.015,.015,'#503d44',0,1.66,.285,g);}
    if(name==='Sofía'||name==='Ana')mesh(new THREE.SphereGeometry(.14,16,12),'#3d302b',.14,1.65,-.16,g);
    label(name,x,2.3,z,station);
  }
  if(!band){person('Sra. Abarca','#d67b59',-3,-2.3,'teacher');person('Mateo','#388e84',3,1,'mateo');person('Carlos','#497fad',.7,-1.1,'group');person('Ana','#936d9c',2.25,-1.3,'group');person('Sofía','#d7ad4d',3.5,-1.5,'group');}
  else {person('Directora','#d67b59',0,-2.8,'band');person('Mateo','#388e84',3,1,'band');tag(mesh(new THREE.CylinderGeometry(.6,.6,.7,32),'#bc6d52',-2,.7,-2),'band');mesh(new THREE.TorusGeometry(.61,.04,8,32),'#f1cc8b',-2,1.055,-2).rotation.x=Math.PI/2;box(1.6,.14,.75,'#233b40',1,1.2,-2);for(let i=0;i<12;i++)box(.12,.02,.65,'#f6f0d5',.27+i*.12,1.29,-2);mesh(new THREE.CylinderGeometry(.55,.55,.035,32),'#e4b83d',-2,1.9,-2.7);}
  tag(box(.48,.65,.3,'#5979aa',0,1.38,2.7),'backpack','mochila');tag(box(.35,.27,.09,'#7999c7',0,1.27,2.88),'backpack','mochila');mesh(new THREE.TorusGeometry(.14,.025,8,20),'#39547f',0,1.75,2.7);label('La mochila',0,2.25,2.7,'backpack');
  for(let i=0;i<3;i++){tag(box(.4,.045,.55,['#5a8d89','#d89167','#7087aa'][i],-2.3,1.1+i*.05,0),'supplies','libro');box(.35,.018,.48,'#eee6d3',-2.3,1.13+i*.05,0);}
  tag(box(.36,.04,.48,'#f6f3dc',-1.85,1.11,.15),'supplies','cuaderno');const pencil=tag(mesh(new THREE.CylinderGeometry(.022,.022,.5,6),'#e9ad30',-1.9,1.16,0),'supplies','lapiz');pencil.rotation.z=Math.PI/2;tag(box(.16,.08,.1,'#ea998c',-2.5,1.14,.25),'supplies','borrador');label('Los útiles',-2.3,1.9,0,'supplies');
  tag(box(1.3,1.6,.08,'#f3e7c9',3.3,2.15,-4.77),'schedule','horario');for(let i=0;i<4;i++)box(.98,.1,.025,['#65a69b','#d99d6d','#879fbe','#dbc177'][i],3.3,2.55-i*.29,-4.71);label('El horario',3.3,3.2,-4.5,'schedule');
  tag(mesh(new THREE.CylinderGeometry(.28,.24,.6,24),'#6b9291',-4.5,.3,3.6),'supplies','papelera');tag(box(1.2,.12,.9,'#b38b63',4,1,3),'supplies','mesa');label('Mesa de arte',4,1.9,3,'supplies');tag(box(.3,.02,.4,'#f6f0d5',4,1.09,3),'supplies','papel');
  const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();let downX=0,downY=0;const hit=(event:PointerEvent)=>{const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(selectable,false)[0]?.object;};
  const down=(e:PointerEvent)=>{downX=e.clientX;downY=e.clientY};const up=(e:PointerEvent)=>{if(Math.hypot(e.clientX-downX,e.clientY-downY)>7)return;const o=hit(e);if(o)selection.current(o.userData.station,o.userData.item);};const over=(e:PointerEvent)=>{const o=hit(e);renderer.domElement.style.cursor=o?'pointer':'grab';setHover(o?stations.find(s=>s.id===o.userData.station)?.name??'Explora':'Selecciona una persona o un objeto');};
  renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointermove',over);
  const navigate=(x:number,z:number)=>{const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();const right=new THREE.Vector3().crossVectors(forward,new THREE.Vector3(0,1,0));const delta=right.multiplyScalar(x*.6).add(forward.multiplyScalar(z*.6));if(Math.abs(controls.target.x+delta.x)>5||Math.abs(controls.target.z+delta.z)>4.5)return;camera.position.add(delta);controls.target.add(delta);controls.update();};move.current=navigate;reset.current=()=>{camera.position.set(7.5,5.8,9);controls.target.set(0,1,0);controls.update();};
  const key=(e:KeyboardEvent)=>{if(!['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();navigate(['d','ArrowRight'].includes(e.key)?1:['a','ArrowLeft'].includes(e.key)?-1:0,['w','ArrowUp'].includes(e.key)?1:['s','ArrowDown'].includes(e.key)?-1:0);};renderer.domElement.addEventListener('keydown',key);
  const resize=new ResizeObserver(()=>{const w=element.clientWidth,h=element.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(element);let frame=0;const render=()=>{controls.update();renderer.render(scene,camera);frame=requestAnimationFrame(render)};render();
  const lost=(e:Event)=>{e.preventDefault();onFallback();};renderer.domElement.addEventListener('webglcontextlost',lost);
  return ()=>{cancelAnimationFrame(frame);resize.disconnect();controls.dispose();renderer.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.domElement.remove();};
 },[unlocked,band,onFallback]);
 return <div className="room-wrap"><div ref={host} className="room-canvas" data-testid="classroom"/><div className="room-caption" aria-live="polite">{hover}</div><div className="camera-controls" aria-label="Move around the classroom"><button onClick={()=>move.current(0,1)} aria-label="Move forward">Avanzar</button><button onClick={()=>move.current(-1,0)} aria-label="Move left">Izquierda</button><button onClick={()=>move.current(1,0)} aria-label="Move right">Derecha</button><button onClick={()=>move.current(0,-1)} aria-label="Move backward">Atrás</button><button onClick={()=>reset.current()}>Vista general</button></div><p className="camera-help">Arrastra para mirar · Drag to look · WASD / arrow keys when the scene has focus</p></div>;
}
