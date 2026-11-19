/* ============ BLOCKS ============ */
var PICS=Object.keys(S).map(function(n){return n+'.png';});
var FONTS=['Verdana, sans-serif','Georgia, serif',"'Courier New', monospace",'Impact, sans-serif',"'Comic Sans MS', cursive","'Trebuchet MS', sans-serif",'Arial, sans-serif'];
var BOXTAGS=['div','header','nav','main','section','article','aside','footer','form','figure'];
var T={
 title:{cat:'page',kind:'head',label:'tab title',f:[{k:'text',t:'text',d:'My Website'}],parts:['<title>','@text','</title>']},
 link:{cat:'page',kind:'head',label:'CSS file',f:[{k:'href',t:'text',d:'style.css',w:80}],parts:['<link rel="stylesheet" href=','@href','>']},
 style:{cat:'style',kind:'head',label:'style',slot:'rule',ph:'drop “style for” blocks here',head:['<style>'],foot:['</style>']},
 h1:{cat:'text',kind:'content',label:'big heading',f:[{k:'text',t:'text',d:'My heading',w:150}],parts:['<h1>','@text','</h1>']},
 h2:{cat:'text',kind:'content',label:'section heading',f:[{k:'text',t:'text',d:'Section',w:120}],parts:['<h2>','@text','</h2>']},
 h3:{cat:'text',kind:'content',label:'small heading',f:[{k:'text',t:'text',d:'Small heading',w:110}],parts:['<h3>','@text','</h3>']},
 p:{cat:'text',kind:'content',label:'paragraph',f:[{k:'text',t:'text',d:'Type here',w:170}],parts:['<p>','@text','</p>']},
 strong:{cat:'text',kind:'inline',label:'bold words',f:[{k:'text',t:'text',d:'DANGER!',w:90}],parts:['<strong>','@text','</strong>']},
 em:{cat:'text',kind:'inline',label:'slanted words',f:[{k:'text',t:'text',d:'quietly',w:90}],parts:['<em>','@text','</em>']},
 fonttag:{cat:'text',kind:'inline',label:'coloured words',need:'font',f:[{k:'c',t:'text',d:'red',w:70},{k:'text',t:'text',d:'Bring water!',w:110}],parts:['<font color=','@c','>','@text','</font>']},
 hr:{cat:'text',kind:'content',label:'line across',parts:['<hr>']},
 pplus:{cat:'parts',kind:'content',label:'paragraph with parts',slot:'inline',ph:'drop words, bold words, links…',head:['<p>'],foot:['</p>']},
 words:{cat:'parts',kind:'inline',label:'words',f:[{k:'text',t:'text',d:'Read more on',w:130}],parts:['@text']},
 span:{cat:'parts',kind:'inline',label:'span',f:[{k:'cls',t:'text',d:'danger',w:70},{k:'text',t:'text',d:'text',w:80}],parts:['<span class=','@cls','>','@text','</span>']},
 br:{cat:'parts',kind:'inline',label:'new line',parts:['<br>']},
 liplus:{cat:'parts',kind:'li',label:'list item with parts',slot:'inline',ph:'drop words, links…',head:['<li>'],foot:['</li>']},
 tdplus:{cat:'parts',kind:'cell',label:'cell with parts',slot:'inline',ph:'drop words, pictures…',f:[{k:'st',t:'text',d:'',ph:'(optional)',w:150}],head:['<td>'],headS:['<td style=','@st','>'],foot:['</td>']},
 ul:{cat:'list',kind:'content',label:'bullet list',slot:'li',ph:'drop list items here',head:['<ul>'],foot:['</ul>']},
 ol:{cat:'list',kind:'content',label:'numbered list',slot:'li',ph:'drop list items here',head:['<ol>'],foot:['</ol>']},
 li:{cat:'list',kind:'li',label:'list item',f:[{k:'text',t:'text',d:'Item',w:100}],parts:['<li>','@text','</li>']},
 img:{cat:'media',kind:'inline',label:'picture',f:[{k:'src',t:'pic',d:'axe.png'},{k:'alt',t:'text',d:'',ph:'what it shows',w:100},{k:'w',t:'number',d:80},{k:'h',t:'number',d:''}],parts:['<img src=','@src','alt=','@alt','width=','@w','height=','@h','>']},
 a:{cat:'link',kind:'inline',label:'link',f:[{k:'href',t:'text',d:'#',w:90},{k:'text',t:'text',d:'Click me',w:90}],parts:['<a href=','@href','>','@text','</a>']},
 button:{cat:'link',kind:'content',label:'button',f:[{k:'text',t:'text',d:'Press me',w:100}],parts:['<button>','@text','</button>']},
 table:{cat:'table',kind:'content',label:'table',slot:'row',ph:'drop table rows here',f:[{k:'st',t:'text',d:'',ph:'(optional)',w:150}],head:['<table>'],headS:['<table style=','@st','>'],foot:['</table>']},
 tr:{cat:'table',kind:'row',label:'table row',slot:'cell',ph:'drop cells here',f:[{k:'st',t:'text',d:'',ph:'(optional)',w:150}],head:['<tr>'],headS:['<tr style=','@st','>'],foot:['</tr>']},
 th:{cat:'table',kind:'cell',label:'header cell',f:[{k:'text',t:'text',d:'Item',w:80},{k:'st',t:'text',d:'',ph:'(optional)',w:150}],parts:['<th>','@text','</th>'],partsS:['<th style=','@st','>','@text','</th>']},
 td:{cat:'table',kind:'cell',label:'cell',f:[{k:'text',t:'text',d:'Axe',w:80},{k:'st',t:'text',d:'',ph:'(optional)',w:150}],parts:['<td>','@text','</td>'],partsS:['<td style=','@st','>','@text','</td>']},
 div:{cat:'box',kind:'content',label:'box',deftag:'div',f:[{k:'tag',t:'select',o:BOXTAGS,d:'div'},{k:'cls',t:'text',d:'',w:70}],slot:'content inline',ph:'drop blocks inside',head:['<','@tag','class=','@cls','>'],foot:['@/tag']},
 video:{cat:'av',kind:'content',label:'video',f:[{k:'src',t:'text',d:'clip.mp4',w:90},{k:'w',t:'number',d:320}],parts:['<video src=','@src','width=','@w','controls>','</video>']},
 audio:{cat:'av',kind:'content',label:'sound',f:[{k:'src',t:'text',d:'song.mp3',w:90}],parts:['<audio src=','@src','controls>','</audio>']},
 iframe:{cat:'av',kind:'content',label:'YouTube / page',f:[{k:'src',t:'text',d:'https://www.youtube.com/embed/…',w:150},{k:'w',t:'number',d:560},{k:'h',t:'number',d:315}],parts:['<iframe src=','@src','width=','@w','height=','@h','>','</iframe>']},
 input:{cat:'more',kind:'content',label:'input box',f:[{k:'type',t:'select',o:['text','number','email','password','checkbox','color','date','range'],d:'text'},{k:'ph',t:'text',d:'Type here',w:90}],parts:['<input type=','@type','placeholder=','@ph','>']},
 anytag:{cat:'more',kind:'content',label:'any tag',deftag:'span',f:[{k:'tag',t:'text',d:'h4',w:50},{k:'cls',t:'text',d:'',w:70},{k:'text',t:'text',d:'text',w:110}],parts:['<','@tag','class=','@cls','>','@text','@/tag']},
 anybox:{cat:'more',kind:'content',label:'any container',deftag:'div',f:[{k:'tag',t:'text',d:'figure',w:70},{k:'cls',t:'text',d:'',w:70}],slot:'content inline',ph:'drop blocks inside',head:['<','@tag','class=','@cls','>'],foot:['@/tag']},
 rule:{cat:'style',kind:'rule',label:'style for',f:[{k:'sel',t:'sel',d:'body'}],slot:'prop',ph:'drop style properties here',head:['@sel','{'],foot:['}']},
 keyframes:{cat:'style',kind:'rule',label:'animation steps',f:[{k:'name',t:'text',d:'glow',w:80}],slot:'step',ph:'drop from / to steps here',head:['@keyframes','@name','{'],foot:['}']},
 step:{cat:'style',kind:'step',label:'step',f:[{k:'at',t:'text',d:'from',w:60}],slot:'prop',ph:'drop style properties here',head:['@at','{'],foot:['}']},
 media:{cat:'style',kind:'rule',label:'screen size',f:[{k:'cond',t:'text',d:'(max-width: 600px)',w:140}],slot:'rule',ph:'drop “style for” blocks here',head:['@media','@cond','{'],foot:['}']},
 bg:{cat:'prop',kind:'prop',label:'background',f:[{k:'v',t:'color',d:'#1b2e1f'}],parts:['background-color:','@v',';']},
 color:{cat:'prop',kind:'prop',label:'text colour',f:[{k:'v',t:'color',d:'#f5deb3'}],parts:['color:','@v',';']},
 font:{cat:'prop',kind:'prop',label:'font',f:[{k:'v',t:'select',o:FONTS,d:FONTS[0]}],parts:['font-family:','@v',';']},
 size:{cat:'prop',kind:'prop',label:'text size',f:[{k:'v',t:'number',d:24}],parts:['font-size:','@v','px;']},
 align:{cat:'prop',kind:'prop',label:'line up text',f:[{k:'v',t:'select',o:['left','center','right'],d:'center'}],parts:['text-align:','@v',';']},
 border:{cat:'prop',kind:'prop',label:'border',f:[{k:'w',t:'number',d:3},{k:'s',t:'select',o:['solid','dashed','dotted','double','groove','ridge','inset','outset'],d:'solid'},{k:'c',t:'color',d:'#a0522d'}],parts:['border:','@w','px','@s','@c',';']},
 radius:{cat:'prop',kind:'prop',label:'round corners',f:[{k:'v',t:'number',d:12}],parts:['border-radius:','@v','px;']},
 padding:{cat:'prop',kind:'prop',label:'space inside',f:[{k:'v',t:'number',d:10}],parts:['padding:','@v','px;']},
 margin:{cat:'prop',kind:'prop',label:'space outside',f:[{k:'v',t:'number',d:20}],parts:['margin:','@v','px;']},
 flex:{cat:'prop',kind:'prop',label:'side by side',f:[{k:'gap',t:'number',d:10}],parts:['display: flex;','gap:','@gap','px;']},
 cssany:{cat:'prop',kind:'prop',label:'property',f:[{k:'p',t:'text',d:'opacity',w:110},{k:'v',t:'text',d:'',ph:'value',w:110}],parts:['@p',':','@v',';']}
};
var BASEPROPS={'background-color':1,'color':1,'font-family':1,'font-size':1,'text-align':1,'border':1,'border-radius':1,'padding':1,'margin':1,'display':1,'gap':1};
var CATS=[['page','Page info'],['text','Text'],['parts','Text with parts'],['list','Lists'],['media','Pictures'],['link','Links & buttons'],['table','Tables'],['box','Boxes & page parts'],['av','Video & sound'],['more','More tags'],['style','Style (CSS)'],['prop','Style properties (CSS)']];
var WRONG={li:'A list item only fits inside a bullet list or numbered list.',row:'A table row only fits inside a table.',cell:'Cells only fit inside a table row.',prop:'Style properties go inside a “style for” block.',rule:'“Style for” blocks go inside a style block or style.css.',step:'Steps go inside an “animation steps” block.',head:'This block belongs in the <head>.',content:'This goes in the <body> or inside a box.',inline:'This goes in the <body>, a box, or a “with parts” block.'};
function catsFor(code,css){
  var d=new DOMParser().parseFromString(code||'','text/html'),on={page:1,text:1,box:1};
  var map={font:'text',tbody:'table',thead:'table',tfoot:'table',caption:'table',ul:'list',ol:'list',li:'list',img:'media',a:'link',button:'link',table:'table',tr:'table',td:'table',th:'table',video:'av',audio:'av',iframe:'av',source:'av',input:'more',select:'more',textarea:'more',span:'parts',br:'parts'};
  Array.prototype.forEach.call(d.querySelectorAll('body *'),function(e){var t=e.tagName.toLowerCase();
    if(map[t])on[map[t]]=1;else if(BOXTAGS.indexOf(t)>=0)on.box=1;else if(!/^(h1|h2|h3|p|strong|em|hr|b|i)$/.test(t))on.more=1;
    if(/^(p|li|td|th)$/.test(t)&&e.children.length)on.parts=1;
    if(e.getAttribute('class')&&!/^(div|span)$/.test(t)&&BOXTAGS.indexOf(t)<0)on.more=1;});
  if(d.querySelector('style')||(norm(css)&&linkedCss(code).length)){on.style=1;on.prop=1;}
  return CATS.map(function(c){return c[0];}).filter(function(c){return on[c];});
}
function cleanTag(t,d){t=String(t||'').toLowerCase().trim();return /^[a-z][a-z0-9-]{0,20}$/.test(t)?t:d;}
function B(){var p=LP(),m=p.blocks;if(!m.css)m.css=[];if(curPage==='index.html')return m;var g=PG();
  var v={head:g.blocks.head,body:g.blocks.body,css:m.css};Object.defineProperty(v,'uid',{get:function(){return m.uid;},set:function(x){m.uid=x;},enumerable:true});return v;}
