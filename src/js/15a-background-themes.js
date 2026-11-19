/* ============ BACKGROUND THEMES ============ */
var THEMES=[
  {id:'night',name:'Night forest',icon:'🌲',css:'linear-gradient(#1b2f55,#183a3a 55%,#08140c)'},
  {id:'dawn',name:'Dawn',icon:'🌅',css:'linear-gradient(#5b4b8a,#d98a8a 45%,#f2c28b 70%,#2d4a3a)'},
  {id:'sunset',name:'Sunset',icon:'🌇',css:'linear-gradient(#1d1038,#5a2150 30%,#c8452f 58%,#f08a2c 72%,#120a05)'},
  {id:'winter',name:'Winter',icon:'❄️',css:'linear-gradient(#0f1b36,#274b78 45%,#9fc0dc 78%,#e8f1f8)'},
  {id:'plain',name:'Calm dark',icon:'🌑',css:'linear-gradient(#0e1812,#0a110d)'}
];
function applyTheme(){
  var id=P.theme||'night',ok=THEMES.some(function(t){return t.id===id;});if(!ok)id='night';
  var bg=$('forestBg');if(bg)bg.setAttribute('data-theme',id);
}
function openThemes(){
  var cur=P.theme||'night';
  modal('<h2>🎨 Background</h2><p class="help">Pick the sky behind your quests.</p><div class="themes">'+THEMES.map(function(t){
    return '<button class="theme'+(t.id===cur?' on':'')+'" data-theme="'+t.id+'" style="background:'+t.css+'"><span>'+t.icon+'</span>'+esc(t.name)+'</button>';
  }).join('')+'</div><div class="mrow"><button class="sbtn" data-close>Close</button></div>');
}
$('themeBtn').onclick=openThemes;
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('.theme');if(!b)return;
  P.theme=b.dataset.theme;saveP();applyTheme();
  [].forEach.call(document.querySelectorAll('.theme'),function(x){x.classList.toggle('on',x===b);});
});
applyTheme();
