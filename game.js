const cv=document.getElementById('c'),g=cv.getContext('2d'),W=800,H=560;
const keys={};let mouse={x:400,y:280};
const CL=[
{n:'Samurai',w:'Katana',col:'#3aa0ff',cd:.38,range:72,arc:.9,dmg:1,kb:12,len:30,sk:'Dash Slash',skcd:5,d:'Nhanh, chém nhẹ'},
{n:'Berserker',w:'Rìu',col:'#e67e22',cd:1.0,range:80,arc:1.5,dmg:2,kb:30,len:26,sk:'Whirlwind',skcd:7,d:'Chậm, đánh rộng, đau'},
{n:'Lancer',w:'Thương',col:'#2ecc71',cd:.65,range:115,arc:.35,dmg:1.5,kb:20,len:50,sk:'Piercing Thrust',skcd:6,d:'Tầm xa, hẹp'}];
addEventListener('keydown',e=>{keys[e.code]=true;if(e.code=='Space')e.preventDefault();
 if(mode=='select'&&'123'.includes(e.key)&&e.key)start(+e.key-1);
 if(mode!='play'){if(e.code=='KeyR')mode='select';return}
 if(e.code=='ShiftLeft')doParry();if(e.code=='Space')doDodge();if(e.code=='KeyQ')doSkill();if(P.fuse&&'123'.includes(e.key))setFuse(+e.key-1);if(e.code=='KeyR')mode='select'});
addEventListener('keyup',e=>keys[e.code]=false);
cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();mouse.x=(e.clientX-r.left)*W/r.width;mouse.y=(e.clientY-r.top)*H/r.height});
cv.addEventListener('mousedown',e=>{if(mode=='select'){const i=Math.floor(mouse.x/(W/3));start(i);return}
 if(mode=='play')e.button==0?doAttack():doParry()});
cv.addEventListener('contextmenu',e=>e.preventDefault());

let mode='select',P,C,E,FX,wave,score,msg,msgT,WP,D,S,FT,ci;
function start(i){C=CL[i];ci=i;P={x:400,y:280,hp:5,max:5,st:100,a:0,dodge:0,dspd:480,dd:{x:0,y:0},parry:0,pcd:0,atk:0,atkDur:.2,acd:0,skcd:0,iframe:0,hurt:0,lvl:1,xp:0,hitDone:true,sfx:null};
 E=[];FX=[];D=[];initMap();P.fus=null;P.fuse=false;WP=C;wave=0;score=0;mode='play';nextWave()}
function nextWave(){wave++;const bw=wave%3==0,n=bw?1:1+Math.ceil(wave/2);for(let i=0;i<n;i++){const s=Math.random()*6.28;
 E.push({x:400+Math.cos(s)*380,y:280+Math.sin(s)*280,hp:4+Math.floor(wave/3),a:0,state:'chase',t:0,hit:false,spd:60+wave*5,wind:Math.max(.4,.75-wave*.03),cw:.6,flash:0,dodge:0,dcd:1+Math.random()*2,iframe:0,dv:{x:0,y:0}})}
 if(bw){const hp=30+wave*3;E.push({boss:true,x:400,y:30,hp,max:hp,a:0,state:'chase',t:0,hit:false,spd:55,wind:.9,cw:.9,flash:0,dodge:0,dcd:99,iframe:0,dv:{x:0,y:0},atk:'slam'})}
 say(bw?'BOSS WAVE '+wave:'Wave '+wave)}
function say(m){msg=m;msgT=1.5}
function spark(x,y,c,n=10){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=80+Math.random()*160;FX.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:.35,c})}}
const ang=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
const aim=(e)=>Math.atan2(e.y-P.y,e.x-P.x);

function doAttack(){ // chống spam: phải đợi hết delay của vũ khí, bấm sớm bị phạt thêm
 if(P.dodge>0)return;
 if(P.acd>0){P.acd=Math.min(WP.cd*1.4,P.acd+.06);return}
 if(P.st<10)return;P.st-=10;P.acd=WP.cd;P.atkDur=Math.min(.4,WP.cd*.5);P.atk=P.atkDur;P.hitDone=false;if(WP.fx=='lunge'){P.x+=Math.cos(P.a)*45;P.y+=Math.sin(P.a)*45}}