function genFor(n){var c=curPage;curPage=n;try{return gen();}finally{curPage=c;}}
function allToType(){var p=LP(),l=L();pagesOf(l).forEach(function(n){if(n==='index.html')p.code=genFor(n);else PG(n).code=genFor(n);});p.css=genCSS();}
function allToBlocks(){var p=LP(),l=L();p.blocks=codeToBlocks(p.code,p.css);pagesOf(l).slice(1).forEach(function(n){var g=PG(n),t=codeToBlocks(g.code,'');renum(t.head,p.blocks);renum(t.body,p.blocks);g.blocks={head:t.head,body:t.body};});}
function mk(t){var d=T[t],b=B(),n={id:'b'+(b.uid++),t:t};(d.f||[]).forEach(function(f){n[f.k]=f.d;});if(d.slot)n.kids=[];return n;}
function mk0(t){var d=T[t],n={t:t};(d.f||[]).forEach(function(f){n[f.k]=f.d;});if(d.slot)n.kids=[];return n;}
function findB(id,arr){var lists=arr?[arr]:[B().head,B().body,B().css];
  for(var a=0;a<lists.length;a++){var Lx=lists[a];for(var i=0;i<Lx.length;i++){if(Lx[i].id===id)return {node:Lx[i],arr:Lx,i:i};if(Lx[i].kids){var r=findB(id,Lx[i].kids);if(r)return r;}}}return null;}
