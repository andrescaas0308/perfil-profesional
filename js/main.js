// Portafolio · Andres Cañas. Sin dependencias.
document.querySelectorAll('.copy').forEach(function(b){
  b.addEventListener('click',function(){
    var el=document.getElementById(b.dataset.t), txt=el.textContent;
    function ok(){var o=b.textContent;b.textContent='Copiado';setTimeout(function(){b.textContent=o},1400)}
    function sel(){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r)}
    try{navigator.clipboard.writeText(txt).then(ok,sel)}catch(e){sel()}
  });
});

// El escalado visual del sitio requiere calcular manualmente las anclas para que
// la navegación siga llegando al inicio exacto de cada sección.
(function(){
  function move(id,smooth){
    var el=document.getElementById(id);if(!el)return;
    var top=scrollY+el.getBoundingClientRect().top-82;
    scrollTo({top:Math.max(0,top),behavior:smooth?'smooth':'auto'});
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=a.getAttribute('href').slice(1);if(!document.getElementById(id))return;
      e.preventDefault();
      history.pushState(null,'','#'+id);
      move(id,true);
    });
  });
  addEventListener('hashchange',function(){if(location.hash)move(location.hash.slice(1),false)});
  if(location.hash)setTimeout(function(){move(location.hash.slice(1),false)},0);
})();
(function(){
  var r=document.documentElement;
  try{if(localStorage.getItem('tema')==='dark')r.setAttribute('data-theme','dark')}catch(e){}
  document.getElementById('tgl').addEventListener('click',function(){
    var next=r.getAttribute('data-theme')==='dark'?'light':'dark';
    r.setAttribute('data-theme',next);
    try{localStorage.setItem('tema',next)}catch(e){}
  });
})();

// Formulario de contacto: sitio estático, así que arma un correo con los datos y abre la app de correo.
(function(){
  var f=document.getElementById('form'); if(!f)return;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(!f.checkValidity()){f.reportValidity();return}
    var n=f.elements.nombre.value.trim(), c=f.elements.correo.value.trim(), m=f.elements.mensaje.value.trim();
    var asunto='Contacto desde el portafolio: '+n;
    var cuerpo=m+'\n\n'+n+'\n'+c;
    location.href='mailto:andrescaas.0308@gmail.com?subject='+encodeURIComponent(asunto)+'&body='+encodeURIComponent(cuerpo);
  });
})();
// Proyectos: en pantallas amplias están uno al lado del otro y el scroll vertical los va mostrando
// (la sección queda fija: aparece el 1.º, luego se desliza el 2.º y después sigue la página).
// En pantallas chicas se apilan.
(function(){
  var sec=document.getElementById('proyectos'), pin=sec.querySelector('.pin'), pinIn=sec.querySelector('.pin-in'),
      track=document.getElementById('track'), slides=[].slice.call(track.children), ctrl=sec.querySelector('.ctrl'),
      dots=document.getElementById('dots'), cnt=document.getElementById('cnt'),
      prev=document.getElementById('prev'), next=document.getElementById('next'),
      mq=matchMedia('(min-width:861px)'), n=slides.length, INTRO=.2, cur=0;
  slides.forEach(function(s,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Ir al proyecto '+(i+1));b.onclick=function(){go(i)};dots.appendChild(b)});
  function geo(){var r=sec.getBoundingClientRect(),pr=pin.getBoundingClientRect();return {r:r,run:r.height-pr.height}}
  // Si la ventana es baja, reduce el contenido para que quepa completo mientras la sección está fija.
  function fit(){
    pinIn.style.zoom='';
    if(!mq.matches)return;
    var pr=pin.getBoundingClientRect(), ir=pinIn.getBoundingClientRect();
    var s=Math.max(.6,Math.min(1,(innerHeight-(ir.top-pr.top)-12)/ir.height));
    if(s<1)pinIn.style.zoom=s;
  }
  // 0..n-1 con pausas cerca de cada proyecto
  function pos(p){
    var q=Math.max(0,Math.min(1,(p-INTRO)/(1-INTRO)));
    if(q>=1||n<2)return n-1;
    var s=q*(n-1), i=Math.floor(s), t=s-i;
    return i+t-Math.sin(2*Math.PI*t)/(2*Math.PI);
  }
  function go(i){
    i=Math.max(0,Math.min(n-1,i));
    if(mq.matches){var g=geo(), p=INTRO+(1-INTRO)*(n>1?i/(n-1):0);scrollTo({top:scrollY+g.r.top+p*g.run,behavior:'smooth'})}
    else slides[i].scrollIntoView({behavior:'smooth',block:'start'});
  }
  function upd(){
    if(!mq.matches){
      track.style.opacity=track.style.transform=ctrl.style.opacity='';
      slides.forEach(function(s){s.style.opacity=''});
      track.scrollLeft=0;return;
    }
    var g=geo(), p=g.run>0?Math.min(1,Math.max(0,-g.r.top/g.run)):1;
    var intro=Math.min(1,p/INTRO), ps=pos(p), step=slides[1]?slides[1].offsetLeft-slides[0].offsetLeft:0;
    track.style.opacity=intro; track.style.transform='translateY('+((1-intro)*48)+'px)'; ctrl.style.opacity=intro;
    track.scrollLeft=ps*step;
    slides.forEach(function(s,i){s.style.opacity=1-.55*Math.min(1,Math.abs(ps-i))});
    cur=Math.round(ps);
    [].forEach.call(dots.children,function(b,i){b.classList.toggle('on',i===cur)});
    cnt.textContent=('0'+(cur+1)).slice(-2)+' / '+('0'+n).slice(-2);
    prev.disabled=cur===0; next.disabled=cur===n-1;
  }
  prev.onclick=function(){go(cur-1)}; next.onclick=function(){go(cur+1)};
  function all(){fit();upd()}
  addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
  addEventListener('resize',all); addEventListener('load',all);
  all();
})();

// Barra de progreso de lectura y enlace activo del menú.
(function(){
  var prog=document.getElementById('prog');
  function sc(){var h=document.documentElement;var m=h.scrollHeight-h.clientHeight;prog.style.transform='scaleX('+(m>0?h.scrollTop/m:0)+')'}
  addEventListener('scroll',sc,{passive:true});sc();
  var links={};[].forEach.call(document.querySelectorAll('nav li a'),function(a){links[a.getAttribute('href').slice(1)]=a});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
      for(var k in links)links[k].classList.remove('on');
      var id=e.target.id; if(id==='formacion')id='habilidades'; if(links[id])links[id].classList.add('on')}})},{rootMargin:'-45% 0px -50% 0px'});
    ['portada','indice','proyectos','habilidades','formacion','contacto'].forEach(function(id){var el=document.getElementById(id);if(el)io.observe(el)});
  }
})();