function doParry(){if(P.pcd>0||P.dodge>0||P.atk>0)return;P.parry=.2;P.pcd=.55}
function doDodge(){if(P.dodge>0||P.st<25)return;P.st-=25;
 let dx=(keys.KeyD?1:0)-(keys.KeyA?1:0),dy=(keys.KeyS?1:0)-(keys.KeyW?1:0);
 if(!dx&&!dy){dx=Math.cos(P.a);dy=Math.sin(P.a)}const l=Math.hypot(dx,dy);P.dd={x:dx/l,y:dy/l};P.dspd=480;P.dodge=.22;P.iframe=.22}
function hit(range,arc,dmg,kb,full){for(const e of E){if(e.dead)continue;const d=Math.hypot(e.x-P.x,e.y-P.y);
 if(d<range+14&&(full||ang(aim(e),P.a)<arc))hurtE(e,dmg,kb)}}
function hurtE(e,dmg,kb){
 if(e.iframe>0)return;
 if(!e.boss&&e.state!='stun'&&e.dcd<=0&&Math.random()<.4){ // NPC né đòn
  const s=Math.random()<.5?1:-1,p=aim(e)+Math.PI/2*s;e.dv={x:Math.cos(p)*380,y:Math.sin(p)*380};
  e.dodge=.25;e.iframe=.3;e.dcd=2.5;e.state='chase';spark(e.x,e.y,'#aaa',6);say('NÉ!');return}
 dmg*=1+.12*(P.lvl-1);if(e.state=='stun')dmg*=2;
 e.hp-=dmg;e.flash=.15;if(WP.fx=='bleed')e.bleed=3;if(WP.fx=='stun'&&!e.boss&&e.state!='stun'&&Math.random()<.35){e.state='stun';e.t=.6;say('CHẤN ĐỘNG!')}spark(e.x,e.y,e.state=='stun'?'#ffd23f':'#fff',e.state=='stun'?20:8);
 const k=aim(e),kk=e.boss?kb*.2:kb;e.x+=Math.cos(k)*kk;e.y+=Math.sin(k)*kk;
 if(e.state=='stun')say('CRIT!');
 if(e.hp<=0)kill(e)}
function gainXp(){P.xp++;const need=P.lvl+1;
 if(P.xp>=need){P.xp-=need;P.lvl++;if(P.lvl%2)P.max++;P.hp=Math.min(P.max,P.hp+1);P.st=100;
  say(P.lvl==2?'LV2 · MỞ KHÓA: '+C.sk+' (Q)':P.lvl==4?'LV4 · '+C.sk+' mạnh hơn!':'LEVEL UP '+P.lvl);spark(P.x,P.y,'#ffd23f',30)}}
function doSkill(){
 if(P.lvl<2){say('Kỹ năng mở ở Lv2');return}
 if(P.skcd>0||P.st<20)return;P.skcd=C.skcd;P.st-=20;const b=P.lvl>=4?1:0,ca=Math.cos(P.a),sa=Math.sin(P.a);
 if(C.n=='Samurai'){const L=150;for(const e of E){const rx=e.x-P.x,ry=e.y-P.y,t=Math.max(0,Math.min(L,rx*ca+ry*sa));
  if(Math.hypot(rx-ca*t,ry-sa*t)<40)hurtE(e,2+b,15)}
  P.dd={x:ca,y:sa};P.dspd=L/.15;P.dodge=.15;P.iframe=.3;P.sfx={t:.25,r:L,w:.12,full:false}}
 else if(C.n=='Berserker'){hit(100,0,2+b,40,true);P.sfx={t:.35,r:100,w:0,full:true}}
 else{hit(190,.28,3+b,50,false);P.sfx={t:.25,r:190,w:.28,full:false}}}

