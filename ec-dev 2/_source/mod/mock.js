/* ===== 商品データ ===== */
const PRODUCTS=[
 {id:'apple',name:'アップル',kana:'ア',ico:'apple',price:100,stock:12,rate:4,rc:'1,284'},
 {id:'grape',name:'グレープ',kana:'ク',ico:'grape',price:500,stock:8,rate:5,rc:'862'},
 {id:'pine',name:'パイナップル',kana:'ハ',ico:'pine',price:1000,stock:3,rate:4,rc:'415'},
 {id:'orange',name:'オレンジ',kana:'オ',ico:'orange',price:300,stock:20,rate:4,rc:'2,031'},
 {id:'straw',name:'ストロベリー',kana:'ス',ico:'straw',price:400,stock:5,rate:5,rc:'977'}];
const PD=Object.fromEntries(PRODUCTS.map(p=>[p.id,p]));
const pimg=(id,s=44,S={})=>S.textOnly?`<span style="font-size:9px;color:#999">（${PD[id].name}の画像）</span>`:ic(PD[id].ico,s);
const stars=(n,c)=>`<span class="stars">${'★'.repeat(n)}${'☆'.repeat(5-n)}<em>${c}</em></span>`;
const price=p=>`<span class="pr"><sup>￥</sup>${p.toLocaleString()}</span>`;
const SCR_NAME={home:'ホーム',search:'Web検索',top:'トップ',results:'検索結果',detail:'商品詳細',cart:'カート',info:'注文の確定',done:'注文完了',custom:'',error:'エラー'};
function shopTop(S){const n=(S.cart||[]).reduce((a,x)=>a+x.qty,0);
  return `<div class="sh-top"><div class="sh-row"><span class="sh-logo">shopping<small>.jp</small></span><span class="sp"></span><span class="sh-cart" data-k="cartbtn">${ic('cart',22,'#fff')}<b>${n}</b>カート</span></div>
  <div class="sbox" data-k="q"><span>${S.query||''}</span><i class="go" data-k="go">${ic('magnify',16)}</i></div></div><div class="sh-addr">${ic('house',11,'#fff')} お届け先：山田さん 東京都港区</div>`}
