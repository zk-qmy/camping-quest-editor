/* ============ TEACHER ACCOUNT (GitHub) ============ */
/* A teacher account is a GitHub account that can write to this project. She logs in once with an access token
   (kept only in this browser, never saved to the page, a backup or an export). 💾 Save to page then makes one
   commit with the course data (src/data/course.json + index.html) and GitHub Pages publishes it. The PIN is never saved. */
var GHKEY='cq-teacher-account',GHSYNC='cq-synced-rev',teacherOK=false,GHFRESH=3600000;
function ghAcc(){try{var a=JSON.parse(localStorage.getItem(GHKEY)||'null');return a&&a.token&&a.repo?a:null;}catch(e){return null;}}
function ghDefaultRepo(){var m=location.hostname.match(/^([^.]+)\.github\.io$/),seg=location.pathname.split('/')[1];return m&&seg?m[1]+'/'+seg:'';}
function ghCall(tok,path,o){
  o=o||{};
  var h={'Accept':o.raw?'application/vnd.github.raw+json':'application/vnd.github+json','Authorization':'Bearer '+tok,'X-GitHub-Api-Version':'2022-11-28'};
  if(o.body)h['Content-Type']='application/json';
  return fetch('https://api.github.com'+path,{method:o.method||'GET',headers:h,body:o.body?JSON.stringify(o.body):undefined}).then(function(r){
    if(!r.ok){var e=new Error('http '+r.status);e.status=r.status;throw e;}
    return o.raw?r.text():r.json();
  });
}
function ghWhy(e){
  var s=e&&e.status;
  if(s===401)return 'GitHub did not accept the token. It may be wrong or expired.';
  if(s===403||s===404)return 'This account is not allowed to change that project. Ask the owner to add you as a collaborator, and give the token “Contents: Read and write”.';
  if(s===409||s===422)return 'The page changed on GitHub while saving. Try again.';
  return 'Could not reach GitHub. Check the internet and try again.';
}
function courseJSON(){var d=JSON.parse(JSON.stringify(DATA));d.pin='';return JSON.stringify(d).replace(/<\/script/gi,'<\\/script');}
function swapData(html,json){
  var open='<scr'+'ipt type="application/json" id="data">',close='</scr'+'ipt>',a=html.indexOf(open);
  if(a<0)return null;
  var s=a+open.length,e=html.indexOf(close,s);
  return e<0?null:html.slice(0,s)+json+html.slice(e);
}
function ghSave(){
  var acc=ghAcc();
  if(!acc){openAccount(ghSave);return;}
  var br=acc.branch||'main',repo='/repos/'+acc.repo,json=courseJSON(),headSha,treeSha,page;
  toast('Saving to GitHub…');
  ghCall(acc.token,repo+'/contents/src/data/course.json?ref='+encodeURIComponent(br),{raw:true}).then(function(txt){
    var remote=0;try{remote=+JSON.parse(txt).rev||0;}catch(e){}
    var base=Math.max(+EMBED.rev||0,+localStorage.getItem(GHSYNC)||0);
    if(remote>base){var c=new Error('newer');c.newer=true;throw c;}
    return ghCall(acc.token,repo+'/git/ref/heads/'+encodeURIComponent(br));
  }).then(function(r){headSha=r.object.sha;return ghCall(acc.token,repo+'/git/commits/'+headSha);
  }).then(function(c){treeSha=c.tree.sha;return ghCall(acc.token,repo+'/contents/index.html?ref='+encodeURIComponent(br),{raw:true});
  }).then(function(html){
    page=swapData(html,json);if(!page){var x=new Error('page');x.page=true;throw x;}
    return ghCall(acc.token,repo+'/git/trees',{method:'POST',body:{base_tree:treeSha,tree:[
      {path:'src/data/course.json',mode:'100644',type:'blob',content:json+'\n'},
      {path:'index.html',mode:'100644',type:'blob',content:page}]}});
  }).then(function(t){return ghCall(acc.token,repo+'/git/commits',{method:'POST',body:{message:'Update course content from the Teacher view',tree:t.sha,parents:[headSha]}});
  }).then(function(c){return ghCall(acc.token,repo+'/git/refs/heads/'+encodeURIComponent(br),{method:'PATCH',body:{sha:c.sha}});
  }).then(function(){
    dirty=false;try{localStorage.setItem(GHSYNC,String(DATA.rev||0));}catch(e){}
    setSt();toast('✓ Saved to GitHub. The live page updates in a minute or two.');
  }).catch(function(e){
    if(e&&e.newer){modal('<h2>Someone else saved first</h2><p>Another teacher saved newer changes. Reload this page to get them, then make your changes again. Your changes stay on this computer until then.</p><div class="mrow"><button class="sbtn" data-close>Close</button></div>');return;}
    if(e&&e.page){toast('Could not update the page on GitHub (page format not recognised).');return;}
    modal('<h2>Could not save</h2><p>'+esc(ghWhy(e))+'</p><p class="help">Your changes stay on this computer.</p><div class="mrow"><button class="sbtn" data-close>Close</button>'+((e&&e.status===401)?'<button class="pbtn" id="ghRe">🔑 Log in again</button>':'')+'</div>');
    if($('ghRe'))$('ghRe').onclick=function(){ghLogout();openAccount();};
  });
}
/* The Teacher view only opens after a successful teacher login (a GitHub account with write access to this project).
   A login checked within the last hour is trusted; otherwise it is checked again, so a removed collaborator or a deleted token loses access. */
