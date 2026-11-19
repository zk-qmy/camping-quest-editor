/* ============ STUDENT ============ */
var lastNear=[];var code=$('code'),gutter=$('gutter'),pre=$('preview'),base=$('baseFrame'),ready={p:0,b:0},lastPass=[],lastCtx=null,curSrc='';
function unlocked(i){var l=L(),p=LP();return i===0||!!p.done[l.quests[i-1].id]||!!p.done[l.quests[i].id];}
function renderHeader(){
  var nights=0;Object.keys(P.lessons||{}).forEach(function(k){nights+=Object.keys((P.lessons[k]||{}).done||{}).length;});
  $('brand').innerHTML='<span class="fire">🔥</span><span>'+esc(DATA.title||'Code Quest')+'</span><span class="night" title="Every quest you finish = one more night survived">🌙 Night '+(nights+1)+'</span>';
  var hs=Object.keys(P.hall||{}).map(function(k){return P.hall[k];});
  $('lessonSel').hidden=DATA.lessons.length+hs.length<2;
  $('lessonSel').innerHTML=DATA.lessons.map(function(l,i){return '<option value="'+i+'"'+(!P.hallOn&&i===P.lesson?' selected':'')+'>'+esc(l.title)+'</option>';}).join('')+(hs.length?'<optgroup label="🏛 Hall projects">'+hs.map(function(l){return '<option value="h:'+esc(l.id)+'"'+(P.hallOn===l.id?' selected':'')+'>'+esc(l.title)+'</option>';}).join('')+'</optgroup>':'');
  $('pts').textContent=P.points;
}
function renderQuest(){
  var l=L();
  if(!l){$('quest').innerHTML='<div class="empty">No lessons yet.</div>';return;}
  var p=LP(),qs=l.quests||[];if(p.current>=qs.length)p.current=0;
  var q=Q();
  var h=l.hall?'<div class="hallbar"><span>'+(l.custom?'✏️ <b>Make it mine</b>: use your own words, colours and pictures!':'🏛 <b>Hall practice</b>: build this project again.')+'</span>'+(l.custom?'<button class="sbtn" id="origCode">📜 Original code</button>':'')+'<button class="sbtn" id="hallBack">⬅ My lessons</button><button class="sbtn" id="hallRm" title="Remove this project">🗑</button></div>':'';
  h+='<div class="dots">'+qs.map(function(x,i){var d=p.done[x.id],lk=!unlocked(i);return '<button class="dot'+(d?' done':'')+(i===p.current?' cur':'')+(lk?' lock':'')+'" data-i="'+i+'" title="Quest '+(i+1)+'">'+(d?'✓':i+1)+'</button>';}).join('')+'</div>';
  if(!q){$('quest').innerHTML=h+'<div class="empty">This lesson has no quests yet.</div>';return;}
  var pts=(DATA.points||{})[q.diff]||10;
  h+='<div class="badges"><span class="badge d-'+q.diff+'">'+q.diff.toUpperCase()+'</span><span class="badge b-pts">⭐ +'+pts+'</span>'+(q.prize?'<span class="badge b-prize">🎁 + prize</span>':'')+(pagesOf(l).length>1?'<span class="badge b-file">📄 '+esc(qFile(q))+'</span>':'')+'</div>';
  if(qFile(q)!==curPage)h+='<div class="pagenote">This quest is in <b>'+esc(qFile(q))+'</b>. <button class="pbtn" data-gopage="'+esc(qFile(q))+'">Open '+esc(qFile(q))+'</button></div>';
  h+='<h2 class="qtitle">'+esc(q.title)+'</h2><ul class="tasks">';
  q.tasks.forEach(function(t,j){
    h+='<li class="task" id="t'+j+'"><div class="row"><span class="box">✓</span><span class="ttext">'+md(t.t)+'</span>'+(t.h?'<button class="tip" data-j="'+j+'" title="Hint">💡</button>':'')+'</div>'+(t.h?'<div class="hint">'+md(t.h)+'</div>':'')+'<div class="almost"></div>';
    var rk=q.id+'-'+j,rep0=lastReport(L().id,rk);
    if(t.check&&t.check.type==='manual')h+='<button class="tick" data-tick="'+j+'">'+(p.manual[rk]?'↩ Untick':'✔ Teacher tick')+'</button>';
    else if(p.manual[rk])h+='<div class="rstat ok">✓ Your teacher approved this task</div>';
    else if(rep0&&rep0.status==='pending')h+='<div class="rstat">📨 Sent to your teacher. Keep going!</div>';
    else{if(rep0&&rep0.status==='declined')h+='<div class="rstat no">Teacher says: try again'+(rep0.reply?': “'+esc(rep0.reply)+'”':'')+'</div>';
      h+='<button class="ask" data-ask="'+j+'">🙋 It won’t tick? Ask teacher</button>';}
    h+='</li>';
  });
  h+='</ul><button class="goal" id="goalBtn">🎯 See the expected result</button>';
  $('quest').innerHTML=h;applyPass(lastPass);
}
function applyPass(p){if(curView==='goal')markGoal();var q=Q();if(!q)return;q.tasks.forEach(function(t,j){var e=$('t'+j);if(!e)return;e.classList.toggle('pass',!!p[j]);var nr=!p[j]&&lastNear[j];e.classList.toggle('near',!!nr);var a=e.querySelector('.almost');if(a&&nr)a.innerHTML=nr;});}
var curFile='html';
function showTabs(){var p=LP(),l=L();fixPage();var on=!!p&&(usesCssFile()||norm(p.css));if(!on)curFile='html';
  var names=pagesOf(l);
  $('ftabs').innerHTML=names.map(function(n){return '<button class="ftab'+(curFile==='html'&&curPage===n?' on':'')+'" data-file="html" data-page="'+esc(n)+'">'+esc(n)+'</button>';}).join('')+(on?'<button class="ftab'+(curFile==='css'?' on':'')+'" data-file="css" id="cssTab">style.css</button>':'');
  var wp=$('wsPages');if(wp)wp.innerHTML=names.length>1?names.map(function(n){return '<button class="ptab'+(curPage===n?' on':'')+'" data-page="'+esc(n)+'">'+esc(n)+'</button>';}).join(''):'';}
