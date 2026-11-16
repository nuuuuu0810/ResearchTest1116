/* ===== 基本の部品 ===== */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const h=html=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild};
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const yen=n=>(Number(n)<0?'−￥':'￥')+Math.abs(Number(n)).toLocaleString();

/* 進捗（目次と共有） */
const Progress={KEY:'ec-dev-progress',LOCK:'ec-dev-lock',
  get(){try{return JSON.parse(localStorage.getItem(this.KEY))||{}}catch(e){return{}}},
  set(id){try{const p=this.get();p[id]=true;localStorage.setItem(this.KEY,JSON.stringify(p))}catch(e){}},
  locked(){try{return localStorage.getItem(this.LOCK)==='1'}catch(e){return false}}};
function postParent(m){try{if(window.parent!==window)window.parent.postMessage(m,'*')}catch(e){}}

/* #pg 内の座標 */
function relRect(el){const pr=$('#pg').getBoundingClientRect(),k=pr.width/1440,r=el.getBoundingClientRect();
  return{x:(r.left-pr.left)/k,y:(r.top-pr.top)/k,w:r.width/k,h:r.height/k,cx:(r.left+r.width/2-pr.left)/k,cy:(r.top+r.height/2-pr.top)/k,r:(r.right-pr.left)/k,b:(r.bottom-pr.top)/k}}

/* ページ：タイトルと「答え合わせ」ボタン */
const Page={cfg:null,state:'check',
  init(cfg){this.cfg=cfg;$('#pg').insertBefore(h(`<header id="hdr"><h1>${cfg.title}</h1></header>`),$('#app'));
    const host=$('.choices')||$('#pg');const b=h(`<button class="cbtn" id="checkBtn">${cfg.checkLabel||'答え合わせをする'}</button>`);
    if(host.id==='pg'){b.style.cssText='position:absolute;right:28px;bottom:22px;z-index:30'}host.appendChild(b);
    b.onclick=()=>this._click();postParent({type:'page-ready',id:cfg.id});
    if(cfg.guide)setTimeout(()=>{const g=cfg.guide();if(g)Eng.guide(g[0],g[1])},600)},
  setLabel(t){$('#checkBtn').textContent=t},busy(b){$('#checkBtn').disabled=b},
  async _click(){if(this.state==='next'){postParent({type:'next',id:this.cfg.id});return}
    if(this._run)return;this._run=true;this.busy(true);Eng.clear();let r=false;
    try{r=await this.cfg.onCheck()}catch(e){console.error(e)}this._run=false;this.busy(false);if(r===true)this.complete()},
  complete(){if(this.state==='next')return;this.state='next';Progress.set(this.cfg.id);postParent({type:'exercise-complete',id:this.cfg.id});
    const b=$('#checkBtn');b.classList.add('next');this.setLabel(this.cfg.nextLabel||'次へ進む');if(this.cfg.done)toast(this.cfg.done)}};

/* エンジニアくん：該当箇所のそばに、一言で */
const Eng={
  clear(){$$('.engpop').forEach(e=>e.remove());$$('.err-glow').forEach(e=>e.classList.remove('err-glow'))},
  point(el,text,{type='ng',keep=false,glow=true,avoid,below=false}={}){if(!keep)this.clear();if(!el)return;if(glow&&type==='ng')el.classList.add('err-glow');
    const p=h(`<div class="engpop ${type}"><div class="av">${ic('engineer',30)}</div><div class="bb">${text}</div></div>`);$('#pg').appendChild(p);
    const av=[el,avoid||el.closest('[data-avoid]')].filter(Boolean).map(relRect);
    const R=av.reduce((a,b)=>({x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),r:Math.max(a.r,b.r),b:Math.max(a.b,b.b)}));R.cx=(R.x+R.r)/2;R.cy=relRect(el).cy;
    const pw=p.offsetWidth,ph=p.offsetHeight;let cand=[[R.r+10,R.cy-ph/2,0],[R.x-pw-10,R.cy-ph/2,1],[R.cx-pw/2,R.b+8,0],[R.cx-pw/2,R.y-ph-8,0]];if(below)cand=[cand[2],...cand];
    const blk=$$('.no-cover').map(relRect),hit=(x,y)=>blk.some(b=>x<b.r&&x+pw>b.x&&y<b.b&&y+ph>b.y);
    const best=cand.find(([x,y])=>x>=6&&x+pw<=1434&&y>=60&&y+ph<=820&&!hit(x,y))||cand.find(([x,y])=>x>=6&&x+pw<=1434&&y>=60&&y+ph<=820)||cand[2];
    p.style.left=Math.max(6,Math.min(1434-pw,best[0]))+'px';p.style.top=Math.max(60,Math.min(820-ph,best[1]))+'px';if(best[2])p.classList.add('flip');return p},
  guide(el,text,o={}){return this.point(el,text,Object.assign({type:'info'},o))},
  errors(list){this.clear();list.forEach(e=>e.el&&e.el.classList.add('err-glow'));if(list[0])this.point(list[0].el,list[0].msg,{keep:true})}};

document.addEventListener('pointerdown',e=>{if(!e.target.closest('.engpop'))$$('.engpop.info').forEach(x=>x.remove())},true);
function toast(t){const e=h(`<div class="toast">${t}</div>`);$('#pg').appendChild(e);setTimeout(()=>e.remove(),1800)}

/* 線とデータの流れ */
const Wire={
  svg(){let s=$('#pg>.wires');if(!s){s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('class','wires');$('#pg').appendChild(s)}return s},
  line(a,b,{cls='',side,curve=true,ax,bx,vert=false}={}){const A=relRect(a),B=relRect(b);const lr=A.cx<B.cx;
    if(vert){const p=document.createElementNS('http://www.w3.org/2000/svg','path');const x1=A.cx,y1=A.b,x2=B.cx,y2=B.y,my=(y1+y2)/2;p.setAttribute('d',`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`);if(cls)p.setAttribute('class',cls);this.svg().appendChild(p);return p}
    const x1=ax??(lr?A.r:A.x),y1=A.cy,x2=bx??(lr?B.x:B.r),y2=B.cy;const mx=(x1+x2)/2;
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',curve?`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`:`M${x1},${y1} L${x2},${y2}`);if(cls)p.setAttribute('class',cls);this.svg().appendChild(p);return p},
  clear(){const s=$('#pg>.wires');if(s)s.innerHTML=''},
  async send(a,b,label='',{dur=800,cls=''}={}){const A=relRect(a),B=relRect(b);const d=h(`<div class="dot ${label?'':'c'} ${cls}">${label}</div>`);$('#pg').appendChild(d);
    d.style.left=A.cx+'px';d.style.top=A.cy+'px';d.style.transition=`left ${dur}ms ease-in-out,top ${dur}ms ease-in-out`;await sleep(30);d.style.left=B.cx+'px';d.style.top=B.cy+'px';await sleep(dur+30);d.remove()}};

/* 画面サイズに合わせる */
(function(){const fit=()=>{const pg=$('#pg');if(!pg)return;const s=Math.min(innerWidth/1440,innerHeight/825);pg.style.transformOrigin='0 0';pg.style.transform=Math.abs(s-1)<.002?'':`scale(${s})`};addEventListener('resize',fit);fit()})();
