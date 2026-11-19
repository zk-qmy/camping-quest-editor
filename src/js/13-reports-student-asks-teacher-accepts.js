/* ============ REPORTS: student asks, teacher accepts ============ */
function lastReport(lid,key){var r=null;(P.reports||[]).forEach(function(x){if(x.lid===lid&&x.key===key)r=x;});return r;}
function pendingReports(){return (P.reports||[]).filter(function(r){return r.status==='pending';});}
function updTeacherBadge(){var b=$('teacherBtn');if(!b)return;var n=pendingReports().length;b.innerHTML='Teacher'+(n?'<span class="badge-n">'+n+'</span>':'');}
function askTeacher(j){
  var q=Q(),l=L(),t=q&&q.tasks[j];if(!t)return;
  modal('<h2>🙋 Ask your teacher</h2><p>Your teacher will look at your code for this task:</p><p style="color:var(--text);font-weight:800">'+md(t.t)+'</p>'+
    '<label style="display:block;font-size:13px;font-weight:800;color:var(--muted);margin:10px 0 4px">What happened? (you can leave this empty)</label>'+
    '<textarea id="askNote" rows="3" style="width:100%;background:#0e1712;border:1px solid var(--line);color:var(--text);border-radius:9px;padding:8px;font:inherit" placeholder="I wrote the h2 but it does not tick…"></textarea>'+
    '<div class="mrow"><button class="sbtn" data-close>Cancel</button><button class="pbtn" id="askSend">📨 Send</button></div>');
  $('askSend').onclick=function(){
    var p=LP();P.reports.push({id:uid('r'),lid:l.id,lesson:l.title,qid:q.id,key:q.id+'-'+j,quest:q.title,task:t.t,check:checkLabel(t.check),note:$('askNote').value.trim(),
      code:P.mode==='blocks'?gen():p.code,css:P.mode==='blocks'?genCSS():p.css,mode:P.mode||'type',at:Date.now(),status:'pending',reply:''});
    saveP();closeModal();renderQuest();applyPass(lastPass);toast('📨 Sent! You can keep going with other tasks.');
  };
}
function tReports(){
  var R=(P.reports||[]).slice().sort(function(a,b){return (a.status==='pending'?0:1)-(b.status==='pending'?0:1)||b.at-a.at;});
  var h='<div class="card"><h3>📨 Reports from the student</h3><p class="help">When a task won’t tick, the student can ask you. Look at his code: <b>Accept</b> counts the task as done; <b>Try again</b> sends him your message. Reports are saved on this device.</p>';
  if(!R.length)h+='<p class="help">No reports yet.</p>';
  R.forEach(function(r){
    h+='<div class="rep'+(r.status!=='pending'?' done':'')+'"><div class="meta">'+esc(r.lesson)+' · '+esc(r.quest)+' · '+new Date(r.at).toLocaleString()+' · '+(r.mode==='blocks'?'🧱 blocks':'⌨️ typing')+'</div>'+
      '<div class="tk">'+md(r.task)+'</div><div class="meta">The page was checking: <code>'+esc(r.check)+'</code></div>'+
      (r.note?'<div class="note">“'+esc(r.note)+'”</div>':'')+
      (r.status==='pending'?'<div class="acts"><button class="sbtn" data-act="repView" data-r="'+r.id+'">👀 See his code</button><button class="pbtn" data-act="repOk" data-r="'+r.id+'">✓ Accept</button><button class="sbtn" data-act="repNo" data-r="'+r.id+'">✗ Try again</button></div>'
        :'<div class="meta" style="margin-top:6px">'+(r.status==='accepted'?'✓ Accepted':'✗ Sent back')+(r.reply?': “'+esc(r.reply)+'”':'')+' <button class="ib" data-act="repView" data-r="'+r.id+'">👀 code</button></div>')+'</div>';
  });
  return h+'</div>';
}
function repById(id){for(var i=0;i<P.reports.length;i++)if(P.reports[i].id===id)return P.reports[i];return null;}
function repView(r){
  modal('<h2>👀 His code</h2><p>'+md(r.task)+'</p><div class="repcode"><pre id="rc"></pre><iframe id="rf" title="His website"></iframe></div><div class="mrow"><button class="pbtn" data-close>Close</button></div>');
  $('rc').textContent=r.code+(norm(r.css)?'\n\n/* style.css */\n'+r.css:'');$('rf').srcdoc=processCode(buildPage(r.code,r.css));
}
function repAnswer(r,ok){
  modal('<h2>'+(ok?'✓ Accept this task?':'✗ Ask him to try again?')+'</h2><p>'+md(r.task)+'</p><label style="display:block;font-size:13px;font-weight:800;color:var(--muted);margin:10px 0 4px">Message to the student (optional)</label>'+
    '<input id="repMsg" style="width:100%" placeholder="'+(ok?'Well done!':'Look at the spelling of your heading')+'"><div class="mrow"><button class="sbtn" data-close>Cancel</button><button class="pbtn" id="repGo">'+(ok?'Accept':'Send back')+'</button></div>');
  $('repGo').onclick=function(){
    r.status=ok?'accepted':'declined';r.reply=$('repMsg').value.trim();
    if(ok){var lp=P.lessons[r.lid];if(lp){lp.manual=lp.manual||{};lp.manual[r.key]=true;}}
    saveP();closeModal();renderTeacher();toast(ok?'✓ Accepted. The task counts as done.':'Sent back to the student.');
  };
}