function loadEditor(){var p=LP();showTabs();code.value=p?(curFile==='css'?p.css:PG().code):'';updateGutter();}
function switchPage(n,keepFile){if(pagesOf(L()).indexOf(n)<0)return;var ch=n!==curPage;curPage=n;if(!keepFile)curFile='html';if(ch){undo=[];lastPass=[];lastNear=[];goalKey='';}loadEditor();if(P.mode==='blocks')renderWS();renderQuest();render();if(curView==='goal')loadGoal();}
$('ftabs').addEventListener('click',function(e){var b=e.target.closest('.ftab');if(!b)return;if(b.dataset.file==='css'){curFile='css';loadEditor();}else switchPage(b.dataset.page);code.focus();});
$('wsPages').addEventListener('click',function(e){var b=e.target.closest('.ptab');if(b)switchPage(b.dataset.page,true);});
function updateGutter(){var n=code.value.split('\n').length,s='';for(var i=1;i<=n;i++)s+=i+'\n';gutter.textContent=s;gutter.scrollTop=code.scrollTop;}
code.addEventListener('scroll',function(){gutter.scrollTop=code.scrollTop;});
code.addEventListener('keydown',function(e){if(e.key==='Tab'){e.preventDefault();code.setRangeText('  ',code.selectionStart,code.selectionEnd,'end');onType();}});
var deb;function onType(){var p=LP();if(!p)return;if(curFile==='css')p.css=code.value;else PG().code=code.value;updateGutter();clearTimeout(deb);deb=setTimeout(function(){saveP();render();},450);}
code.addEventListener('input',onType);
var curCss='';
function render(){var p=LP();fixPage();curSrc=p?(P.mode==='blocks'?gen():PG().code):'';curCss=p?(P.mode==='blocks'?genCSS():p.css):'';
  if(p&&P.mode==='blocks')$('codeView').innerHTML=(pagesOf(L()).length>1?'<span class="pr">&lt;!-- '+esc(curPage)+' --&gt;</span>\n':'')+highlight(curSrc)+(norm(curCss)?'\n\n<span class="pr">/* style.css */</span>\n'+highlight(curCss):'');
  var page=buildPage(curSrc,curCss);ready.p=ready.b=0;pre.srcdoc=processCode(page);base.srcdoc=processCode(stripStyles(page));}
