(() => {
  const IMG_BASE = 'assets/chapter-1/unit-1/part-1/';
  const MEDIA = {
    hero: {src: IMG_BASE+'hero.webp', alt:'清晨起床情景教学图', legend:[['alarm / alarm clock','闹钟'],['wake up','醒来'],['stretch','伸展；伸懒腰']]},
    'The Alarm Goes Off': {src: IMG_BASE+'scene-alarm-snooze.webp', alt:'闹钟响起与按贪睡按钮的教学图', legend:[['go off','（闹钟）响'],['snooze button','贪睡按钮'],['hit the snooze button','按下贪睡按钮']]},
    'I Overslept': {src: IMG_BASE+'scene-overslept.webp', alt:'睡过头后慌忙起床的教学图', legend:[['oversleep','睡过头'],['panic','惊慌'],['in a rush','赶时间；匆忙']]},
    'Looking Rough in the Morning': {src: IMG_BASE+'scene-puffy-eyes.webp', alt:'镜前观察浮肿眼睛和黑眼圈的教学图', legend:[['puffy eyes','浮肿的眼睛'],['dark circles','黑眼圈'],['drowsy','昏昏欲睡的']]}
  };

  let voices = [];
  function refreshVoices(){ if ('speechSynthesis' in window) voices = window.speechSynthesis.getVoices() || []; }
  if ('speechSynthesis' in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
  function chooseUSVoice(){
    return voices.find(v => /^en-US$/i.test(v.lang) && /(David|Guy|Christopher|Ryan|Andrew|Brian|Eric|Roger|Steffan|Google US English)/i.test(v.name))
      || voices.find(v => /^en-US$/i.test(v.lang))
      || voices.find(v => /^en/i.test(v.lang)) || null;
  }
  function speak(text, button){
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    document.querySelectorAll('.us-speak.playing').forEach(b=>b.classList.remove('playing'));
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 1;
    u.pitch = 1;
    const v = chooseUSVoice(); if (v) u.voice = v;
    if (button) {
      button.classList.add('playing');
      const clear=()=>button.classList.remove('playing');
      u.onend=clear; u.onerror=clear;
    }
    setTimeout(() => window.speechSynthesis.speak(u), 20);
  }
  function makeSpeakButton(text, full=false){
    const b=document.createElement('button');
    b.type='button';
    b.className='us-speak'+(full?' us-scene-play':'');
    b.innerHTML=full?'▶ 播放整段 · US':'🔊 <span>US</span>';
    b.setAttribute('aria-label', full?'播放整段美式英语':'播放美式英语');
    b.addEventListener('click',e=>{e.stopPropagation();speak(text,b)});
    return b;
  }
  function legend(items){
    const box=document.createElement('div'); box.className='v2-legend';
    const title=document.createElement('div'); title.className='v2-legend-title'; title.textContent='看图学表达'; box.appendChild(title);
    const grid=document.createElement('div'); grid.className='v2-legend-grid';
    items.forEach((x,i)=>{
      const row=document.createElement('div'); row.className='v2-legend-item';
      row.innerHTML=`<span class="v2-num">${i+1}</span><span class="v2-copy"><strong>${x[0]}</strong><small>${x[1]}</small></span>`;
      row.appendChild(makeSpeakButton(x[0])); grid.appendChild(row);
    }); box.appendChild(grid); return box;
  }
  function mediaFigure(cfg, hero=false){
    const wrap=document.createElement('div'); wrap.className=hero?'v2-media v2-hero':'v2-media v2-scene-media';
    const img=document.createElement('img'); img.src=cfg.src+'?v=20260911g'; img.alt=cfg.alt; img.decoding='async'; img.loading=hero?'eager':'lazy';
    img.addEventListener('error',()=>{ wrap.remove(); });
    img.addEventListener('load',()=>{ wrap.classList.add('loaded'); });
    const stage=document.createElement('div'); stage.className='v2-image-stage'; stage.appendChild(img);
    cfg.legend.forEach((_,i)=>{const m=document.createElement('span');m.className='v2-marker v2-marker-'+(i+1);m.textContent=String(i+1);stage.appendChild(m)});
    wrap.append(stage,legend(cfg.legend)); return wrap;
  }
  function cleanLegacyMedia(){
    document.querySelectorAll('.part-hero-media,.scene-illustration,.teaching-visual,.hotfix-media,.hotfix-legend,.teaching-legend').forEach(x=>x.remove());
  }
  function addMedia(){
    const part=document.querySelector('.course-part'); if(!part) return;
    const title=part.querySelector('.part-header h2')?.textContent||''; if(!title.includes('Waking Up & Being Late')) return;
    cleanLegacyMedia();
    const header=part.querySelector('.part-header');
    if(header && !header.querySelector('.v2-hero')){
      const f=mediaFigure(MEDIA.hero,true); const obj=header.querySelector('.objectives');
      obj?obj.insertAdjacentElement('beforebegin',f):header.appendChild(f);
    }
    document.querySelectorAll('#scenes .scene-card').forEach(card=>{
      const t=card.querySelector('.scene-head h4')?.textContent?.trim(); const cfg=MEDIA[t];
      if(!cfg||card.querySelector('.v2-scene-media')) return;
      card.querySelector('.scene-head')?.insertAdjacentElement('afterend',mediaFigure(cfg,false));
    });
  }
  function fixSceneAudio(){
    document.querySelectorAll('#scenes .scene-card').forEach(card=>{
      const lines=[...card.querySelectorAll('.dialogue .en')].map(x=>x.textContent.trim()).filter(Boolean);
      if(!lines.length) return;
      let box=card.querySelector('.scene-audio');
      if(!box){ box=document.createElement('div'); box.className='scene-audio'; card.querySelector('.dialogue')?.insertAdjacentElement('beforebegin',box); }
      if(box.dataset.v2==='1') return;
      box.dataset.v2='1'; box.innerHTML='<span>🎧 对话音频 · 美音</span>';
      box.appendChild(makeSpeakButton(lines.join(' '),true));
      const tip=document.createElement('small'); tip.textContent='正常语速 · en-US'; box.appendChild(tip);
    });
  }
  function addInlineAudio(){
    document.querySelectorAll('.vocab-card').forEach(card=>{
      const term=card.querySelector('.vocab-term')?.textContent.trim(); if(!term) return;
      const row=card.querySelector('.vocab-row'); if(!row||row.querySelector('.v2-vocab-audio')) return;
      row.querySelector('.vocab-audio-btn')?.remove(); const b=makeSpeakButton(term); b.classList.add('v2-vocab-audio'); row.appendChild(b);
    });
    const selectors=['#expressions .expression-card h4','#expressions .alternatives .en','#comparisons .compare-row strong','#useful-lines .line-card .en','#practice .prompt-box .en','#practice .rewrite .better'];
    document.querySelectorAll(selectors.join(',')).forEach(n=>{
      if(n.dataset.v2audio==='1') return; const text=n.textContent.trim(); if(!text)return;
      n.dataset.v2audio='1'; n.classList.add('v2-audio-line'); n.appendChild(makeSpeakButton(text));
    });
  }
  function run(){ addMedia(); fixSceneAudio(); addInlineAudio(); }
  const app=document.querySelector('#app'); if(!app) return;
  new MutationObserver(()=>requestAnimationFrame(run)).observe(app,{childList:true,subtree:true});
  requestAnimationFrame(run);
})();