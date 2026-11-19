/* ============ BACKUP CODE (save / restore progress) ============ */
function b64(bytes){var s='';for(var i=0;i<bytes.length;i++)s+=String.fromCharCode(bytes[i]);return btoa(s);}
function unb64(t){var s=atob(t),a=new Uint8Array(s.length);for(var i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a;}
function makeBackup(){
  var json=JSON.stringify({v:1,course:DATA.title||'',at:Date.now(),p:P}),bytes=new TextEncoder().encode(json);
  if(window.CompressionStream){try{var cs=new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
      return new Response(cs).arrayBuffer().then(function(buf){return 'CQZ1:'+b64(new Uint8Array(buf));}).catch(function(){return 'CQ1:'+b64(bytes);});}catch(e){}}
  return Promise.resolve('CQ1:'+b64(bytes));
}
function readBackup(code){
  code=String(code||'').replace(/\s+/g,'');
  var m=code.match(/^(CQZ?1):(.+)$/);if(!m)return Promise.reject(new Error('That is not a Code Quest backup code.'));
  var bytes;try{bytes=unb64(m[2]);}catch(e){return Promise.reject(new Error('The code is broken. Copy the whole code.'));}
  var p=m[1]==='CQZ1'?(window.DecompressionStream?new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer().then(function(b){return new Uint8Array(b);}):Promise.reject(new Error('This browser cannot read this code.'))):Promise.resolve(bytes);
  return p.then(function(b){var o=JSON.parse(new TextDecoder().decode(b));if(!o||!o.p||typeof o.p.points!=='number')throw new Error('The code is broken. Copy the whole code.');return o;})
   .catch(function(e){throw new Error(e&&/backup|broken|browser/.test(e.message)?e.message:'The code is broken. Copy the whole code.');});
}
function openBackup(tab){
  tab=tab||'save';
  modal('<h2>💾 Backup</h2><div class="tabs"><button class="tab'+(tab==='save'?' on':'')+'" id="bkS">Save my progress</button><button class="tab'+(tab==='load'?' on':'')+'" id="bkL">Load my progress</button></div><div id="bkBody"></div>');
  $('bkS').onclick=function(){openBackup('save');};$('bkL').onclick=function(){openBackup('load');};
  var body=$('bkBody'),done=0;Object.keys(P.lessons||{}).forEach(function(k){done+=Object.keys((P.lessons[k]||{}).done||{}).length;});
  if(tab==='save'){
    body.innerHTML='<p>This code holds <b>all your progress</b>: '+done+' quests done, ⭐ '+P.points+' points, '+P.items.length+' items, your code and blocks. Copy it and keep it safe: send it to your teacher or paste it into a note.</p>'+
      '<textarea id="bkOut" rows="5" readonly style="width:100%;font-family:JetBrains Mono,monospace;font-size:11.5px;background:#0e1712;border:1px solid var(--line);color:var(--text);border-radius:9px;padding:8px;word-break:break-all">Making your code…</textarea>'+
      '<div class="mrow"><button class="sbtn" data-close>Close</button><button class="pbtn" id="bkCopy">📋 Copy code</button></div>';
    makeBackup().then(function(c){$('bkOut').value=c;try{P.lastBackup=Date.now();saveP();}catch(e){}});
    $('bkCopy').onclick=function(){var v=$('bkOut').value;if(!/^CQ/.test(v))return;
      try{navigator.clipboard.writeText(v).then(function(){toast('📋 Copied! Paste it somewhere safe.');},function(){$('bkOut').select();toast('Press Ctrl+C (or ⌘+C) to copy.');});}catch(e){$('bkOut').select();toast('Press Ctrl+C (or ⌘+C) to copy.');}};
  }else{
    body.innerHTML='<p>Paste a backup code to bring back your progress. <b>This replaces the progress on this computer.</b></p>'+
      '<textarea id="bkIn" rows="5" placeholder="CQZ1:…" style="width:100%;font-family:JetBrains Mono,monospace;font-size:11.5px;background:#0e1712;border:1px solid var(--line);color:var(--text);border-radius:9px;padding:8px;word-break:break-all"></textarea>'+
      '<div id="bkInfo" class="help" style="margin-top:8px;color:var(--muted)"></div>'+
      '<div class="mrow"><button class="sbtn" data-close>Cancel</button><button class="pbtn" id="bkGo">Load progress</button></div>';
    $('bkGo').onclick=function(){
      readBackup($('bkIn').value).then(function(o){
        var q=0;Object.keys(o.p.lessons||{}).forEach(function(k){q+=Object.keys((o.p.lessons[k]||{}).done||{}).length;});
        $('bkInfo').innerHTML='Found: <b>'+q+' quests done</b>, ⭐ '+o.p.points+' points, '+(o.p.items||[]).length+' items, saved '+new Date(o.at).toLocaleString()+'.';
        $('bkGo').textContent='Yes, replace my progress';
        $('bkGo').onclick=function(){
          var np=o.p;['items','lessons','log','reports','using'].forEach(function(k){if(!np[k])np[k]=k==='lessons'?{}:[];});
          P=np;if(P.lesson>=DATA.lessons.length)P.lesson=0;saveP();LAY=Object.assign({},LDEF,P.layout||{});
          closeModal();pets.forEach(function(x){x.el.remove();});pets=[];lastPass=[];renderStudent();syncPets();toast('✅ Progress loaded. Welcome back!');
        };
      }).catch(function(e){$('bkInfo').innerHTML='<span style="color:#ffb36b">'+esc(e.message)+'</span>';});
    };
  }
}
$('backupBtn').onclick=function(){openBackup('save');};

