(() => {
  const pronunciationMap = new Map([
    ['pajamas', 'pajamas /pəˈdʒɑːməz/'],
    ['crawl back into bed', 'crawl /krɔːl/'],
    ['snooze button', 'snooze /snuːz/'],
    ['hit the snooze button', 'snooze /snuːz/'],
    ['drowsy', 'drowsy /ˈdraʊzi/'],
    ['puffy eyes', 'puffy /ˈpʌfi/'],
    ['panic', 'panic /ˈpænɪk/'],
    ['panicked', 'panicked /ˈpænɪkt/'],
    ['alarm / alarm clock', 'alarm /əˈlɑːrm/'],
    ['be grumpy in the morning', 'grumpy /ˈɡrʌmpi/'],
    ['barely sleep', 'barely /ˈberli/']
  ]);

  const sectionIds = ['vocabulary', 'scenes', 'expressions', 'comparisons', 'useful-lines', 'practice'];
  const sectionNames = {
    vocabulary: 'Vocabulary',
    scenes: 'Scenes',
    expressions: 'Expressions',
    comparisons: "Don't Mix These Up",
    'useful-lines': 'Useful Lines',
    practice: 'Practice'
  };

  const partMedia = {
    title: 'Waking Up & Being Late',
    hero: 'assets/chapter-1/unit-1/part-1/hero.webp',
    heroAlt: '清晨卧室里刚醒来伸懒腰的动漫场景插画',
    scenes: {
      'The Alarm Goes Off': {
        src: 'assets/chapter-1/unit-1/part-1/scene-alarm-snooze.webp',
        alt: '清晨躺在床上伸手按闹钟贪睡按钮的动漫场景插画'
      },
      'I Overslept': {
        src: 'assets/chapter-1/unit-1/part-1/scene-overslept.webp',
        alt: '发现睡过头后慌忙惊醒的动漫场景插画'
      },
      'Looking Rough in the Morning': {
        src: 'assets/chapter-1/unit-1/part-1/scene-puffy-eyes.webp',
        alt: '清晨在镜子前观察浮肿眼睛和黑眼圈的动漫场景插画'
      }
    }
  };

  let floatingNav = null;
  let originalJump = null;
  let scrollBound = false;

  function decorateLessonMedia() {
    const part = document.querySelector('.course-part');
    if (!part) return;
    const partTitle = part.querySelector('.part-header h2')?.textContent || '';
    if (!partTitle.includes(partMedia.title)) return;

    const header = part.querySelector('.part-header');
    if (header && !header.querySelector('.part-hero-media')) {
      const figure = document.createElement('figure');
      figure.className = 'part-hero-media';
      figure.innerHTML = `<img src="${partMedia.hero}" alt="${partMedia.heroAlt}" loading="eager" decoding="async">`;
      const objectives = header.querySelector('.objectives');
      if (objectives) objectives.insertAdjacentElement('beforebegin', figure);
      else header.appendChild(figure);
    }

    document.querySelectorAll('#scenes .scene-card').forEach(card => {
      if (card.querySelector('.scene-illustration')) return;
      const title = card.querySelector('.scene-head h4')?.textContent?.trim();
      const media = partMedia.scenes[title];
      if (!media) return;
      const img = document.createElement('img');
      img.className = 'scene-illustration';
      img.src = media.src;
      img.alt = media.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      card.querySelector('.scene-head')?.insertAdjacentElement('afterend', img);
    });
  }

  function decorateVocabulary() {
    const section = document.querySelector('#vocabulary');
    if (!section) return;

    section.querySelectorAll('.vocab-card').forEach(card => {
      const termEl = card.querySelector('.vocab-term');
      if (!termEl || card.querySelector('.vocab-ipa')) return;
      const ipa = pronunciationMap.get(termEl.textContent.trim());
      if (!ipa) return;
      const ipaEl = document.createElement('span');
      ipaEl.className = 'vocab-ipa';
      ipaEl.textContent = ipa;
      termEl.insertAdjacentElement('afterend', ipaEl);
    });

    const title = section.querySelector('.section-title');
    if (!title || title.querySelector('.vocab-expand-toggle')) return;

    const tools = document.createElement('div');
    tools.className = 'section-tools';
    const count = title.querySelector('.section-count');
    if (count) tools.appendChild(count);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'vocab-expand-toggle';
    toggle.textContent = '展开全部';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.addEventListener('click', () => {
      const cards = [...section.querySelectorAll('.vocab-card')];
      const shouldOpen = !cards.every(card => card.classList.contains('open'));
      cards.forEach(card => {
        card.classList.toggle('open', shouldOpen);
        card.querySelector('.vocab-summary')?.setAttribute('aria-expanded', String(shouldOpen));
      });
      syncExpandToggle(section, toggle);
    });

    tools.appendChild(toggle);
    title.appendChild(tools);
    section.addEventListener('click', event => {
      if (event.target.closest('.vocab-summary')) setTimeout(() => syncExpandToggle(section, toggle), 0);
    });
    syncExpandToggle(section, toggle);
  }

  function syncExpandToggle(section, toggle) {
    const cards = [...section.querySelectorAll('.vocab-card')];
    const allOpen = cards.length > 0 && cards.every(card => card.classList.contains('open'));
    toggle.textContent = allOpen ? '收起全部' : '展开全部';
    toggle.setAttribute('aria-pressed', String(allOpen));
  }

  function buildFloatingNav() {
    originalJump = document.querySelector('.part-jump');
    if (!originalJump) return;

    document.querySelector('.floating-part-nav')?.remove();
    floatingNav = document.createElement('div');
    floatingNav.className = 'floating-part-nav';
    floatingNav.setAttribute('aria-label', '本 Part 快速导航');

    const counts = {};
    originalJump.querySelectorAll('a').forEach(link => {
      const id = link.getAttribute('href')?.replace('#', '');
      if (!id) return;
      const match = link.textContent.match(/·\s*(\d+)/);
      counts[id] = match ? match[1] : '';
    });

    floatingNav.innerHTML = `
      <div>
        <button class="floating-part-trigger" type="button" aria-expanded="false" aria-label="打开本 Part 导航" title="本 Part 导航"><span aria-hidden="true">☰</span></button>
        <div class="floating-part-progress" aria-hidden="true">${sectionIds.map(id => `<span class="floating-part-dot" data-section-dot="${id}"></span>`).join('')}</div>
      </div>
      <div class="floating-part-panel" role="dialog" aria-label="本 Part 导航">
        <div class="floating-part-panel-title">本 Part 导航</div>
        ${sectionIds.map(id => `<button class="floating-part-link" type="button" data-section-link="${id}"><span>${sectionNames[id]}</span><small>${counts[id] || ''}</small></button>`).join('')}
      </div>`;

    document.body.appendChild(floatingNav);
    const trigger = floatingNav.querySelector('.floating-part-trigger');
    trigger.addEventListener('click', () => {
      const open = floatingNav.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute('aria-label', open ? '关闭本 Part 导航' : '打开本 Part 导航');
    });

    floatingNav.querySelectorAll('[data-section-link]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById(btn.dataset.sectionLink)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeFloatingNav();
      });
    });

    if (!scrollBound) {
      window.addEventListener('scroll', updateFloatingState, { passive: true });
      window.addEventListener('resize', updateFloatingState);
      document.addEventListener('click', event => {
        if (floatingNav?.classList.contains('open') && !floatingNav.contains(event.target)) closeFloatingNav();
      });
      document.addEventListener('keydown', event => { if (event.key === 'Escape') closeFloatingNav(); });
      scrollBound = true;
    }
    updateFloatingState();
  }

  function closeFloatingNav() {
    if (!floatingNav) return;
    floatingNav.classList.remove('open');
    const trigger = floatingNav.querySelector('.floating-part-trigger');
    trigger?.setAttribute('aria-expanded', 'false');
    trigger?.setAttribute('aria-label', '打开本 Part 导航');
  }

  function updateFloatingState() {
    if (!floatingNav || !originalJump || !document.body.contains(originalJump)) return;
    const shouldShow = originalJump.getBoundingClientRect().bottom < 12;
    floatingNav.classList.toggle('visible', shouldShow);
    if (!shouldShow) closeFloatingNav();

    let active = sectionIds[0];
    const threshold = Math.max(110, window.innerHeight * 0.28);
    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= threshold) active = id;
    });
    floatingNav.querySelectorAll('[data-section-dot]').forEach(dot => dot.classList.toggle('active', dot.dataset.sectionDot === active));
    floatingNav.querySelectorAll('[data-section-link]').forEach(link => link.classList.toggle('active', link.dataset.sectionLink === active));
    const trigger = floatingNav.querySelector('.floating-part-trigger');
    if (trigger) trigger.title = `本 Part 导航 · ${sectionNames[active]}`;
  }

  function enhanceCurrentPart() {
    if (!document.querySelector('.course-part')) return;
    decorateLessonMedia();
    decorateVocabulary();
    buildFloatingNav();
  }

  const app = document.querySelector('#app');
  if (!app) return;
  const observer = new MutationObserver(() => requestAnimationFrame(enhanceCurrentPart));
  observer.observe(app, { childList: true, subtree: true });
  if (document.querySelector('.course-part')) enhanceCurrentPart();
})();