function update(d){
 if(mode!='play')return;
 P.a=Math.atan2(mouse.y-P.y,mouse.x-P.x);
 for(const k of['parry','pcd','atk','acd','skcd','iframe','hurt'])if(P[k]>0)P[k]-=d;
 if(P.sfx&&(P.sfx.t-=d)<=0)P.sfx=null;
 P.st=Math.min(100,P.st+(P.parry>0||P.atk>0?0:22)*d);
 if(P.dodge>0){P.dodge-=d;P.x+=P.dd.x*P.dspd*d;P.y+=P.dd.y*P.dspd*d}
 else{let dx=(keys.KeyD?1:0)-(keys.KeyA?1:0),dy=(keys.KeyS?1:0)-(keys.KeyW?1:0);
  const l=Math.hypot(dx,dy)||1,sp=P.parry>0?60:P.atk>0?55:170;P.x+=dx/l*sp*d;P.y+=dy/l*sp*d}
 P.x=Math.max(16,Math.min(W-16,P.x));P.y=Math.max(16,Math.min(H-16,P.y));push(P,15);
 if(P.atk>0&&!P.hitDone&&P.atk<=P.atkDur*.5){P.hitDone=true;hit(WP.range,WP.arc,WP.dmg,WP.kb,false)}
 for(const e of E){if(e.dead)continue;e.t+=d;if(e.flash>0)e.flash-=d;if(e.iframe>0)e.iframe-=d;if(e.dcd>0)e.dcd-=d;
  if(e.dodge>0){e.dodge-=d;e.x+=e.dv.x*d;e.y+=e.dv.y*d;continue}
  const dist=Math.hypot(P.x-e.x,P.y-e.y),toP=Math.atan2(P.y-e.y,P.x-e.x);
  if(e.state=='chase'){e.a=toP;if(dist>(e.boss?70:46)){e.x+=Math.cos(toP)*e.spd*d;e.y+=Math.sin(toP)*e.spd*d}
   else{e.state='wind';e.t=0;e.hit=false;e.cw=e.wind*(.8+Math.random()*.5);e.atk=e.boss&&Math.random()<.45?'charge':'slam'}}
  else if(e.state=='wind'){e.a=toP;if(e.t>e.cw){e.state='strike';e.t=0}}
  else if(e.state=='strike'){
   if(e.atk=='charge'&&e.boss){e.x+=Math.cos(e.a)*520*d;e.y+=Math.sin(e.a)*520*d}
   if(!e.hit&&(e.boss?(e.atk=='charge'?dist<46:dist<100):dist<62&&ang(aim(e)+Math.PI,e.a)<1)){e.hit=true;
    if(P.iframe>0){}
    else if(P.parry>0&&ang(aim(e),P.a)<1.2){e.state='stun';e.t=0;P.st=100;P.pcd=0;spark((P.x+e.x)/2,(P.y+e.y)/2,'#6cf',24);say('PARRY!');score+=5;
     const k=aim(e);e.x+=Math.cos(k)*30;e.y+=Math.sin(k)*30}
    else{P.hp-=e.boss?2:1;P.hurt=.4;spark(P.x,P.y,'#f44',14);const k=aim(e)+Math.PI;P.x+=Math.cos(k)*25;P.y+=Math.sin(k)*25;
     if(P.hp<=0)mode='over'}}
   if(e.state=='strike'&&e.t>(e.atk=='charge'?.4:.15)){if(!e.boss&&Math.random()<.3&&dist<80){e.state='wind';e.t=0;e.hit=false;e.cw=.3}else{e.state='recover';e.t=0}}}
  else if(e.state=='recover'){if(e.t>.6)e.state='chase'}
  else if(e.state=='stun'){if(e.t>1.4)e.state='chase'}}
 E=E.filter(e=>!e.dead);world(d);
 for(const a of E)for(const b of E)if(a!=b){const dx=a.x-b.x,dy=a.y-b.y,l=Math.hypot(dx,dy);
  if(l>0&&l<30){a.x+=dx/l*30*d;a.y+=dy/l*30*d}}
 for(const f of FX){f.t-=d;f.x+=f.vx*d;f.y+=f.vy*d}FX=FX.filter(f=>f.t>0);
 if(msgT>0)msgT-=d;
 if(!E.length)nextWave();
}
function arc(x,y,a,r,w,fill){g.beginPath();g.moveTo(x,y);g.arc(x,y,r,a-w,a+w);g.closePath();g.fillStyle=fill;g.fill()}
function bar(x,y,w,v,col){g.fillStyle='#444';g.fillRect(x,y,w,8);g.fillStyle=col;g.fillRect(x,y,w*Math.max(0,Math.min(1,v)),8)}
function drawSelect(){g.fillStyle='#fff';g.textAlign='center';g.font='bold 32px sans-serif';g.fillText('PARRY ARENA',W/2,80);
 g.font='16px sans-serif';g.fillText('Chọn class: bấm 1 / 2 / 3 hoặc click',W/2,110);
 CL.forEach((c,i)=>{const x=i*W/3+W/6;g.fillStyle=c.col+'33';g.fillRect(x-115,150,230,300);g.strokeStyle=c.col;g.strokeRect(x-115,150,230,300);
  g.beginPath();g.arc(x,215,22,0,6.28);g.fillStyle=c.col;g.fill();
  g.fillStyle='#fff';g.font='bold 22px sans-serif';g.fillText((i+1)+'. '+c.n,x,280);g.font='15px sans-serif';
  [c.w+' · '+c.d,'Delay đánh: '+c.cd+'s','Tầm: '+c.range,'Skill Lv2: '+c.sk].forEach((t,j)=>g.fillText(t,x,315+j*28))})}
