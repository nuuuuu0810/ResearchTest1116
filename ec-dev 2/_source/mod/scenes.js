/* ===== リスク → 対応：スマホで場面を再生し、吹き出しに対応カードを置く ===== */
class Scenes{
  constructor({list,pieces,scale=1.12}){this.list=list;this.i=0;
    $('#app').innerHTML=`<div class="sc"><div class="sc-col l" id="scL"></div><div class="sc-ph no-cover" id="scPh"></div><div class="sc-col r" id="scR"></div></div><div class="choices r"><span class="ctag">選択肢</span><div class="pool" id="scPool"></div></div>`;
    this.mock=new Mock($('#scPh'),{scale});
    list.forEach((s,i)=>{const side=s.side||(i%2?'r':'l');s.el=h(`<div class="co wait" data-avoid="1"><div class="slot sq" data-accept="${s.accept.join('|')}" data-hint="${s.hint||'ここをもう一度'}" data-off="1"></div><div class="tx">${s.icon?ic(s.icon,22):''}<span>${s.short}</span></div></div>`);$(side==='l'?'#scL':'#scR').appendChild(s.el)});
    this.P=new Puzzle({root:$('.sc'),pool:$('#scPool'),pieces,tile:true})}
  async start(){await this.show(0)}
  async show(i){const s=this.list[i];this.i=i;this.list.forEach((x,k)=>{x.el.classList.toggle('cur',k===i);if(k===i){x.el.classList.remove('wait');$('.slot',x.el).removeAttribute('data-off')}});
    await this.play()}
  async play(){const s=this.list[this.i];this.P.lock(true);Page.busy(true);Wire.clear();this.mock.clearBadges();this.mock.unhl();
    try{await s.scene(this.mock)}catch(e){console.error(e)}this.mock.hideFinger();
    const t=s.target&&(typeof s.target==='string'?this.mock.el(s.target):s.target(this.mock));if(t){this.mock.hl(t,'mhl-ng');Wire.line($('.tx',s.el),t)}
    this.P.lock(false);Page.busy(false);Eng.guide($('.slot',s.el),s.ask||'どう対応する？')}
  async check(){const s=this.list[this.i],slot=$('.slot',s.el);
    if(!this.P.judge()){return false}
    this.P.lock(true);Wire.clear();this.mock.unhl();this.mock.clearBadges();try{await s.fix(this.mock)}catch(e){console.error(e)}this.mock.hideFinger();
    s.el.classList.remove('cur');s.el.classList.add('done');slot.setAttribute('data-off','1');await sleep(700);
    if(this.i<this.list.length-1){this.P.lock(false);await this.show(this.i+1);return false}return true}
}
