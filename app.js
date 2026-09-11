const app = document.querySelector('#app');
const nav = document.querySelector('#curriculumNav');
const searchInput = document.querySelector('#searchInput');
const navToggle = document.querySelector('#navToggle');
const sidebarClose = document.querySelector('#sidebarClose');
const sidebarOverlay = document.querySelector('#sidebarOverlay');
let curriculum;
let currentPart;

const sectionMeta = [
  ['Vocabulary', '词汇总表', 'vocabulary'],
  ['Scenes', '真实场景会话', 'scenes'],
  ['Expressions', '重点表达与自然说法', 'expressions'],
  ["Don't Mix These Up", '词义辨析与易错表达', 'comparisons'],
  ['Useful Lines', '高频实用短句', 'useful-lines'],
  ['Practice', '输出练习', 'practice']
];

async function loadCurriculum() {
  const res = await fetch('curriculum/index.json', { cache: 'no-store' });
  curriculum = await res.json();
  renderNav();
  const first = curriculum.chapters?.[0]?.units?.[0]?.parts?.[0];
  if (first) await openPart(first);
}

function renderNav() {
  nav.innerHTML = '';
  curriculum.chapters.forEach(chapter => {
    const chapterWrap = document.createElement('section');
    chapterWrap.className = 'nav-chapter';
    chapterWrap.innerHTML = `<h2>Chapter ${chapter.id.split('-').pop()} · ${escapeHtml(chapter.title)}</h2><p>${escapeHtml(chapter.zh)}</p>`;
    chapter.units.forEach(unit => {
      const unitWrap = document.createElement('div');
      unitWrap.className = 'nav-unit';
      unitWrap.innerHTML = `<h3>Unit ${unit.id.split('-').pop()} · ${escapeHtml(unit.title)}</h3><p>${escapeHtml(unit.zh)}</p>`;
      unit.parts.forEach(part => {
        const btn = document.createElement('button');
        btn.className = 'part-link';
        btn.textContent = `Part ${part.id.split('-').pop()} · ${part.title}`;
        btn.addEventListener('click', () => openPart(part));
        unitWrap.appendChild(btn);
      });
      chapterWrap.appendChild(unitWrap);
    });
    nav.appendChild(chapterWrap);
  });
}