const SCREENS={
 home:S=>`<div class="s-home"><div class="apps">${['tools','addr','images','route','receiver','mail','gear','clock'].map(k=>`<div class="app"><i>${ic(k,24)}</i></div>`).join('')}</div>
   <div class="dock"><div class="app" data-k="browser"><i>${ic('world',26)}</i></div><div class="app"><i>${ic('receiver',22)}</i></div><div class="app"><i>${ic('mail',24)}</i></div><div class="app"><i>${ic('camera',22)}</i></div></div></div>`,
 search:S=>`<div class="brw"><div class="urlbar" data-k="q">${ic('magnify',14)}<span>${S.query||''}</span></div>${S.query?`<div class="sres">
   ${S.fake?`<div class="it" data-k="r-fake"><div class="u"><span class="ad">スポンサー</span> shopping-jp.xyz</div><div class="t">【公式】Shopping 全品90%OFF</div><div class="d">今だけ。カード情報を入力するだけ。</div></div>`:''}
   <div class="it" data-k="r-shop"><div class="u"><i>${ic('bag',10)}</i>Shopping.jp</div><div class="t">Shopping</div><div class="d">Shopping.jpの公式サイト。食品や日用品から家具や家電までたくさん…</div></div>
   <div class="it"><div class="u"><i>${ic('bag',10)}</i>AIUEOShop.jp</div><div class="t">あいうえおショップ</div><div class="d">食品や日用品から家具や家電まで…</div></div>
   <div class="it"><div class="u"><i>${ic('bag',10)}</i>ABCDE.jp</div><div class="t">ABCDE Shopping</div><div class="d">毎日の暮らしに役立つ商品をお届け…</div></div>
   <div class="it"><div class="u"><i>${ic('bag',10)}</i>shop12345.jp</div><div class="t">ショップ 12345</div><div class="d">まとめ買いでお得…</div></div></div>`:''}</div>`,
 top:S=>`<div class="shop">${shopTop(S)}<div class="banner" data-k="banner"><div><b>秋のフルーツフェア</b><small>対象商品 最大20%OFF</small></div>${S.textOnly?'':ic('grape',56)}</div>
   <div class="cats"><span class="cat" data-k="cat-fruit">くだもの</span><span class="cat">やさい</span><span class="cat">日用品</span><span class="cat">家電</span></div>
   <div class="sec-t">あなたへのおすすめ</div><div class="recs">${['apple','grape','pine'].map(i=>`<div class="rec"><div class="im">${pimg(i,40,S)}</div>${PD[i].name}<br><b>${yen(PD[i].price)}</b></div>`).join('')}</div></div>`,
 results:S=>{const list=S.list||PRODUCTS.map(p=>p.id);return `<div class="shop">${shopTop(S)}<div class="rbar"><span>「${S.query||'くだもの'}」${list.length}件</span><span class="pill" data-k="sort">並べ替え：${S.sortLabel||'おすすめ順'}</span></div>
   <div class="plist">${list.map(i=>{const p=PD[i];return `<div class="pitem" data-k="p-${i}"><div class="im">${pimg(i,46,S)}</div><div><div class="nm">${p.name}</div>${stars(p.rate,p.rc)}<div>${price(p.price)}</div><div class="dlv"><b>明日 11/18</b> にお届け</div>${S.showStock?`<div class="stk ${p.stock?'':'no'}">残り${p.stock}点</div>`:''}</div></div>`}).join('')}</div></div>`},
 detail:S=>{const p=PD[S.sel||'grape'];return `<div class="shop">${shopTop(S)}<div class="dt"><div class="nm" data-k="name">${p.name}（国産・旬）</div>${stars(p.rate,p.rc)}
   <div class="im" data-k="img">${pimg(p.id,120,S)}</div><div data-k="price">${price(p.price)}</div><div class="stk" data-k="stock">在庫あり${S.showStock?`（残り${p.stock}点）`:''}</div>
   <div class="qtyb" data-k="qty"><span>数量</span><i class="q" data-k="qty-">−</i><b>${S.qty||1}</b><i class="q" data-k="qty+">＋</i></div>
   <div class="ybtn" data-k="add">カートに入れる</div><div class="obtn" data-k="buy">今すぐ買う</div></div></div>`},
 cart:S=>{const c=S.cart&&S.cart.length?S.cart:[{id:'apple',qty:1},{id:'grape',qty:2},{id:'pine',qty:1}];const n=c.reduce((a,x)=>a+x.qty,0),tot=c.reduce((a,x)=>a+PD[x.id].price*x.qty,0);
   return `<div class="shop">${shopTop(S)}<div class="cartv"><div class="sub" data-k="total">小計（${n}個の商品）：<b>${typeof S.totalOverride==='string'?S.totalOverride:yen(S.totalOverride??tot)}</b></div><div class="ybtn" data-k="toinfo">レジに進む</div>
   ${c.map(x=>{const p=PD[x.id];return `<div class="citem" data-k="c-${x.id}"><div class="im">${pimg(x.id,38,S)}</div><div><div class="nm" style="font-size:11.5px">${p.name}</div>${price(p.price)}<div class="stk">在庫あり</div><span class="qtyb" style="padding:2px 8px">数量：<b>${x.qty}</b></span></div></div>`}).join('')}</div></div>`},
 info:S=>{const f=S.filled;const c=S.cart&&S.cart.length?S.cart:[{id:'apple',qty:1},{id:'grape',qty:2},{id:'pine',qty:1}];const tot=c.reduce((a,x)=>a+PD[x.id].price*x.qty,0);
   return `<div class="shop">${shopTop(S)}<div class="form"><h3>注文の確定</h3>
   <div class="card2"><div class="lb">お届け先<a>変更</a></div><div class="fi" data-k="f-name" data-ph="お名前">${f?'山田 花子':''}</div><div class="fi" data-k="f-addr" data-ph="住所">${f?'東京都港区南青山1-2-3':''}</div><div class="fi" data-k="f-tel" data-ph="電話番号">${f?'090-1234-5678':''}</div>${S.extraFields||''}</div>
   <div class="card2" data-k="pay"><div class="lb">お支払い方法<a>変更</a></div><div class="fi" data-k="f-card" data-ph="クレジットカード">${f?'VISA 末尾 9012':''}</div></div>
   ${S.consent||''}<div class="tot2" data-k="total"><span>ご請求額</span><b>${yen(tot)}</b></div><div class="ybtn" data-k="confirm">注文を確定する</div></div></div>`},
 done:S=>`<div class="shop">${shopTop(S)}<div class="donev"><span class="ck">${ic('check',56,'#067d62')}</span><b>ご注文ありがとうございます</b><span style="color:#565959;font-size:10.5px">注文番号 250-1116042<br>確認メールを送信しました</span><div class="wbtn" data-k="home" style="width:160px;margin-top:10px">買い物を続ける</div></div></div>`,
 error:S=>`<div class="err-scr">${ic(S.errIcon||'alert',48)}<b>${S.errTitle||'ページを表示できません'}</b><small>${S.errText||''}</small></div>`,
 custom:S=>S.html||''};

