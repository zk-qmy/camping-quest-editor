/* ============ CHECKS ============ */
function qsa(d,s){try{return Array.prototype.slice.call(d.querySelectorAll(s));}catch(e){return [];}}
function sameVal(win,doc,el,prop,v){
  var tag=/^(BODY|HTML)$/.test(el.tagName)?'div':el.tagName;var t=doc.createElement(tag);
  t.style.setProperty(prop,v);if(!t.style.getPropertyValue(prop))return false;
  t.style.visibility='hidden';var par=(el.parentNode&&el.parentNode.nodeType===1&&el.tagName!=='BODY'&&el.tagName!=='HTML')?el.parentNode:doc.body;
  par.appendChild(t);var a=win.getComputedStyle(t).getPropertyValue(prop),b=win.getComputedStyle(el).getPropertyValue(prop);t.remove();return a===b;
}

/* which tags in the typed code were really closed (browsers hide missing closing tags) */
var VOID=/^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr|!doctype)$/i;
function closeMap(src){
  src=String(src||'').replace(/<!--[\s\S]*?-->/g,'');
  var re=/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g,m,stack=[],count={},closed={};
  while((m=re.exec(src))){
    var name=m[2].toLowerCase();
    if(!m[1]){
      if(VOID.test(name)||m[3])continue;
      count[name]=(count[name]||0);var k=count[name]++;(closed[name]=closed[name]||[])[k]=false;stack.push({n:name,k:k});
      if(name==='style'||name==='script'||name==='title'||name==='textarea'){var e=src.toLowerCase().indexOf('</'+name,re.lastIndex);if(e<0)break;re.lastIndex=e;}
    }else{
      for(var i=stack.length-1;i>=0;i--)if(stack[i].n===name){closed[name][stack[i].k]=true;stack.length=i;break;}
    }
  }
  return closed;
}
function markOpen(doc,map){Object.keys(map).forEach(function(n){var els=doc.getElementsByTagName(n);map[n].forEach(function(ok,k){if(!ok&&els[k])els[k].__open=true;});});}
function openTag(el){for(var e=el;e&&e.tagName&&!/^(HTML|BODY|HEAD)$/.test(e.tagName);e=e.parentElement)if(e.__open)return e.tagName.toLowerCase();return null;}
function qs2(x,sel){var L=qsa(x.doc,sel);if(x.loose){L.forEach(function(e){var o=openTag(e);if(o)x.openTags.push(o);});return L;}return L.filter(function(e){return !openTag(e);});}
function cssRules(x){if(!x._rules)x._rules=parseCSS(styleText(x.doc));return x._rules;}
function valEq(x,prop,a,b){
  var na=norm(a).toLowerCase().replace(/\s*,\s*/g,',').replace(/'/g,'"'),nb=norm(b).toLowerCase().replace(/\s*,\s*/g,',').replace(/'/g,'"');if(na===nb)return true;
  try{var t=x.doc.createElement('div');t.style.visibility='hidden';x.doc.body.appendChild(t);var c0=x.win.getComputedStyle(t).getPropertyValue(prop);
    t.style.setProperty(prop,a);var sa=t.style.getPropertyValue(prop),ca=x.win.getComputedStyle(t).getPropertyValue(prop);
    t.style.removeProperty(prop);t.style.setProperty(prop,b);var sb=t.style.getPropertyValue(prop),cb=x.win.getComputedStyle(t).getPropertyValue(prop);t.remove();
    if(!sa||!sb)return false;return sa===sb||(ca===cb&&ca!==c0);}catch(e){return false;}}
function ruleMatch(x,c){
  var ns=normSel(c.sel||''),med=c.media?normAt(c.media):'',pr=String(c.prop||'').toLowerCase();
  return cssRules(x).rules.some(function(r){return r.sel===ns&&(r.media||'')===med&&r.decls.some(function(d){return d[0]===pr&&(!norm(c.value)||valEq(x,pr,d[1],c.value));});});
}
function baseSel(s){return String(s||'').split(',').map(function(p){return p.replace(/::?[a-z-]+(\([^)]*\))?/gi,'').trim();}).filter(Boolean).join(',');}
function runCheck(c,x,key){
  c=c||{};
  switch(c.type){
   case 'code':var it=String(c.text||'').split(',').map(function(s){return s.trim().toLowerCase().replace(/\s+/g,' ');}).filter(Boolean),low=(x.all||x.src).toLowerCase().replace(/\s+/g,' ');
     return it.length>0&&it.every(function(i){return low.indexOf(i)>=0||low.replace(/\s/g,'').indexOf(i.replace(/\s/g,''))>=0;});
   case 'count':var n=+c.chars||0;return qs2(x,c.sel).filter(function(e){return !n||norm(e.textContent).length>=n;}).length>=(+c.min||1);
   case 'text':var w=normT(c.text);return qs2(x,c.sel).some(function(e){return normT(e.textContent).indexOf(w)>=0;});
   case 'attr':var E=qs2(x,c.sel);if(!E.length)return false;var has=function(e){return (e.getAttribute(c.attr||'')||'').trim().length>0;};return c.mode==='any'?E.some(has):E.every(has);
   case 'atrule':var want=normAt(c.text);return cssRules(x).at.some(function(a){return a.n===want||a.n.indexOf(want)===0;});
   case 'css':
     if(c.value&&/\.(png|jpe?g|gif|svg)\b/i.test(c.value)&&!/data:/.test(c.value)){c=Object.assign({},c,{value:processCode(c.value)});}
     var pr=String(c.prop||'').trim();if(!pr)return false;var special=!!c.media||/:/.test(c.sel||'');
     if(!special){
       var E2=qs2(x,c.sel),B2=qsa(x.bdoc,c.sel);
       var ok=norm(c.value)?E2.some(function(e){return String(c.value).split('|').some(function(v){return sameVal(x.win,x.doc,e,pr,v.trim());});})
                           :E2.some(function(e,i){var b=B2[i];return !b||x.win.getComputedStyle(e).getPropertyValue(pr)!==x.bwin.getComputedStyle(b).getPropertyValue(pr);});
       if(ok)return true;
       return E2.length>0&&ruleMatch(x,c);
     }
     var bs=baseSel(c.sel);if(bs&&!qs2(x,bs).length)return false;
     return ruleMatch(x,c);
   case 'manual':return !!LP().manual[key];
  }
  return false;
}
function lastTag(sel){var parts=String(sel||'').split(',')[0].trim().split(/[\s>+~]+/);var m=parts[parts.length-1].match(/^[a-z][a-z0-9]*/i);return m?m[0].toLowerCase():'';}
function diagnose(c,x){
  c=c||{};if(c.nohl)return 'Almost! Add <b>one new thing</b> of your own.';
  if(c.type==='text'){
    var others=[];(L().quests||[]).forEach(function(qq){qq.tasks.forEach(function(tt){var k=tt.check||{};if(k.type==='text'&&k.sel===c.sel&&k!==c)others.push(normT(k.text));});});
    var E=qs2(x,c.sel).filter(function(e){var tx=normT(e.textContent);return !others.some(function(o){return o&&tx.indexOf(o)>=0;});});
    if(E.length)return 'Almost! Your <code>&lt;'+esc(lastTag(c.sel))+'&gt;</code> needs the words <b>'+esc(c.text)+'</b>';
    var bt=lastTag(c.sel);if(bt&&qs2(x,bt).length&&bt!==c.sel)return 'Almost! Check the tag’s <b>id</b>, <b>class</b> or <b>attributes</b>.';
  }
  if(c.type==='count'){
    var all=qs2(x,c.sel),n=+c.chars||0,ok=all.filter(function(e){return !n||norm(e.textContent).length>=n;});
    if(all.length&&ok.length<all.length&&ok.length<(+c.min||1))return 'Almost! Write some words inside it.';
    if(ok.length&&ok.length<(+c.min||1))return 'Almost! You need <b>'+(+c.min)+'</b>. You have <b>'+ok.length+'</b>.';
    var bt2=lastTag(c.sel);if(!all.length&&bt2&&qs2(x,bt2).length&&/[\[#.]/.test(c.sel))return 'Almost! Check the tag’s <b>attributes</b> (like <code>src</code>, <code>href</code>, <code>alt</code>).';
  }
  if(c.type==='css'&&c.prop){
    var ns=normSel(c.sel),R=cssRules(x).rules.filter(function(r){return r.sel===ns&&(r.media||'')===(c.media?normAt(c.media):'');});
    if(R.some(function(r){return r.decls.some(function(d){return d[0]===c.prop;});}))return 'Almost! Check the value: <code>'+esc(c.prop)+': '+esc(c.value||'…')+';</code>';
    if(R.length)return 'Almost! Add <code>'+esc(c.prop)+'</code> inside <code>'+esc(c.sel)+' { }</code>';
  }
  return null;
}
function checkLabel(c){c=c||{};switch(c.type){case 'code':return 'code has: '+c.text;case 'count':return c.min+'× '+c.sel;case 'text':return c.sel+' says “'+c.text+'”';case 'attr':return c.sel+' has '+c.attr;case 'atrule':return 'CSS has '+c.text;case 'css':return (c.media?c.media+' ':'')+c.sel+' { '+c.prop+': '+(c.value||'any')+' }';case 'manual':return 'teacher ticks';}return '?';}