function teacherGate(){
  var enter=function(){teacherOK=true;openT();},a=ghAcc();
  if(!a){openAccount(enter,true);return;}
  if(a.at&&Date.now()-a.at<GHFRESH){enter();return;}
  toast('Checking your login…');
  ghCall(a.token,'/repos/'+a.repo).then(function(r){
    if(r.permissions&&r.permissions.push){a.at=Date.now();try{localStorage.setItem(GHKEY,JSON.stringify(a));}catch(e){}enter();}
    else{ghLogout();openAccount(enter,true);}
  }).catch(function(e){
    if(e&&e.status){ghLogout();openAccount(enter,true);}
    else toast('Could not check your login. Check the internet and try again.');
  });
}
function ghLogout(){try{localStorage.removeItem(GHKEY);}catch(e){}}
function openAccount(after,gate){
  var a=ghAcc();
  if(a){
    modal('<h2>🔑 Teacher account</h2><p>✅ Logged in as <b>@'+esc(a.user)+'</b>.</p><p class="help">💾 Save to page saves to <b>'+esc(a.repo)+'</b> ('+esc(a.branch||'main')+') on GitHub. The Teacher PIN is never saved there, so set the PIN in each browser.</p>'+
      '<div class="mrow"><button class="sbtn" id="ghOut">Log out</button><button class="sbtn" data-close>Close</button><button class="pbtn" id="ghNow">💾 Save now</button></div>');
    $('ghOut').onclick=function(){ghLogout();teacherOK=false;closeModal();toast('Logged out');if(!$('teacherView').hidden){var c=document.querySelector('[data-act=close]');if(c){c.dataset.force='1';c.click();}}};
    $('ghNow').onclick=function(){closeModal();ghSave();};
    return;
  }
  modal('<h2>🔑 '+(gate?'Teacher login':'Teacher account')+'</h2><p>'+(gate?'Only teachers can open the Teacher view. Log in with the GitHub account that can edit this project.':'Log in with a GitHub account that can edit this project. Then <b>💾 Save to page</b> saves your changes to GitHub, and the live page updates in a minute or two.')+'</p>'+
    '<label>Project (owner/name)</label><input id="ghRepo" value="'+esc(ghDefaultRepo())+'" placeholder="owner/project" autocomplete="off">'+
    '<label style="margin-top:8px;display:block">Access token</label><input type="password" id="ghTok" autocomplete="off" placeholder="github_pat_…">'+
    '<details style="margin-top:10px"><summary style="cursor:pointer;color:var(--gold);font-weight:800">How do I get an account and a token?</summary><ol style="color:var(--muted);line-height:1.6">'+
    '<li>The owner adds your GitHub username as a <b>collaborator</b> (project → Settings → Collaborators).</li>'+
    '<li>On GitHub: your picture → Settings → Developer settings → Personal access tokens → <b>Fine-grained tokens</b> → Generate new token.</li>'+
    '<li>Repository access: <b>only this project</b>. Permissions → Contents: <b>Read and write</b>.</li>'+
    '<li>Copy the token and paste it above. It stays in this browser only. Never share it.</li></ol></details>'+
    '<p class="help" id="ghMsg" style="margin-top:8px"></p>'+
    '<div class="mrow"><button class="sbtn" data-close>Cancel</button><button class="pbtn" id="ghGo">Log in</button></div>');
  $('ghGo').onclick=function(){
    var repo=$('ghRepo').value.trim(),tok=$('ghTok').value.trim(),msg=$('ghMsg');
    if(!/^[\w.-]+\/[\w.-]+$/.test(repo)||!tok){msg.textContent='Type the project as owner/name and paste the token.';return;}
    msg.textContent='Checking…';
    ghCall(tok,'/user').then(function(u){
      return ghCall(tok,'/repos/'+repo).then(function(r){
        if(!r.permissions||!r.permissions.push){msg.textContent='@'+u.login+' can read this project but cannot save to it. Ask the owner to add you as a collaborator.';return;}
        try{localStorage.setItem(GHKEY,JSON.stringify({user:u.login,repo:repo,branch:r.default_branch||'main',token:tok,at:Date.now()}));}catch(e){msg.textContent='This browser would not keep the login.';return;}
        closeModal();toast('✅ Logged in as @'+u.login);if(after)after();else if(!$('teacherView').hidden)renderTeacher();
      });
    }).catch(function(e){msg.textContent=ghWhy(e);});
  };
}
function accountCard(){
  var a=ghAcc();
  return '<div class="card"><h3>🔑 Teacher account</h3><p class="help">'+(a?'Logged in as <b>@'+esc(a.user)+'</b>. 💾 Save to page saves to GitHub.':'Not logged in. Only a teacher account (a GitHub account that can edit this project) can save. Log in to save your changes.')+'</p><button class="sbtn" data-act="acct">'+(a?'Account…':'Log in…')+'</button></div>';
}