class Mock{
  constructor(host,{scale=1,nav=false}={}){
    this.S={query:'',cart:[],sel:'grape',qty:1,filled:false,theme:''};this.hist=[];this.hi=-1;this.cur=null;
    const w=h(`<div class="mockwrap"><div class="phone" style="${scale!==1?`transform:scale(${scale});transform-origin:top center;margin-bottom:${-556*(1-scale)}px;margin-left:${-270*(1-scale)/2}px;margin-right:${-270*(1-scale)/2}px`:''}"><div class="scr"><div class="island"></div><div class="view"></div><div class="movl"></div><div class="finger"></div><div class="homebar"></div></div></div>${nav?`<div class="pnav"><button class="pv">‹</button><span class="pnm">—</span><button class="nx">›</button></div>`:''}</div>`);
    host.appendChild(w);this.w=w;this.phone=$('.phone',w);this.scr=$('.scr',w);this.view=$('.view',w);this.ovl=$('.movl',w);this.fg=$('.finger',w);
    if(nav){$('.pv',w).onclick=()=>this.nav(-1);$('.nx',w).onclick=()=>this.nav(1)}}
  _render(n){this.view.innerHTML=`<div class="screen ${(n==='search'||n==='error'||(n==='custom'&&!(this.S.html||'').includes('class="shop"')))?'':'nopad'} ${this.S.theme||''}">${SCREENS[n](this.S)}</div>`;this.cur=n}
  _upd(){const n=$('.pnm',this.w);if(!n)return;const e=this.hist[this.hi];n.textContent=e?(e.label||SCR_NAME[e.name]):'—';$('.pv',this.w).disabled=this.hi<=0;$('.nx',this.w).disabled=this.hi>=this.hist.length-1}
  async go(n,patch={},{push=true,label,wait=280}={}){Object.assign(this.S,patch);this._render(n);if(push){this.hist=this.hist.slice(0,this.hi+1);this.hist.push({name:n,S:JSON.parse(JSON.stringify(this.S)),label});this.hi=this.hist.length-1}this._upd();await sleep(wait)}
  nav(d){const i=this.hi+d;if(i<0||i>=this.hist.length)return;this.hi=i;const e=this.hist[i];this.S=JSON.parse(JSON.stringify(e.S));this._render(e.name);this._upd()}
  el(k){return this.view.querySelector(`[data-k="${k}"]`)}
  pos(e){const r=e.getBoundingClientRect(),s=this.scr.getBoundingClientRect(),k=s.width/this.scr.offsetWidth;return{x:(r.left+r.width/2-s.left)/k,y:(r.top+r.height/2-s.top)/k}}
  async tap(k){const e=typeof k==='string'?this.el(k):k;if(!e)return;const p=this.pos(e),f=this.fg;
    if(!f.classList.contains('on')){f.style.transition='none';f.style.left=(p.x+30)+'px';f.style.top=(p.y+70)+'px';void f.offsetWidth;f.style.transition='';f.classList.add('on')}
    f.style.left=p.x+'px';f.style.top=p.y+'px';await sleep(430);f.classList.add('press');const r=h(`<div class="ripple" style="left:${p.x}px;top:${p.y}px"></div>`);this.scr.appendChild(r);setTimeout(()=>r.remove(),600);await sleep(200);f.classList.remove('press');await sleep(100)}
  hideFinger(){this.fg.classList.remove('on')}
  async type(k,t,sp=55){const e=this.el(k);if(!e)return;const s=e.querySelector('span')||e;s.textContent='';for(const c of t){s.textContent+=c;await sleep(sp)}}
  hl(k,cls='mhl'){const e=typeof k==='string'?this.el(k):k;if(e)e.classList.add(cls);return e}
  unhl(){$$('.mhl,.mhl-ng',this.view).forEach(e=>e.classList.remove('mhl','mhl-ng'))}
  badge(t,{cls='',top,bottom,icon}={}){const b=h(`<div class="mbadge ${cls}" style="${top!=null?`top:${top}px`:`bottom:${bottom??60}px`}">${icon?ic(icon,18):''}<span>${t}</span></div>`);this.ovl.appendChild(b);return b}
  clearBadges(){this.ovl.innerHTML=''}
  async step(n){const S=this.S;switch(n){
    case 'websearch':await this.go('home');await this.tap('browser');await this.go('search',{query:''});await this.type('q','ショッピング');await this.go('search',{query:'ショッピング'},{wait:400});break;
    case 'opentop':if(this.cur!=='search')await this.go('search',{query:'ショッピング'});await this.tap('r-shop');await this.go('top',{query:''});break;
    case 'search':if(this.cur!=='top')await this.go('top',{query:''});await this.tap('q');await this.type('q','くだもの');await this.tap('go');await this.go('results',{query:'くだもの'});break;
    case 'select':if(this.cur!=='results')await this.go('results',{query:'くだもの'});await this.tap('p-grape');await this.go('detail',{sel:'grape',qty:1});break;
    case 'qty':if(this.cur!=='detail')await this.go('detail',{sel:'grape',qty:1});await this.tap('qty+');await this.go('detail',{qty:2},{push:false,wait:200});break;
    case 'add':if(this.cur!=='detail')await this.go('detail',{sel:'grape',qty:2});await this.tap('add');{const c=S.cart.filter(x=>x.id!==S.sel);c.push({id:S.sel,qty:S.qty});await this.go('detail',{cart:c},{push:false,wait:200})}toast('カートに追加しました');await sleep(300);break;
    case 'opencart':await this.tap('cartbtn');await this.go('cart');break;
    case 'total':if(this.cur!=='cart')await this.go('cart');this.hl('total');await sleep(800);this.unhl();break;
    case 'pay':if(this.cur!=='cart')await this.go('cart');await this.tap('toinfo');await this.go('info',{filled:false});await this.tap('f-name');await this.go('info',{filled:true},{push:false,wait:250});await this.tap('pay');break;
    case 'confirm':if(this.cur!=='info')await this.go('info',{filled:true});await this.tap('confirm');await this.go('done');break;
    case 'backtop':if(this.cur!=='done')await this.go('done');await this.tap('home');await this.go('top',{cart:[]});break}}
}
