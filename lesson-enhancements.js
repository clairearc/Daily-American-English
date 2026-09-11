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

  let floatingNav = null;
  let originalJump = null;
  let currentSectionId = 'vocabulary';
  let scrollBound = false;

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
      if (event.target.closest('.vocab-summary')) {
        setTimeout(() => syncExpandToggle(section, toggle), 0);
      }
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
        <button class="floating-part-trigger" type="button" aria-expanded="false" aria-label="打开本 Part 导航" title="本 Part 导航">
          <span aria-hidden="true">☰</span>
        </button>
        <div class="floating-part-progress" aria-hidden="true">
          ${sectionIds.map(id => `<span class="floating-part-dot" data-section-dot="${id}"></span>`).join('')}
        </div>
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
        const id = btn.dataset.sectionLink;
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeFloatingNav();
      });
    });

    if (!scrollBound) {
      window.addEventListener('scroll', updateFloatingState, { passive: true });
      window.addEventListener('resize', updateFloatingState);
      document.addEventListener('click', event => {
        if (floatingNav?.classList.contains('open') && !floatingNav.contains(event.target)) closeFloatingNav();
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeFloatingNav();
      });
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
    const jumpRect = originalJump.getBoundingClientRect();
    const shouldShow = jumpRect.bottom < 12;
    floatingNav.classList.toggle('visible', shouldShow);
    if (!shouldShow) closeFloatingNav();

    let active = sectionIds[0];
    const threshold = Math.max(110, window.innerHeight * 0.28);
    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= threshold) active = id;
    });
    currentSectionId = active;

    floatingNav.querySelectorAll('[data-section-dot]').forEach(dot => dot.classList.toggle('active', dot.dataset.sectionDot === active));
    floatingNav.querySelectorAll('[data-section-link]').forEach(link => link.classList.toggle('active', link.dataset.sectionLink === active));
    const trigger = floatingNav.querySelector('.floating-part-trigger');
    if (trigger) trigger.title = `本 Part 导航 · ${sectionNames[active]}`;
  }

  function enhanceCurrentPart() {
    if (!document.querySelector('.course-part')) return;
    decorateVocabulary();
    buildFloatingNav();
  }

  const app = document.querySelector('#app');
  if (!app) return;

  const observer = new MutationObserver(() => {
    requestAnimationFrame(enhanceCurrentPart);
  });
  observer.observe(app, { childList: true, subtree: true });

  if (document.querySelector('.course-part')) enhanceCurrentPart();
})();
