/* ============ SCREEN STICKERS (little pets) ============ */
var pets=[],SAY=['Keep coding!','You got this!','Nice work!','Don’t forget </ tags>!','Night is coming…','Let’s build!','Yum, code!','Go go go!','Watch out for the deer!','Almost there!'];
function syncPets(){
  var want=(P.using||[]).filter(function(id){return itemById(id)&&ownedCount(id);});P.using=want;
  pets=pets.filter(function(p){if(want.indexOf(p.id)<0){p.el.remove();return false;}return true;});
  want.forEach(function(id){if(!pets.some(function(p){return p.id===id;}))addPet(itemById(id));});
  $('petsBtn').hidden=!want.length;$('pets').classList.toggle('off',!!P.petsOff);$('petsBtn').textContent=P.petsOff?'🙈':'🐾';
}
var MOVES=[['walk','🚶 walks'],['run','🏃 runs fast'],['hop','🐇 hops'],['roll','🛞 rolls'],['float','👻 floats'],['fly','🦅 flies'],['bounce','⚽ bounces around'],['chase','🐾 follows the mouse'],['climb','🕷️ climbs the edges'],['peek','🙈 peeks and hides'],['orbit','🌀 circles around'],['dance','💃 dances'],['sleep','😴 sleeps'],['stay','📌 stays still']];
var mouse={x:-1,y:-1};window.addEventListener('pointermove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;},true);
function rnd(a,b){return a+Math.random()*(b-a);}
function sign(){return Math.random()<.5?-1:1;}
function addPet(it){
  var el=document.createElement('div');el.className='pet';var SZ={S:42,M:58,L:86}[it.size||'M']||58;el.style.width=el.style.height=SZ+'px';el.style.setProperty('--s',SZ+'px');
  el.innerHTML='<div class="bubble"></div><div class="body">'+(it.img?'<img src="'+esc(it.img)+'" alt="">':esc(it.emoji||'⭐'))+'</div>';
  $('pets').appendChild(el);
  var mv=it.move||'walk',W=innerWidth,H=innerHeight;
  var p={S:SZ,id:it.id,el:el,body:el.querySelector('.body'),mode:mv,x:rnd(10,W-SZ-10),y:-60,vx:sign()*rnd(35,70),vy:0,pause:0,face:1,rot:0,t:rnd(0,10),drag:null,bubbleT:0,st:0,timer:0};
  if(mv==='run')p.vx*=3;
  if(mv==='float'){p.y=rnd(120,H-200);p.vy=sign()*25;}
  if(mv==='bounce'){p.vx=sign()*130;p.vy=sign()*110;p.y=rnd(100,H-200);}
  if(mv==='fly'){p.vx=sign()*rnd(80,120);p.base=rnd(90,H*.5);p.y=p.base;}
  if(mv==='orbit'){p.cx=rnd(150,W-150);p.cy=rnd(150,H-150);p.ang=0;p.y=p.cy;}
  if(mv==='climb'){p.edge=0;p.y=H-SZ;}
  if(mv==='peek'){p.st=0;p.timer=rnd(1,3);p.x=-SZ;p.y=H-SZ;}
  if(mv==='chase'){p.y=rnd(100,H-200);}
  if(mv==='stay'||mv==='dance'||mv==='sleep'){p.y=rnd(140,H-SZ-10);}
  el.classList.add('m-'+mv);
  el.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();p.drag={sx:e.clientX,sy:e.clientY,ox:e.clientX-p.x,oy:e.clientY-p.y,moved:false};el.setPointerCapture(e.pointerId);el.style.cursor='grabbing';});
  el.addEventListener('pointermove',function(e){if(!p.drag)return;if(Math.abs(e.clientX-p.drag.sx)+Math.abs(e.clientY-p.drag.sy)>4)p.drag.moved=true;if(p.drag.moved){p.x=e.clientX-p.drag.ox;p.y=e.clientY-p.drag.oy;p.vy=0;}});
  el.addEventListener('pointerup',function(){if(!p.drag)return;var moved=p.drag.moved;p.drag=null;el.style.cursor='grab';if(moved)dropped(p);else poke(p);});
  pets.push(p);return p;
}
function dropped(p){
  var W=innerWidth,H=innerHeight,S=p.S;
  if(p.mode==='orbit'){p.cx=p.x;p.cy=p.y;p.ang=0;}
  if(p.mode==='fly')p.base=p.y;
  if(p.mode==='climb'){var d=[H-S-p.y,W-S-p.x,p.y,p.x],m=Math.min.apply(null,d);p.edge=d.indexOf(m);}
  if(p.mode==='peek'){p.st=0;p.timer=rnd(2,4);}
}
function say(p,t){var b=p.el.querySelector('.bubble');b.textContent=t;b.classList.add('show');p.bubbleT=1.8;}
function poke(p){
  var m=p.mode;
  if(m==='sleep'){p.awake=2;p.hopv=-380;say(p,['Huh?!','Five more minutes…','I’m awake!'][Math.floor(Math.random()*3)]);return;}
  if(m==='peek'){say(p,'Boo!');p.st=2;p.timer=1.2;return;}
  if(m==='bounce'){p.vx*=-1;p.vy=-Math.abs(p.vy||110);}
  else if(m==='float'||m==='fly'||m==='chase'||m==='orbit'){p.spin=1;}
  else if(m==='climb'){p.spin=1;}
  else if(m!=='stay'&&m!=='dance')p.vy=-520;
  else{p.spin=1;p.hopv=-380;}
  say(p,SAY[Math.floor(Math.random()*SAY.length)]);
}
function cheerPets(){pets.forEach(function(p,i){setTimeout(function(){if(/^(walk|run|hop|roll)$/.test(p.mode))p.vy=-620;else p.spin=1;if(p.mode==='peek'){p.st=1;p.timer=2;}say(p,['Yay!','Woohoo!','Awesome!','🎉'][i%4]);},i*120);});}
function ground(p,dt,H){var g=H-p.S-4;p.vy+=1400*dt;p.y+=p.vy*dt;if(p.y>g){p.y=g;p.vy=0;}return p.y>=g-.5;}
function walls(p,W){var S=p.S;if(p.x<0){p.x=0;p.vx=Math.abs(p.vx);}if(p.x>W-S){p.x=W-S;p.vx=-Math.abs(p.vx);}}
var lastT=0;
function petLoop(t){
  var dt=Math.min(.05,(t-lastT)/1000||0);lastT=t;
  var W=innerWidth,H=innerHeight;
  pets.forEach(function(p){
    var S=p.S,m=p.mode,rot=0,walking=false,flip=true;p.t+=dt;
    if(p.bubbleT>0){p.bubbleT-=dt;if(p.bubbleT<=0)p.el.querySelector('.bubble').classList.remove('show');}
    if(!p.drag){
      if(m==='walk'||m==='run'||m==='hop'||m==='roll'){
        var og=p.y>=H-S-4.5;
        if(p.pause>0)p.pause-=dt;else{p.x+=p.vx*dt;if(og&&m!=='run'&&Math.random()<dt*.25)p.pause=rnd(1,3);}
        if(m==='hop'&&og&&p.pause<=0&&Math.random()<dt*1.2)p.vy=-rnd(300,450);
        og=ground(p,dt,H);walls(p,W);walking=og&&p.pause<=0&&m!=='roll';
        if(m==='roll'){p.rot+=p.vx*dt/(S/2)*57.3;rot=p.rot;flip=false;}
      }else if(m==='float'){
        p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx+=(Math.random()-.5)*20*dt;p.vy+=(Math.random()-.5)*20*dt;
        var sp=Math.hypot(p.vx,p.vy);if(sp>60){p.vx*=.98;p.vy*=.98;}if(sp<20){p.vx*=1.05;p.vy*=1.05;}
        walls(p,W);if(p.y<70){p.y=70;p.vy=Math.abs(p.vy);}if(p.y>H-S){p.y=H-S;p.vy=-Math.abs(p.vy);}
      }else if(m==='fly'){
        p.x+=p.vx*dt;walls(p,W);p.base=Math.max(70,Math.min(H-S-60,p.base+(Math.random()-.5)*30*dt));p.y=p.base+Math.sin(p.t*2.2)*45;rot=Math.sin(p.t*2.2+1.5)*-12*(p.vx<0?-1:1);
      }else if(m==='bounce'){
        p.x+=p.vx*dt;p.y+=p.vy*dt;walls(p,W);if(p.y<0){p.y=0;p.vy=Math.abs(p.vy);}if(p.y>H-S){p.y=H-S;p.vy=-Math.abs(p.vy);}
      }else if(m==='chase'){
        if(mouse.x>=0){var dx=mouse.x-(p.x+S/2),dy=mouse.y-(p.y+S/2),dd=Math.hypot(dx,dy);
          if(dd>S+20){var v=Math.min(260,dd*2);p.vx=dx/dd*v;p.x+=p.vx*dt;p.y+=dy/dd*v*dt;walking=true;}}
      }else if(m==='climb'){
        var v2=70*dt;walking=true;flip=false;
        if(p.edge===0){p.y=H-S;p.x+=v2;rot=0;if(p.x>=W-S){p.x=W-S;p.edge=1;}}
        else if(p.edge===1){p.x=W-S;p.y-=v2;rot=-90;if(p.y<=0){p.y=0;p.edge=2;}}
        else if(p.edge===2){p.y=0;p.x-=v2;rot=180;if(p.x<=0){p.x=0;p.edge=3;}}
        else{p.x=0;p.y+=v2;rot=90;if(p.y>=H-S){p.y=H-S;p.edge=0;}}
      }else if(m==='peek'){
        p.timer-=dt;
        if(p.st===0&&p.timer<=0){p.side=Math.floor(Math.random()*3);p.pos=p.side===2?rnd(40,W-S-40):rnd(120,H-S-40);p.st=1;p.timer=rnd(2,3.5);p.k=0;}
        if(p.st===1){p.k=Math.min(1,p.k+dt*2.5);if(p.timer<=0){p.st=2;p.timer=.6;}}
        if(p.st===2){p.k=Math.max(0,p.k-dt*2.5);if(p.k<=0){p.st=0;p.timer=rnd(3,7);}}
        var show=p.k*S*.6;
        if(p.side===0){p.x=-S+show;p.y=p.pos;rot=90*(1-p.k)*0+20;p.face=-1;}
        else if(p.side===1){p.x=W-show;p.y=p.pos;rot=-20;p.face=1;}
        else{p.x=p.pos;p.y=H-show;rot=0;}
        flip=false;
      }else if(m==='orbit'){
        p.ang+=1.3*dt;p.x=p.cx+Math.cos(p.ang)*90-S/2+S/2;p.y=p.cy+Math.sin(p.ang)*60;p.vx=-Math.sin(p.ang);
      }else if(m==='sleep'){
        if(p.awake>0)p.awake-=dt;else if(p.bubbleT<=0&&Math.random()<dt*.35)say(p,'💤');
      }
      p.x=Math.max(-S,Math.min(W,p.x));p.y=Math.max(-S,Math.min(H,p.y));
      if(flip&&Math.abs(p.vx)>1)p.face=p.vx<0?1:-1;
    }
    if(p.hopv||p.hopy){p.hopy=(p.hopy||0)+(p.hopv||0)*dt;p.hopv=(p.hopv||0)+1400*dt;if(p.hopy>=0){p.hopy=0;p.hopv=0;}}
    if(p.spin>0){p.spin-=dt*1.6;rot+=(1-p.spin)*360;if(p.spin<=0)p.spin=0;}
    p.el.classList.toggle('walking',walking&&m!=='climb');
    p.el.classList.toggle('crawl',m==='climb');
    p.el.style.transform='translate('+p.x.toFixed(1)+'px,'+(p.y+(p.hopy||0)).toFixed(1)+'px)';
    p.body.style.transform='rotate('+rot.toFixed(1)+'deg) scaleX('+(flip||m==='peek'?p.face:1)+')';
  });
  requestAnimationFrame(petLoop);
}
requestAnimationFrame(petLoop);
$('petsBtn').onclick=function(){P.petsOff=!P.petsOff;saveP();syncPets();toast(P.petsOff?'🙈 Stickers hidden':'🐾 Stickers are back!');};