function draw(){
 g.clearRect(0,0,W,H);
 if(mode=='select'){drawSelect();return}
 g.strokeStyle='#ffffff10';for(let i=0;i<W;i+=40){g.beginPath();g.moveTo(i,0);g.lineTo(i,H);g.stroke()}
 for(let i=0;i<H;i+=40){g.beginPath();g.moveTo(0,i);g.lineTo(W,i);g.stroke()}
 drawMap();
 for(const e of E){const br=e.boss?26:15;
  if(e.state=='wind'){const c=`rgba(255,60,60,${.15+.35*e.t/e.cw})`;
   if(e.boss&&e.atk=='slam'){g.beginPath();g.arc(e.x,e.y,100,0,6.28);g.fillStyle=c;g.fill()}
   else if(e.boss){g.save();g.translate(e.x,e.y);g.rotate(e.a);g.fillStyle=c;g.fillRect(0,-20,260,40);g.restore()}
   else arc(e.x,e.y,e.a,62,1,c)}
  if(e.state=='strike'){if(!e.boss)arc(e.x,e.y,e.a,62,1,'rgba(255,255,255,.7)');else if(e.atk=='slam'){g.beginPath();g.arc(e.x,e.y,100,0,6.28);g.fillStyle='rgba(255,255,255,.6)';g.fill()}}
  g.globalAlpha=e.iframe>0?.4:1;
  fig(e.x,e.y,e.a,br,e.flash>0?'#fff':e.state=='stun'?'#ffd23f':e.boss?'#6c2a8a':'#8e2b24',e.boss?'#2d1040':'#3b1210',[e.boss?1:0],e.state=='wind'?-.9:e.state=='strike'?.9:0,0);
  g.globalAlpha=1;
  if(!e.boss)for(let i=0;i<Math.ceil(e.hp);i++){g.fillStyle='#f55';g.fillRect(e.x-14+i*7,e.y-30,5,4)}
  if(e.state=='stun'){g.fillStyle='#fff';g.font='11px sans-serif';g.textAlign='center';g.fillText('STUN',e.x,e.y-br-14)}}
 if(P.atk>0)arc(P.x,P.y,P.a,WP.range,WP.arc,`rgba(255,255,255,${P.atk/P.atkDur*.4})`);
 if(P.sfx)arc(P.x,P.y,P.a,P.sfx.r,P.sfx.full?3.2:P.sfx.w,C.col+'88');
 if(P.parry>0)arc(P.x,P.y,P.a,36,1.2,'rgba(100,200,255,.6)');
 const ks=P.fus==null?[ci]:[ci,P.fus],off=P.atk>0?(P.atk/P.atkDur-.5)*WP.arc*1.6:0;
 g.globalAlpha=P.iframe>0?.45:1;
 fig(P.x,P.y,P.a,15,P.hurt>0?'#f88':C.col,P.fus==null?'#1c1f26':WP.col,ks,off,P.atk>0&&ks.includes(2)?14:0);
 g.globalAlpha=1;
 for(const f of FX){g.fillStyle=f.c;g.fillRect(f.x,f.y,3,3)}
 g.fillStyle='#fff';g.font='13px sans-serif';g.textAlign='left';
 g.fillText(C.n+' · '+(P.fus==null?C.w:WP.n)+' · Lv'+P.lvl,12,20);
 for(let i=0;i<P.max;i++){g.fillStyle=i<P.hp?'#e74c3c':'#555';g.fillRect(12+i*18,28,14,12)}
 g.fillStyle='#fff';g.fillText('ST',12,60);bar(36,52,100,P.st/100,'#4cd964');
 g.fillText('XP',12,78);bar(36,70,100,P.xp/(P.lvl+1),'#ffd23f');
 g.fillText('Đánh',12,96);bar(46,88,90,1-P.acd/WP.cd,'#fff');
 g.fillText('Q',12,114);bar(36,106,100,P.lvl<2?0:1-P.skcd/C.skcd,C.col);
 g.textAlign='right';g.fillText(P.lvl<2?'Skill: khóa (Lv2)':'Q: '+C.sk,W-12,38);
 g.font='14px sans-serif';g.fillText('Wave '+wave+' · Điểm '+score,W-12,20);
 g.textAlign='center';
 drawExtra();if(msgT>0){g.globalAlpha=Math.min(1,msgT);g.font='bold 26px sans-serif';g.fillText(msg,W/2,70);g.globalAlpha=1}
 if(mode=='over'){g.fillStyle='#000a';g.fillRect(0,0,W,H);g.fillStyle='#fff';g.font='bold 40px sans-serif';g.fillText('GAME OVER',W/2,260);
  g.font='18px sans-serif';g.fillText('Lv'+P.lvl+' · Wave '+wave+' · Điểm '+score+' — nhấn R để chọn lại class',W/2,300)}
}

