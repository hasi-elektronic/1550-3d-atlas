'use strict';
/* A dependency-free WebGL2 atlas. All textures and data are embedded at build time.
 * Geometry, lighting, camera, picking and animation are computed live; no rendered
 * background image is used as a substitute for a 3D scene.
 */
const $=id=>document.getElementById(id);
const ICONS={plus:'M12 5v14M5 12h14',minus:'M5 12h14',close:'m6 6 12 12M18 6 6 18',play:'m8 5 11 7-11 7Z',pause:'M8 5v14M16 5v14',arrow:'M4 12h15m-5-5 5 5-5 5',external:'M14 4h6v6M20 4 10 14M10 5H5v14h14v-5',search:'M16 16l4 4M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14',full:'M8 4H4v4M16 4h4v4M20 16v4h-4M8 20H4v-4',home:'m3 11 9-8 9 8M6 9v11h12V9M10 20v-7h4v7',angle:'m3 9 9-5 9 5-9 5ZM3 14l9 6 9-6',layers:'m3 7 9-4 9 4-9 4ZM3 12l9 4 9-4M3 17l9 4 9-4',list:'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',pin:'M12 21s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12ZM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',focus:'M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',help:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5M12 17h.01'};
function icon(name){return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]||ICONS.help}"/></svg>`;}
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function multiply(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
function lookAt(eye,target){const z=norm(sub(eye,target)),x=norm(cross([0,1,0],z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
const D=ATLAS_DATA, regions=D.regions, regionByID=new Map(regions.map(r=>[r.id,r]));
const [L0,L1,B0,B1]=D.extent, SCALE=.8, WORLD_W=(L1-L0)*SCALE, WORLD_H=B1-B0;
const [NX,NZ]=D.mesh, FOV=42*Math.PI/180, isSmall=()=>innerWidth<=680;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer, app, textures, pixelMaps;
const VS=`#version 300 es
precision highp float;
precision highp int;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aUV;
uniform mat4 uMVP; uniform float uRelief; uniform int uKind;
uniform vec3 uOffset; uniform float uRotation;
out vec2 vUV;out vec3 vNormal;out vec3 vPosition;
void main(){
 vec3 p=aPosition;vec3 n=aNormal;
 if(uKind==0){p.y*=uRelief;n=normalize(vec3(n.x*uRelief,n.y,n.z*uRelief));}
 float c=cos(uRotation),s=sin(uRotation);
 p.xz=mat2(c,-s,s,c)*p.xz;n.xz=mat2(c,-s,s,c)*n.xz;
 p+=uOffset;vPosition=p;vNormal=n;vUV=aUV;gl_Position=uMVP*vec4(p,1.);
}`;
const FS=`#version 300 es
precision highp float;
precision highp int;
in vec2 vUV;in vec3 vNormal;in vec3 vPosition;out vec4 fragColor;
uniform sampler2D uEarth,uRegions,uPalette;
uniform vec3 uEye,uBaseColor;uniform float uTime,uSelected,uHover,uPolitical,uGrid;
uniform int uKind;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float rid(vec2 uv){return floor(texture(uRegions,clamp(uv,vec2(0.),vec2(1.))).r*255.+.5);}
void main(){
 vec3 n=normalize(vNormal);vec3 light=normalize(vec3(-.5,.85,-.35));
 float diffuse=.49+.62*max(dot(n,light),0.);vec3 color;
 if(uKind>0){color=uBaseColor*diffuse; if(uKind==1)color*=.98+.04*hash(vPosition.xz*100.);}
 else{
  vec4 tex=texture(uEarth,vUV);float land=step(.49,tex.a);float id=rid(vUV);
  if(land>.5){
   vec3 natural=pow(tex.rgb,vec3(.85));float lum=dot(natural,vec3(.3,.55,.15));
   natural=mix(natural,vec3(lum)*vec3(1.12,1.04,.82),.25);
   color=natural;
   if(id>.5){vec3 political=texture(uPalette,vec2((id+.5)/256.,.5)).rgb;color=mix(natural,political*(.70+.48*lum),.67*uPolitical);}
   color*=diffuse;
   vec2 px=max(vec2(1.)/vec2(textureSize(uRegions,0)),fwidth(vUV)*.60);
   float edge=max(max(step(.5,abs(id-rid(vUV+vec2(px.x,0.)))),step(.5,abs(id-rid(vUV-vec2(px.x,0.))))),max(step(.5,abs(id-rid(vUV+vec2(0.,px.y)))),step(.5,abs(id-rid(vUV-vec2(0.,px.y))))));
   if(id>.5)color=mix(color,vec3(.83,.75,.53),edge*.62*uPolitical);
   if(id>.5&&(abs(id-uSelected)<.2||abs(id-uHover)<.2)){
    color=mix(color,color*1.18+vec3(.08,.065,.02),.63);
    color=mix(color,vec3(1.,.86,.50),edge*.88);
   }
  }else{
   float wave=sin(vPosition.x*2.3+vPosition.z*1.7+uTime*.45)+sin(vPosition.z*3.2-vPosition.x*1.3-uTime*.6);
   float wide=sin(vPosition.x*.09+vPosition.z*.17);
   color=vec3(.038,.139,.198)+vec3(.010,.021,.024)*wide+vec3(.001,.003,.004)*wave;
   float sparkle=pow(max(0.,sin(vPosition.x*15.+vPosition.z*8.+uTime*.55)*sin(vPosition.z*19.-uTime*.44)),18.);
   color+=vec3(.07,.12,.13)*sparkle*.3;
   vec2 ll=vec2(mix(-17.,155.,vUV.x),mix(75.,-12.,vUV.y));
   vec2 grid=abs(fract(ll/10.+.5)-.5)/max(fwidth(ll/10.),vec2(.000001));
   float line=1.-min(min(grid.x,grid.y),1.);color=mix(color,vec3(.12,.24,.28),line*.32*uGrid);
   // A fine shoreline follows the actual land mask.
   vec2 dt=1./vec2(textureSize(uEarth,0));
   float shore=max(max(texture(uEarth,vUV+vec2(dt.x,0.)).a,texture(uEarth,vUV-vec2(dt.x,0.)).a),max(texture(uEarth,vUV+vec2(0.,dt.y)).a,texture(uEarth,vUV-vec2(0.,dt.y)).a));
   color=mix(color,vec3(.33,.47,.44),shore*.40);
  }
 }
 float fog=smoothstep(190.,430.,distance(uEye,vPosition));color=mix(color,vec3(.027,.065,.090),fog*.65);
 fragColor=vec4(color,1.);
}`;
function loadImage(base64){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Gömülü harita dokusu okunamadı.'));im.src=base64;});}
function imagePixels(im){const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0);return{w:im.width,h:im.height,data:ctx.getImageData(0,0,im.width,im.height).data};}
class Renderer{
 constructor(canvas){this.canvas=canvas;this.gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});if(!this.gl)throw new Error('WebGL 2 başlatılamadı. Dosyayı güncel Chrome, Edge veya Safari’de açıp donanım hızlandırmasını etkinleştir.');const g=this.gl;
  const shader=(type,src)=>{const s=g.createShader(type);g.shaderSource(s,src);g.compileShader(s);if(!g.getShaderParameter(s,g.COMPILE_STATUS))throw new Error(g.getShaderInfoLog(s));return s;};
  this.program=g.createProgram();g.attachShader(this.program,shader(g.VERTEX_SHADER,VS));g.attachShader(this.program,shader(g.FRAGMENT_SHADER,FS));g.linkProgram(this.program);if(!g.getProgramParameter(this.program,g.LINK_STATUS))throw new Error(g.getProgramInfoLog(this.program));g.useProgram(this.program);
  this.u={};for(const n of ['MVP','Relief','Kind','Offset','Rotation','Earth','Regions','Palette','Eye','BaseColor','Time','Selected','Hover','Political','Grid'])this.u[n]=g.getUniformLocation(this.program,'u'+n);
  g.enable(g.DEPTH_TEST);g.depthFunc(g.LEQUAL);g.disable(g.CULL_FACE);g.clearColor(.026,.061,.086,1);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();toast('Grafik bağlantısı kesildi. Sayfayı yeniden aç.');this.lost=true;});
 }
 texture(im,unit,nearest=false){const g=this.gl,t=g.createTexture();g.activeTexture(g.TEXTURE0+unit);g.bindTexture(g.TEXTURE_2D,t);g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,false);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,im);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,nearest?g.NEAREST:g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,nearest?g.NEAREST:g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);return t;}
 mesh(vertices,indices){const g=this.gl,vao=g.createVertexArray();g.bindVertexArray(vao);const v=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,v);g.bufferData(g.ARRAY_BUFFER,new Float32Array(vertices),g.STATIC_DRAW);for(const [i,n,offset]of [[0,3,0],[1,3,12],[2,2,24]]){g.enableVertexAttribArray(i);g.vertexAttribPointer(i,n,g.FLOAT,false,32,offset);}const ib=g.createBuffer();g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,ib);g.bufferData(g.ELEMENT_ARRAY_BUFFER,new Uint32Array(indices),g.STATIC_DRAW);return{vao,count:indices.length};}
 draw(mesh,color,kind=0,offset=[0,0,0],rotation=0){const g=this.gl;g.uniform1i(this.u.Kind,kind);g.uniform3fv(this.u.BaseColor,color);g.uniform3fv(this.u.Offset,offset);g.uniform1f(this.u.Rotation,rotation);g.bindVertexArray(mesh.vao);g.drawElements(g.TRIANGLES,mesh.count,g.UNSIGNED_INT,0);}
 resize(){const ratio=Math.min(devicePixelRatio||1,isSmall()?1.6:1.75),w=Math.floor(innerWidth*ratio),h=Math.floor(innerHeight*ratio);if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;this.gl.viewport(0,0,w,h);}}
}
function hAtUV(u,v){u=clamp(u,0,1)*(NX-1);v=clamp(v,0,1)*(NZ-1);const x=Math.floor(u),z=Math.floor(v),x1=Math.min(x+1,NX-1),z1=Math.min(z+1,NZ-1);return mix(mix(app.heights[z*NX+x],app.heights[z*NX+x1],u-x),mix(app.heights[z1*NX+x],app.heights[z1*NX+x1],u-x),v-z);}
function world(lon,lat,extra=0){const u=(lon-L0)/(L1-L0),v=(B1-lat)/(B1-B0);return[(u-.5)*WORLD_W,hAtUV(u,v)*app.relief+extra,(v-.5)*WORLD_H];}
function terrainMesh(heights){const vertices=new Float32Array(NX*NZ*8),ix=new Uint32Array((NX-1)*(NZ-1)*6),dx=WORLD_W/(NX-1),dz=WORLD_H/(NZ-1);let k=0;
 for(let z=0;z<NZ;z++)for(let x=0;x<NX;x++){const i=z*NX+x,h=heights[i],xl=Math.max(x-1,0),xr=Math.min(x+1,NX-1),zt=Math.max(z-1,0),zb=Math.min(z+1,NZ-1);const n=norm([-(heights[z*NX+xr]-heights[z*NX+xl])/((xr-xl)*dx),1,-(heights[zb*NX+x]-heights[zt*NX+x])/((zb-zt)*dz)]);vertices.set([(x/(NX-1)-.5)*WORLD_W,h,(z/(NZ-1)-.5)*WORLD_H,...n,x/(NX-1),z/(NZ-1)],i*8);if(x<NX-1&&z<NZ-1){ix.set([i,i+NX,i+1,i+1,i+NX,i+NX+1],k);k+=6;}}
 return renderer.mesh(vertices,ix);
}
function surfaceMesh(triangles){const verts=[],idx=[];for(const t of triangles){const n=norm(cross(sub(t[1],t[0]),sub(t[2],t[0])));for(const p of t){idx.push(idx.length);verts.push(...p,...n,0,0);}}return renderer.mesh(verts,idx);}
function box(x,y,z,w,h,d){const p=[[x-w/2,y-h/2,z-d/2],[x+w/2,y-h/2,z-d/2],[x+w/2,y+h/2,z-d/2],[x-w/2,y+h/2,z-d/2],[x-w/2,y-h/2,z+d/2],[x+w/2,y-h/2,z+d/2],[x+w/2,y+h/2,z+d/2],[x-w/2,y+h/2,z+d/2]],faces=[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]],tris=[];for(const f of faces){tris.push([p[f[0]],p[f[1]],p[f[2]]],[p[f[0]],p[f[2]],p[f[3]]]);}return surfaceMesh(tris);}
function paletteImage(){const c=document.createElement('canvas');c.width=256;c.height=1;const ctx=c.getContext('2d');for(const r of regions){ctx.fillStyle=r.color;ctx.fillRect(r.id,0,1,1);}return c;}
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,3500);}
class Atlas{
 constructor(heightPixels){this.heights=new Float32Array(NX*NZ);for(let i=0;i<this.heights.length;i++)this.heights[i]=(heightPixels.data[i*4]+heightPixels.data[i*4+1]*256)/65535*6-.1;
  this.relief=1;this.political=true;this.grid=false;this.names=true;this.motion=!reduced;this.selected=0;this.hover=0;this.tour=false;this.tourIndex=0;this.tourStart=0;this.lastTime=0;this.lastPick=0;this.pose={x:0,z:0,d:132,e:1.0,yaw:-.035};this.goal={...this.pose};this.labels=[];this.seas=[];this.eye=[0,0,0];this.matrix=null;this.pointers=new Map();this.tourSequence=['ottoman','safavid','sur','ming','japan','russia','france'];this.labelOrder=[...regions].sort((a,b)=>a.priority-b.priority);
 }
 init(){this.terrain=terrainMesh(this.heights);this.base=box(0,-.64,0,WORLD_W+.4,1.1,WORLD_H+.4);this.rims=[box(0,-.055,-WORLD_H/2,WORLD_W+.5,.07,.13),box(0,-.055,WORLD_H/2,WORLD_W+.5,.07,.13),box(-WORLD_W/2,-.055,0,.13,.07,WORLD_H),box(WORLD_W/2,-.055,0,.13,.07,WORLD_H)];this.hull=surfaceMesh([[[.64,.10,0],[-.5,.10,-.22],[-.5,.10,.22]],[[.64,.10,0],[-.5,.10,.22],[-.4,-.08,.1]],[[.64,.10,0],[-.4,-.08,-.1],[-.5,.10,-.22]],[[-.5,.10,-.22],[-.4,-.08,-.1],[-.4,-.08,.1]],[[-.5,.10,-.22],[-.4,-.08,.1],[-.5,.10,.22]]]);this.sails=surfaceMesh([[[0,.12,0],[0,1,0],[.49,.2,0]],[[-.05,.22,.02],[-.05,.88,.02],[-.44,.22,.02]]]);
  this.makeLabels();this.bind();this.setView(isSmall()?'europe':'all',true);this.renderList();
 }
 makeLabels(){for(const r of this.labelOrder){const el=document.createElement('button');el.className='map-label'+(r.priority===0?' major':'');el.textContent=r.label;el.setAttribute('aria-label',r.name+' — açıklama');el.dataset.region=r.id;el.addEventListener('click',e=>{e.stopPropagation();this.stopTour();this.select(r.id);});el.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')this.showHover(r.id,e.clientX,e.clientY);});el.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')this.showHover(r.id,e.clientX,e.clientY);});el.addEventListener('pointerleave',()=>this.hideHover());$('labels').append(el);this.labels.push({r,el});}
  for(const [text,lon,lat] of [['AKDENİZ',18,34],['HİNT OKYANUSU',74,4],['KARADENİZ',34,43],['PASİFİK OKYANUSU',143,19],['HAZAR DENİZİ',51,41],['ATLAS OKYANUSU',-12,28]]){const el=document.createElement('div');el.className='sea-label';el.textContent=text;$('labels').append(el);this.seas.push({el,lon,lat});}
 }
 setView(type,instant=false){this.stopTour();let goal;const ratio=innerWidth/innerHeight;
  if(type==='all')goal={x:0,z:1,d:Math.max(123,WORLD_W/(2*Math.tan(FOV/2)*ratio)*1.13),e:1.04,yaw:0};
  else if(type==='europe'){const w=world(isSmall()?23:20,50);goal={x:w[0],z:w[2]+3,d:isSmall()?87:64,e:1.10,yaw:-.07};}
  else{const w=world(101,34);goal={x:w[0],z:w[2],d:isSmall()?146:96,e:1.06,yaw:.02};}
  this.goal=goal;if(instant)this.pose={...goal};document.querySelectorAll('.views button').forEach(b=>b.classList.toggle('active',b.id==='view-'+type));
 }
 flyTo(r){document.querySelectorAll('.views button').forEach(b=>b.classList.remove('active'));const p=world(...r.center);this.goal={x:p[0]+(isSmall()?0:8),z:p[2]+(isSmall()?8:0),d:isSmall()?53:51,e:.90,yaw:-.12};if(reduced)this.pose={...this.goal};}
 select(id){const r=regionByID.get(id);if(!r)return;this.selected=id;this.hideHover();$('info').hidden=false;document.body.classList.add('has-info');$('info').style.setProperty('--region-color',r.color);$('info-area').textContent=r.area;$('info-title').textContent=r.name;$('info-capital').textContent=r.capital;$('info-text').textContent=r.text;$('info-note').textContent=r.note;$('info-source').href=r.source[1];$('info-source').title=r.source[0];$('info').scrollTop=0;this.renderList();if(isSmall()){$('list-panel').hidden=true;$('layers-panel').hidden=true;}}
 closeInfo(){this.selected=0;$('info').hidden=true;document.body.classList.remove('has-info');this.renderList();}
 renderList(){const term=$('search').value.toLocaleLowerCase('tr').trim();const list=regions.filter(r=>(r.name+' '+r.label+' '+r.area).toLocaleLowerCase('tr').includes(term)).sort((a,b)=>a.name.localeCompare(b.name,'tr'));$('region-list').replaceChildren();for(const r of list){const b=document.createElement('button');b.className='region-row'+(this.selected===r.id?' selected':'');b.innerHTML=`<span class="swatch" style="background:${r.color}"></span><span>${esc(r.name)}</span>`;b.addEventListener('click',()=>{this.stopTour();this.select(r.id);this.flyTo(r);});$('region-list').append(b);}if(!list.length){const p=document.createElement('p');p.textContent='Eşleşen bölge bulunamadı.';p.style.fontSize='12px';$('region-list').append(p);}}
 showHover(id,x,y){if(this.pointers.size||isSmall())return;const r=regionByID.get(id);if(!r){this.hideHover();return;}this.hover=id;$('hover-area').textContent=r.area;$('hover-name').textContent=r.name;$('hover-text').textContent=r.text.split('. ')[0]+'.';$('hover').hidden=false;const h=$('hover').offsetHeight,w=$('hover').offsetWidth;$('hover').style.left=clamp(x+18,10,innerWidth-w-12)+'px';$('hover').style.top=clamp(y+16,103,innerHeight-h-112)+'px';$('scene').style.cursor='pointer';}
 hideHover(){this.hover=0;$('hover').hidden=true;$('scene').style.cursor=this.pointers.size?'grabbing':'grab';}
 project(p){const m=this.matrix;if(!m)return null;const x=m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12],y=m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13],w=m[3]*p[0]+m[7]*p[1]+m[11]*p[2]+m[15];if(w<=0)return null;return[(x/w*.5+.5)*innerWidth,(-y/w*.5+.5)*innerHeight,w];}
 updateLabels(){const occupied=[];const small=isSmall();for(const {r,el}of this.labels){let visible=this.names&&(this.pose.d<92||r.priority<2||r.id===this.selected);const p=this.project(world(...r.center,.65));if(!p){el.hidden=true;continue;}const [x,y]=p;const w=r.priority===0?170:120,h=r.label.includes('\n')?38:25;visible=visible&&x>25&&x<innerWidth-25&&y>(small?193:107)&&y<innerHeight-(small?145:120);if(this.selected&&!small&&x>innerWidth-370&&y<innerHeight-245)visible=false;
   const rect=[x-w/2,y-h/2,x+w/2,y+h/2];if(visible&&r.id!==this.selected&&occupied.some(a=>rect[0]<a[2]&&rect[2]>a[0]&&rect[1]<a[3]&&rect[3]>a[1]))visible=false;
   el.hidden=!visible;if(visible){el.style.left=x+'px';el.style.top=y+'px';el.classList.toggle('selected',r.id===this.selected);occupied.push(rect);}}
  for(const sea of this.seas){const p=this.project(world(sea.lon,sea.lat,.15));const visible=this.names&&p&&p[0]>50&&p[0]<innerWidth-80&&p[1]>175&&p[1]<innerHeight-160&&!occupied.some(a=>p[0]>a[0]-40&&p[0]<a[2]+40&&p[1]>a[1]-20&&p[1]<a[3]+20);sea.el.hidden=!visible;if(visible){sea.el.style.left=p[0]+'px';sea.el.style.top=p[1]+'px';}}
 }
 pick(x,y){if(!this.matrix)return null;const target=[this.pose.x,0,this.pose.z],f=norm(sub(target,this.eye)),right=norm(cross(f,[0,1,0])),up=cross(right,f),nx=(x/innerWidth*2-1)*Math.tan(FOV/2)*(innerWidth/innerHeight),ny=(1-y/innerHeight*2)*Math.tan(FOV/2),ray=norm(f.map((v,i)=>v+right[i]*nx+up[i]*ny));if(ray[1]>-.03)return null;
  let t=-this.eye[1]/ray[1],p;for(let i=0;i<6;i++){p=this.eye.map((v,j)=>v+ray[j]*t);const u=p[0]/WORLD_W+.5,v=p[2]/WORLD_H+.5;const hh=hAtUV(u,v)*this.relief;t=(hh-this.eye[1])/ray[1];}
  p=this.eye.map((v,j)=>v+ray[j]*t);const u=p[0]/WORLD_W+.5,v=p[2]/WORLD_H+.5;if(u<0||u>1||v<0||v>1)return null;const px=clamp(Math.floor(u*pixelMaps.regions.w),0,pixelMaps.regions.w-1),py=clamp(Math.floor(v*pixelMaps.regions.h),0,pixelMaps.regions.h-1),id=pixelMaps.regions.data[(py*pixelMaps.regions.w+px)*4];return{id,lon:mix(L0,L1,u),lat:mix(B1,B0,v)};
 }
 zoom(factor){this.stopTour();this.goal.d=clamp(this.goal.d*factor,13,550);this.hideHover();}
 pan(dx,dy){const s=this.goal.d*Math.tan(FOV/2)*2/innerHeight,c=Math.cos(this.goal.yaw),ss=Math.sin(this.goal.yaw),inv=1/Math.max(Math.sin(this.goal.e),.3);this.goal.x=clamp(this.goal.x-dx*s*c-dy*s*ss*inv,-WORLD_W/2,WORLD_W/2);this.goal.z=clamp(this.goal.z+dx*s*ss-dy*s*c*inv,-WORLD_H/2,WORLD_H/2);}
 stopTour(){if(!this.tour)return;this.tour=false;$('tour-icon').innerHTML=icon('play');$('tour-text').textContent='Sinematik tur';$('tour-progress').style.width='0';}
 startTour(){if(this.tour){this.stopTour();return;}this.tour=true;this.tourIndex=0;this.tourStart=performance.now();$('tour-icon').innerHTML=icon('pause');this.tourStep();$('list-panel').hidden=true;$('layers-panel').hidden=true;}
 tourStep(){const r=regions.find(x=>x.key===this.tourSequence[this.tourIndex]);this.select(r.id);this.flyTo(r);$('tour-text').textContent=`Turu durdur · ${this.tourIndex+1}/${this.tourSequence.length}`;}
 bind(){for(const view of ['all','europe','asia'])$('view-'+view).onclick=()=>this.setView(view);$('zoom-in').onclick=()=>this.zoom(.8);$('zoom-out').onclick=()=>this.zoom(1.25);$('reset').onclick=()=>{this.closeInfo();this.setView(isSmall()?'europe':'all');};$('angle').onclick=()=>{this.stopTour();this.goal.e=this.goal.e>1.3?.86:1.55;this.goal.yaw=0;};$('focus').onclick=()=>{this.stopTour();if(this.selected)this.flyTo(regionByID.get(this.selected));};$('info-close').onclick=()=>{this.stopTour();this.closeInfo();};$('tour').onclick=()=>this.startTour();$('search').oninput=()=>this.renderList();
  for(const [button,panel,other]of [['list-toggle','list-panel','layers-panel'],['layers-toggle','layers-panel','list-panel']])$(button).onclick=()=>{$(panel).hidden=!$(panel).hidden;$(other).hidden=true;this.hideHover();if(panel==='list-panel'&&!$(panel).hidden&&!isSmall())$('search').focus();};document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).hidden=true);
  for(const key of ['political','names','grid','motion'])$(key).onchange=e=>{this[key]=e.target.checked;};$('motion').checked=this.motion;
  $('relief').oninput=e=>{this.relief=Number(e.target.value);$('relief-value').value=this.relief.toFixed(1).replace('.',',')+'×';};
  $('full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('Bu tarayıcıda tam ekran düğmesi desteklenmiyor. Telefonu yatay çevirerek daha geniş görüntüleyebilirsin.');}catch(e){toast('Tam ekran isteği tarayıcı tarafından engellendi.');}};
  $('sources').onclick=()=>showSources();$('help').onclick=()=>showHelp();$('modal-close').onclick=()=>$('modal').close();$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const b=$('modal').getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)$('modal').close();}});
  const cv=$('scene');cv.addEventListener('contextmenu',e=>e.preventDefault());cv.addEventListener('wheel',e=>{e.preventDefault();this.zoom(Math.exp(clamp(e.deltaY,-130,130)*.0018));},{passive:false});
  cv.addEventListener('pointerdown',e=>{e.preventDefault();this.stopTour();cv.focus({preventScroll:true});cv.setPointerCapture(e.pointerId);this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false,button:e.button,shift:e.shiftKey});if(this.pointers.size>1)for(const p of this.pointers.values())p.moved=true;cv.classList.add('dragging');this.hideHover();});
  cv.addEventListener('pointermove',e=>{const p=this.pointers.get(e.pointerId);if(!p){if(e.pointerType==='touch')return;const now=performance.now();if(now-this.lastPick<45)return;this.lastPick=now;const hit=this.pick(e.clientX,e.clientY);if(hit){$('coords').textContent=Math.abs(hit.lat).toFixed(1)+'° '+(hit.lat>=0?'K':'G')+'  '+Math.abs(hit.lon).toFixed(1)+'° '+(hit.lon>=0?'D':'B');this.showHover(hit.id,e.clientX,e.clientY);}else{this.hideHover();$('coords').textContent='1550';}return;}
   const old=[...this.pointers.values()].map(v=>({...v}));const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;if(Math.hypot(p.x-p.startX,p.y-p.startY)>5)p.moved=true;
   if(this.pointers.size===2){const now=[...this.pointers.values()],od=Math.hypot(old[0].x-old[1].x,old[0].y-old[1].y),nd=Math.hypot(now[0].x-now[1].x,now[0].y-now[1].y);if(nd>8&&od>8)this.goal.d=clamp(this.goal.d*od/nd,13,550);this.pan((now[0].x+now[1].x-old[0].x-old[1].x)/2,(now[0].y+now[1].y-old[0].y-old[1].y)/2);}
   else if(this.pointers.size===1){if(p.button===2||p.button===1||p.shift){this.pan(dx,dy);}else{this.goal.yaw-=dx*.004;this.goal.e=clamp(this.goal.e+dy*.004,.35,1.555);}}
  });
  const up=e=>{const p=this.pointers.get(e.pointerId);if(!p)return;const click=!p.moved&&this.pointers.size===1&&p.button===0;this.pointers.delete(e.pointerId);if(cv.hasPointerCapture(e.pointerId))cv.releasePointerCapture(e.pointerId);if(!this.pointers.size)cv.classList.remove('dragging');if(click){const hit=this.pick(e.clientX,e.clientY);if(hit&&hit.id)this.select(hit.id);else this.closeInfo();}};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>{this.pointers.delete(e.pointerId);if(!this.pointers.size)cv.classList.remove('dragging');});cv.addEventListener('pointerleave',()=>{if(!this.pointers.size)this.hideHover();});
  window.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName)||$('modal').open)return;if(e.key==='Escape'){this.stopTour();this.closeInfo();this.hideHover();$('list-panel').hidden=true;$('layers-panel').hidden=true;}else if(e.key==='+'||e.key==='=')this.zoom(.85);else if(e.key==='-')this.zoom(1.17);else if(e.key==='Home')this.setView('all');else if(e.key===' '){e.preventDefault();this.startTour();}else if(e.key==='ArrowLeft'){e.preventDefault();this.stopTour();this.pan(30,0);}else if(e.key==='ArrowRight'){e.preventDefault();this.stopTour();this.pan(-30,0);}else if(e.key==='ArrowUp'){e.preventDefault();this.stopTour();this.pan(0,30);}else if(e.key==='ArrowDown'){e.preventDefault();this.stopTour();this.pan(0,-30);}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stopTour();});
 }
 frame(t){requestAnimationFrame(tt=>this.frame(tt));if(renderer.lost||document.hidden)return;const interval=isSmall()?30:16;if(t-this.lastTime<interval)return;const dt=Math.min((t-this.lastTime)/1000,.10);this.lastTime=t;
  if(this.tour){let elapsed=t-this.tourStart;if(elapsed>=8500){this.tourIndex=(this.tourIndex+1)%this.tourSequence.length;this.tourStart=t;elapsed=0;this.tourStep();}const width=isSmall()?196:$('tour').offsetWidth;$('tour-progress').style.width=width*(elapsed/8500)+'px';if(!reduced)this.goal.yaw+=dt*.014;}
  const easing=reduced?1:1-Math.exp(-dt*5.0);for(const k of ['x','z','d','e','yaw'])this.pose[k]=mix(this.pose[k],this.goal[k],easing);
  const p=this.pose;this.eye=[p.x+p.d*Math.cos(p.e)*Math.sin(p.yaw),p.d*Math.sin(p.e),p.z+p.d*Math.cos(p.e)*Math.cos(p.yaw)];this.matrix=multiply(perspective(FOV,innerWidth/innerHeight,.5,1600),lookAt(this.eye,[p.x,0,p.z]));
  const g=renderer.gl,u=renderer.u;renderer.resize();g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);g.useProgram(renderer.program);g.uniformMatrix4fv(u.MVP,false,this.matrix);g.uniform3fv(u.Eye,this.eye);g.uniform1f(u.Relief,this.relief);g.uniform1f(u.Time,this.motion?t/1000:0);g.uniform1f(u.Selected,this.selected);g.uniform1f(u.Hover,this.hover);g.uniform1f(u.Political,this.political?1:0);g.uniform1f(u.Grid,this.grid?1:0);g.uniform1i(u.Earth,0);g.uniform1i(u.Regions,1);g.uniform1i(u.Palette,2);
  renderer.draw(this.base,[.055,.091,.100],1);renderer.draw(this.terrain,[1,1,1],0);for(const rim of this.rims)renderer.draw(rim,[.49,.43,.28],1);
  const seconds=this.motion?t/1000:0;for(const [lon,lat,phase]of [[15,35,0],[68,11,1.1],[124,21,2.3],[57,16,3.6],[-10,35,4.7]]){const ang=seconds*.014+phase;const llon=lon+Math.sin(ang)*2,llat=lat+Math.sin(ang*.73)*.45,pos=world(llon,llat);pos[1]=-.045+Math.sin(seconds*1.5+phase)*.014;renderer.draw(this.hull,[.26,.16,.09],2,pos,-.4);renderer.draw(this.sails,[.90,.87,.75],2,pos,-.4);}
  this.updateLabels();$('needle').style.transform=`rotate(${-p.yaw*180/Math.PI}deg)`;
 }
}
function showSources(){const unique=[...new Map(Object.values(D.sources).map(s=>[s[1],s])).values()];$('modal-title').textContent='Haritayı nasıl okumalı?';$('modal-body').innerHTML=`<p><strong>Bu, 1550 dolaylarını keşfetmek için hazırlanmış, etkileşimli bir eğitim atlasıdır.</strong> Siyasi alanlar elle hazırlanmış, yaklaşık bölge zarflarıdır. Akademik olarak doğrulanmış tarihî sınır verisi veya kesin bir siyasi harita değildir.</p><h3>Siyasi alanlar</h3><p>İmparatorluk, bağlı hanlık ve çoklu yerel yönetimler farklı siyasi ilişkilere sahipti. Tek renk her zaman merkezi bir devlet anlamına gelmez. Küçük devletler, denizaşırı topraklar ve iç sınırların tamamı gösterilmez. Renksiz alanlar boş veya sahipsiz toprak değildir.</p><h3>Coğrafya ve kabartı</h3><p>Kıyılar, Basemap içindeki GSHHG coğrafya verisinden; fiziksel doku, NASA Blue Marble görüntüsünden alınır. Bunlar 1550’de ölçülmüş kıyılar değildir. Dağ sıraları coğrafi konumlarına göre modellenmiştir; yükseltiler <strong>temsili ve görsel olarak abartılıdır</strong>. Ölçülmüş bir sayısal yükseklik modeli kullanılmaz. İzdüşüm, enlemlerin eşit aralıklı olduğu bir atlas düzlemidir; alan ve mesafe ölçümü için kullanılmamalıdır.</p><p><a href="https://matplotlib.org/basemap/stable/users/geography.html" target="_blank" rel="noopener">Basemap · coğrafi veri ve görüntü kaynakları ↗</a></p><h3>Tarih okumaları</h3><p>Bu kaynaklar tarihsel açıklamaları ve dönem bağlamını destekler; elle çizilen her sınır noktasını doğrulamaz.</p>${unique.map(s=>`<div><a href="${esc(s[1])}" target="_blank" rel="noopener">${esc(s[0])} ↗</a></div>`).join('')}<h3>Çalışma biçimi</h3><p>Harita gerçek zamanlı WebGL 2 ile çizilir. Görüntü dokuları, açıklamalar ve kod dosyanın içine gömülüdür. Haritayı çalıştırmak için internet, üyelik veya API anahtarı gerekmez. Yalnızca dış kaynak bağlantıları internet kullanır.</p>`;$('modal').showModal();app.hideHover();}
function showHelp(){$('modal-title').textContent='Haritayı keşfet';$('modal-body').innerHTML=`<h3>Bilgisayarda</h3><p>Sol tuşla sürükleyerek haritayı döndür ve eğ. Fare tekerleğiyle yakınlaş veya uzaklaş. Sağ tuşla ya da Shift + sürükleme ile haritayı kaydır. Bir devletin üzerine geldiğinde kısa açıklama açılır; tıklayınca ayrıntı paneli görünür.</p><h3>Telefon ve tablette</h3><p>Tek parmakla sürükle: döndür. İki parmağını aç veya kapat: yakınlaştır. İki parmakla birlikte sürükle: kaydır. Devlet adına ya da renkli bölgeye dokun: açıklamayı aç. Daha geniş görünüm için telefonu yatay tut.</p><h3>Kısayollar</h3><p><span class="key">+ / −</span> Yakınlaştır / uzaklaştır<br><span class="key">Yön tuşları</span> Kaydır<br><span class="key">Home</span> Genel görünüm<br><span class="key">Boşluk</span> Sinematik turu başlat / durdur<br><span class="key">Esc</span> Açıklamayı kapat, turu durdur</p><h3>Keşif seçenekleri</h3><p><strong>Devletler:</strong> 34 siyasi yapı ve bölge grubu içinde ara.<br><strong>Katmanlar:</strong> siyasi renkleri, isimleri ve deniz hareketini aç/kapat. Kabartı yüksekliğini ayarla.<br><strong>Sinematik tur:</strong> kamera yedi bölge arasında otomatik dolaşır. Haritaya müdahale ettiğinde tur durur.</p><p>HTML dosyasının önizlemesi JavaScript çalıştırmıyorsa dosyayı gerçek bir web tarayıcısında aç. WebGL 2 destekli bir tarayıcı gerekir.</p>`;$('modal').showModal();app.hideHover();}
async function start(){try{renderer=new Renderer($('scene'));const [earth,ids,height]=await Promise.all([loadImage(ATLAS_ASSETS.earth),loadImage(ATLAS_ASSETS.regions),loadImage(ATLAS_ASSETS.height)]);pixelMaps={regions:imagePixels(ids)};const hp=imagePixels(height);renderer.texture(earth,0);renderer.texture(ids,1,true);renderer.texture(paletteImage(),2,true);app=new Atlas(hp);window.atlas=app;app.init();$('loading').hidden=true;requestAnimationFrame(t=>app.frame(t));}catch(error){console.error(error);$('loading').innerHTML=`<div class="loading-year">1550</div><p>Üç boyutlu görünüm başlatılamadı.</p><div class="error-detail">${esc(error.message||error)}</div><p>Dosyayı bir önizleme penceresi yerine Chrome, Edge veya Safari’de aç.</p>`;}}
start();