pre.addEventListener('load',function(){ready.p=1;tryCheck();});
base.addEventListener('load',function(){ready.b=1;tryCheck();});
function tryCheck(){
  if(!ready.p||!ready.b)return;var x;
  try{x={src:curSrc,all:curSrc+'\n'+curCss,doc:pre.contentDocument,win:pre.contentWindow,bdoc:base.contentDocument,bwin:base.contentWindow};}catch(e){return;}
  if(!x.doc||!x.doc.body||!x.bdoc||!x.bdoc.body)return;lastCtx=x;evaluate(x);
}
function evaluate(x){
  var q=Q();if(!q)return;var p=LP(),i=p.current;
  if(qFile(q)!==curPage){lastPass=[];lastNear=[];applyPass([]);return;}
  if(!x.marked){if(P.mode!=='blocks')markOpen(x.doc,closeMap(x.src));x.marked=true;}
  var near=[];
  var pass=q.tasks.map(function(t,j){try{x.loose=false;if(p.manual[q.id+'-'+j]&&(!t.check||t.check.type!=='manual'||true))return true;if(runCheck(t.check,x,q.id+'-'+j))return true;
    x.loose=true;x.openTags=[];var ok=runCheck(t.check,x,q.id+'-'+j);x.loose=false;if(ok&&x.openTags.length)near[j]='Almost! Close it with <code>&lt;/'+esc(x.openTags[0])+'&gt;</code>';else{try{var dg=diagnose(t.check,x);if(dg)near[j]=dg;}catch(e2){}}return false;}catch(e){x.loose=false;return false;}});
  lastNear=near;
  var newly=pass.some(function(v,j){return v&&!lastPass[j];});lastPass=pass;applyPass(pass);
  var all=pass.length&&pass.every(Boolean);
  if(newly&&!all)toast('✓ Nice!');
  if(all&&unlocked(i)&&!p.done[q.id])complete(i);
}
function itemById(id){for(var i=0;i<DATA.items.length;i++)if(DATA.items[i].id===id)return DATA.items[i];return null;}
function itemPic(it,cls){return it.img?'<img src="'+esc(it.img)+'" alt="">':'<div class="em">'+esc(it.emoji||'🎁')+'</div>';}
function pickPrize(q){
  if(!q.prize)return null;if(q.prize!=='random')return itemById(q.prize);
  var sp=DATA.items.filter(function(it){return it.special;});if(!sp.length)sp=DATA.items.slice();if(!sp.length)return null;
  var owned=P.items.map(function(o){return o.id;}),fresh=sp.filter(function(it){return owned.indexOf(it.id)<0;});
  var pool=fresh.length?fresh:sp;return pool[Math.floor(Math.random()*pool.length)];
}
function complete(i){
  var l=L(),p=LP(),q=l.quests[i];p.done[q.id]=true;
  var again=!!(l.hall&&P.hallPaid&&(P.hallPaid[l.id]||[]).indexOf(i)>=0);
  var pts=again?0:(DATA.points||{})[q.diff]||10;P.points+=pts;P.earned+=pts;P.log.push({pts:pts,why:q.title,at:Date.now()});
  var prize=again?null:pickPrize(q);if(prize){P.items.push({id:prize.id,how:'prize',given:prize.kind==='sticker',at:Date.now()});if(prize.kind==='sticker'&&P.using.length<5&&P.using.indexOf(prize.id)<0)P.using.push(prize.id);}
  saveP();renderHeader();syncPets();cheerPets();
  var allDone=l.quests.every(function(x){return p.done[x.id];});
  var h='<h2>'+(allDone?'Lesson complete!':'Quest complete!')+'</h2><div class="big">'+(again?'✓':'⭐ +'+pts)+'</div>'+(again?'<p style="font-size:13px">You already won the points for this quest.</p>':'');
  if(prize)h+='<div class="prize">'+itemPic(prize)+'<div style="font-weight:900;margin-top:6px">You won: '+esc(prize.name)+'!</div></div>';
  if(allDone)h+='<p style="margin-top:10px;font-size:14px">Lesson done! Save a backup of your progress.</p><button id="winBackup" style="background:#2e4c35;color:#eaf4e6;margin-right:8px">💾 Backup</button>';
  h+='<button id="winNext">'+(allDone?'🎉 Yay!':'Next quest →')+'</button>';
  $('winInner').innerHTML=h;setTimeout(function(){$('winBox').classList.add('show');},350);
  if($('winBackup'))$('winBackup').onclick=function(){$('winBox').classList.remove('show');openBackup('save');};
  $('winNext').onclick=function(){$('winBox').classList.remove('show');if(!allDone){var n=l.quests.findIndex(function(x,k){return k>i&&!p.done[x.id];});if(n<0)n=l.quests.findIndex(function(x){return !p.done[x.id];});if(n>=0)selectQuest(n);}};
  renderQuest();
}
function selectQuest(i){if(!unlocked(i)){toast('🔒 Finish the quest before this one first.');return;}LP().current=i;lastPass=[];lastNear=[];saveP();var f=qFile(Q());if(f!==curPage&&pagesOf(L()).indexOf(f)>=0){switchPage(f,P.mode==='blocks');return;}renderQuest();if(lastCtx)evaluate(lastCtx);}
$('quest').addEventListener('click',function(e){
  var d=e.target.closest('.dot');if(d){selectQuest(+d.dataset.i);return;}
  var tp=e.target.closest('.tip');if(tp){tp.closest('.task').classList.toggle('showhint');return;}
  var ak=e.target.closest('[data-ask]');if(ak){askTeacher(+ak.dataset.ask);return;}
  var tk=e.target.closest('[data-tick]');if(tk){var q=Q(),k=q.id+'-'+tk.dataset.tick,p=LP();p.manual[k]=!p.manual[k];saveP();renderQuest();if(lastCtx)evaluate(lastCtx);return;}
  var gp0=e.target.closest('[data-gopage]');if(gp0){switchPage(gp0.dataset.gopage,P.mode==='blocks');return;}
  if(e.target.closest('#goalBtn')){showView('goal');}
  if(e.target.closest('#hallRm')){hallRemove(L().id);return;}
  if(e.target.closest('#hallBack')){P.hallOn='';lastPass=[];undo=[];saveP();renderStudent();}
  if(e.target.closest('#origCode')){var hl=L();if(hl&&hl.hall)hallOpen(hl.hall,curFile==='css'?'css':curPage);}
});
$('lessonSel').addEventListener('change',function(){var v=this.value;if(v.indexOf('h:')===0)P.hallOn=v.slice(2);else{P.hallOn='';P.lesson=+v;}lastPass=[];undo=[];saveP();renderStudent();});
function applyMode(){setTimeout(applyLayout,0);document.body.classList.toggle('mode-type',P.mode!=='blocks');document.body.classList.toggle('mode-blocks',P.mode==='blocks');document.querySelectorAll('.modes button').forEach(function(b){b.classList.toggle('on',b.dataset.mode===(P.mode||'type'));});}
function renderStudent(){goalKey='';if(L()){var q0=Q();curPage=q0?qFile(q0):'index.html';fixPage();}applyMode();if(curView==='goal'||curView==='code')showView('preview');renderHeader();renderQuest();loadEditor();renderPalette();renderWS();render();}
document.querySelectorAll('.modes button').forEach(function(b){b.onclick=function(){
  var to=b.dataset.mode,from=P.mode||'type',p=LP();
  if(p&&to!==from){
    if(to==='type'){allToType();curFile='html';}
    else{undo.push(JSON.stringify(B()));allToBlocks();}
    toast(to==='type'?'⌨️ Your blocks are now code. Keep going!':'🧱 Your code is now blocks. Keep going!');
  }
  P.mode=to;saveP();applyMode();if(curView==='code')showView('preview');lastPass=[];if(P.mode==='type')loadEditor();else{renderPalette();renderWS();}render();};});