const FUS={1:{n:'Huyết Nguyệt',fx:'bleed',col:'#e74c3c',cd:.7,range:85,arc:1.3,dmg:1.6,kb:20,d:'chảy máu 3s'},
2:{n:'Phong Thương',fx:'lunge',col:'#1abc9c',cd:.5,range:105,arc:.5,dmg:1.3,kb:15,d:'lao tới khi đánh'},
3:{n:'Địa Chấn',fx:'stun',col:'#f1c40f',cd:1.1,range:105,arc:.9,dmg:2.3,kb:35,d:'35% gây choáng'}};
function setFuse(i){P.fus=i==ci?null:i;WP=P.fus==null?C:FUS[ci+P.fus];say(P.fus==null?'Vũ khí gốc: '+C.w:'DUNG HỢP: '+WP.n+' ('+WP.d+')')}
function initMap(){S=[{x:190,y:130,w:46,h:46},{x:564,y:130,w:46,h:46},{x:190,y:384,w:46,h:46},{x:564,y:384,w:46,h:46},{x:350,y:60,w:100,h:16},{x:350,y:484,w:100,h:16}];FT={x:400,y:280,cd:0}}
function push(o,r){for(const s of S){const cx=Math.max(s.x,Math.min(s.x+s.w,o.x)),cy=Math.max(s.y,Math.min(s.y+s.h,o.y)),dx=o.x-cx,dy=o.y-cy,d=Math.hypot(dx,dy);
 if(d<r){if(d==0)o.y=s.y-r;else{o.x+=dx/d*(r-d);o.y+=dy/d*(r-d)}}}}
function kill(e){e.dead=true;score+=e.boss?100:10;spark(e.x,e.y,'#f55',e.boss?50:24);
 if(e.boss){D.push({x:e.x,y:e.y});say('BOSS HẠ GỤC! Nhặt Lõi Dung Hợp');for(let i=0;i<4;i++)gainXp()}else gainXp()}
function world(d){for(const e of E)if(e.bleed>0&&!e.dead){e.bleed-=d;e.bt=(e.bt||0)+d;if(e.bt>=1){e.bt=0;e.hp-=1;spark(e.x,e.y,'#c0392b',6);if(e.hp<=0)kill(e)}}
 E=E.filter(e=>!e.dead);for(const e of E)push(e,e.boss?26:15);
 if(FT.cd>0)FT.cd-=d;
 if(FT.cd<=0&&P.hp<P.max&&Math.hypot(P.x-FT.x,P.y-FT.y)<34){P.hp++;FT.cd=10;spark(FT.x,FT.y,'#6cf',16);say('Suối hồi 1 máu')}
 for(const o of D)if(Math.hypot(P.x-o.x,P.y-o.y)<28){o.got=true;
  if(P.fuse){P.hp=P.max;say('Lõi: hồi đầy máu')}else{P.fuse=true;say('MỞ KHÓA DUNG HỢP! Bấm 1/2/3 chọn vũ khí kết hợp')}spark(o.x,o.y,'#c6f',30)}
 D=D.filter(o=>!o.got)}
function drawMap(){
 g.fillStyle='#2a3a4a';g.beginPath();g.arc(FT.x,FT.y,34,0,6.28);g.fill();g.strokeStyle='#7f8c9a';g.lineWidth=4;g.stroke();
 g.fillStyle=FT.cd>0?'#3b5566':'#4fc3f7';g.beginPath();g.arc(FT.x,FT.y,22,0,6.28);g.fill();
 for(const s of S){g.fillStyle='#4a4f5a';g.fillRect(s.x,s.y,s.w,s.h);g.fillStyle='#6a707d';g.fillRect(s.x,s.y,s.w,4);g.strokeStyle='#111';g.lineWidth=2;g.strokeRect(s.x,s.y,s.w,s.h)}
 const t=performance.now()/300;
 for(const o of D){g.save();g.translate(o.x,o.y);g.rotate(t);g.fillStyle='#c06cff';g.fillRect(-9,-9,18,18);g.restore();g.beginPath();g.arc(o.x,o.y,18+Math.sin(t*2)*3,0,6.28);g.strokeStyle='#c06cff88';g.lineWidth=2;g.stroke()}}
