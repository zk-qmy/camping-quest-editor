/* ============ TEACHER ============ */
/* PIN is stored only as a salted PBKDF2 hash, never as plain text. */
var PINIT=200000,pinFails=0,pinLock=0;
function b64(u){var s='';u=new Uint8Array(u);for(var i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s);}
function unb64(s){var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;}
function pinDerive(pin,salt,it){return crypto.subtle.importKey('raw',new TextEncoder().encode(pin),'PBKDF2',false,['deriveBits']).then(function(k){return crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:salt,iterations:it},k,256);});}
function pinHash(pin){var salt=crypto.getRandomValues(new Uint8Array(16));return pinDerive(pin,salt,PINIT).then(function(bits){return 'pbkdf2$'+PINIT+'$'+b64(salt)+'$'+b64(bits);});}
function pinCheck(pin){var s=DATA.pin;if(s.indexOf('pbkdf2$')!==0)return Promise.resolve(pin===s);var p=s.split('$'),it=Math.min(+p[1]||PINIT,1000000);return pinDerive(pin,unb64(p[2]),it).then(function(bits){var a=b64(bits),b=p[3]||'',d=a.length^b.length;for(var i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0;});}
var tv={tab:'lessons',sel:0},artifactApi=null,sampleApi=null;
try{if(window.claude&&window.claude.use){window.claude.use('artifact').then(function(a){artifactApi=a;}).catch(function(){});window.claude.use('sample').then(function(s){sampleApi=s;if(!$('teacherView').hidden)renderTeacher();}).catch(function(){});}}catch(e){}
$('teacherBtn').addEventListener('click',function(){setTimeout(placeHandles,50);});
$('teacherBtn').onclick=function(){
  if(DATA.pin){modal('<h2>Teacher only</h2><input type="password" id="pinIn" placeholder="PIN"><div class="mrow"><button class="sbtn" data-close>Cancel</button><button class="pbtn" id="pinGo">Open</button></div>');
    var go=function(){if(Date.now()<pinLock){toast('Too many tries. Wait a little.');return;}var v=$('pinIn').value;var done=function(ok){if(ok){pinFails=0;closeModal();openT();if(DATA.pin.indexOf('pbkdf2$')!==0&&v){pinHash(v).then(function(h){DATA.pin=h;touch();}).catch(function(){});}}else{if(++pinFails>=5){pinFails=0;pinLock=Date.now()+30000;}toast('Wrong PIN');}};try{pinCheck(v).then(done,function(){toast('PIN check is not available in this browser');});}catch(e){toast('PIN check is not available in this browser');}};$('pinGo').onclick=go;$('pinIn').onkeydown=function(e){if(e.key==='Enter')go();};$('pinIn').focus();}
  else openT();
};
function openT(){if(pendingReports().length)tv.tab='reports';tv.sel=Math.min(P.lesson,Math.max(0,DATA.lessons.length-1));$('teacherView').hidden=false;renderTeacher();}
function setSt(){var s=document.querySelector('.st');if(s){s.textContent=dirty?'● Not saved to the page yet: your student can’t see these changes':'✓ Saved: your student sees this';s.classList.toggle('dirty',dirty);}}
function gp(path){if(!path)return DATA;return path.split('.').reduce(function(a,k){return a==null?a:a[k];},DATA);}
function setPath(path,v){var ks=path.split('.'),last=ks.pop(),t=gp(ks.join('.'));if(t!=null)t[last]=v;}
function inp(path,ph,type){var v=gp(path);return '<input type="'+(type||'text')+'" data-b="'+path+'" value="'+esc(v==null?'':v)+'" placeholder="'+esc(ph||'')+'">';}

function renderTeacher(){
  var h='<div class="tv"><div class="tvbar"><h2>🛠 Teacher</h2><span class="st"></span><button class="sbtn" data-act="tguide">❓ Teacher guide</button><button class="bigbtn" data-act="save">💾 Save to page</button><button class="sbtn" data-act="export">Export</button><button class="sbtn" data-act="import">Import</button><button class="pbtn" data-act="close">▶ Student view</button></div>';
  var waiting=P.items.filter(function(o){var it=itemById(o.id);return !o.given&&(!it||it.kind!=='sticker');}).length;
  var pr=pendingReports().length;
  h+='<div class="tnav">'+[['reports','📨 Reports'+(pr?' ('+pr+')':'')],['lessons','📚 Lessons'],['hall','🏛 Hall'],['items','🎁 Items'],['quiz','🧠 Quiz'],['prizes','📦 Prizes to give'+(waiting?' ('+waiting+')':'')],['settings','⚙️ Settings']].map(function(t){return '<button class="tab'+(tv.tab===t[0]?' on':'')+'" data-tab="'+t[0]+'">'+t[1]+'</button>';}).join('')+'</div>';
  if(tv.tab==='reports')h+=tReports();else if(tv.tab==='lessons')h+=tLessons();else if(tv.tab==='hall')h+=tHall();else if(tv.tab==='items')h+=tItems();else if(tv.tab==='quiz')h+=tQuiz();else if(tv.tab==='prizes')h+=tPrizes();else h+=tSettings();
  $('teacherView').innerHTML=h+'</div>';setSt();
}
function tLessons(){
  var Ls=DATA.lessons,l=Ls[tv.sel];
  var h='<div class="tgrid"><aside><div class="card"><h3>Lessons</h3>'+Ls.map(function(x,i){return '<button class="lbtn'+(i===tv.sel?' on':'')+'" data-act="pick" data-i="'+i+'">'+(i+1)+'. '+esc(x.title)+'</button>';}).join('')+'<button class="dash" data-act="addLesson">+ New lesson</button></div></aside><section>';
  if(!l)return h+'<div class="card"><p class="help">Add a lesson to start.</p></div></section></div>';
  var b='lessons.'+tv.sel;
  h+='<div class="card"><div style="display:flex;gap:6px;align-items:center"><h3 style="flex:1;margin:0">Lesson '+(tv.sel+1)+'</h3><button class="ib" data-act="lCopy" title="Copy this lesson as a code">📤 Copy</button><button class="ib" data-act="lUp">↑</button><button class="ib" data-act="lDown">↓</button><button class="ib del" data-act="lDel">Delete</button></div>'+
    '<label>Lesson name</label>'+inp(b+'.title')+
    '<label>Builds on</label><select data-b="'+b+'.basedOn" data-rr><option value="">Nothing (start from an empty file)</option>'+Ls.map(function(x,i){return i===tv.sel?'':'<option value="'+x.id+'"'+(l.basedOn===x.id?' selected':'')+'>'+esc(x.title)+'</option>';}).join('')+'</select>'+
    '<p class="help">If it builds on another lesson, he starts with his code from that lesson, and only the new parts become quests.</p>'+
    '<label>Final code (index.html): what his website should look like at the end of this lesson</label><textarea rows="12" data-b="'+b+'.finalCode">'+esc(l.finalCode||'')+'</textarea>'+
    '<label>style.css (optional, only if this lesson uses a separate CSS file linked with &lt;link&gt;)</label><textarea rows="6" data-b="'+b+'.finalCss" placeholder="body { … }">'+esc(l.finalCss||'')+'</textarea>'+pagesEd(b,l.pages)+
    (norm(l.finalCss)&&!linkedCss(l.finalCode).length?'<p class="help" style="color:var(--gold)">⚠ The final code has no <code>&lt;link rel="stylesheet" href="style.css"&gt;</code>, so this style.css is not used. Clear it if this lesson doesn’t need it.</p>':'')+
    '<div class="limrow"><div><label>Max quests in this lesson</label><input type="number" min="1" max="50" data-b="'+b+'.maxQuests" value="'+esc(l.maxQuests||'')+'" placeholder="'+(DATA.maxQuests?'default '+DATA.maxQuests:'no limit')+'"></div>'+
    '<div><label>If there are more</label><select data-b="'+b+'.limitMode"><option value="merge"'+(l.limitMode!=='first'?' selected':'')+'>Combine into bigger quests</option><option value="first"'+(l.limitMode==='first'?' selected':'')+'>Keep only the first ones</option></select></div>'+
    '<button class="sbtn" data-act="applyLimit" style="align-self:flex-end">Apply to the quests below</button></div>'+
    '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="bigbtn" data-act="breakdown">🔨 Break into quests</button>'+(sampleApi?'<button class="sbtn" data-act="fun">✨ Fun quest names</button>':'')+'<button class="sbtn" data-act="previewFinal">👀 Preview final code</button></div><div class="prog" id="tprog"></div></div>';
  var lim=limitOf(l),qn=(l.quests||[]).length;
  h+='<div class="card"><h3>Quests ('+qn+(lim?' · limit '+lim:'')+')</h3>'+(lim&&qn>lim?'<p class="help" style="color:var(--gold)">This lesson has more quests than your limit. Click <b>Apply to the quests below</b>.</p>':'')+'<p class="help">Each quest has at most 3 tasks (combined quests can have more). Edit the words if you like. A hard quest gives a prize item as well as points.</p>';
  (l.quests||[]).forEach(function(q,j){
    var qb=b+'.quests.'+j;
    h+='<div class="qed"><div class="top"><b style="color:var(--muted);width:24px">'+(j+1)+'</b>'+inp(qb+'.title')+
      '<select data-b="'+qb+'.diff" data-rr>'+RN.map(function(d){return '<option value="'+d+'"'+(q.diff===d?' selected':'')+'>'+d+'</option>';}).join('')+'</select>'+
      '<select data-b="'+qb+'.prize"><option value="">no prize</option><option value="random"'+(q.prize==='random'?' selected':'')+'>🎁 random special item</option>'+DATA.items.map(function(it){return '<option value="'+it.id+'"'+(q.prize===it.id?' selected':'')+'>'+esc((it.emoji||'🎁')+' '+it.name)+'</option>';}).join('')+'</select>'+
      '<button class="ib" data-act="qUp" data-j="'+j+'">↑</button><button class="ib del" data-act="qDel" data-j="'+j+'">✕</button></div>';
    q.tasks.forEach(function(t,k){h+='<div class="ted">'+inp(qb+'.tasks.'+k+'.t')+'<span class="ck" title="'+esc(checkLabel(t.check))+'">✓ '+esc(checkLabel(t.check))+'</span><button class="ib del" data-act="tDel" data-j="'+j+'" data-k="'+k+'">✕</button></div>';});
    if(q.tasks.length<3)h+='<button class="dash" style="margin-top:6px;padding:4px 10px" data-act="tAdd" data-j="'+j+'">+ task you tick yourself</button>';
    h+='</div>';
  });
  return h+'</div></section></div>';
}
function tQuiz(){
  var c=quizCfg(),n=quizItems().length;
  var h='<div class="card"><h3>🧠 Pop-up quiz</h3><p class="help">A 🧠 button pops up on his screen at a random time between the two numbers below. When he clicks it he gets one multiple-choice question. A right answer gives him random bonus points. Questions come in a random order.</p>'+
   '<label class="chk" style="margin-bottom:10px"><input type="checkbox" data-qon'+(c.on?' checked':'')+'> The pop-up quiz is on</label>'+
   '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px"><div><label>Fastest (minutes)</label>'+inp('quiz.min','15','number')+'</div><div><label>Slowest (minutes)</label>'+inp('quiz.max','30','number')+'</div><div><label>Fewest bonus ⭐</label>'+inp('quiz.pmin','5','number')+'</div><div><label>Most bonus ⭐</label>'+inp('quiz.pmax','15','number')+'</div></div>'+
   '<p class="help" style="margin-top:8px">'+n+' question'+(n===1?'':'s')+' ready. A question needs text, at least 2 answers and one marked right.</p>'+
   '<button class="sbtn" data-act="qTest">🧪 Try a quiz now (no points)</button></div>';
  c.items.forEach(function(it,i){var b='quiz.items.'+i,bad=!quizValid(it);
    h+='<div class="card'+(bad?' qbad':'')+'"><div style="display:flex;gap:6px;align-items:center"><b>'+(i+1)+'.</b>'+inp(b+'.q','Question')+'<button class="ib del" data-act="qDel" data-i="'+i+'">✕</button></div>'+
      [0,1,2,3].map(function(k){return '<div style="display:flex;gap:8px;align-items:center;margin-top:6px"><input type="radio" style="width:auto" name="qa'+i+'" data-qans="'+i+'" value="'+k+'" title="This is the right answer"'+(+it.ans===k?' checked':'')+'>'+inp(b+'.opts.'+k,'Answer '+(k+1)+(k>1?' (optional)':''))+'</div>';}).join('')+
      '<div style="margin-top:6px">'+inp(b+'.why','Why? (shown after he answers, optional)')+'</div>'+(bad?'<p class="help" style="color:#ffb36b">Not used yet: add the question, 2 answers and tick the right one.</p>':'')+'</div>';});
  return h+'<button class="dash" data-act="qAdd">+ Question</button>';
}
function tItems(){
  var h='<div class="card"><h3>Item collection</h3><p class="help"><b>Real prizes</b> are things you hand to him. <b>Screen stickers</b> are characters that move around his screen when he uses them. Normal items cost points; <b>special</b> items can only be won in hard quests. Click a picture to upload your own: PNG with a see-through background works best for stickers, and small animated GIFs keep moving.</p>';
  DATA.items.forEach(function(it,i){var b='items.'+i;
    h+='<div class="irow"><label class="pic" title="Upload photo">'+(it.img?'<img src="'+esc(it.img)+'" alt="">':esc(it.emoji||'🎁'))+'<input type="file" accept="image/*" data-up="'+i+'" hidden></label>'+
      '<div><div style="display:flex;gap:6px"><div style="width:70px">'+inp(b+'.emoji','emoji')+'</div>'+inp(b+'.name','name')+'</div>'+(it.img?'<button class="ib" style="margin-top:4px" data-act="noImg" data-i="'+i+'">remove photo</button>':'')+'</div>'+
      '<div>'+(it.special?'<span class="help">prize only</span>':inp(b+'.price','points','number'))+'</div>'+
      '<div style="display:flex;flex-direction:column;gap:4px"><select data-b="'+b+'.kind" data-rr><option value="merch"'+(it.kind!=='sticker'?' selected':'')+'>Real prize</option><option value="sticker"'+(it.kind==='sticker'?' selected':'')+'>Screen sticker</option></select>'+(it.kind==='sticker'?'<select data-b="'+b+'.move">'+MOVES.map(function(m){return '<option value="'+m[0]+'"'+((it.move||'walk')===m[0]?' selected':'')+'>'+m[1]+'</option>';}).join('')+'</select><div style="display:flex;gap:4px"><select data-b="'+b+'.size">'+[['S','small'],['M','medium'],['L','large']].map(function(m){return '<option value="'+m[0]+'"'+((it.size||'M')===m[0]?' selected':'')+'>'+m[1]+'</option>';}).join('')+'</select><button class="ib" data-act="tryPet" data-i="'+i+'" title="See it move">▶ Try</button></div>':'')+'</div>'+
      '<label class="chk"><input type="checkbox" data-special="'+i+'"'+(it.special?' checked':'')+'> special</label><button class="ib del" data-act="iDel" data-i="'+i+'">✕</button></div>';});
  return h+'<button class="dash" data-act="iAdd">+ Item</button></div>';
}
function tPrizes(){
  var h='<div class="card"><h3>Prizes to hand out</h3><p class="help">Items he got on this device. Tick when you have given them.</p>';
  var real=P.items.filter(function(o){var it=itemById(o.id);return !it||it.kind!=='sticker';});
  if(!real.length)h+='<p class="help">Nothing yet. (Screen stickers don’t need handing out.)</p>';
  P.items.slice().reverse().forEach(function(o){var it0=itemById(o.id);if(it0&&it0.kind==='sticker')return;var i=P.items.indexOf(o),it=itemById(o.id)||{name:'(deleted item)',emoji:'❔'};
    h+='<div class="claim'+(o.given?' given':'')+'"><span class="em">'+(it.img?'<img src="'+esc(it.img)+'" style="width:36px;height:36px;border-radius:8px;object-fit:cover" alt="">':esc(it.emoji))+'</span><div class="x"><b>'+esc(it.name)+'</b><div class="help">'+(o.how==='prize'?'🏆 won in a hard quest':'⭐ bought')+' · '+new Date(o.at).toLocaleDateString()+'</div></div><label class="chk"><input type="checkbox" data-given="'+i+'"'+(o.given?' checked':'')+'> given</label></div>';});
  return h+'</div>';
}
function tSettings(){
  return '<div class="card"><h3>Course</h3><label>Name shown at the top</label>'+inp('title')+'</div>'+
   '<div class="card"><h3>Default quest limit</h3><p class="help">Used for lessons that don’t set their own “Max quests”. Leave empty for no limit.</p>'+inp('maxQuests','no limit','number')+'</div>'+
   '<div class="card"><h3>Points per quest</h3><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px"><div><label>Easy</label>'+inp('points.easy','','number')+'</div><div><label>Medium</label>'+inp('points.medium','','number')+'</div><div><label>Hard</label>'+inp('points.hard','','number')+'</div></div></div>'+
   '<div class="card"><h3>Teacher PIN</h3><p class="help">Keeps him out of this panel. Saved only as a scrambled hash, never the PIN itself.</p>'+'<input type="password" id="pinSet" autocomplete="new-password" placeholder="'+(DATA.pin?'PIN is set. Type a new one to change it':'no PIN')+'">'+(DATA.pin?' <button class="sbtn" id="pinClear">Remove PIN</button>':'')+'</div>'+
   '<div class="card"><h3>This device</h3><p class="help">He has ⭐ '+P.points+' now (earned '+P.earned+' in total).</p><button class="sbtn" data-act="give" data-x="5">+5 ⭐ for effort</button> <button class="sbtn" data-act="give" data-x="10">+10 ⭐</button> <button class="sbtn" data-act="give" data-x="-5">−5 ⭐</button> <button class="sbtn" data-act="unlock">Unlock all quests in this lesson</button> <button class="sbtn" style="color:#ff9a9a" data-act="reset">Reset his progress</button></div>';
}
var TV=$('teacherView');
TV.addEventListener('change',function(e){var t=e.target;if(t.dataset.qon!==undefined){quizCfg().on=t.checked;touch();return;}if(t.dataset.qans!==undefined){quizCfg().items[+t.dataset.qans].ans=+t.value;touch();renderTeacher();return;}if(t.id==='pinSet'&&t.value){var v=t.value;try{pinHash(v).then(function(h){DATA.pin=h;touch();renderTeacher();toast('PIN saved');},function(){toast('Cannot set a PIN in this browser');});}catch(x){toast('Cannot set a PIN in this browser');}}});
TV.addEventListener('click',function(e){if(e.target.id==='pinClear'){DATA.pin='';touch();renderTeacher();toast('PIN removed');}});
TV.addEventListener('input',function(e){var t=e.target;if(!t.dataset.b)return;setPath(t.dataset.b,t.type==='number'?(+t.value||0):t.value);touch();if(t.hasAttribute('data-rr'))renderTeacher();});
TV.addEventListener('change',function(e){var t=e.target;
  var mb=t.dataset&&t.dataset.b||'';
  if(/^lessons\.\d+\.(maxQuests|limitMode)$/.test(mb)){var li2=+mb.split('.')[1],l2=DATA.lessons[li2];if(l2)limitChanged(l2);return;}
  if(mb==='maxQuests'){renderTeacher();toast(DATA.maxQuests?'Default limit: '+DATA.maxQuests+' quests (used when you break a lesson into quests)':'No default limit');return;}
  if(t.dataset.hhide!==undefined){DATA.hall[+t.dataset.hhide].hidden=t.checked;touch();renderTeacher();return;}
  if(t.dataset.special!==undefined){DATA.items[+t.dataset.special].special=t.checked;touch();renderTeacher();}
  if(t.dataset.given!==undefined){P.items[+t.dataset.given].given=t.checked;saveP();renderTeacher();}
  if(t.dataset.up!==undefined&&t.files&&t.files[0]){var i=+t.dataset.up,file=t.files[0],fr=new FileReader();
    fr.onload=function(){
      if(/gif$/i.test(file.type)&&file.size<400000){DATA.items[i].img=fr.result;touch();renderTeacher();toast('Animated GIF added');return;}
      if(/gif$/i.test(file.type))toast('That GIF is big, so it will be still. Use one under 400 KB to keep it moving.');
      var im=new Image();im.onload=function(){var M=220,r=Math.min(1,M/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*r);c.height=Math.round(im.height*r);
        c.getContext('2d').drawImage(im,0,0,c.width,c.height);DATA.items[i].img=c.toDataURL('image/png');touch();renderTeacher();};im.src=fr.result;};
    fr.readAsDataURL(file);}
});
function mv(a,i,d){var j=i+d;if(j<0||j>=a.length)return;var x=a[i];a[i]=a[j];a[j]=x;}
TV.addEventListener('click',function(e){
  var hr=e.target.closest('[data-hrm]');if(hr){hallRemove(hr.dataset.hrm);return;}
  var tb=e.target.closest('[data-tab]');if(tb){tv.tab=tb.dataset.tab;renderTeacher();return;}
  var b=e.target.closest('[data-act]');if(!b)return;
  var a=b.dataset.act,Ls=DATA.lessons,l=Ls[tv.sel],j=+b.dataset.j,k=+b.dataset.k,ch=true;
  switch(a){
   case 'close':
     if(dirty&&!b.dataset.force){modal('<h2>Save your changes?</h2><p>Your lesson changes are only on <b>this computer</b>. Your student will not see them until you click <b>💾 Save to page</b>.</p><div class="mrow"><button class="sbtn" id="clLater">Later</button><button class="pbtn" id="clSave">💾 Save now</button></div>');
       $('clSave').onclick=function(){closeModal();saveToPage();};
       $('clLater').onclick=function(){closeModal();var fb=document.createElement('button');fb.dataset.act='close';fb.dataset.force='1';TV.appendChild(fb);fb.click();fb.remove();};return;}
     setTimeout(placeHandles,50);$('guideView').hidden=true;pets.forEach(function(x){x.el.remove();});pets=[];syncPets();$('teacherView').hidden=true;if(P.lesson>=Ls.length)P.lesson=0;renderStudent();return;
   case 'repView':repView(repById(b.dataset.r));return;
   case 'repOk':repAnswer(repById(b.dataset.r),true);return;
   case 'repNo':repAnswer(repById(b.dataset.r),false);return;
   case 'tguide':openTeacherGuide();return;
   case 'save':saveToPage();return;case 'export':exportData();return;case 'import':importData();return;
   case 'pick':tv.sel=+b.dataset.i;ch=false;break;
   case 'hAdd':DATA.hall.push({id:uid('hp'),phase:(DATA.hall.length?+DATA.hall[DATA.hall.length-1].phase||1:1),lessons:'',topic:'',title:'New project',desc:'',finalCode:'<!DOCTYPE html>\n<html>\n  <head>\n    <title>My project</title>\n  </head>\n  <body>\n    <h1>My project</h1>\n  </body>\n</html>',finalCss:'',max:10,customMax:8});break;
   case 'hRestore':confirmBox('Replace the Hall with the built-in projects? Your own Hall projects will be removed.',function(){DATA.hall=JSON.parse(JSON.stringify(HALL_DEFAULT));touch();renderTeacher();toast('Built-in projects restored');},'Restore');return;
   case 'hDel':var hi=+b.dataset.i;confirmBox('Delete “'+esc(DATA.hall[hi].title)+'” from the Hall?',function(){DATA.hall.splice(hi,1);touch();renderTeacher();},'Delete');return;
   case 'pgAdd':var pa=gp(b.dataset.path);if(pa){if(!pa.pages)pa.pages=[];var nn=2;while(pa.pages.some(function(x){return x.name==='page'+nn+'.html';}))nn++;pa.pages.push({name:'page'+nn+'.html',code:'<!DOCTYPE html>\n<html>\n  <head>\n    <title>Page '+nn+'</title>\n  </head>\n  <body>\n    <h1>Page '+nn+'</h1>\n    <a href="index.html">Home</a>\n  </body>\n</html>'});}break;
   case 'pgDel':var pd=gp(b.dataset.path);if(pd&&pd.pages){pd.pages.splice(k,1);}break;
   case 'hUp':mv(DATA.hall,+b.dataset.i,-1);break;case 'hDown':mv(DATA.hall,+b.dataset.i,1);break;
   case 'hPrev':hallOpen(DATA.hall[+b.dataset.i].id);return;
   case 'addLesson':var prev=Ls[Ls.length-1];Ls.push({id:uid('l'),title:'New lesson',basedOn:prev?prev.id:'',finalCode:prev?prev.finalCode:'',finalCss:prev?prev.finalCss||'':'',quests:[]});tv.sel=Ls.length-1;break;
   case 'lCopy':codeBox(lessonCode([l]),'📤 Lesson code','<p>Paste it in <b>Teacher → Import → ➕ Add these lessons</b> on any computer or account. To put it on the page, the owner must then click <b>💾 Save to page</b>.</p>');return;
   case 'lUp':mv(Ls,tv.sel,-1);tv.sel=Math.max(0,tv.sel-1);break;
   case 'lDown':if(tv.sel<Ls.length-1){mv(Ls,tv.sel,1);tv.sel++;}break;
   case 'lDel':confirmBox('Delete the lesson “'+esc(l.title)+'”?',function(){Ls.splice(tv.sel,1);tv.sel=0;touch();renderTeacher();},'Delete');return;
   case 'breakdown':
     var go=function(){var all=lessonQuests(l);l.quests=limitQuests(all,limitOf(l),l.limitMode);if(all.length>l.quests.length)setTimeout(function(){toast('🔨 '+all.length+' quests → '+l.quests.length+' (your limit)');},1200);touch();renderTeacher();toast('🔨 '+l.quests.length+' quests made');};
     if(l.quests&&l.quests.length)confirmBox('This replaces the '+l.quests.length+' quests in this lesson.',go,'Break it down');else go();return;
   case 'fun':funNames(l);return;
   case 'applyLimit':var lm=limitOf(l);if(!lm){toast('Type a number in “Max quests” first');return;}var before=(l.quests||[]).length;if(before<=lm){toast('Already '+before+' quests: nothing to change');return;}
     confirmBox((l.limitMode==='first'?'Keep only the first '+lm+' of the '+before+' quests? The rest are removed.':'Combine the '+before+' quests into '+lm+' bigger quests?'),function(){l.quests=limitQuests(l.quests,lm,l.limitMode);touch();renderTeacher();toast('Now '+l.quests.length+' quests');},'Yes');return;
   case 'previewFinal':modal('<h2>Final code preview</h2><iframe class="goalframe" id="gf" title="Final"></iframe><div class="mrow"><button class="pbtn" data-close>Close</button></div>');$('gf').srcdoc=processCode(buildPage(l.finalCode,l.finalCss));return;
   case 'qUp':mv(l.quests,j,-1);break;
   case 'qDel':l.quests.splice(j,1);break;
   case 'tDel':l.quests[j].tasks.splice(k,1);if(!l.quests[j].tasks.length)l.quests.splice(j,1);break;
   case 'tAdd':l.quests[j].tasks.push({t:'New task',h:'',check:{type:'manual'}});break;
   case 'qAdd':quizCfg().items.push({id:uid('z'),q:'',opts:['','','',''],ans:0,why:''});break;
   case 'qDel':quizCfg().items.splice(+b.dataset.i,1);break;
   case 'qTest':openQuiz(true);return;
   case 'iAdd':DATA.items.push({id:uid('i'),emoji:'🎁',name:'New item',price:50,special:false,kind:'merch'});break;
   case 'iDel':DATA.items.splice(+b.dataset.i,1);break;
   case 'noImg':delete DATA.items[+b.dataset.i].img;break;
   case 'tryPet':var tp=addPet(DATA.items[+b.dataset.i]);tp.y=Math.min(tp.y<0?100:tp.y,innerHeight-120);say(tp,'Hi!');setTimeout(function(){tp.el.remove();pets=pets.filter(function(x){return x!==tp;});},7000);return;
   case 'give':P.points=Math.max(0,P.points+ +b.dataset.x);if(+b.dataset.x>0)P.earned+= +b.dataset.x;saveP();renderHeader();ch=false;toast('Points updated');break;
   case 'unlock':unlockedOverride=true;toast('All quests unlocked on this device until you reload');ch=false;break;
   case 'reset':confirmBox('Erase his points, items and code on this device?',function(){P={points:0,earned:0,items:[],lessons:{},lesson:0,log:[],reports:[],using:[]};saveP();renderTeacher();toast('Progress reset');},'Reset');return;
  }
  if(ch)touch();renderTeacher();
});
var unlockedOverride=false;
var _unl=unlocked;unlocked=function(i){return unlockedOverride||_unl(i);};

function funNames(l){
  if(!sampleApi||!l.quests||!l.quests.length)return;
  var pr=$('tprog');pr.textContent='✨ Thinking of names…';
  var list=l.quests.map(function(q,i){return (i+1)+'. '+q.title+' | tasks: '+q.tasks.map(function(t){return t.t;}).join(' / ');}).join('\n');
  sampleApi('Rename these coding quests for a 10-year-old who loves the Roblox game 99 Nights in the Forest. Each name: 2 to 4 words, exciting, related to forest survival AND hinting at what is built. No emojis. Return ONLY a JSON array of strings, one per quest, same order.\n\n'+list,{modelTier:'quick',cache:false}).then(function(r){
    var t=r.text,a=t.indexOf('['),z=t.lastIndexOf(']');var arr=JSON.parse(t.slice(a,z+1));
    l.quests.forEach(function(q,i){if(arr[i])q.title=String(arr[i]).slice(0,40);});touch();renderTeacher();toast('✨ New quest names');
  }).catch(function(err){pr.textContent=err&&err.code==='not_granted'?'Claude wasn’t allowed. Allow it when asked.':'Couldn’t rename right now. Try again later.';});
}
function buildHTML(){
  var json=JSON.stringify(DATA).replace(/</g,'\\u003c'),f=document.head.querySelector('link[href*="fonts.googleapis"]');
  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>'+esc(DATA.title||'Code Quest')+'</title>\n'+(f?f.outerHTML:'')+'\n<style id="appcss">'+$('appcss').textContent+'</style>\n</head>\n<body>\n<template id="shell">'+$('shell').innerHTML+'</template>\n<script type="application/json" id="data">'+json+'<\/script>\n<script id="app">'+$('app').textContent+'<\/script>\n</body>\n</html>';
}
function saveToPage(){
  if(!artifactApi){cantSave('unavailable');return;}
  toast('Saving…');DATA.t=Date.now();try{localStorage.setItem(LKEY,JSON.stringify(DATA));}catch(e){}
  artifactApi.publish(buildHTML()).then(function(){dirty=false;setSt();toast('✓ Saved! He will see this next time he opens the page.');})
  .catch(function(err){var c=err&&err.code;if(c==='not_writer'||c==='not_granted'){cantSave('owner');return;}
    toast(c==='conflict'?'The page changed elsewhere and will reload. Try again.':'Couldn’t save ('+(c||'error')+'). Changes stay on this device.');});
}
function lessonCode(ls){var used={};ls.forEach(function(l){(l.quests||[]).forEach(function(q){if(q.prize&&q.prize!=='random')used[q.prize]=1;});});
  return 'CQL1:'+b64(new TextEncoder().encode(JSON.stringify({v:1,lessons:ls,items:DATA.items.filter(function(it){return used[it.id];})})));}
function readLessonCode(txt){txt=String(txt||'').trim();var o,c=txt.replace(/\s+/g,'');
  if(/^CQL1:/.test(c))o=JSON.parse(new TextDecoder().decode(unb64(c.slice(5))));else o=JSON.parse(txt);
  if(Array.isArray(o))o={lessons:o};if(!o||!Array.isArray(o.lessons))throw new Error('no lessons found');return o;}
function codeBox(code,title,intro){
  modal('<h2>'+title+'</h2>'+intro+'<textarea rows="6" id="lcOut" readonly style="width:100%;font-family:JetBrains Mono,monospace;font-size:11.5px;word-break:break-all"></textarea><div class="mrow"><button class="sbtn" data-close>Close</button><button class="pbtn" id="lcCopy">📋 Copy code</button></div>');
  $('lcOut').value=code;
  $('lcCopy').onclick=function(){try{navigator.clipboard.writeText(code).then(function(){toast('📋 Copied');},function(){$('lcOut').select();toast('Press Ctrl+C (or ⌘+C)');});}catch(e){$('lcOut').select();toast('Press Ctrl+C (or ⌘+C)');}};
}
function cantSave(why){
  var cur=DATA.lessons[tv.sel];
  modal('<h2>This account can’t save to the page</h2><p>'+(why==='owner'?'Only the account that <b>owns</b> Code Quest can save. Your changes are kept on <b>this computer</b> only, so the student can’t see them yet.':'Saving isn’t available here. Your changes are kept on <b>this computer</b> only.')+'</p>'+
   '<p><b>To get your lessons onto the page:</b></p><ol style="color:var(--muted);line-height:1.6;margin-top:0"><li>Copy the lesson code below.</li><li>Send it to the owner (chat, email…).</li><li>The owner opens <b>Teacher → Import</b>, pastes it, chooses <b>➕ Add these lessons</b>, then <b>💾 Save to page</b>.</li></ol>'+
   '<div class="mrow" style="justify-content:flex-start">'+(cur?'<button class="pbtn" id="csOne">📤 Code for “'+esc(short(cur.title,24))+'”</button>':'')+'<button class="sbtn" id="csAll">📤 Code for all lessons</button><button class="sbtn" data-close style="margin-left:auto">Close</button></div>');
  if(cur)$('csOne').onclick=function(){codeBox(lessonCode([cur]),'📤 Lesson code','<p>Send this to the owner of Code Quest.</p>');};
  $('csAll').onclick=function(){codeBox(lessonCode(DATA.lessons),'📤 All lessons','<p>Send this to the owner of Code Quest.</p>');};
}
function exportData(){
  var d=JSON.parse(JSON.stringify(DATA));delete d.pin;
  codeBox(JSON.stringify(d),'Export','<p>A backup of <b>all</b> your lessons, items and settings (not the PIN). Paste it back with <b>Import</b>.</p>');
}
function importData(){
  modal('<h2>Import</h2><p>Paste a <b>lesson code</b> (from 📤) or an <b>Export</b>.</p><textarea rows="7" id="im" style="width:100%;font-family:JetBrains Mono,monospace;font-size:11.5px;word-break:break-all"></textarea>'+
   '<div id="imInfo" class="help" style="margin-top:8px"></div><div class="mrow"><button class="sbtn" data-close>Cancel</button><button class="sbtn" id="imRep">Replace everything</button><button class="pbtn" id="imAdd">➕ Add these lessons</button></div>');
  function get(){try{return readLessonCode($('im').value);}catch(e){$('imInfo').innerHTML='<span style="color:#ffb36b">That doesn’t look like a lesson code or export.</span>';return null;}}
  $('imAdd').onclick=function(){var o=get();if(!o)return;
    var ids={};DATA.lessons.forEach(function(l){ids[l.id]=1;});var itemIds={};DATA.items.forEach(function(it){itemIds[it.id]=1;});
    (o.items||[]).forEach(function(it){if(!itemIds[it.id]){DATA.items.push(it);itemIds[it.id]=1;}});
    var inCode={};o.lessons.forEach(function(x){inCode[x.id]=1;});
    var added=o.lessons.map(function(l){l=JSON.parse(JSON.stringify(l));if(ids[l.id]){var old=l.id;l.id=uid('l');o.lessons.forEach(function(x){if(x.basedOn===old)x.basedOn=l.id;});}
      if(l.basedOn&&!ids[l.basedOn]&&!inCode[l.basedOn])l.basedOn='';ids[l.id]=1;return l;});
    DATA.lessons=DATA.lessons.concat(added);ensureQuests();touch();closeModal();tv.tab='lessons';tv.sel=DATA.lessons.length-added.length;renderTeacher();
    toast('➕ Added '+added.length+' lesson'+(added.length>1?'s':'')+'. Click 💾 Save to page.');};
  $('imRep').onclick=function(){var o=get();if(!o)return;
    confirmBox('Replace <b>all</b> lessons with this?',function(){
      var pin=DATA.pin;if(o.title!==undefined&&o.items){DATA=o;DATA.pin=pin;}else{DATA.lessons=o.lessons;}
      DATA.rev=Math.max(EMBED.rev||0,DATA.rev||0);ensureQuests();touch();tv.sel=0;renderTeacher();toast('Imported. Click 💾 Save to page.');},'Replace');};
}

