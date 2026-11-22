
(function(){
  var d=document,w=window;
  var REGISTER_URL="#registration"; // TODO: paste the Google Form link
  var PAY_URL="#registration";      // TODO: paste the payment portal link
  d.body.classList.remove('nojs');
  var reduce=w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* wire CTAs */
  [].forEach.call(d.querySelectorAll('[data-register]'),function(a){ if(REGISTER_URL.charAt(0)!=='#'){a.href=REGISTER_URL;a.target='_blank';a.rel='noopener'} });
  [].forEach.call(d.querySelectorAll('[data-pay]'),function(a){ if(PAY_URL.charAt(0)!=='#'){a.href=PAY_URL;a.target='_blank';a.rel='noopener'} });
  [].forEach.call(d.querySelectorAll('a[href="#"]'),function(a){a.addEventListener('click',function(e){e.preventDefault()})});

  /* load */
  requestAnimationFrame(function(){requestAnimationFrame(function(){d.documentElement.classList.add('ready');d.body.classList.add('ready')})});

  /* reveal */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  [].forEach.call(d.querySelectorAll('[data-reveal]'),function(el){io.observe(el)});

  /* menu */
  var nav=d.getElementById('nav'),menu=d.getElementById('menu');
  menu.addEventListener('click',function(){var o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o)});
  [].forEach.call(nav.querySelectorAll('a'),function(a){a.addEventListener('click',function(){nav.classList.remove('open');menu.setAttribute('aria-expanded',false)})});

  /* statement word reveal */
  var st=d.getElementById('statement');if(st){
  (function split(node){
    [].slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var f=d.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(t){
          if(!t)return;
          if(/^\s+$/.test(t)){f.appendChild(d.createTextNode(' '))}
          else{var s=d.createElement('span');s.className='w';s.textContent=t;f.appendChild(s)}
        });
        node.replaceChild(f,n);
      }else if(n.nodeType===1){split(n)}
    });
  })(st);
  var words=[].slice.call(st.querySelectorAll('.w'));}else{var words=[]}

  /* count up */
  var counted=false;
  function countUp(){
    if(counted)return;counted=true;
    [].forEach.call(d.querySelectorAll('[data-count]'),function(el){
      var to=+el.getAttribute('data-count'),t0=null,dur=1400;
      function f(t){if(!t0)t0=t;var p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,4);el.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(f)}
      if(!reduce){el.textContent='0';requestAnimationFrame(f)}
    });
  }
  var facts=d.querySelector('.age');
  if(facts)new IntersectionObserver(function(es,o){if(es[0].isIntersecting){countUp();o.disconnect()}},{threshold:.3}).observe(facts);

  /* scroll-linked */
  var hd=d.getElementById('hd'),prog=d.getElementById('progress'),topb=d.getElementById('top');
  var tl=d.getElementById('tl'),steps=tl?[].slice.call(tl.querySelectorAll('.step')):[];
  
  var ticking=false;
  function frame(){
    ticking=false;
    var y=w.scrollY,H=d.documentElement.scrollHeight-w.innerHeight,vh=w.innerHeight;
    prog.style.transform='scaleX('+(H>0?y/H:0)+')';
    hd.classList.toggle('stuck',y>10);
    topb.classList.toggle('show',y>900);
    /* statement words */
    if(st){var r=st.getBoundingClientRect();
    var p=(vh*0.85-r.top)/(vh*0.55+r.height*0.4);p=Math.max(0,Math.min(1,p));
    var lit=Math.round(p*words.length);
    for(var i=0;i<words.length;i++){words[i].classList.toggle('lit',reduce||i<lit)}}
    /* timeline */
    if(tl){var tr=tl.getBoundingClientRect(),horizontal=w.innerWidth>1080;
    var tp=horizontal?(vh*0.8-tr.top)/(vh*0.35):(vh*0.6-tr.top)/tr.height;
    tp=Math.max(0,Math.min(1,tp));
    if(horizontal){tp=Math.max(0,Math.min(1,(vh*0.85-tr.top)/(vh*0.45)))}
    tl.style.setProperty('--p',reduce?1:tp);
    steps.forEach(function(s,i){
      var th=(i+0.2)/steps.length;
      s.classList.toggle('on',reduce||tp>=th-0.0001);
    });}
  }
  w.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(frame)}},{passive:true});
  w.addEventListener('resize',frame);frame();
  topb.addEventListener('click',function(){w.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});

  /* contour field */
  var cv=d.getElementById('contours');if(cv){var cx=cv.getContext('2d'),dpr=Math.min(w.devicePixelRatio||1,2),S=0,vis=true;
  var INK='#13161C',ACC='#FF6B6B',RC={5:'#00C2CB',9:'#FF6B6B',12:'#F4B400'};
  function size(){var b=cv.getBoundingClientRect();S=b.width;cv.width=S*dpr;cv.height=S*dpr}
  size();w.addEventListener('resize',size);
  new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(cv);
  function h(n){var s=Math.sin(n*127.1)*43758.5453;return s-Math.floor(s)}
  function vn(x,y){var xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;
    function g(a,b){return h(a*57+b*131)}
    var u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
    var a=g(xi,yi),b=g(xi+1,yi),c=g(xi,yi+1),dd=g(xi+1,yi+1);
    return a+(b-a)*u+(c-a)*v+(a-b-c+dd)*u*v}
  var mx=0,my=0,tx=0,ty=0;
  cv.parentNode.addEventListener('mousemove',function(e){var b=cv.getBoundingClientRect();tx=(e.clientX-b.left)/b.width-.5;ty=(e.clientY-b.top)/b.height-.5});
  cv.parentNode.addEventListener('mouseleave',function(){tx=0;ty=0});
  var RINGS=15,T0=performance.now();
  function draw(now){
    requestAnimationFrame(draw);
    if(!vis)return;
    var t=reduce?0:(now-T0)/1000;
    mx+=(tx-mx)*.05;my+=(ty-my)*.05;
    cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,S,S);
    var c=S/2,max=S*.46;
    for(var k=1;k<=RINGS;k++){
      var base=max*(k/RINGS),px=mx*(k*2.2),py=my*(k*2.2);
      cx.beginPath();
      for(var a=0;a<=96;a++){
        var th=a/96*Math.PI*2,cs=Math.cos(th),sn=Math.sin(th);
        var n=vn(cs*1.3+3+k*.07+t*.08,sn*1.3+3+t*.06)-.5;
        var wob=1+n*(.12+k*.028);
        var r=base*wob;
        var x=c+cs*r+px,y=c+sn*r+py;
        a?cx.lineTo(x,y):cx.moveTo(x,y);
      }
      cx.closePath();
      var hot=!!RC[k];
      cx.lineWidth=hot?3:1.2;
      cx.strokeStyle=hot?RC[k]:INK;
      cx.globalAlpha=hot?1:(.3+.4*(k/RINGS));
      cx.stroke();
    }
    cx.globalAlpha=1;
    /* centre mark */
    cx.fillStyle=INK;cx.beginPath();cx.arc(c+mx*20,c+my*20,5,0,7);cx.fill();
  }
  requestAnimationFrame(draw);
  }
})();
