/* ============ BREAK FINAL CODE INTO QUESTS ============ */
var RANK={easy:0,medium:1,hard:2},RN=['easy','medium','hard'];
var HARDPROP=/^(display|flex|flex-.*|grid|grid-.*|justify-.*|align-.*|position|top|left|right|bottom|float|z-index|transform|transform-.*|transition|transition-.*|animation|animation-.*|content)$/;
var INLINE={strong:'bold',b:'bold',em:'slanted',i:'slanted',mark:'highlighted',u:'underlined',small:'small',code:'code-style',sup:'raised up',sub:'lowered'};
var TEXTY=/^(h[1-6]|p|li|td|th|button|label|span|blockquote|figcaption|caption|dt|dd|summary|legend|option|small|strong|em|b|i|q|cite)$/;
var SKIP=/^(script|style|br|noscript|template|meta|link|title|head|source|track)$/;
var MEDIA=/^(video|audio|iframe|embed|object|canvas|svg|input|select|textarea|progress|meter)$/;
var CONTAINER_NAMES={div:'box',section:'section',header:'header',nav:'menu bar',main:'main area',footer:'footer',article:'article',aside:'side box',form:'form',figure:'figure',ul:'list',ol:'list'};
var KEYATTR=['href','src','width','height','target','type','colspan','rowspan','border','bgcolor','color','align','controls','autoplay','loop','muted','allowfullscreen','rel','for','name','value','cellpadding','cellspacing','size','face','start','reversed'];
function norm(s){return String(s||'').replace(/\s+/g,' ').trim();}
function normT(s){return norm(s).replace(/\s+([.,!?;:)])/g,'$1').replace(/([(])\s+/g,'$1').toLowerCase();}
function short(s,n){s=norm(s);return s.length>n?s.slice(0,n-1)+'…':s;}
function firstWords(s){return norm(s).split(' ').slice(0,4).join(' ');}
function cssStr(v){return '"'+String(v).replace(/\\/g,'\\\\').replace(/"/g,'\\"')+'"';}
function keyOf(el){var t=el.tagName.toLowerCase(),id=el.getAttribute('id'),c=el.classList&&el.classList[0];return t+(id?'#'+CSS.escape(id):'')+(c?'.'+CSS.escape(c):'');}
function attrInfo(el,skip){var sel='',show='';
  KEYATTR.forEach(function(a){if((skip&&skip.indexOf(a)>=0)||!el.hasAttribute(a))return;var v=el.getAttribute(a);
    if(a==='src'){sel+='[src*='+cssStr(v.split('/').pop())+']';show+=' src="'+short(v,40)+'"';return;}
    if((a==='width'||a==='height')&&!isNaN(parseFloat(v))){sel+='['+a+'^='+cssStr(String(parseFloat(v)))+']';show+=' '+a+'="'+v+'"';return;}
    if(v===''){sel+='['+a+']';show+=' '+a;return;}
    sel+='['+a+'='+cssStr(v)+']';show+=' '+a+'="'+short(v,40)+'"';});
  return {sel:sel,show:show};}
function selOf(el,skip){return keyOf(el)+attrInfo(el,skip).sel;}
function tagShow(el,skip){var t=el.tagName.toLowerCase(),c=el.getAttribute('class'),id=el.getAttribute('id');return '<'+t+(id?' id="'+id+'"':'')+(c?' class="'+c.split(/\s+/)[0]+'"':'')+attrInfo(el,skip).show+'>';}
function idx(doc,sel,el){try{return Array.prototype.indexOf.call(doc.querySelectorAll(sel),el)+1;}catch(e){return 1;}}
function sig(el){return keyOf(el)+'|'+short(el.textContent,60)+'|'+attrInfo(el).show;}
function normSel(s){s=norm(s).toLowerCase().replace(/\s*([,>+~])\s*/g,'$1').replace(/:{1,2}(before|after|first-line|first-letter|marker|placeholder|selection)\b/g,'::$1');return s.split(',').map(function(x){return x.trim();}).sort().join(',');}
function normAt(s){return norm(s).toLowerCase().replace(/\s*([:(),])\s*/g,'$1');}
function declsOf(body){return body.split(';').map(function(d){var k=d.indexOf(':');return k<0?null:[d.slice(0,k).trim().toLowerCase(),d.slice(k+1).replace(/!important/i,'').trim()];}).filter(function(d){return d&&d[0]&&d[1];});}
function parseCSS(text){
  text=String(text||'').replace(/\/\*[\s\S]*?\*\//g,'');var rules=[],at=[];
  (function walk(t,media,mraw){var depth=0,start=0,pre='';
    for(var i=0;i<t.length;i++){var ch=t[i];
      if(ch==='{'){if(depth===0){pre=t.slice(start,i).trim();start=i+1;}depth++;}
      else if(ch==='}'){depth--;if(depth===0){var body=t.slice(start,i);
        if(pre.charAt(0)==='@'){var pn=normAt(pre);at.push({n:pn,raw:norm(pre),body:body});if(/^@(media|supports)/i.test(pre))walk(body,pn,norm(pre));}
        else if(pre)rules.push({sel:normSel(pre),raw:norm(pre),media:media||'',mraw:mraw||'',decls:declsOf(body)});
        start=i+1;}}}
    var rest=t.slice(start).trim();if(depth===0&&/^@import/i.test(rest))at.push({n:normAt(rest.replace(/;$/,'')),raw:rest});
  })(text,'');
  return {rules:rules,at:at};
}
function styleText(doc){return Array.prototype.map.call(doc.querySelectorAll('style'),function(s){return s.textContent;}).join('\n');}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}

function noGrp(l){l.forEach(function(t){delete t.grp;});return l;}
function whichEl(e){var t=e.tagName.toLowerCase();
  if(t==='tr'){var tb=e.closest('table'),rows=tb?Array.prototype.slice.call(tb.querySelectorAll('tr')):[];return 'row '+(rows.indexOf(e)+1)+' `<tr>`';}
  if((t==='td'||t==='th')&&norm(e.textContent))return 'the `<'+t+'>` that says **'+short(e.textContent,24)+'**';
  if(norm(e.textContent)&&t!=='table'&&t!=='body')return '`<'+t+'>` **'+short(e.textContent,24)+'**';
  return '`<'+t+'>`';}
function styleTasks(els){var seen={},out=[];
  els.forEach(function(e){var st=e.getAttribute&&e.getAttribute('style');if(!st)return;var t=e.tagName.toLowerCase(),base=keyOf(e)+attrInfo(e).sel,first=true;
    declsOf(st).forEach(function(d){var k=base+'|'+d[0]+'|'+norm(d[1])+'|'+short(e.textContent,24);if(seen[k])return;seen[k]=1;
      out.push({t:first?'Add `style="'+d[0]+': '+d[1]+'"` to '+whichEl(e):'In the same `style`, add `; '+d[0]+': '+d[1]+'`',
        h:first?'`<'+t+' style="'+d[0]+': '+d[1]+'">`':'Several styles go in one style="…", separated by `;` like `style="border: 1px solid green; '+d[0]+': '+d[1]+'"`',
        check:{type:'css',sel:base,prop:d[0],value:d[1]},grp:out.gid||0});first=false;});out.gid=(out.gid||0)+1;});
  return out;}
function packStyle(list){var chunks=[],cur=[],g=-1,grp=[];
  function flush(){if(!grp.length)return;if(cur.length+grp.length>3&&cur.length){chunks.push(cur);cur=[];}cur=cur.concat(grp);grp=[];}
  list.forEach(function(t){if(t.grp!==g){flush();g=t.grp;}grp.push(t);});flush();if(cur.length)chunks.push(cur);
  return chunks.map(function(c){return c.map(function(t){delete t.grp;return t;});});}
function breakdown(finalCode,prevCode,finalCss,prevCss){
  if(!linkedCss(finalCode).length)finalCss='';if(!linkedCss(prevCode||'').length)prevCss='';
  var dp=new DOMParser(),doc=dp.parseFromString(finalCode||'','text/html'),pdoc=dp.parseFromString(prevCode||'','text/html');
  var units=[],prevSig={};
  Array.prototype.forEach.call(pdoc.body.querySelectorAll('*'),function(e){var s=sig(e);prevSig[s]=(prevSig[s]||0)+1;});
  function seen(el){var s=sig(el);if(prevSig[s]>0){prevSig[s]--;return true;}return false;}
  function U(label,diff,tasks,brk){if(tasks.length)units.push({label:label,diff:diff,tasks:tasks,brk:!!brk});}
  function T(t,h,check){return {t:t,h:h,check:check};}
  /* page skeleton */
  if(/<!doctype html>/i.test(finalCode)&&!/<!doctype html>/i.test(prevCode||'')){
    var ttl=doc.querySelector('title');
    U('Build the page','easy',[T('Start with `<!DOCTYPE html>` and `<html>`','`<!DOCTYPE html>` goes on line 1. Then `<html>` … `</html>` wraps everything.',{type:'code',text:'<!DOCTYPE html>, <html, </html>'}),
      ttl&&norm(ttl.textContent)?T('Add `<head>` with a `<title>`: **'+short(ttl.textContent,40)+'**','`<head>` `<title>`Your title`</title>` `</head>`',{type:'text',sel:'title',text:firstWords(ttl.textContent)}):T('Add `<head>` … `</head>`','The head holds info about the page.',{type:'code',text:'<head, </head>'}),
      T('Add `<body>` … `</body>`','Everything you can see goes inside the body.',{type:'code',text:'<body, </body>'})],true);
  }else{
    var t1=doc.querySelector('title'),t0=pdoc.querySelector('title');
    if(t1&&norm(t1.textContent)&&(!t0||norm(t0.textContent)!==norm(t1.textContent)))U('Name the page','easy',[T('Set the `<title>` to **'+short(t1.textContent,40)+'**','The title shows in the browser tab.',{type:'text',sel:'title',text:firstWords(t1.textContent)})],true);
  }
  var plinks=linkedCss(prevCode);
  linkedCss(finalCode).forEach(function(f){if(plinks.indexOf(f)<0)U('Connect the CSS file','easy',[T('Connect **'+f+'**: add `<link rel="stylesheet" href="'+f+'">` in `<head>`','The link tag tells the page where its styles are. It has no closing tag.',{type:'code',text:'<link, stylesheet, '+f})],true);});
  function inlineTasks(el){
    var out=[];
    Array.prototype.forEach.call(el.querySelectorAll('strong,b,em,i,mark,u,code,a,span,img,sup,sub,small'),function(c){
      if(out.length>=2)return;var t=c.tagName.toLowerCase(),w=short(c.textContent,30);
      if(t==='img'){var s=selOf(c,['alt']);out.push(T('Put picture `'+tagShow(c,['alt'])+'` inside it','`<img src="…">` goes right inside the text, between the other words.',{type:'count',sel:keyOf(el)+' '+s,min:1}));return;}
      if(!w)return;
      if(t==='a'){out.push(T('Make **'+w+'** a link: `'+tagShow(c)+'`','`'+tagShow(c)+'`'+w+'`</a>`',{type:'text',sel:selOf(c),text:firstWords(c.textContent)}));return;}
      if(t==='span'){if(c.getAttribute('class')||c.getAttribute('id'))out.push(T('Wrap **'+w+'** in `'+tagShow(c)+'`','`'+tagShow(c)+'`'+w+'`</span>`',{type:'text',sel:selOf(c),text:firstWords(c.textContent)}));return;}
      out.push(T('Make **'+w+'** '+INLINE[t]+' with `<'+t+'>`','`<'+t+'>`'+w+'`</'+t+'>`',{type:'text',sel:selOf(c),text:firstWords(c.textContent)}));
    });
    return out;
  }
  function walk(parent){
    Array.prototype.forEach.call(parent.children,function(el){
      var t=el.tagName.toLowerCase();if(SKIP.test(t))return;
      var key=selOf(el),tx=norm(el.textContent);
      if(t==='ul'||t==='ol'){
        if(seen(el)){walk(el);return;}
        var items=Array.prototype.map.call(el.children,function(li){return short(li.textContent,24);}).filter(Boolean);
        var list=items.length>5?items.slice(0,4).join(', ')+' + '+(items.length-4)+' more':items.join(', ');
        var lsel=key+' > li',lis=el.querySelectorAll(':scope > li'),n=lis.length?idx(doc,lsel,lis[lis.length-1]):0;
        var tasks=[T('Add a '+(t==='ul'?'bullet list':'numbered list')+' `'+tagShow(el)+'` with '+items.length+' items: **'+list+'**','`'+tagShow(el)+'` then one `<li>`item`</li>` for each, then `</'+t+'>`',{type:'count',sel:lsel,min:n,chars:1})];
        Array.prototype.forEach.call(lis,function(li){if(tasks.length<3)tasks=tasks.concat(inlineTasks(li).slice(0,3-tasks.length));});
        U('Make a list','medium',tasks);return;
      }
      if(t==='table'){
        if(seen(el))return;
        var rows=el.querySelectorAll('tr'),ths=el.querySelectorAll('th'),tds=el.querySelectorAll('td'),cap=el.querySelector('caption'),tsel=key+' tr';
        var a=[T('Add a table `'+tagShow(el)+'` with **'+rows.length+'** rows `<tr>`','`'+tagShow(el)+'` `<tr>`…`</tr>` `</table>`. Each `<tr>` is one row.',{type:'count',sel:tsel,min:rows.length?idx(doc,tsel,rows[rows.length-1]):1})];
        if(cap&&norm(cap.textContent))a.push(T('Give it a `<caption>`: **'+short(cap.textContent,40)+'**','`<caption>` goes right after `<table>`.',{type:'text',sel:'caption',text:firstWords(cap.textContent)}));
        if(ths.length)a.push(T('Add header cells `<th>`: **'+Array.prototype.map.call(ths,function(c){return short(c.textContent,16);}).slice(0,6).join(', ')+'**','`<th>` cells are bold titles, usually in the first row.',{type:'text',sel:'th',text:firstWords(ths[0].textContent)}));
        U('Build a table','hard',a.slice(0,3),true);
        var b=[];
        if(tds.length)b.push(T('Fill the cells `<td>`, starting with **'+short(tds[0].textContent,20)+'**','`<td>`words`</td>` inside each row.',{type:'count',sel:'td',min:idx(doc,'td',tds[tds.length-1])}));
        var span=el.querySelector('td[colspan],td[rowspan],th[colspan],th[rowspan]');
        if(span)b.push(T('Join cells with `'+tagShow(span)+'`','`colspan` joins cells side by side, `rowspan` joins them up and down.',{type:'count',sel:selOf(span),min:1}));
        var icons=el.querySelectorAll('td img, th img');
        if(icons.length)b.push(T('Put '+(icons.length===1?'a picture icon':'**'+icons.length+'** picture icons')+' `<img>` in the cells','Put `<img src="…">` inside a `<td>`.',{type:'count',sel:'td img, th img',min:idx(doc,'td img, th img',icons[icons.length-1])}));
        U('Fill the table','medium',b.slice(0,3),true);
        packStyle(styleTasks([el].concat(Array.prototype.slice.call(el.querySelectorAll('tr,td,th'))))).forEach(function(ch,ci){U('Style the table'+(ci?' (more)':''),'medium',ch,true);});
        return;
      }
      if(t==='img'){
        if(seen(el))return;
        var alt=el.getAttribute('alt'),s2=selOf(el,['alt'])+(alt?'[alt]:not([alt=""])':'');
        U('Add pictures','medium',[T('Add picture `'+tagShow(el,['alt'])+'`'+(alt?' with alt text':''),'`<img src="…"'+(alt?' alt="what it shows"':'')+'>` (no closing tag)',{type:'count',sel:s2,min:idx(doc,s2,el)})].concat(noGrp(styleTasks([el]))));return;
      }
      if(t==='hr'){if(seen(el))return;U('Add a line','easy',[T('Add a line `'+tagShow(el)+'`','`<hr>` draws a line. It has no closing tag.',{type:'count',sel:key,min:idx(doc,key,el)})]);return;}
      if(t==='a'&&!el.querySelector('div,p,section,img')){
        if(seen(el))return;
        U('Add links','medium',[T('Add link `'+tagShow(el)+'`: **'+short(tx,30)+'**','`'+tagShow(el)+'`words`</a>`',tx?{type:'text',sel:key,text:firstWords(tx)}:{type:'count',sel:key,min:idx(doc,key,el)})]);return;
      }
      if(MEDIA.test(t)){
        if(seen(el))return;var ph=el.getAttribute('placeholder');
        var mt=[T('Add `'+tagShow(el)+'`'+(ph?' that says **'+short(ph,30)+'**':''),'`'+tagShow(el)+'`'+(/^(input|embed)$/.test(t)?' (no closing tag)':' … `</'+t+'>`'),{type:'count',sel:key,min:idx(doc,key,el)})];
        Array.prototype.forEach.call(el.querySelectorAll('source,track,option'),function(s,k){if(k<2)mt.push(T('Inside it, add `'+tagShow(s)+'`'+(norm(s.textContent)?': **'+short(s.textContent,20)+'**':''),'It goes between `<'+t+'>` and `</'+t+'>`.',{type:'count',sel:key+' '+selOf(s),min:1}));});
        U(/^(input|select|textarea)$/.test(t)?'Add inputs':'Add video and sound',/^(input|select|textarea)$/.test(t)?'hard':'medium',mt.slice(0,3));return;
      }
      var blockKids=Array.prototype.some.call(el.children,function(c){var ct=c.tagName.toLowerCase();return !INLINE[ct]&&!/^(a|span|br|img|q|cite)$/.test(ct);});
      if(!blockKids&&tx&&(TEXTY.test(t)||!CONTAINER_NAMES[t]||!el.children.length)){
        if(seen(el))return;
        var lab=t==='h1'?'Put up the title':/^h[2-3]$/.test(t)?'The “'+short(tx,20)+'” part':'Write some words';
        U(lab,t==='button'?'medium':'easy',[T('Add `'+tagShow(el)+'`: **'+short(tx,70)+'**','`'+tagShow(el)+'`your words`</'+t+'>`',{type:'text',sel:key,text:firstWords(tx)})].concat(inlineTasks(el)).concat(noGrp(styleTasks([el]))),/^h[1-3]$/.test(t));return;
      }
      if(!tx&&!el.children.length){if(seen(el))return;U('Add '+t,'medium',[T('Add `'+tagShow(el)+'` … `</'+t+'>`','An empty `<'+t+'>`. CSS will give it a shape.',{type:'count',sel:key,min:idx(doc,key,el)})]);return;}
      if(!seen(el)){
        var nm=CONTAINER_NAMES[t]||'container';
        units.push({intro:1,label:'Build the '+(el.classList[0]?el.classList[0]+' ':'')+nm,diff:t==='form'?'hard':'medium',brk:true,tasks:[T('Add a '+nm+' `'+tagShow(el)+'`. The next things go inside it.','`'+tagShow(el)+'` … `</'+t+'>`',{type:'count',sel:key,min:idx(doc,key,el)})]});
      }
      walk(el);
    });
  }
  walk(doc.body);
  /* CSS: <style> in the page, plus style.css */
  function rulesOf(html,css){var a=parseCSS(styleText(html)),b=parseCSS(css||'');a.rules.forEach(function(r){r.file='';});b.rules.forEach(function(r){r.file='style.css';});a.at.forEach(function(r){r.file='';});b.at.forEach(function(r){r.file='style.css';});return {rules:a.rules.concat(b.rules),at:a.at.concat(b.at)};}
  var cur=rulesOf(doc,finalCss),prev=rulesOf(pdoc,prevCss),had={},hadAt={};
  prev.rules.forEach(function(r){r.decls.forEach(function(d){had[r.media+'|'+r.sel+'|'+d[0]+'|'+norm(d[1])]=1;});});
  prev.at.forEach(function(a){hadAt[a.n]=1;});
  var needStyleTag=!pdoc.querySelector('style')&&cur.rules.some(function(r){return !r.file;}),introduced={};
  if(needStyleTag)U('Get ready to style','easy',[T('Add `<style>` … `</style>` inside `<head>`','CSS rules go between `<style>` and `</style>`, in the head.',{type:'count',sel:'style',min:1})],true);
  cur.at.forEach(function(a){if(hadAt[a.n]||/^@(media|supports)/.test(a.n))return;
    U('Special rule','hard',[T((a.file?'In **'+a.file+'**, add':'Add')+' the `'+short(a.raw,50)+'` rule','Copy it from the goal design. Ask your teacher if you get stuck.',{type:'atrule',text:a.n})],true);});
  var firstCss=true;
  cur.rules.forEach(function(r){
    var decls=r.decls.filter(function(d){return !had[r.media+'|'+r.sel+'|'+d[0]+'|'+norm(d[1])];});if(!decls.length)return;
    if(r.media&&!introduced[r.media]&&!hadAt[r.media]){introduced[r.media]=1;U('Screen-size rule','hard',[T((r.file?'In **'+r.file+'**, add':'Add')+' `'+(r.mraw||r.media)+' { }`','Rules inside `@media` only work when the screen matches.',{type:'atrule',text:r.media})],true);}
    var pseudo=/:/.test(r.raw);
    var where=(r.file?'in **'+r.file+'**, ':'')+(r.media?'inside `'+(r.mraw||r.media)+'`, ':'');
    var tasks=decls.map(function(d){return {t:cap(where+'in `'+r.raw+' { }` write `'+d[0]+': '+d[1]+';`'),h:'`'+r.raw+' { '+d[0]+': '+d[1]+'; }`',check:{type:'css',sel:r.raw,prop:d[0],value:d[1],media:r.media||''},hard:HARDPROP.test(d[0])||pseudo||!!r.media};});
    for(var i=0;i<tasks.length;i+=3){var part=tasks.slice(i,i+3),hard=part.some(function(x){return x.hard;});part.forEach(function(x){delete x.hard;});
      U('Style '+short(r.raw,24)+(r.media?' (small screens)':'')+(i?' (more)':''),hard?'hard':'medium',part,firstCss&&!needStyleTag);firstCss=false;}
  });
  /* group into quests of max 3 tasks */
  var quests=[],q=null;
  units.forEach(function(u){
    var fits=q&&q.tasks.length+u.tasks.length<=3;
    var mergeable=fits&&((q.intro&&!/^Style |^Special|^Screen|^Get ready|^Connect/.test(u.label))||(!u.brk&&(q.label===u.label||(/^Style /.test(q.label)&&/^Style /.test(u.label)))));
    if(!mergeable){q={label:u.label,title:u.label,diff:u.diff,tasks:[],intro:!!u.intro};quests.push(q);}
    else if(!u.intro){if(q.intro)q.label=u.label;q.intro=false;}
    else if(q.label!==u.label&&/^Style /.test(u.label))q.title=q.title+' + '+u.label.replace(/^Style /,'');
    q.tasks=q.tasks.concat(u.tasks);if(RANK[u.diff]>RANK[q.diff])q.diff=u.diff;
  });
  return quests.map(function(x){return {id:uid('q'),title:short(x.title,40),diff:x.diff,prize:x.diff==='hard'?'random':'',tasks:x.tasks};});
}
function lessonBase(l){return l.basedOn&&lessonById(l.basedOn);}
/* keep a lesson to at most N quests: combine neighbours (smallest pairs first) or keep the first N */
function limitOf(l){var n=+l.maxQuests||+DATA.maxQuests||0;return n>0?n:0;}
function limitQuests(qs,max,mode){
  qs=qs.slice();if(!max||qs.length<=max)return qs;
  if(mode==='first')return qs.slice(0,max);
  while(qs.length>max){
    var best=-1,bs=1e9;for(var i=0;i<qs.length-1;i++){if(qFile(qs[i])!==qFile(qs[i+1]))continue;var sz=qs[i].tasks.length+qs[i+1].tasks.length;if(sz<bs){bs=sz;best=i;}}
    if(best<0)break;var a=qs[best],b=qs[best+1];
    var m={id:a.id,file:a.file,title:a.title,diff:RN[Math.max(RANK[a.diff]||0,RANK[b.diff]||0)],prize:(a.prize||b.prize)?(a.prize||b.prize):'',tasks:a.tasks.concat(b.tasks)};
    qs.splice(best,2,m);
  }
  return qs;
}
function ensureQuests(){DATA.lessons.forEach(function(l){if(!l.quests){l.quests=limitQuests(lessonQuests(l),limitOf(l),l.limitMode);}});}