function arrFor(pid){if(pid==='head')return B().head;if(pid==='body')return B().body;if(pid==='css')return B().css;var r=findB(pid);return r&&r.node.kids;}
function usesCssFile(){var l=L();return !!(l&&linkedCss(l.finalCode).length);}
/* turn starting code into blocks (when a lesson builds on another one) */
var FIELDATTR={table:['style'],tr:['style'],td:['style'],th:['style'],font:['color'],img:['src','alt','width','height'],a:['href'],link:['href','rel'],input:['type','placeholder'],video:['src','width','controls'],audio:['src','controls'],iframe:['src','width','height']};
function extraAttrs(el,skip){var out=[];Array.prototype.forEach.call(el.attributes,function(a){if(a.name==='class'||(skip||[]).indexOf(a.name)>=0)return;out.push(a.value===''?a.name:a.name+'="'+a.value+'"');});return out.join(' ');}
function codeToBlocks(code,css){
  var d=new DOMParser().parseFromString(code||'','text/html'),st={head:[],body:[],css:[],uid:1};
  function nb(t,props,el){var n={id:'b'+(st.uid++),t:t};var df=T[t];(df.f||[]).forEach(function(f){n[f.k]=f.d;});if(df.slot)n.kids=[];for(var k in props)n[k]=props[k];if(el){var ex=extraAttrs(el,(FIELDATTR[el.tagName.toLowerCase()]||[]).concat(t==='div'||t==='anybox'||t==='anytag'||t==='span'?[]:['class']));if(t!=='div'&&t!=='anybox'&&t!=='anytag'&&t!=='span'&&el.getAttribute('class'))ex=('class="'+el.getAttribute('class')+'" '+ex).trim();if(ex){n.attrs=ex;n.showAttrs=true;}}return n;}
  function rulesTo(text,arr){var css2=parseCSS(text),med={};
    css2.at.forEach(function(a){if(!/^@keyframes/.test(a.n))return;var kb=nb('keyframes',{name:a.raw.replace(/^@keyframes\s*/i,'')});
      String(a.body||'').replace(/([^{}]+)\{([^{}]*)\}/g,function(m,at,bd){var sb2=nb('step',{at:norm(at)});declsOf(bd).forEach(function(x){sb2.kids.push(nb('cssany',{p:x[0],v:x[1]}));});kb.kids.push(sb2);return m;});arr.push(kb);});css2.rules.forEach(function(r){var rb=nb('rule',{sel:r.raw});r.decls.forEach(function(x){rb.kids.push(nb('cssany',{p:x[0],v:x[1]}));});
      if(r.media){if(!med[r.media]){med[r.media]=nb('media',{cond:(r.mraw||r.media).replace(/^@media\s*/i,'')});arr.push(med[r.media]);}med[r.media].kids.push(rb);}else arr.push(rb);});}
  var ti=d.querySelector('title');if(ti)st.head.push(nb('title',{text:norm(ti.textContent)}));
  Array.prototype.forEach.call(d.querySelectorAll('link[rel=stylesheet]'),function(l){st.head.push(nb('link',{href:l.getAttribute('href')||'style.css'}));});
  var sTxt=styleText(d);if(norm(sTxt)){var sb=nb('style',{});rulesTo(sTxt,sb.kids);st.head.push(sb);}
  if(norm(css))rulesTo(css,st.css);
  function inl(el){var out=[];Array.prototype.forEach.call(el.childNodes,function(c){
      if(c.nodeType===3){var w=norm(c.textContent);if(w)out.push(nb('words',{text:w}));return;}
      if(c.nodeType!==1)return;var x=conv(c,true);if(x)out.push(x);});return out;}
  function conv(el,inside){
    var t=el.tagName.toLowerCase(),cls=el.getAttribute('class')||'',tx=norm(el.textContent),kids=Array.prototype.slice.call(el.children);
    if(/^(script|style)$/.test(t))return null;
    if(t==='br')return nb('br',{},el);
    if(t==='img')return nb('img',{src:(el.getAttribute('src')||'axe.png').split('/').pop(),alt:el.getAttribute('alt')||'',w:parseFloat(el.getAttribute('width'))||'',h:parseFloat(el.getAttribute('height'))||''},el);
    if(t==='font'&&!kids.length)return nb('fonttag',{c:el.getAttribute('color')||'',text:tx},el);
    if(t==='a'&&!kids.length)return nb('a',{text:tx,href:el.getAttribute('href')||''},el);
    if(t==='span')return nb('span',{cls:cls,text:tx},el);
    if((t==='strong'||t==='em')&&!kids.length)return nb(t,{text:tx},el);
    if(t==='hr')return nb('hr',{},el);
    if(t==='input')return nb('input',{type:el.getAttribute('type')||'text',ph:el.getAttribute('placeholder')||''},el);
    if(t==='video'||t==='audio')return nb(t,{src:el.getAttribute('src')||'',w:el.getAttribute('width')||''},el);
    if(t==='iframe')return nb('iframe',{src:el.getAttribute('src')||'',w:el.getAttribute('width')||'',h:el.getAttribute('height')||''},el);
    if(/^(h1|h2|h3|p|li|th|td|button)$/.test(t)){
      if(kids.length&&/^(p|li|td)$/.test(t)){var pp=nb(t==='p'?'pplus':t==='li'?'liplus':'tdplus',t==='td'?{st:el.getAttribute('style')||''}:{},el);pp.kids=inl(el);return pp;}
      return nb(t,(t==='td'||t==='th')?{text:tx,st:el.getAttribute('style')||''}:{text:tx},el);}
    if(t==='ul'||t==='ol'||t==='table'||t==='tr'){var n=nb(t,(t==='table'||t==='tr')?{st:el.getAttribute('style')||''}:{},el);var src=t==='table'?el.querySelectorAll('tr'):kids;Array.prototype.forEach.call(src,function(c){var x=conv(c);if(x)n.kids.push(x);});return n;}
    if(!kids.length)return BOXTAGS.indexOf(t)>=0&&!tx?nb('div',{tag:t,cls:cls},el):nb('anytag',{tag:t,cls:cls,text:tx},el);
    var bx=BOXTAGS.indexOf(t)>=0?nb('div',{tag:t,cls:cls},el):nb('anybox',{tag:t,cls:cls},el);
    var blockish=kids.some(function(c){return !/^(strong|em|b|i|a|span|br|img)$/.test(c.tagName.toLowerCase());});
    if(blockish)kids.forEach(function(c){var x=conv(c);if(x)bx.kids.push(x);});else bx.kids=inl(el);
    return bx;
  }
  Array.prototype.forEach.call(d.body.children,function(c){var x=conv(c);if(x)st.body.push(x);});
  return st;
}
function picList(){var l=L(),extra=[];if(l){var dd=new DOMParser().parseFromString(allFinal(l),'text/html');Array.prototype.forEach.call(dd.querySelectorAll('img[src]'),function(i){var f=i.getAttribute('src').split('/').pop();if(f&&PICS.indexOf(f)<0&&extra.indexOf(f)<0)extra.push(f);});}return PICS.concat(extra);}
function fieldHTML(f,v){
  if(f.t==='text')return '<input type="text" data-k="'+f.k+'" value="'+esc(v)+'" placeholder="'+esc(f.ph||'')+'" style="--w:'+(f.w||110)+'px">';
  if(f.t==='number')return '<input type="number" min="0" max="2000" data-k="'+f.k+'" value="'+esc(v)+'">';
  if(f.t==='color')return '<input type="color" data-k="'+f.k+'" value="'+esc(v)+'">';
  if(f.t==='select'||f.t==='pic'){var o=f.t==='pic'?picList():f.o;if(f.t==='pic'&&v&&o.indexOf(v)<0)o=o.concat([v]);return '<select data-k="'+f.k+'">'+o.map(function(x){return '<option value="'+esc(x)+'"'+(x===v?' selected':'')+'>'+esc(f.t==='pic'?x:x.split(',')[0].replace(/'/g,''))+'</option>';}).join('')+'</select>';}
  if(f.t==='sel')return '<input type="text" list="sels" data-k="'+f.k+'" value="'+esc(v)+'" style="--w:90px">';
  return '';
}
function inlineOn(){var l=L();return !!(l&&/\sstyle\s*=/i.test(allFinal(l)));}
function lessonHasTag(t){var l=L();return !!(l&&new RegExp('<'+t+'[\\s>]','i').test(allFinal(l)));}
function isTagBlock(d){var p=(d.slot?d.head:d.parts)||[];return p.length&&String(p[0]).charAt(0)==='<'&&d.kind!=='head';}
function attrsField(n){return '<input type="text" class="attrs" data-k="attrs" value="'+esc(n.attrs||'')+'" placeholder=\'id="…" target="…"\' style="--w:120px">';}
function partsHTML(parts,n,d,withA){
  var done=!withA,out='';
  (parts||[]).forEach(function(p){
    if(!done&&/^<[a-z0-9]+>$/i.test(p)){out+='<span class="tagb">'+esc(p.slice(0,-1))+'</span>'+attrsField(n)+'<span class="tagb">&gt;</span>';done=true;return;}
    if(!done&&p!=='<'&&/>$/.test(p)&&!/^<\//.test(p)){out+=attrsField(n);done=true;}
    if(p==='@/tag'){out+='<span class="tagb tclose">'+esc('</'+cleanTag(n.tag,d.deftag||'span')+'>')+'</span>';return;}
    if(p.charAt(0)==='@'){var f=(d.f||[]).filter(function(x){return x.k===p.slice(1);})[0];out+=f?fieldHTML(f,n[f.k]):'';return;}
    out+='<span class="tagb">'+esc(p)+'</span>';
  });
  return out;
}
function blockHTML(n,pal,extra){
  var d=T[n.t];if(!d)return '';
  var withA=!pal&&isTagBlock(d)&&(n.showAttrs||n.attrs);
  var useS=(d.headS||d.partsS)&&(inlineOn()||n.st);
  var h='<div class="block k-'+d.cat+(d.slot?' cont':'')+'" '+(pal?'data-new="'+n.t+'"'+(extra||''):'data-id="'+n.id+'"')+'><div class="bhead"><span class="blbl">'+d.label+'</span>'+partsHTML(d.slot?(useS?d.headS:d.head):(useS?d.partsS:d.parts),n,d,withA)+(!pal&&isTagBlock(d)?'<button class="gear" data-gear title="Add attributes like id or target">⚙️</button>':'')+'</div>';
  if(d.slot){h+='<div class="slot" data-pid="'+(pal?'':n.id)+'" data-accept="'+d.slot+'" data-ph="'+d.ph+'">';if(!pal)n.kids.forEach(function(c){h+=blockHTML(c);});h+='</div><div class="bfoot">'+partsHTML(d.foot,n,d,false)+'</div>';}
  return h+'</div>';
}
function lessonCss(){var l=L();if(!l)return {rules:[],at:[]};var a=parseCSS(styleText(new DOMParser().parseFromString(l.finalCode||'','text/html'))),b=parseCSS(linkedCss(l.finalCode).length?(l.finalCss||''):'');return {rules:a.rules.concat(b.rules),at:a.at.concat(b.at)};}
var CSSPROPS=['color','background','background-color','background-image','border','border-radius','border-collapse','border-color','border-style','border-width','box-shadow','text-shadow','opacity','margin','margin-top','margin-bottom','margin-left','margin-right','padding','width','height','max-width','font-size','font-family','font-weight','font-style','text-align','text-decoration','line-height','letter-spacing','list-style-type','list-style-image','display','flex-direction','flex-wrap','justify-content','align-items','gap','grid-template-columns','position','top','left','right','bottom','z-index','transform','transition','animation','cursor','content','float','overflow','vertical-align','outline','visibility','text-transform','filter','list-style','word-spacing','background-size','background-position','background-repeat','min-height','min-width','align-self','flex','flex-grow','object-fit','white-space','row-gap','column-gap','grid-template-rows','justify-items','text-indent','border-spacing','caption-side'];
var ALIAS={picture:'img',image:'img',photo:'img',link:'a',bold:'strong',italic:'em',slanted:'em',heading:'h1 h2 h3',title:'title h1',list:'ul ol li',bullet:'ul',number:'ol',row:'tr',cell:'td th',box:'div',container:'div',menu:'nav',line:'hr',break:'br',video:'video',sound:'audio',music:'audio',youtube:'iframe',hover:'rule',focus:'rule',active:'rule',before:'rule',after:'rule',selector:'rule',css:'style rule',media:'media',keyframes:'keyframes',colour:'color',font:'fonttag font',coloured:'fonttag',size:'font-size',space:'padding margin',corner:'border-radius',shadow:'box-shadow text-shadow',see:'opacity'};
function searchBlocks(q){
  q=q.toLowerCase().replace(/[<>\/]/g,'').trim();if(!q)return null;
  var terms=[q].concat((ALIAS[q]||'').split(' ').filter(Boolean)),h='',found=0,keyHit=ALIAS[q]?ALIAS[q].split(' '):[];
  Object.keys(T).forEach(function(t){var d=T[t];
    var hay=[t,d.label,(d.parts||[]).join(' '),(d.head||[]).join(' '),(d.foot||[]).join(' '),d.cat].join(' ').toLowerCase()+' '+(d.f||[]).map(function(f){return f.o?f.o.join(' '):'';}).join(' ').toLowerCase();
    var tokens=hay.replace(/[<>\/=:;{}"]/g,' ').split(/\s+/);
    if(keyHit.indexOf(t)>=0||tokens.indexOf(q)>=0||hay.indexOf(q)>=0||terms.slice(1).some(function(w){return tokens.indexOf(w)>=0;})){h+=blockHTML(mk0(t),true);found++;}});
  var props=CSSPROPS.filter(function(p){return p.indexOf(q)>=0;});lessonCss().rules.forEach(function(r){r.decls.forEach(function(x){if(x[0].indexOf(q)>=0&&props.indexOf(x[0])<0)props.push(x[0]);});});
  props.slice(0,8).forEach(function(p){var n=mk0('cssany');n.p=p;h+=blockHTML(n,true,' data-p="'+esc(p)+'"');found++;});
  return '<div class="cat"><i style="background:var(--gold)"></i>Results for “'+esc(q)+'”</div>'+(found?h:'<div class="noresult">No blocks found. Try another word, like <b>p</b>, <b>img</b> or <b>color</b>.</div>');
}
function renderPalette(){
  var l=L();if(!l){$('palette').innerHTML='';return;}
  var sq=searchBlocks($('blockSearch').value);
  if(sq!==null){var sels0={body:1};lessonCss().rules.forEach(function(r){sels0[r.raw]=1;});$('palette').innerHTML=sq+'<datalist id="sels">'+Object.keys(sels0).map(function(x){return '<option value="'+esc(x)+'">';}).join('')+'</datalist>';return;}
  var on=catsFor(allFinal(l),l.finalCss),h='',lc=lessonCss();
  var extraProps=[];lc.rules.forEach(function(r){r.decls.forEach(function(x){if(!BASEPROPS[x[0]]&&extraProps.indexOf(x[0])<0)extraProps.push(x[0]);});});
  CATS.forEach(function(c){if(on.indexOf(c[0])<0)return;
    h+='<div class="cat"><i style="background:var(--c-'+c[0]+')"></i>'+c[1]+'</div>';
    Object.keys(T).forEach(function(t){
      if(T[t].cat!==c[0])return;
      if(t==='link'&&!usesCssFile())return;
      if(T[t].need&&!lessonHasTag(T[t].need))return;
      if(t==='media'&&!lc.rules.some(function(r){return r.media;}))return;
      if((t==='keyframes'||t==='step')&&!lc.at.some(function(a){return /^@keyframes/.test(a.n);}))return;
      if(t==='cssany'){extraProps.forEach(function(p){var n=mk0('cssany');n.p=p;h+=blockHTML(n,true,' data-p="'+esc(p)+'"');});}
      h+=blockHTML(mk0(t),true);});});
  var sels={body:1};lc.rules.forEach(function(r){sels[r.raw]=1;});
  h+='<datalist id="sels">'+Object.keys(sels).map(function(s){return '<option value="'+esc(s)+'">';}).join('')+'</datalist>';
  $('palette').innerHTML=h;
}
function renderWS(){
  if(!L()){$('ws').innerHTML='';return;}var b=B();
  var h='<div class="htmlframe"><div class="lbl">index.html · &lt;html&gt;</div>'+
   '<div class="zone"><div class="zl">&lt;head&gt;<span>page info</span></div><div class="slot" data-pid="head" data-accept="head" data-ph="drop a tab title or style block here">'+b.head.map(function(n){return blockHTML(n);}).join('')+'</div><div class="zl zc">&lt;/head&gt;</div></div>'+
   '<div class="zone"><div class="zl">&lt;body&gt;<span>what you see</span></div><div class="slot" data-pid="body" data-accept="content inline" data-ph="drop blocks here">'+b.body.map(function(n){return blockHTML(n);}).join('')+'</div><div class="zl zc">&lt;/body&gt;</div></div>'+
   '<div class="lbl" style="margin-top:6px">&lt;/html&gt;</div></div>';
  if(usesCssFile()||b.css.length)h+='<div class="htmlframe" style="margin-top:14px"><div class="lbl">style.css</div><div class="zone"><div class="slot" data-pid="css" data-accept="rule" data-ph="drop “style for” blocks here">'+b.css.map(function(n){return blockHTML(n);}).join('')+'</div></div></div>';
  $('ws').innerHTML=h;
}
function STY(n){var v=String(n.st||'').replace(/["<>]/g,'').trim();return v?' style="'+v+'"':'';}
function A(n){var s=String(n.attrs||'').trim();if(!s)return '';var out=[];
  s.replace(/([a-zA-Z][\w:-]*)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g,function(m,k,v){if(/^on/i.test(k))return m;if(v===undefined)out.push(k.toLowerCase());else{v=v.replace(/^["']|["']$/g,'');out.push(k.toLowerCase()+'="'+v.replace(/"/g,'&quot;').replace(/</g,'&lt;')+'"');}return m;});
  return out.length?' '+out.join(' '):'';}
function num(v){return parseFloat(v)||0;}
function srcOf(v){v=String(v||'');return /\./.test(v)?v:v+'.png';}
function inl(n){var t=n.t;
  if(t==='words')return esc(n.text);
  if(t==='strong'||t==='em')return '<'+t+A(n)+'>'+esc(n.text)+'</'+t+'>';
  if(t==='a')return '<a href="'+esc(n.href)+'"'+A(n)+'>'+esc(n.text)+'</a>';
  if(t==='img')return '<img src="'+esc(srcOf(n.src))+'" alt="'+esc(n.alt)+'"'+(num(n.w)?' width="'+num(n.w)+'"':'')+(num(n.h)?' height="'+num(n.h)+'"':'')+A(n)+'>';
  if(t==='fonttag')return '<font color="'+esc(n.c)+'"'+A(n)+'>'+esc(n.text)+'</font>';
  if(t==='br')return '<br'+A(n)+'>';
  if(t==='span')return '<span'+(n.cls?' class="'+esc(n.cls)+'"':'')+A(n)+'>'+esc(n.text)+'</span>';
  return '';}
function joinInl(kids){var s='';kids.forEach(function(k){var h=inl(k);if(!h)return;var punct=k.t==='words'&&/^[.,!?;:)]/.test(String(k.text||''));if(s&&!/\s$/.test(s)&&!punct&&k.t!=='br'&&!/<br[^>]*>$/.test(s))s+=' ';s+=h;});return s;}
function gen(){var b=B(),Lx=['<!DOCTYPE html>','<html>','  <head>'];b.head.forEach(function(n){genNode(n,'    ',Lx);});Lx.push('  </head>','  <body>');b.body.forEach(function(n){genNode(n,'    ',Lx);});Lx.push('  </body>','</html>');return Lx.join('\n');}
function genCSS(){var Lx=[];B().css.forEach(function(n){genNode(n,'',Lx);});return Lx.join('\n');}
function kidsOut(n,ind,Lx){n.kids.forEach(function(c){genNode(c,ind+'  ',Lx);});}
function genNode(n,ind,Lx){
  var t=n.t,v=null,d=T[t];if(!d)return;
  if(d.kind==='inline'){Lx.push(ind+inl(n));return;}
  if(['title','h1','h2','h3','p','li','th','td','button'].indexOf(t)>=0)Lx.push(ind+'<'+t+(t==='th'||t==='td'?STY(n):'')+(t==='title'?'':A(n))+'>'+esc(n.text)+'</'+t+'>');
  else if(t==='pplus'||t==='liplus'||t==='tdplus'){var g0={pplus:'p',liplus:'li',tdplus:'td'}[t];Lx.push(ind+'<'+g0+(t==='tdplus'?STY(n):'')+A(n)+'>'+joinInl(n.kids)+'</'+g0+'>');}
  else if(t==='hr')Lx.push(ind+'<hr'+A(n)+'>');
  else if(t==='link')Lx.push(ind+'<link rel="stylesheet" href="'+esc(n.href)+'">');
  else if(t==='input')Lx.push(ind+'<input type="'+esc(n.type)+'" placeholder="'+esc(n.ph)+'"'+A(n)+'>');
  else if(t==='video')Lx.push(ind+'<video src="'+esc(n.src)+'"'+(num(n.w)?' width="'+num(n.w)+'"':'')+' controls'+A(n)+'></video>');
  else if(t==='audio')Lx.push(ind+'<audio src="'+esc(n.src)+'" controls'+A(n)+'></audio>');
  else if(t==='iframe')Lx.push(ind+'<iframe src="'+esc(n.src)+'"'+(num(n.w)?' width="'+num(n.w)+'"':'')+(num(n.h)?' height="'+num(n.h)+'"':'')+A(n)+'></iframe>');
  else if(t==='anytag'){var g=cleanTag(n.tag,'span');Lx.push(ind+'<'+g+(n.cls?' class="'+esc(n.cls)+'"':'')+A(n)+'>'+esc(n.text)+'</'+g+'>');}
  else if(t==='ul'||t==='ol'||t==='table'||t==='tr'){Lx.push(ind+'<'+t+(t==='table'||t==='tr'?STY(n):'')+A(n)+'>');kidsOut(n,ind,Lx);Lx.push(ind+'</'+t+'>');}
  else if(t==='div'||t==='anybox'){var g2=cleanTag(n.tag,'div');Lx.push(ind+'<'+g2+(n.cls?' class="'+esc(n.cls)+'"':'')+A(n)+'>');kidsOut(n,ind,Lx);Lx.push(ind+'</'+g2+'>');}
  else if(t==='style'){Lx.push(ind+'<style>');kidsOut(n,ind,Lx);Lx.push(ind+'</style>');}
  else if(t==='rule'){Lx.push(ind+String(n.sel||'body').replace(/[{}<>;]/g,'')+' {');kidsOut(n,ind,Lx);Lx.push(ind+'}');}
  else if(t==='keyframes'){Lx.push(ind+'@keyframes '+String(n.name||'').replace(/[^\w-]/g,'')+' {');kidsOut(n,ind,Lx);Lx.push(ind+'}');}
  else if(t==='step'){Lx.push(ind+String(n.at||'from').replace(/[{}<>;]/g,'')+' {');kidsOut(n,ind,Lx);Lx.push(ind+'}');}
  else if(t==='media'){Lx.push(ind+'@media '+String(n.cond||'').replace(/[{}<>;]/g,'')+' {');kidsOut(n,ind,Lx);Lx.push(ind+'}');}
  else{
    if(t==='bg')v='background-color: '+n.v;else if(t==='color')v='color: '+n.v;else if(t==='font')v='font-family: '+n.v;
    else if(t==='size')v='font-size: '+num(n.v)+'px';else if(t==='align')v='text-align: '+n.v;
    else if(t==='border')v='border: '+num(n.w)+'px '+n.s+' '+n.c;else if(t==='radius')v='border-radius: '+num(n.v)+'px';
    else if(t==='padding')v='padding: '+num(n.v)+'px';else if(t==='margin')v='margin: '+num(n.v)+'px';
    else if(t==='flex'){Lx.push(ind+'display: flex;');v='gap: '+num(n.gap)+'px';}
    else if(t==='cssany'){var pp=String(n.p||'').replace(/[^a-z-]/gi,'');if(pp)v=pp+': '+String(n.v||'').replace(/[{};<>]/g,'');}
    if(v)Lx.push(ind+v+';');
  }
}
function highlight(c){var e=esc(c);
  e=e.replace(/(&lt;\/?)([a-z0-9!]+)([^&]*?)(&gt;)/gi,function(m,a,tag,at,b){at=at.replace(/([a-z-]+)=(&quot;.*?&quot;)/g,'$1=<span class="at">$2</span>');return '<span class="tg">'+a+tag+'</span>'+at+'<span class="tg">'+b+'</span>';});
  return e.replace(/^(\s+)([a-z-]+)(: )/gm,'$1<span class="pr">$2</span>$3');}

var undo=[];function snap(){undo.push(JSON.stringify(B()));if(undo.length>30)undo.shift();}
var editSnap=null;
$('ws').addEventListener('focusin',function(e){if(e.target.matches('input,select'))editSnap=JSON.stringify(B());});
$('ws').addEventListener('click',function(e){var g=e.target.closest('[data-gear]');if(!g)return;var r=findB(g.closest('.block').dataset.id);if(!r)return;snap();r.node.showAttrs=!(r.node.showAttrs||r.node.attrs);if(!r.node.showAttrs)r.node.attrs='';saveP();renderWS();render();if(r.node.showAttrs){var inp=document.querySelector('[data-id="'+r.node.id+'"] > .bhead .attrs');if(inp)inp.focus();}});
$('ws').addEventListener('change',function(){if(editSnap){undo.push(editSnap);editSnap=null;}});
$('ws').addEventListener('input',function(e){var f=e.target;if(!f.dataset.k)return;var r=findB(f.closest('.block').dataset.id);if(!r)return;r.node[f.dataset.k]=f.value;if(f.dataset.k==='tag'||(f.tagName==='SELECT'&&f.dataset.k==='tag')){var blk=f.closest('.block');var dft=(T[r.node.t]||{}).deftag||'span';blk.querySelectorAll(':scope > .bhead .tclose, :scope > .bfoot .tclose').forEach(function(t){t.textContent='</'+cleanTag(f.value,dft)+'>';});}clearTimeout(deb);deb=setTimeout(function(){saveP();render();},300);});
var drag=null;
document.addEventListener('pointerdown',function(e){
  if(e.button>0||e.target.closest('input,select,button'))return;
  var hd=e.target.closest('.bhead');if(!hd)return;var b=hd.parentNode;
  if(!b.closest('#palette')&&!b.closest('#ws'))return;
  drag={el:b,sx:e.clientX,sy:e.clientY,started:false,isNew:!!b.dataset.new,type:b.dataset.new||(findB(b.dataset.id)||{node:{}}).node.t};e.preventDefault();
});
window.addEventListener('pointermove',function(e){
  if(!drag)return;
  if(!drag.started){if(Math.abs(e.clientX-drag.sx)+Math.abs(e.clientY-drag.sy)<5)return;
    drag.started=true;var r=drag.el.getBoundingClientRect();drag.ox=drag.sx-r.left;drag.oy=drag.sy-r.top;
    var g=drag.el.cloneNode(true);g.id='ghost';g.style.width=r.width+'px';document.body.appendChild(g);drag.ghost=g;
    if(!drag.isNew){drag.el.classList.add('moving');document.body.classList.add('dragging-ws');}
    drag.marker=document.createElement('div');drag.marker.className='marker';}
  drag.ghost.style.transform='translate('+(e.clientX-drag.ox)+'px,'+(e.clientY-drag.oy)+'px) rotate(2deg)';
  target(e.clientX,e.clientY);
  var ws=$('ws'),wr=ws.getBoundingClientRect();if(e.clientY<wr.top+40)ws.scrollTop-=12;else if(e.clientY>wr.bottom-40)ws.scrollTop+=12;
});
function clearHi(){document.querySelectorAll('.slot.ok,.slot.bad').forEach(function(s){s.classList.remove('ok','bad');});if(drag&&drag.marker&&drag.marker.parentNode)drag.marker.remove();}
function target(x,y){
  clearHi();drag.slot=null;drag.trash=false;$('trash').classList.remove('hot');
  var u=document.elementFromPoint(x,y);if(!u)return;
  if(!drag.isNew&&u.closest('#palCol')){drag.trash=true;$('trash').classList.add('hot');return;}
  var kind=T[drag.type].kind,slot=null,force=null;
  /* over a container's name bar or closing bar: put it INSIDE that container */
  var bar=u.closest('#ws .bhead, #ws .bfoot');
  if(bar){var cb=bar.parentNode;
    if(cb.classList.contains('cont')&&(drag.isNew||(drag.el!==cb&&!drag.el.contains(cb)))){
      var inner=cb.querySelector(':scope > .slot');
      if(inner&&inner.dataset.accept.split(' ').indexOf(kind)>=0){slot=inner;force=bar.classList.contains('bhead')?0:'end';}}}
  if(!slot)slot=u.closest('#ws .slot');
  if(!slot)return;
  if(!drag.isNew&&drag.el.contains(slot)){slot=drag.el.parentNode.closest('.slot');if(!slot)return;force=null;}
  var ok=slot.dataset.accept.split(' ').indexOf(kind)>=0;slot.classList.add(ok?'ok':'bad');drag.slot=slot;drag.ok=ok;if(!ok)return;
  var kids=Array.prototype.filter.call(slot.children,function(c){return c.classList.contains('block')&&c!==drag.el;});
  var ix=kids.length;
  if(force===0)ix=0;else if(force!=='end'){for(var i=0;i<kids.length;i++){var r=kids[i].getBoundingClientRect();if(y<r.top+r.height/2){ix=i;break;}}}
  drag.idx=ix;if(ix<kids.length)slot.insertBefore(drag.marker,kids[ix]);else slot.appendChild(drag.marker);
}
function endDrag(d){clearHi();if(d.marker&&d.marker.parentNode)d.marker.remove();if(d.ghost)d.ghost.remove();d.el.classList.remove('moving');document.body.classList.remove('dragging-ws');$('trash').classList.remove('hot');}
window.addEventListener('pointerup',function(){
  if(!drag)return;var d=drag;drag=null;if(!d.started)return;endDrag(d);
  if(d.trash){snap();var r=findB(d.el.dataset.id);if(r)r.arr.splice(r.i,1);renderWS();saveP();render();toast('🗑 Block removed');return;}
  if(!d.slot)return;if(!d.ok){toast('🚫 '+WRONG[T[d.type].kind]);return;}
  snap();var node;
  if(d.isNew){node=mk(d.type);if(d.el.dataset.p){node.p=d.el.dataset.p;node.v='';}}else{var r2=findB(d.el.dataset.id);if(!r2)return;node=r2.node;r2.arr.splice(r2.i,1);}
  var arr=arrFor(d.slot.dataset.pid);if(!arr)return;arr.splice(Math.min(d.idx,arr.length),0,node);
  renderWS();saveP();render();
});
window.addEventListener('pointercancel',function(){if(drag&&drag.started)endDrag(drag);drag=null;});

$('blockSearch').addEventListener('input',function(){renderPalette();$('paletteScroll').scrollTop=0;});
$('blockSearch').addEventListener('keydown',function(e){if(e.key==='Escape'){this.value='';renderPalette();}});
