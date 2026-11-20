/* ============ POP-UP QUIZ ============ */
/* A 🧠 button shows up at a random time (default every 15 to 30 minutes). One multiple-choice question; a right answer gives random bonus points. If he does not answer within 10 minutes (teacher can change it) the quiz expires. The teacher manages the questions in Teacher → 🧠 Quiz. */
function quizCfg(){
  var q=DATA.quiz;
  if(!q||typeof q!=='object')q=DATA.quiz={on:true,min:15,max:30,pmin:5,pmax:15,expire:10,items:[]};
  if(!q.items)q.items=[];
  return q;
}
function quizOpts(it){
  return (it.opts||[]).map(function(t,i){return {t:String(t==null?'':t).trim(),i:i};}).filter(function(o){return o.t;});
}
function quizValid(it){
  var o=quizOpts(it);
  return !!(it&&String(it.q||'').trim()&&o.length>=2&&o.some(function(x){return x.i===+it.ans;}));
}
function quizItems(){return quizCfg().items.filter(quizValid);}
function quizRand(a,b){return a+Math.random()*(b-a);}
function quizLife(){return Math.max(1,+quizCfg().expire||10)*60000;}
function quizExpired(){return !!(P.quizWait&&P.quizShown&&Date.now()-P.quizShown>=quizLife());}
function quizExpire(){
  P.quizMissed=(P.quizMissed||0)+1;
  if(qzOpen){qzOpen=null;closeModal();}
  quizSchedule();quizBtn(false);
  toast('⌛ The pop-up quiz expired. Next time answer it within '+Math.round(quizLife()/60000)+' minutes!');
}
function quizSchedule(){
  var c=quizCfg(),lo=Math.max(1,+c.min||15),hi=Math.max(lo,+c.max||30);
  P.quizNext=Date.now()+Math.round(quizRand(lo,hi)*60000);
  P.quizWait=false;P.quizShown=0;P.quizCur='';saveP();
}
function quizBtn(show){var b=$('quizBtn');if(b)b.hidden=!show;}
function quizTick(){
  var c=quizCfg();
  if(!c.on||!quizItems().length){quizBtn(false);return;}
  if(!P.quizNext)quizSchedule();
  if(P.quizWait&&!P.quizShown){P.quizShown=Date.now();saveP();}
  if(quizExpired()){quizExpire();return;}
  if(!P.quizWait&&Date.now()>=P.quizNext){P.quizWait=true;P.quizShown=Date.now();saveP();toast('🧠 Pop-up quiz! Click the 🧠 button within '+Math.round(quizLife()/60000)+' minutes');}
  quizBtn(!!P.quizWait);
}
function quizPick(){
  var all=quizItems(),cur=null;
  all.forEach(function(x){if(x.id===P.quizCur)cur=x;});
  if(cur)return cur;
  var seen=P.quizSeen||[],pool=all.filter(function(x){return seen.indexOf(x.id)<0;});
  if(!pool.length){pool=all;seen=[];}
  var q=pool[Math.floor(Math.random()*pool.length)];
  if(!q)return null;
  seen.push(q.id);P.quizSeen=seen;P.quizCur=q.id;saveP();
  return q;
}
var qzOpen=null;
function quizShuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function openQuiz(preview){
  if(!preview&&quizExpired()){quizExpire();return;}
  var q=preview?(function(){var a=quizItems();return a[Math.floor(Math.random()*a.length)]||null;})():quizPick();
  if(!q){toast('No quiz questions yet');quizBtn(false);return;}
  qzOpen={q:q,preview:!!preview};
  modal('<h2>🧠 Pop-up quiz'+(preview?' <small style="color:var(--muted)">(try-out: no points)</small>':'')+'</h2><p class="qq">'+esc(q.q)+'</p><div class="qopts">'+
    quizShuffle(quizOpts(q)).map(function(o){return '<button class="qopt" data-qi="'+o.i+'">'+esc(o.t)+'</button>';}).join('')+
    '</div>'+(preview?'':'<p class="help" style="margin-top:10px">⏳ This quiz disappears '+Math.max(1,Math.ceil((quizLife()-(Date.now()-(P.quizShown||Date.now())))/60000))+' min after it popped up.</p>')+'<div class="mrow"><button class="sbtn" data-close>Later</button></div>');
  $('modalBox').className='mbox qbox';
}
function quizAnswer(i){
  if(!qzOpen)return;
  var q=qzOpen.q,preview=qzOpen.preview;
  if(!preview&&quizExpired()){quizExpire();modal('<h2>⌛ Time’s up</h2><p>This quiz expired because it was not answered in time. A new one will pop up later.</p><div class="mrow"><button class="pbtn" data-close>OK</button></div>');$('modalBox').className='mbox qbox';return;}
  var ok=(+i===+q.ans);qzOpen=null;
  var c=quizCfg(),lo=Math.max(0,+c.pmin||0),hi=Math.max(lo,+c.pmax||0),pts=ok?Math.round(quizRand(lo,hi)):0;
  if(ok&&pts<1)pts=1;
  if(!preview){
    if(ok){P.points+=pts;P.earned+=pts;P.log.push({pts:pts,why:'Pop-up quiz',at:Date.now()});P.quizRight=(P.quizRight||0)+1;}
    else P.quizWrong=(P.quizWrong||0)+1;
    quizSchedule();quizBtn(false);saveP();renderHeader();if(ok&&typeof cheerPets==='function')cheerPets();
  }
  var right=quizOpts(q).filter(function(o){return o.i===+q.ans;})[0];
  modal('<h2>'+(ok?'✅ Correct!':'❌ Not this time')+'</h2>'+
    (ok?'<div class="big">⭐ +'+pts+'</div>':'<p>The right answer was: <b style="color:var(--ok)">'+esc(right?right.t:'')+'</b></p>')+
    (q.why?'<p class="qwhy">'+esc(q.why)+'</p>':'')+
    (preview&&ok?'<p class="help">Try-out only. The student would get ⭐ '+pts+' (random between '+lo+' and '+hi+').</p>':'')+
    '<div class="mrow"><button class="pbtn" data-close>OK</button></div>');
  $('modalBox').className='mbox qbox';
}
$('quizBtn').onclick=function(){openQuiz(false);};
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('.qopt');if(b)quizAnswer(b.dataset.qi);
});
quizTick();
setInterval(quizTick,20000);