function drawExtra(){const b=E.find(e=>e.boss);
 if(b){g.fillStyle='#000a';g.fillRect(W/2-152,H-30,304,16);g.fillStyle='#a03ad0';g.fillRect(W/2-150,H-28,300*Math.max(0,b.hp/b.max),12);g.fillStyle='#fff';g.font='12px sans-serif';g.textAlign='center';g.fillText('BOSS',W/2,H-34)}
 if(P.fuse){g.fillStyle='#fff';g.font='13px sans-serif';g.textAlign='left';g.fillText('Dung hợp: '+CL.map((c,i)=>(i+1)+'='+c.w).join(' ')+(P.fus==null?'':' → '+WP.n),12,134)}}
function wpn(k,r,sw,i,n,ext){g.save();g.translate(r*.5,(i?-1:1)*r*.85);g.rotate(sw*(i?-1:1)+(n>1?(i?-.25:.25):0));
 if(k==2)g.translate(ext,0);
 g.fillStyle='#6b4a2b';
 if(k==0){g.fillRect(-r*.4,-1.5,r*.5,3);g.fillStyle='#d4af37';g.fillRect(r*.1,-r*.3,3,r*.6);g.fillStyle='#e8eef5';g.beginPath();g.moveTo(r*.1,-2);g.lineTo(r*2.1,-1);g.lineTo(r*2.4,1);g.lineTo(r*.1,2);g.fill()}
 else if(k==1){g.fillRect(-r*.4,-2,r*1.9,4);g.fillStyle='#aab3bd';g.beginPath();g.moveTo(r*1.2,0);g.lineTo(r*1.5,-r*.9);g.lineTo(r*1.95,-r*.3);g.lineTo(r*1.95,r*.3);g.lineTo(r*1.5,r*.9);g.closePath();g.fill();g.strokeStyle='#222';g.lineWidth=1;g.stroke()}
 else{g.fillRect(-r*.8,-1.5,r*3.4,3);g.fillStyle='#dfe6ee';g.beginPath();g.moveTo(r*2.6,-r*.28);g.lineTo(r*3.3,0);g.lineTo(r*2.6,r*.28);g.fill()}
 g.restore()}
function fig(x,y,a,r,col,acc,ks,sw,ext){g.save();g.translate(x,y);
 g.fillStyle='#0005';g.beginPath();g.ellipse(0,r*.8,r*1.1,r*.4,0,0,6.28);g.fill();
 g.rotate(a);ks.forEach((k,i)=>wpn(k,r,sw,i,ks.length,ext));
 g.fillStyle=acc;g.beginPath();g.moveTo(-r*.3,-r*.8);g.lineTo(-r*1.6,0);g.lineTo(-r*.3,r*.8);g.closePath();g.fill();
 g.fillStyle=col;g.beginPath();g.ellipse(0,0,r*.65,r*1.05,0,0,6.28);g.fill();g.strokeStyle='#000b';g.lineWidth=2;g.stroke();
 g.fillStyle=acc;g.beginPath();g.arc(r*.35,-r*.95,r*.3,0,6.28);g.arc(r*.35,r*.95,r*.3,0,6.28);g.fill();
 g.fillStyle='#f1c9a0';g.beginPath();g.arc(r*.15,0,r*.5,0,6.28);g.fill();g.stroke();
 g.fillStyle=acc;g.beginPath();g.arc(r*.05,0,r*.52,Math.PI*.6,Math.PI*1.4);g.fill();
 g.fillStyle='#111';g.fillRect(r*.45,-r*.25,3,3);g.fillRect(r*.45,r*.15,3,3);
 if(r>20){g.fillStyle='#e8e8e8';g.beginPath();g.moveTo(0,-r*.4);g.lineTo(r*.3,-r*1.2);g.lineTo(r*.5,-r*.35);g.moveTo(0,r*.4);g.lineTo(r*.3,r*1.2);g.lineTo(r*.5,r*.35);g.fill()}
 g.restore()}
let last=performance.now();
function loop(t){const d=Math.min(.05,(t-last)/1000);last=t;update(d);draw();requestAnimationFrame(loop)}
requestAnimationFrame(loop);