var curView='preview';
function showView(v){if(v==='code'&&P.mode!=='blocks')v='preview';curView=v;
  document.querySelectorAll('.vtab[data-v]').forEach(function(x){x.classList.toggle('active',x.dataset.v===v);});
  pre.hidden=v!=='preview';$('goalPrev').hidden=v!=='goal';$('goalNote').hidden=v!=='goal';$('codeView').hidden=v!=='code';$('codefoot').hidden=v!=='code';
  var gl=L();$('goalNote').innerHTML=gl&&gl.custom?'💡 The original project, for ideas. Yours can look different! The <b>orange outline</b> shows the part this quest is about.':'🎯 The goal. The <b>orange outline</b> shows what this quest adds.';
  if(v==='goal')loadGoal();}
document.querySelectorAll('.vtab[data-v]').forEach(function(b){b.onclick=function(){showView(b.dataset.v);};});
var goalKey='';
function loadGoal(){var l=L();if(!l)return;var fc=finalOf(l,curPage),key=l.id+'|'+curPage+'|'+fc.length+'|'+(l.finalCss||'').length;
  if(key!==goalKey){goalKey=key;$('goalPrev').srcdoc=processCode(buildPage(fc,l.finalCss));}else markGoal();}
$('goalPrev').addEventListener('load',markGoal);
function hookLinks(fr,onPage,pages){fr.addEventListener('load',function(){var d;try{d=fr.contentDocument;}catch(e){return;}if(!d)return;
  d.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';e.preventDefault();
    if(h.charAt(0)==='#'){var t=h.length>1&&d.getElementById(h.slice(1));if(t)t.scrollIntoView({behavior:'smooth'});else d.documentElement.scrollTop=0;return;}
    var n=h.split('#')[0].split('?')[0].split('/').pop();var ps=pages();if(n&&ps.indexOf(n)>=0){onPage(n);return;}
    toast(/^mailto:/i.test(h)?'✉️ This link opens an email app on the real website.':'🔗 This link opens another website when your site is published.');});});}
