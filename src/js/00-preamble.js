"use strict";
document.body.prepend(document.getElementById('shell').content.cloneNode(true));
var $=function(id){return document.getElementById(id);};
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function md(s){return esc(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');}
function uid(p){return (p||'x')+Math.random().toString(36).slice(2,9);}
var tt;function toast(m){var t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show');},2600);}
function modal(h){$('modalBox').className='mbox';$('modalBox').innerHTML=h;$('modal').classList.add('show');}
function closeModal(){$('modal').classList.remove('show');}
$('modal').addEventListener('click',function(e){if(e.target.id==='modal'||e.target.closest('[data-close]'))closeModal();});
function limitChanged(l){
  var lm=limitOf(l),n=(l.quests||[]).length;
  renderTeacher();
  if(!lm||!n){toast(lm?'Limit set: '+lm+' quests':'No limit for this lesson');return;}
  if(n>lm){
    confirmBox('This lesson has <b>'+n+'</b> quests. '+(l.limitMode==='first'?'Keep only the <b>first '+lm+'</b>? The others are removed.':'Combine them into <b>'+lm+'</b> bigger quests?'),
      function(){l.quests=limitQuests(l.quests,lm,l.limitMode);touch();renderTeacher();toast('✓ Now '+l.quests.length+' quests');},'Yes, make it '+lm);
  }else{
    var full=lessonQuests(l).length;
    if(n<lm&&full>n)confirmBox('The lesson now has <b>'+n+'</b> quests, and your limit is <b>'+lm+'</b>. Break the final code into quests again to get up to <b>'+Math.min(lm,full)+'</b>? (Your edits to these quests will be replaced.)',
      function(){l.quests=limitQuests(lessonQuests(l),lm,l.limitMode);touch();renderTeacher();toast('✓ Now '+l.quests.length+' quests');},'Yes, rebuild');
    else toast('Limit set: '+lm+'. This lesson already has '+n+' quests.');
  }
}
function confirmBox(msg,yes,label){modal('<h2>Are you sure?</h2><p>'+msg+'</p><div class="mrow"><button class="sbtn" data-close>Cancel</button><button class="pbtn" id="cYes">'+(label||'Yes')+'</button></div>');$('cYes').onclick=function(){closeModal();yes();};}


