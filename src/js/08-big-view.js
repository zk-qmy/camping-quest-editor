/* ============ BIG VIEW ============ */
var bigMode='mine';
function openBig(mode){bigMode=mode||(curView==='goal'?'goal':'mine');var l=L();if(!l)return;
  $('bigMine').srcdoc=processCode(buildPage(curSrc,curCss));$('bigGoal').srcdoc=processCode(buildPage(finalOf(l,curPage),l.finalCss));
  $('bigView').classList.add('show');setBig(bigMode);}
function setBig(m){bigMode=m;document.querySelectorAll('[data-bv]').forEach(function(b){b.classList.toggle('active',b.dataset.bv===m);});
  $('bfMine').hidden=m==='goal';$('bfGoal').hidden=m==='mine';$('bigView').querySelector('.bigframes').classList.toggle('both',m==='both');
  $('bigNote').innerHTML=m==='mine'?'':'The <b style="color:var(--fire)">orange outline</b> shows what this quest adds.';}
$('bigGoal').addEventListener('load',function(){markGoal('bigGoal');});
$('bigBtn').onclick=function(e){e.stopPropagation();openBig();};
$('bigView').addEventListener('click',function(e){var b=e.target.closest('[data-bv]');if(b){setBig(b.dataset.bv);return;}if(e.target.id==='bigClose'||e.target.id==='bigView')$('bigView').classList.remove('show');});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&$('bigView').classList.contains('show'))$('bigView').classList.remove('show');});