hookLinks(pre,function(n){switchPage(n);toast('📄 '+n);},function(){return pagesOf(L());});
hookLinks($('goalPrev'),function(n){switchPage(n);},function(){return pagesOf(L());});
hookLinks($('bigMine'),function(n){switchPage(n);openBig(bigMode);},function(){return pagesOf(L());});
hookLinks($('bigGoal'),function(n){switchPage(n);openBig(bigMode);},function(){return pagesOf(L());});
function markGoal(fid){
  var q=Q(),d;try{d=$(typeof fid==='string'?fid:'goalPrev').contentDocument;}catch(e){return;}if(!d||!d.body)return;
  if(!d.getElementById('cq-hl-style')){var st=d.createElement('style');st.id='cq-hl-style';st.textContent='.cq-hl{outline:3px dashed #ff8a2a!important;outline-offset:3px;box-shadow:0 0 0 7px rgba(255,138,42,.28)!important;animation:cqp 1.2s infinite alternate}@keyframes cqp{from{outline-color:#ff8a2a}to{outline-color:#ffd34a}}';d.head.appendChild(st);}
  Array.prototype.forEach.call(d.querySelectorAll('.cq-hl'),function(e){e.classList.remove('cq-hl');});
  if(!q)return;var first=null;
  q.tasks.forEach(function(t){var c=t.check||{};if(c.nohl)return;var sel=c.type==='css'?baseSel(c.sel):(c.type==='count'||c.type==='text'||c.type==='attr')?c.sel:'';if(!sel)return;
    var els;try{els=Array.prototype.slice.call(d.querySelectorAll(sel));}catch(e){return;}
    if(c.type==='text'){var w=normT(c.text);els=els.filter(function(e){return normT(e.textContent).indexOf(w)>=0;});}
    els.forEach(function(e){if(/^(HTML|BODY|HEAD|TITLE|STYLE|LINK)$/.test(e.tagName))return;e.classList.add('cq-hl');if(!first)first=e;});});
  if(first)first.scrollIntoView({block:'center',behavior:'smooth'});
}
$('undoBtn').onclick=function(){var s=undo.pop();if(!s){toast('Nothing to undo');return;}setB(JSON.parse(s));saveP();renderWS();render();toast('↶ Undone');};
$('toTyping').onclick=function(){
  modal('<h2>Keep building by typing?</h2><p>The code your blocks made goes into the typing editor. From there you write real code yourself.</p><div class="mrow"><button class="sbtn" data-close>Cancel</button><button class="pbtn" id="doType">Yes!</button></div>');
  $('doType').onclick=function(){allToType();curFile='html';P.mode='type';saveP();closeModal();applyMode();loadEditor();render();toast('⌨️ Now you’re typing real code!');};
};

