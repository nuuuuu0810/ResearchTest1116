/* ---------- パズル（ドラッグ＆ドロップ / クリック選択） ---------- */
class Puzzle{
  constructor({pieces,pool,order,root,onChange,pieceCls='',shuffle:sh=true,swap=false,tile=false}){
    this.tile=tile;
    this.swap=swap;this.selSlot=null;this.defs=pieces;this.pool=pool;this.root=root||$('#app');this.onChange=onChange||(()=>{});this.pieceCls=pieceCls;
    this.order=order||Object.keys(pieces);if(sh)this.order=shuffle(this.order);
    this.map=new Map();this.sel=null;this.locked=false;
    $$('.slot',this.root).forEach(s=>{if(!s.dataset.ph0)s.dataset.ph0=s.innerHTML});
    this.renderPool();this._bind();
  }
  slots(){return $$('.slot',this.root).filter(s=>!s.closest('[data-off]'))}
  mk(id,extra=''){const d=this.defs[id];const t=d.tile??this.tile;const icon=d.icon?(ICON[d.icon]?ic(d.icon,t?34:18):`<span class="ic">${d.icon}</span>`):'';return h(`<div class="piece ${t?'tile':''} ${this.pieceCls} ${d.cls||''} ${extra}" data-pid="${id}">${icon}<span class="lb">${d.label}</span></div>`)}
  renderPool(){if(!this.pool)return;this.pool.innerHTML='';const used=new Set([].concat(...this.map.values()));
    this.order.forEach(id=>{const p=this.mk(id);if(used.has(id)&&!this.defs[id].inf)p.classList.add('used');if(this.sel===id)p.classList.add('sel');this.pool.appendChild(p)})}
  renderSlot(s){const ids=this.map.get(s)||[];s.classList.remove('ok');
    if(!ids.length){s.innerHTML=s.dataset.ph0||'';s.classList.remove('filled');return}
    s.innerHTML='';ids.forEach(id=>{const p=this.mk(id);p.dataset.from='1';s.appendChild(p)});s.classList.add('filled')}
  get(s){return (this.map.get(s)||[])[0]}
  getAll(s){return this.map.get(s)||[]}
  put(s,id,{silent}={}){
    if(!this.defs[id].inf)for(const [k,v] of this.map){if(v.includes(id)){this.map.set(k,v.filter(x=>x!==id));this.renderSlot(k)}}
    const bin=s.classList.contains('bin');const cur=this.map.get(s)||[];
    this.map.set(s,bin?[...cur.filter(x=>x!==id),id]:[id]);this.renderSlot(s);
    s.classList.remove('err-glow');this.sel=null;this.renderPool();if(!silent)this.onChange(s,id);
  }
  swapSlots(a,b){const x=this.map.get(a)||[],y=this.map.get(b)||[];this.map.set(a,y);this.map.set(b,x);this.renderSlot(a);this.renderSlot(b);$$('.slot',this.root).forEach(z=>z.classList.remove('selectable','err-glow'));this.onChange(b,x[0])}
  remove(s,id){const v=(this.map.get(s)||[]).filter(x=>x!==id);this.map.set(s,v);this.renderSlot(s);this.renderPool();this.onChange(s,null)}
  reset(){this.map.clear();this.slots().forEach(s=>this.renderSlot(s));this.renderPool()}
  check(){const empty=[],wrong=[];
    this.slots().forEach(s=>{const acc=(s.dataset.accept||'').split('|');const ids=this.map.get(s)||[];
      if(s.classList.contains('bin')){if(ids.some(i=>!acc.includes(i)))wrong.push(s);else if(acc.some(a=>!ids.includes(a)))empty.push(s)}
      else if(!ids.length)empty.push(s);else if(!acc.includes(ids[0]))wrong.push(s)});
    return {ok:!empty.length&&!wrong.length,empty,wrong}}
  /* 標準の答え合わせ：エンジニアくんが指摘 */
  judge(){const r=this.check();
    if(r.ok){this.slots().forEach(s=>s.classList.add('ok'));return true}
    const list=[...r.wrong.map(s=>({el:s,msg:s.dataset.hint||'ここをもう一度'})),...r.empty.map(s=>({el:s,msg:s.classList.contains('bin')?'まだ足りないよ':'まだ空いているよ'}))];
    Eng.errors(list);return false}
  lock(b=true){this.locked=b}
  _bind(){
    let st=null;
    const down=e=>{if(this.locked)return;const p=e.target.closest('.piece');if(!p||!p.dataset.pid||!(this.root.contains(p)||(this.pool&&this.pool.contains(p))))return;
      if(p.classList.contains('used'))return;e.preventDefault();
      st={p,id:p.dataset.pid,from:p.dataset.from?p.closest('.slot'):null,x:e.clientX,y:e.clientY,g:null}};
    const move=e=>{if(!st)return;const dx=e.clientX-st.x,dy=e.clientY-st.y;
      if(!st.g&&Math.hypot(dx,dy)>5){const r=st.p.getBoundingClientRect();st.g=st.p.cloneNode(true);st.g.classList.add('ghost');st.g.classList.remove('sel');st.g.style.width=r.width+'px';st.ox=e.clientX-r.left;st.oy=e.clientY-r.top;document.body.appendChild(st.g);st.p.style.opacity=.35}
      if(st.g){st.g.style.left=(e.clientX-st.ox)+'px';st.g.style.top=(e.clientY-st.oy)+'px';$$('.slot.hov').forEach(s=>s.classList.remove('hov'));const t=document.elementFromPoint(e.clientX,e.clientY);const s=t&&t.closest('.slot');if(s&&this.root.contains(s))s.classList.add('hov')}};
    const up=e=>{if(!st)return;const s0=st;st=null;$$('.slot.hov').forEach(s=>s.classList.remove('hov'));
      if(s0.g){s0.g.remove();s0.p.style.opacity='';const t=document.elementFromPoint(e.clientX,e.clientY);const s=t&&t.closest('.slot');
        if(s&&this.swap&&s0.from&&s!==s0.from){this.swapSlots(s0.from,s);return}
        if(s&&this.root.contains(s)&&!s.closest('[data-off]')){if(s0.from&&s0.from!==s&&this.defs[s0.id].inf){this.map.set(s0.from,(this.map.get(s0.from)||[]).filter(x=>x!==s0.id));this.renderSlot(s0.from)}this.put(s,s0.id)}
        else if(s0.from){this.remove(s0.from,s0.id)}
        return}
      /* クリック */
      if(s0.from&&this.swap){if(this.selSlot&&this.selSlot!==s0.from){const a=this.selSlot;this.selSlot=null;this.swapSlots(a,s0.from)}else{this.selSlot=this.selSlot===s0.from?null:s0.from;$$('.slot',this.root).forEach(x=>x.classList.toggle('selectable',x===this.selSlot))}return}
      if(s0.from){if(this.sel&&this.sel!==s0.id){this.put(s0.from,this.sel)}else this.remove(s0.from,s0.id);return}
      this.sel=this.sel===s0.id?null:s0.id;this.renderPool();this._mark()};
    document.addEventListener('pointerdown',down);document.addEventListener('pointermove',move);document.addEventListener('pointerup',up);
    this.root.addEventListener('click',e=>{if(this.locked||!this.sel)return;if(e.target.closest('.piece'))return;const s=e.target.closest('.slot');if(s&&!s.closest('[data-off]')){this.put(s,this.sel);this._mark()}});
  }
  _mark(){$$('.slot',this.root).forEach(s=>s.classList.toggle('selectable',!!this.sel&&!s.classList.contains('filled')))}
}

