(() => {
  const BASE = 'assets/chapter-1/unit-1/part-1/';
  const MEDIA = {
    hero: {src: BASE+'hero-final.svg', alt:'清晨起床、闹钟与伸懒腰的教学插画', items:[['alarm / alarm clock','闹钟'],['wake up','醒来'],['stretch','伸展；伸懒腰']]},
    'The Alarm Goes Off': {src: BASE+'alarm-final.svg', alt:'闹钟响起并按下贪睡按钮的教学插画', items:[['go off','（闹钟）响'],['snooze button','贪睡按钮'],['hit the snooze button','按下贪睡按钮']]},
    'I Overslept': {src: BASE+'overslept-final.svg', alt:'睡过头后慌忙起床的教学插画', items:[['oversleep','睡过头'],['panic','惊慌'],['in a rush','赶时间；匆忙']]},
    'Looking Rough in the Morning': {src: BASE+'puffy-final.svg', alt:'镜前观察浮肿眼睛与黑眼圈的教学插画', items:[['puffy eyes','浮肿的眼睛'],['dark circles','黑眼圈'],['drowsy','昏昏欲睡的']]}
  };

  function audioFor(term) {
    return [...document.querySelectorAll('.vocab-card')].find(c => c.querySelector('.vocab-term')?.textContent.trim() === term)?.querySelector('.vocab-audio-btn');
  }

  function legend(items) {
    const box = document.createElement('div');
    box.className = 'v2-legend';
    box.innerHTML = '<div class="v2-legend-title">看图学表达</div>';
    const grid = document.createElement('div');
    grid.className = 'v2-legend-grid';
    items.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'v2-legend-item';
      row.innerHTML = `<span class="v2-num">${i+1}</span><span class="v2-copy"><strong>${item[0]}</strong><small>${item[1]}</small></span>`;
      const source = audioFor(item[0]);
      if (source) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'us-speak';
        b.innerHTML = '🔊 <span>US</span>';
        b.title = `播放 ${item[0]} 的美音`;
        b.addEventListener('click', e => { e.stopPropagation(); source.click(); });
        row.appendChild(b);
      }
      grid.appendChild(row);
    });
    box.appendChild(grid);
    return box;
  }

  function build(cfg, hero) {
    const wrap = document.createElement('div');
    wrap.className = hero ? 'v2-media v2-hero stable-teaching-media' : 'v2-media v2-scene-media stable-teaching-media';
    wrap.hidden = true;
    const stage = document.createElement('div');
    stage.className = 'v2-image-stage';
    const img = new Image();
    img.alt = cfg.alt;
    img.decoding = 'async';
    img.addEventListener('load', () => {
      cfg.items.forEach((_, i) => {
        const marker = document.createElement('span');
        marker.className = `v2-marker v2-marker-${i+1}`;
        marker.textContent = String(i+1);
        stage.appendChild(marker);
      });
      wrap.appendChild(legend(cfg.items));
      wrap.hidden = false;
    }, {once:true});
    img.addEventListener('error', () => wrap.remove(), {once:true});
    img.src = cfg.src + '?v=svg-final-1';
    stage.appendChild(img);
    wrap.appendChild(stage);
    return wrap;
  }

  function ensure() {
    const part = document.querySelector('.course-part');
    if (!part || !part.querySelector('.part-header h2')?.textContent.includes('Waking Up & Being Late')) return;

    document.querySelectorAll('.v2-media:not(.stable-teaching-media)').forEach(el => el.remove());

    const header = part.querySelector('.part-header');
    if (header && !header.querySelector('.stable-teaching-media.v2-hero')) {
      const hero = build(MEDIA.hero, true);
      const objectives = header.querySelector('.objectives');
      objectives ? objectives.insertAdjacentElement('beforebegin', hero) : header.appendChild(hero);
    }

    document.querySelectorAll('#scenes .scene-card').forEach(card => {
      const title = card.querySelector('.scene-head h4')?.textContent.trim();
      const cfg = MEDIA[title];
      if (!cfg || card.querySelector('.stable-teaching-media')) return;
      const media = build(cfg, false);
      card.querySelector('.scene-head')?.insertAdjacentElement('afterend', media);
    });
  }

  const app = document.querySelector('#app');
  if (!app) return;
  const observer = new MutationObserver(() => requestAnimationFrame(ensure));
  observer.observe(app, {childList:true, subtree:true});
  requestAnimationFrame(ensure);
})();