/* ---------- collection / shop ---------- */
var collTab='all';
$('collBtn').onclick=function(){collTab='all';renderColl();};
function ownedCount(id){return P.items.filter(function(o){return o.id===id;}).length;}
function renderColl(){
  var h='<h2>🎒 My collection</h2><div class="tabs"><button class="tab'+(collTab==='all'?' on':'')+'" data-tab="all">All items</button><button class="tab'+(collTab==='mine'?' on':'')+'" data-tab="mine">Mine ('+P.items.length+')</button><span style="margin-left:auto" class="pts">⭐ '+P.points+'</span></div><div class="grid">';
  var list=collTab==='mine'?DATA.items.filter(function(it){return ownedCount(it.id);}):DATA.items;
  if(!list.length)h+='<div class="empty" style="grid-column:1/-1">'+(collTab==='mine'?'No items yet. Finish quests to earn points!':'No items yet.')+'</div>';
  list.forEach(function(it){
    var n=ownedCount(it.id),wait=P.items.some(function(o){return o.id===it.id&&!o.given;});
    h+='<div class="itm'+(n?' own':' locked')+'">'+itemPic(it)+'<div class="nm">'+esc(it.name)+'</div>';
    var stk=it.kind==='sticker';
    h+='<span class="kind '+(stk?'sticker">Screen sticker':'merch">Real prize')+'</span>';
    if(n)h+='<div class="cnt">✓ Got it'+(n>1&&!stk?' ×'+n:'')+'</div>'+(stk?'<button class="use'+(P.using.indexOf(it.id)>=0?' on':'')+'" data-use="'+it.id+'">'+(P.using.indexOf(it.id)>=0?'Put away':'✨ Put on screen')+'</button>':(wait?'<div class="sub">Ask your teacher for it!</div>':''));
    if(it.special)h+='<div class="sub">🏆 Win it in a hard quest</div>';
    else if(!(stk&&n))h+='<button class="buy" data-buy="'+it.id+'"'+(P.points<it.price?' disabled':'')+'>⭐ '+it.price+'</button>';
    h+='</div>';
  });
  h+='</div><div class="mrow"><button class="pbtn" data-close>Close</button></div>';
  modal(h);
}
$('modalBox').addEventListener('click',function(e){
  var t=e.target.closest('[data-tab]');if(t){collTab=t.dataset.tab;renderColl();return;}
  var us=e.target.closest('[data-use]');if(us){var id=us.dataset.use,k=P.using.indexOf(id);if(k>=0)P.using.splice(k,1);else{if(P.using.length>=5){toast('Max 5 stickers on screen');return;}P.using.push(id);P.petsOff=false;}saveP();syncPets();renderColl();return;}
  var b=e.target.closest('[data-buy]');if(b){var it=itemById(b.dataset.buy);if(!it||P.points<it.price)return;
    modal('<h2>Get '+esc(it.name)+'?</h2><div style="text-align:center;font-size:60px">'+(it.img?'<img src="'+esc(it.img)+'" style="width:110px;height:110px;object-fit:cover;border-radius:14px" alt="">':esc(it.emoji))+'</div><p style="text-align:center">This costs <b style="color:var(--gold)">⭐ '+it.price+'</b>. You have ⭐ '+P.points+'.</p><div class="mrow"><button class="sbtn" id="bNo">Not now</button><button class="pbtn" id="bYes">Yes, get it!</button></div>');
    $('bNo').onclick=renderColl;
    $('bYes').onclick=function(){P.points-=it.price;P.items.push({id:it.id,how:'bought',given:it.kind==='sticker',at:Date.now()});
      if(it.kind==='sticker'&&P.using.length<5&&P.using.indexOf(it.id)<0){P.using.push(it.id);P.petsOff=false;}
      saveP();renderHeader();syncPets();collTab='mine';renderColl();toast(it.kind==='sticker'?'🎉 '+it.name+' is on your screen! Click it.':'🎉 You got '+it.name+'! Ask your teacher for it.');};}
});




