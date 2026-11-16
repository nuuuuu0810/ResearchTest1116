/* ===== 配置図：各タスクへ進む ===== */
const Hub={
  init({subs,finale,extraCheck}){this.subs=subs;this.finale=finale;this.extraCheck=extraCheck;
    const t=$('#tasks');subs.forEach((s,i)=>{s.el=h(`<div class="task" data-i="${i}" style="order:${s.ord??i}"><div class="tt"><span class="n">${i+1}</span>${s.label}</div><span class="go">開く ›</span></div>`);t.appendChild(s.el)});
    document.addEventListener('click',e=>{const m=e.target.closest('.task');if(!m)return;const i=+m.dataset.i;if(!this.state()[i].av){Eng.point(m,'前のタスクを先に',{type:'info'});return}this.open(this.subs[i])});
    addEventListener('storage',()=>this.render());addEventListener('message',e=>{if(e.data&&e.data.type==='state')this.render()});
    requestAnimationFrame(()=>{this.links();this.render()})},
  links(){const T=relRect($('#tasks')),src=s=>$(s.at).closest('.node')||$(s.at);const L=[...this.subs].sort((a,b)=>relRect(src(a)).cx-relRect(src(b)).cx||this.subs.indexOf(a)-this.subs.indexOf(b));
    const w=Math.min(220,(T.w-24*(L.length-1))/L.length),tot=L.length*w+24*(L.length-1);let x=(T.w-tot)/2;
    L.forEach(s=>{s.el.style.position='absolute';s.el.style.width=w+'px';s.el.style.left=x+'px';x+=w+24});
    this.subs.forEach(s=>{if(s.at)Wire.line(src(s),s.el,{vert:true,cls:'dash'})})},
  state(){const p=Progress.get(),L=Progress.locked();let pd=true;return this.subs.map(s=>{const d=!!p[s.id];const st={d,av:!L||d||pd,cur:!d&&pd};pd=pd&&d;return st})},
  render(){const st=this.state();this.subs.forEach((s,i)=>{const t=st[i];s.el.className=`task ${t.d?'done':''} ${t.cur?'cur':''} ${t.av?'':'lock'}`;$('.n',s.el).innerHTML=t.d?ic('check',26):i+1;$('.go',s.el).textContent=t.d?'もう一度 ›':t.av?'開く ›':''});
    const nx=st.findIndex(t=>!t.d);if(Page.state!=='next'){if(nx>=0)Eng.guide(this.subs[nx].el,'次はここ',{below:true});else Eng.clear()}},
  open(s){if(window.parent!==window)postParent({type:'open',target:s.id});else location.href=s.file},
  async check(){const st=this.state(),nx=st.findIndex(t=>!t.d);
    if(this.extraCheck&&!(await this.extraCheck()))return false;
    if(nx>=0){Eng.point(this.subs[nx].el,'まだ残っているよ');return false}Eng.clear();await this.finale();return true}};
