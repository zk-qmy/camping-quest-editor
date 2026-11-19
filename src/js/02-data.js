/* ============ DATA ============ */
var EMBED=JSON.parse($('data').textContent),DATA=EMBED,LKEY='cq-data',PKEY='cq-progress',dirty=false;
try{var loc=JSON.parse(localStorage.getItem(LKEY)||'null');
  /* use this device's unsaved copy only if it is newer than what was saved to the page */
  if(loc&&((loc.t||EMBED.t)?(loc.t||0)>(EMBED.t||0):loc.rev>EMBED.rev)){DATA=loc;dirty=true;}}catch(e){}
function touch(){DATA.rev=(DATA.rev||0)+1;DATA.t=Date.now();dirty=true;try{localStorage.setItem(LKEY,JSON.stringify(DATA));}catch(e){}setSt();}
var P={points:0,earned:0,items:[],lessons:{},lesson:0,log:[],mode:'type',using:[],petsOff:false,reports:[]};
try{var sp=JSON.parse(localStorage.getItem(PKEY)||'null');if(sp)for(var k in sp)P[k]=sp[k];}catch(e){}
if(!P.reports)P.reports=[];if(!P.using)P.using=[];
function saveP(){if(!P.reports)P.reports=[];try{localStorage.setItem(PKEY,JSON.stringify(P));}catch(e){}updTeacherBadge&&updTeacherBadge();}
var BLANK='<'+'!-- Start your quest here! -->\n';
var curPage='index.html';
function pagesOf(l){return ['index.html'].concat(((l&&l.pages)||[]).filter(function(x){return x&&x.name;}).map(function(x){return x.name;}));}
function finalOf(l,n){if(!l)return '';if(!n||n==='index.html')return l.finalCode||'';var f=(l.pages||[]).filter(function(x){return x.name===n;})[0];return f?f.code||'':'';}
function allFinal(l){return l?[l.finalCode||''].concat((l.pages||[]).map(function(x){return x.code||'';})).join('\n'):'';}
function qFile(q){return (q&&q.file)||'index.html';}
function fixPage(){if(pagesOf(L()).indexOf(curPage)<0)curPage='index.html';}
function PG(n){var p=LP();n=n||curPage;if(n==='index.html')return p;if(!p.pages)p.pages={};var g=p.pages[n];if(!g)g=p.pages[n]={code:BLANK,blocks:{head:[],body:[]}};if(!g.blocks)g.blocks={head:[],body:[]};if(g.code==null)g.code='';return g;}
function setB(o){var p=LP();if(curPage==='index.html'){p.blocks=o;return;}var g=PG();g.blocks={head:o.head||[],body:o.body||[]};p.blocks.css=o.css||[];p.blocks.uid=Math.max(p.blocks.uid||1,o.uid||1);}
function renum(arr,m){(arr||[]).forEach(function(n){n.id='b'+(m.uid++);if(n.kids)renum(n.kids,m);});}
function splitCss(css,codes){
  var out=codes.map(function(){return '';}),dp=new DOMParser(),docs=codes.map(function(c){return dp.parseFromString(c||'','text/html');});
  var t=String(css||''),depth=0,start=0,pre='';
  for(var i=0;i<t.length;i++){var ch=t[i];
    if(ch==='{'){if(depth===0)pre=t.slice(start,i);depth++;}
    else if(ch==='}'){depth--;if(depth===0){var blk=t.slice(start,i+1),sel=pre.replace(/\/\*[\s\S]*?\*\//g,'').trim(),k=0;
      if(sel&&sel.charAt(0)!=='@'){var bs=baseSel(sel);var hit=function(d){return bs.split(',').some(function(x){x=x.trim();if(!x)return false;try{return !!d.querySelector(x);}catch(e){return false;}});};
        if(!hit(docs[0])){for(var j=1;j<docs.length;j++)if(hit(docs[j])){k=j;break;}}}
      out[k]+=blk.replace(/^\s*\n/,'')+'\n';start=i+1;}}}
  return out.map(function(x){return x.trim()?x.trim()+'\n':'';});
}
function lessonQuests(l,base){var b=base||lessonBase(l),pg=(l.pages||[]).filter(function(x){return x&&x.name;});
  if(!pg.length)return breakdown(l.finalCode,b?b.finalCode:'',l.finalCss||'',b?b.finalCss||'':'');
  var names=pagesOf(l),codes=names.map(function(n){return finalOf(l,n);}),bcodes=names.map(function(n){return b?finalOf(b,n):'';});
  var parts=splitCss(l.finalCss||'',codes),bparts=b?splitCss(b.finalCss||'',codes):names.map(function(){return '';}),out=[];
  names.forEach(function(n,i){breakdown(codes[i],bcodes[i],parts[i],bparts[i]).forEach(function(q){q.file=n;if(i>0&&q.title==='Build the page')q.title='Start '+n;out.push(q);});});
  return out;}

function L(){if(P.hallOn){var hh=P.hall&&P.hall[P.hallOn];if(hh)return hh;P.hallOn='';}return DATA.lessons[P.lesson]||null;}
function lessonById(id){for(var i=0;i<DATA.lessons.length;i++)if(DATA.lessons[i].id===id)return DATA.lessons[i];return (P.hall&&P.hall[id])||null;}
function LP(){
  var l=L();if(!l)return null;var p=P.lessons[l.id];
  if(!p){p={done:{},current:0,code:'',manual:{},blocks:null};
    var b=l.basedOn&&lessonById(l.basedOn),bp=b&&P.lessons[b.id];
    p.code=(bp&&bp.code&&bp.code.trim())?bp.code:(b?b.finalCode:BLANK);
    p.css=(bp&&bp.css!=null&&norm(bp.css))?bp.css:(b?(b.finalCss||''):'');
    p.blocks=(bp&&bp.blocks)?JSON.parse(JSON.stringify(bp.blocks)):(b?codeToBlocks(b.finalCode,b.finalCss):{head:[],body:[],css:[],uid:1});
    P.lessons[l.id]=p;
    if(l.start){p.code=l.start.code||BLANK;p.css=l.start.css||'';p.pages={};Object.keys(l.start.pages||{}).forEach(function(n){p.pages[n]={code:l.start.pages[n],blocks:{head:[],body:[]}};});var c0=curPage;try{allToBlocks();}finally{curPage=c0;}}
    saveP();}
  if(!p.blocks)p.blocks={head:[],body:[],css:[],uid:1};if(p.css==null)p.css='';
  return p;
}
function Q(){var l=L(),p=LP();return l&&l.quests&&l.quests[p.current]||null;}