async function openPart(meta) {
  const res = await fetch(meta.file, { cache: 'no-store' });
  currentPart = await res.json();
  renderPart(currentPart);
  document.querySelectorAll('.part-link').forEach(btn => btn.classList.toggle('active', btn.textContent.includes(meta.title)));
  closeNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPart(data) {
  app.innerHTML = '';
  const article = document.createElement('article');
  article.className = 'course-part';
  article.innerHTML = `
    <header class="part-header">
      <p class="breadcrumb">Chapter ${data.chapter.number} · ${escapeHtml(data.chapter.title)} / Unit ${data.unit.number} · ${escapeHtml(data.unit.title)}</p>
      <h2>Part ${data.part.number} · ${escapeHtml(data.part.title)}</h2>
      <p class="part-zh">${escapeHtml(data.part.zh)}</p>
      <p class="intro">${escapeHtml(data.intro)}</p>
      <div class="objectives"><h3>本 Part 学习目标</h3><ul>${data.objectives.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>
    </header>
    ${renderJumpNav(data)}
    ${section('Vocabulary', '词汇总表', renderVocabulary(data.vocabulary), 'vocabulary', data.vocabulary?.length)}
    ${section('Scenes', '真实场景会话', renderScenes(data.scenes), 'scenes', data.scenes?.length)}
    ${section('Expressions', '重点表达与自然说法', renderExpressions(data.expressions), 'expressions', data.expressions?.length)}
    ${section("Don't Mix These Up", '词义辨析与易错表达', renderComparisons(data.comparisons), 'comparisons', data.comparisons?.length)}
    ${section('Useful Lines', '高频实用短句', renderUsefulLines(data.usefulLines), 'useful-lines', data.usefulLines?.length)}
    ${section('Practice', '输出练习', renderPractice(data.practice), 'practice', data.practice?.length)}
  `;
  app.appendChild(article);
  attachVocabInteractions();
  applySearch();
}

function renderJumpNav(data) {
  return `<nav class="part-jump" aria-label="Part 内快速导航">${sectionMeta.map(([en, zh, id]) => {
    const key = id === 'useful-lines' ? 'usefulLines' : id;
    const count = Array.isArray(data[key]) ? data[key].length : 0;
    return `<a href="#${id}">${escapeHtml(en)}${count ? ` · ${count}` : ''}</a>`;
  }).join('')}</nav>`;
}

function section(en, zh, body, id, count) {
  return `<section id="${id}" class="content-section searchable"><div class="section-title"><div class="section-title-text"><span>${en}</span><h3>${zh}</h3></div>${Number.isFinite(count) ? `<div class="section-count">${count} 项</div>` : ''}</div>${body}</section>`;
}

function renderVocabulary(items = []) {
  return `<div class="vocab-grid">${items.map((item, index) => `
    <article class="vocab-card searchable">
      <button class="vocab-summary" type="button" aria-expanded="false" aria-controls="vocab-detail-${index}">
        <span><span class="vocab-term">${escapeHtml(item.term)}</span><span class="vocab-zh">${escapeHtml(item.zh)}</span></span>
        <span class="vocab-chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="vocab-detail" id="vocab-detail-${index}">
        ${item.note ? `<p class="note">${escapeHtml(item.note)}</p>` : ''}
        ${item.example ? `<div class="example"><p>${escapeHtml(item.example.en)}</p><p>${escapeHtml(item.example.zh)}</p></div>` : '<p class="note">点击词条可收起或展开详细说明。</p>'}
      </div>
    </article>`).join('')}</div>`;
}

function attachVocabInteractions() {
  document.querySelectorAll('.vocab-summary').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.vocab-card');
      const open = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
}

function renderScenes(scenes = []) {
  return scenes.map((scene, i) => `
    <article class="scene-card searchable">
      <div class="scene-head"><div><p class="scene-kicker">Scene ${i + 1}</p><h4>${escapeHtml(scene.title)}</h4><p>${escapeHtml(scene.zh)}</p></div></div>
      ${scene.audio ? `<div class="scene-audio"><span>🎧 对话音频</span><audio controls preload="none" src="${escapeHtml(scene.audio)}"></audio><small>先不看文字听 1 遍 → 看着文字听 1 遍 → shadowing 跟读 1 遍。</small></div>` : ''}
      <div class="dialogue">${scene.dialogue.map(turn => `<div class="dialogue-turn"><span class="speaker">${escapeHtml(turn.speaker)}</span><p class="en">${escapeHtml(turn.en)}</p><p class="zh">${escapeHtml(turn.zh)}</p></div>`).join('')}</div>
    </article>`).join('');
}

function renderExpressions(items = []) {
  return `<div class="expression-list">${items.map(item => `
    <article class="expression-card searchable"><h4>${escapeHtml(item.term)}</h4><p class="zh-main">${escapeHtml(item.zh)}</p>
      ${item.alternatives?.length ? `<div class="alternatives">${item.alternatives.map(a => `<div><p class="en">${escapeHtml(a.en)}</p><p class="zh">${escapeHtml(a.zh)}</p></div>`).join('')}</div>` : ''}
    </article>`).join('')}</div>`;
}

function renderComparisons(items = []) {
  return `<div class="comparison-list">${items.map(item => `
    <article class="comparison-card searchable"><h4>${escapeHtml(item.title)}</h4>
      ${item.items.map(x => `<div class="compare-row"><strong>${escapeHtml(x.term)}</strong><span>${escapeHtml(x.zh)}</span></div>`).join('')}
      ${item.example ? `<div class="example"><p>${escapeHtml(item.example.en)}</p><p>${escapeHtml(item.example.zh)}</p></div>` : ''}
    </article>`).join('')}</div>`;
}

function renderUsefulLines(items = []) {
  return `<div class="useful-lines">${items.map(x => `<div class="line-card searchable"><p class="en">${escapeHtml(x.en)}</p><p class="zh">${escapeHtml(x.zh)}</p></div>`).join('')}</div>`;
}

function renderPractice(items = []) {
  return `<div class="practice-list">${items.map(item => {
    if (item.type === 'rewrite') {
      return `<article class="practice-card searchable"><h4>${escapeHtml(item.title)}</h4>${item.items.map(x => `<div class="rewrite"><p class="source">${escapeHtml(x.source)}</p><p class="arrow">→</p><p class="better">${escapeHtml(x.better)}</p><p class="zh">${escapeHtml(x.zh)}</p></div>`).join('')}</article>`;
    }
    return `<article class="practice-card searchable"><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.context)}</p><div class="prompt-box"><p class="en">${escapeHtml(item.promptEn)}</p><p class="zh">${escapeHtml(item.promptZh)}</p></div><p>${escapeHtml(item.task)}</p><div class="targets"><strong>尽量用到：</strong>${item.targets.map(x => `<span>${escapeHtml(x)}</span>`).join('')}</div></article>`;
  }).join('')}</div>`;
}

function applySearch() {
  if (!currentPart) return;
  const q = searchInput.value.trim().toLowerCase();
  document.querySelectorAll('.searchable').forEach(el => {
    el.hidden = !!q && !el.textContent.toLowerCase().includes(q);
  });
}

function openNav() {
  document.body.classList.add('nav-open');
  navToggle?.setAttribute('aria-expanded', 'true');
}
function closeNav() {
  document.body.classList.remove('nav-open');
  navToggle?.setAttribute('aria-expanded', 'false');
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','\"':'&quot;'}[c]));
}

searchInput.addEventListener('input', applySearch);
navToggle?.addEventListener('click', () => document.body.classList.contains('nav-open') ? closeNav() : openNav());
sidebarClose?.addEventListener('click', closeNav);
sidebarOverlay?.addEventListener('click', closeNav);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

loadCurriculum().catch(err => {
  console.error(err);
  app.innerHTML = '<div class="empty">课程加载失败，请刷新页面。</div>';
});
