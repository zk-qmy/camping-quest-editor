/* ============ RESIZE PANELS ============ */
var LDEF={ta:330,tb:0,ba:290,bc:390,bq:0.46},LAY=Object.assign({},LDEF,P.layout||{});
function applyLayout(){
  var m=document.querySelector('main');if(!m)return;
  if(P.mode==='blocks'){m.style.gridTemplateColumns=LAY.ba+'px minmax(0,1fr) '+LAY.bc+'px';m.style.gridTemplateRows='minmax(0,'+LAY.bq+'fr) minmax(0,'+(1-LAY.bq).toFixed(3)+'fr)';}
  else{m.style.gridTemplateColumns=LAY.ta+'px '+(LAY.tb?LAY.tb+'px':'minmax(0,1fr)')+' minmax(0,1fr)';m.style.gridTemplateRows='';}
  placeHandles();
}
function placeHandles(){
  var r1=$('rz1'),r2=$('rz2'),r3=$('rz3');
  var off=innerWidth<=1100||!$('teacherView').hidden;
  [r1,r2,r3].forEach(function(r){r.hidden=off;});if(off)return;
  function between(h,a,b){var A=$(a).getBoundingClientRect(),Bb=$(b).getBoundingClientRect();h.style.left=((A.right+Bb.left)/2-6)+'px';h.style.top=Math.max(A.top,Bb.top)+'px';h.style.height=Math.min(A.height,Bb.height)+'px';}
  if(P.mode==='blocks'){between(r1,'palCol','wsCol');between(r2,'wsCol','qCol');
    var Q1=$('qCol').getBoundingClientRect(),P1=$('preCol').getBoundingClientRect();r3.hidden=false;r3.style.left=Q1.left+'px';r3.style.width=Q1.width+'px';r3.style.top=((Q1.bottom+P1.top)/2-6)+'px';}
  else{between(r1,'qCol','edCol');between(r2,'edCol','preCol');r3.hidden=true;}
}
var rzd=null;
['rz1','rz2','rz3'].forEach(function(id){
  var h=$(id);
  h.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();h.setPointerCapture(e.pointerId);h.classList.add('on');document.body.classList.add('resizing');
    var m=document.querySelector('main').getBoundingClientRect();
    rzd={id:id,x:e.clientX,y:e.clientY,L:Object.assign({},LAY),ed:$('edCol').getBoundingClientRect().width,mw:m.width,q:$('qCol').getBoundingClientRect(),p:$('preCol').getBoundingClientRect()};});
  h.addEventListener('pointermove',function(e){if(!rzd||rzd.id!==id)return;var dx=e.clientX-rzd.x,G=12;
    function cl(v,a,b){return Math.max(a,Math.min(b,v));}
    if(P.mode==='blocks'){
      if(id==='rz1')LAY.ba=cl(rzd.L.ba+dx,190,Math.max(190,rzd.mw-rzd.L.bc-300-2*G-24));
      else if(id==='rz2')LAY.bc=cl(rzd.L.bc-dx,280,Math.max(280,rzd.mw-rzd.L.ba-300-2*G-24));
      else{var top=rzd.q.top,tot=rzd.p.bottom-rzd.q.top;LAY.bq=cl((e.clientY-top)/tot,0.15,0.85);}
    }else{
      if(id==='rz1')LAY.ta=cl(rzd.L.ta+dx,220,Math.max(220,rzd.mw-(LAY.tb||rzd.ed)-240-2*G-24));
      else if(id==='rz2')LAY.tb=cl(rzd.ed+dx,240,Math.max(240,rzd.mw-LAY.ta-240-2*G-24));
    }
    applyLayout();});
  function end(){if(!rzd)return;rzd=null;h.classList.remove('on');document.body.classList.remove('resizing');P.layout=LAY;saveP();}
  h.addEventListener('pointerup',end);h.addEventListener('pointercancel',end);
  h.addEventListener('dblclick',function(){
    if(P.mode==='blocks'){if(id==='rz1')LAY.ba=LDEF.ba;else if(id==='rz2')LAY.bc=LDEF.bc;else LAY.bq=LDEF.bq;}
    else{if(id==='rz1')LAY.ta=LDEF.ta;else LAY.tb=LDEF.tb;}
    P.layout=LAY;saveP();applyLayout();toast('Size reset');});
});
window.addEventListener('resize',placeHandles);
setInterval(function(){if(!rzd)placeHandles();},1500);

