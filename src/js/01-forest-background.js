/* ============ FOREST BACKGROUND ============ */
(function(){
  var bg=$('forestBg');if(!bg)return;
  function tree(x,h,w,c){var t='';for(var k=0;k<4;k++){var y=100-h+k*h*0.2,ww=w*(0.45+k*0.2);t+='<polygon points="'+x+','+(y)+' '+(x-ww/2)+','+(y+h*0.32)+' '+(x+ww/2)+','+(y+h*0.32)+'" fill="'+c+'"/>';}return t+'<rect x="'+(x-w*0.05)+'" y="'+(100-h*0.08)+'" width="'+(w*0.1)+'" height="'+(h*0.1)+'" fill="'+c+'"/>';}
  var svg='<svg viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">',i;
  for(i=0;i<26;i++)svg+=tree(i*8+Math.random()*6,40+Math.random()*25,14+Math.random()*6,'#2a5a43');
  for(i=0;i<20;i++)svg+=tree(i*10+Math.random()*8,55+Math.random()*30,18+Math.random()*8,'#1a3d2b');
  for(i=0;i<12;i++)svg+=tree(i*17+Math.random()*10,70+Math.random()*28,24+Math.random()*10,'#0c2117');
  svg+='</svg>';bg.insertAdjacentHTML('beforeend',svg);
  var h='<div class="moon2"></div>';for(i=0;i<70;i++)h+='<span class="star" style="left:'+(Math.random()*100)+'%;top:'+(Math.random()*42)+'%;animation-delay:'+(Math.random()*3)+'s;opacity:'+(.3+Math.random()*.6)+'"></span>';
  for(i=0;i<26;i++)h+='<span class="ff" style="left:'+(Math.random()*100)+'%;top:'+(35+Math.random()*60)+'%;animation-delay:'+(Math.random()*10)+'s;animation-duration:'+(8+Math.random()*6)+'s"></span>';
  for(i=0;i<3;i++)h+='<span class="eyes" style="left:'+(10+Math.random()*80)+'%;animation-delay:'+(i*5+Math.random()*4)+'s"></span>';
  bg.insertAdjacentHTML('beforeend',h);
})();

