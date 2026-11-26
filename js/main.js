(()=>{
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  $('#yr').textContent=new Date().getFullYear();

  // nav: scrolled state, back-to-top
  const nav=$('#nav'), top=$('#totop');
  const onScroll=()=>{const y=scrollY;nav.classList.toggle('scrolled',y>20);top.classList.toggle('show',y>600)};
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  top.onclick=()=>scrollTo({top:0,behavior:'smooth'});

  // mobile menu
  const burger=$('#burger');
  const setMenu=o=>{nav.classList.toggle('open',o);document.body.classList.toggle('menu-open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu')};
  burger.onclick=()=>setMenu(!nav.classList.contains('open'));
  $$('#links a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!e.target.closest('#nav'))setMenu(false)});
  addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
  addEventListener('resize',()=>{if(innerWidth>760)setMenu(false)});

  // active link per section (sub-sections map to nearest nav item)
  const map={home:'home',about:'about',services:'services',work:'work',case:'work',journey:'about',process:'services',testimonials:'work',contact:'contact'};
  const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const id=map[e.target.id];$$('#links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id))}}),{rootMargin:'-45% 0px -50% 0px'});
  $$('main section').forEach(s=>spy.observe(s));

  // reveal + counters
  const count=el=>{const t=+el.dataset.count,d=+(el.dataset.dec||0),p=el.dataset.prefix||'',s=el.dataset.suffix||'';let st=null;
    const step=ts=>{st??=ts;const k=Math.min((ts-st)/1400,1),v=t*(1-Math.pow(1-k,3));el.textContent=p+v.toFixed(d)+s;if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)};
  const rv=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');e.target.querySelectorAll('[data-count]').forEach(count);rv.unobserve(e.target)}),{threshold:.15});
  $$('.reveal').forEach((el,i)=>{el.style.transitionDelay=(el.classList.contains('card')||el.classList.contains('proj'))?(i%3)*90+'ms':'0ms';rv.observe(el)});
  // case-stats are not inside .reveal of their own → count when visible
  const cs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('[data-count]').forEach(count);cs.unobserve(e.target)}}),{threshold:.4});
  cs.observe($('.case-stats'));

  // dashboard bars in case study
  const bars=$('#bars');let h='';for(let i=0;i<40;i++){const v=20+Math.abs(Math.sin(i*.55)*50)+(i%5)*4;h+=`<rect x="${i*7.5+1}" y="${90-v}" width="5" height="${v}" rx="1" fill="${i%7===3?'#93c5fd':'#2563eb'}" style="animation-delay:${-(i*.13).toFixed(2)}s"/>`}bars.innerHTML=h;

  // testimonials carousel
  const T=[
    {q:'"Naveen delivered our automation project beyond expectations. Professional, responsive and highly skilled."',r:'— Product Manager',c:'COMPANY1',a:'PM'},
    {q:'"Our document workflow went from hours to minutes. Clear communication and on-time delivery throughout."',r:'— Operations Head',c:'COMPANY2',a:'OH'},
    {q:'"A reliable developer who truly understands business needs. The dashboard changed how our team works."',r:'— Founder',c:'COMPANY3',a:'FD'}
  ];
  let idx=0,timer;
  const dots=$('#dots');
  T.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Show testimonial '+(i+1));b.onclick=()=>{go(i);restart()};dots.appendChild(b)});
  const render=()=>{const t=T[idx];$('#qText').textContent=t.q;$('#qRole').textContent=t.r;$('#qCo').textContent=t.c;$('#qAv').textContent=t.a;$$('#dots button').forEach((b,i)=>b.classList.toggle('on',i===idx))};
  const go=i=>{const els=[$('#qText'),$('#qWho')];els.forEach(e=>e.classList.add('fade'));setTimeout(()=>{idx=(i+T.length)%T.length;render();els.forEach(e=>e.classList.remove('fade'))},300)};
  const restart=()=>{clearInterval(timer);timer=setInterval(()=>go(idx+1),6000)};
  $('#prev').onclick=()=>{go(idx-1);restart()};$('#next').onclick=()=>{go(idx+1);restart()};
  render();restart();

  // contact form validation
  const f=$('#form');
  const rules={fName:v=>v.trim().length>1,fEmail:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),fMsg:v=>v.trim().length>4};
  Object.keys(rules).forEach(id=>$('#'+id).addEventListener('input',e=>{if(rules[id](e.target.value))e.target.parentElement.classList.remove('err')}));
  f.onsubmit=e=>{e.preventDefault();let ok=true,first=null;
    for(const id in rules){const el=$('#'+id),good=rules[id](el.value);el.parentElement.classList.toggle('err',!good);if(!good){ok=false;first??=el}}
    if(!ok){first.focus();return}
    const body=encodeURIComponent(`Name: ${$('#fName').value}\nEmail: ${$('#fEmail').value}\n\n${$('#fMsg').value}`);
    $('#sent').classList.add('show');f.reset();
    location.href='mailto:naveenk.munusamy@gmail.com?subject='+encodeURIComponent('New project enquiry')+'&body='+body;
  };

  /* =====================================================
     MOTION EXTRAS
     ===================================================== */
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer: fine)').matches;
  const body=document.body;

  // loader → body.ready (starts hero headline + ribbon animations)
  const loader=$('#loader'),t0=performance.now();
  const ready=()=>{if(body.classList.contains('ready'))return;
    setTimeout(()=>{body.classList.add('ready');loader.classList.add('done')},Math.max(0,700-(performance.now()-t0)))};
  if(reduce){body.classList.add('ready');loader.classList.add('done')}
  else{addEventListener('load',ready);setTimeout(ready,2500)}

  // split headline into words
  $$('.split').forEach(h=>{let i=0;
    const mk=()=>{const s=document.createElement('span');s.className='w';s.style.setProperty('--d',(i++*90)+'ms');return s};
    [...h.childNodes].forEach(n=>{
      if(n.nodeType===3){const fr=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){fr.append(' ');return}const s=mk();s.textContent=p;fr.append(s)});
        n.replaceWith(fr)}
      else if(n.nodeName!=='BR'){const s=mk();n.replaceWith(s);s.append(n)}
    })});

  // typewriter roles
  const typed=$('#typed');
  if(typed&&!reduce){
    const R=['Software Developer','Python Developer','Automation Specialist','Flask API Builder','Secure Systems Developer'];
    let wi=0,ci=R[0].length,del=true;
    const tick=()=>{
      if(del){ci--;typed.textContent=R[wi].slice(0,ci);if(ci===0){del=false;wi=(wi+1)%R.length;return setTimeout(tick,300)}return setTimeout(tick,35)}
      ci++;typed.textContent=R[wi].slice(0,ci);
      if(ci===R[wi].length){del=true;return setTimeout(tick,1900)}
      setTimeout(tick,80)};
    setTimeout(tick,3200);
  }

  // floating code symbols
  const SYM=['{ }','</>','def','()','=>','#','[ ]','import','λ','::','&&','py','%','fn'];
  $$('[data-floaters]').forEach(box=>{if(reduce)return;const n=Math.ceil(+box.dataset.floaters/(innerWidth<760?2.5:1));
    for(let i=0;i<n;i++){const s=document.createElement('span');s.textContent=SYM[i%SYM.length];
      const dur=14+Math.random()*16;
      s.style.cssText=`left:${Math.random()*100}%;font-size:${11+Math.random()*12}px;animation-duration:${dur}s;animation-delay:${-Math.random()*dur}s`;
      box.appendChild(s)}});

  // reveal directions for two-column layouts
  $$('.grid-2,.contact-grid').forEach(g=>{const k=[...g.children].filter(c=>c.classList.contains('reveal'));k[0]?.classList.add('l');k[1]?.classList.add('r')});
  // staggered bar growth in project thumbnails
  $$('.proj .chart i').forEach((b,i)=>b.style.transitionDelay=(350+(i%8)*70)+'ms');

  // pause CSS animations in sections that are not on screen
  const vis=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('off',!e.isIntersecting)),{rootMargin:'100px 0px'});
  $$('main section').forEach(s=>{s.classList.add('off');vis.observe(s)});

  // scroll progress
  const prog=$('#progress');
  const onProg=()=>{const m=document.documentElement.scrollHeight-innerHeight;prog.style.transform=`scaleX(${m>0?scrollY/m:0})`};
  addEventListener('scroll',onProg,{passive:true});addEventListener('resize',onProg);onProg();

  // particle network background
  const cv=$('#bg'),cx=cv.getContext('2d'),dpr=1;
  const lowEnd=(navigator.hardwareConcurrency||8)<=4||innerWidth<760;
  let BW,BH,P=[],mouse={x:-1e4,y:-1e4},running=false;
  const size=()=>{BW=innerWidth;BH=innerHeight;cv.width=BW*dpr;cv.height=BH*dpr;cv.style.width=BW+'px';cv.style.height=BH+'px';cx.setTransform(dpr,0,0,dpr,0,0);
    const n=Math.min(lowEnd?35:65,Math.round(BW*BH/22000));
    P=Array.from({length:n},()=>({x:Math.random()*BW,y:Math.random()*BH,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.6+.6}))};
  const frame=()=>{
    cx.clearRect(0,0,BW,BH);
    const off=scrollY*.12,L=P.length;
    for(const p of P){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x+=BW;if(p.x>BW)p.x-=BW;if(p.y<0)p.y+=BH;if(p.y>BH)p.y-=BH;
      p.py=((p.y-off)%BH+BH)%BH;
      const dx=p.x-mouse.x,dy=p.py-mouse.y,q=dx*dx+dy*dy;
      if(q<12100&&q>0){const d=Math.sqrt(q);p.x+=dx/d*1.4;p.y+=dy/d*1.4}
    }
    // lines grouped into 3 opacity buckets -> 3 stroke calls per frame instead of hundreds
    cx.lineWidth=1;const B=[new Path2D(),new Path2D(),new Path2D()],M=new Path2D();
    for(let i=0;i<L;i++){const a=P[i];
      for(let j=i+1;j<L;j++){const b=P[j],dx=a.x-b.x,dy=a.py-b.py,d2=dx*dx+dy*dy;
        if(d2<15625){const k=d2<4000?0:d2<9000?1:2;B[k].moveTo(a.x,a.py);B[k].lineTo(b.x,b.py)}}
      const mx2=a.x-mouse.x,my2=a.py-mouse.y;
      if(mx2*mx2+my2*my2<32400){M.moveTo(a.x,a.py);M.lineTo(mouse.x,mouse.y)}
    }
    cx.strokeStyle='rgba(166,226,46,.2)';cx.stroke(B[0]);
    cx.strokeStyle='rgba(166,226,46,.11)';cx.stroke(B[1]);
    cx.strokeStyle='rgba(166,226,46,.05)';cx.stroke(B[2]);
    cx.strokeStyle='rgba(196,242,74,.22)';cx.stroke(M);
    const D=new Path2D();for(const p of P){D.moveTo(p.x+p.r,p.py);D.arc(p.x,p.py,p.r,0,6.283)}
    cx.fillStyle='rgba(196,242,74,.65)';cx.fill(D);
    if(running)requestAnimationFrame(frame)};
  const start=()=>{if(running||reduce)return;running=true;requestAnimationFrame(frame)};
  size();addEventListener('resize',size);
  if(reduce)frame();else start();
  document.addEventListener('visibilitychange',()=>{if(document.hidden)running=false;else start()});

  // cursor glow + ring, hero parallax
  if(fine&&!reduce){
    const spot=$('#spot'),ring=$('#ring'),rib=$('.ribbon'),star=$('.star-big');
    let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;mouse.x=mx;mouse.y=my;body.classList.add('has-pointer');
      const px=(mx/innerWidth-.5),py=(my/innerHeight-.5);
      rib.style.translate=`${px*-30}px ${py*-24}px`;star.style.translate=`${px*-22}px ${py*-18}px`},{passive:true});
    document.documentElement.addEventListener('mouseleave',()=>{body.classList.remove('has-pointer');mouse.x=mouse.y=-1e4});
    let fRun=false;const follow=()=>{rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.transform=`translate(${rx}px,${ry}px)`;spot.style.transform=`translate(${mx}px,${my}px)`;
      if(Math.abs(mx-rx)+Math.abs(my-ry)>.5)requestAnimationFrame(follow);else fRun=false};
    addEventListener('pointermove',()=>{if(!fRun){fRun=true;requestAnimationFrame(follow)}},{passive:true});
    document.addEventListener('pointerover',e=>ring.classList.toggle('big',!!e.target.closest('a,button,.card,.proj,input,textarea,.steps li')));

    // 3D tilt + spotlight on cards
    $$('.card,.proj').forEach(el=>{
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        el.style.setProperty('--mx',x*100+'%');el.style.setProperty('--my',y*100+'%');el.style.transitionDelay='0ms';
        el.style.transform=`perspective(800px) rotateX(${(.5-y)*9}deg) rotateY(${(x-.5)*11}deg) translateY(-6px)`});
      el.addEventListener('pointerleave',()=>{el.style.transform=''})});

    // magnetic buttons
    $$('.btn-lime,.circle-btn,.totop').forEach(b=>{if(b.closest('form'))return;
      b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();
        b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`});
      b.addEventListener('pointerleave',()=>{b.style.transform=''})});
  }

  // click ripple on buttons
  if(!reduce)document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.circle-btn');if(!b)return;
    const r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,s=document.createElement('span');
    s.className='ripple';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;
    b.appendChild(s);setTimeout(()=>s.remove(),700)});

  // swipe left/right on testimonials (touch)
  (()=>{const q=$('.carousel');let x0=null,y0=0;
    q.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
    q.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;
      if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5){go(idx+(dx<0?1:-1));restart()}},{passive:true})})();
})();
