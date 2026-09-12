const app = document.querySelector('#app');
const nav = document.querySelector('#curriculumNav');
const searchInput = document.querySelector('#searchInput');
const navToggle = document.querySelector('#navToggle');
const sidebarClose = document.querySelector('#sidebarClose');
const sidebarOverlay = document.querySelector('#sidebarOverlay');
const scrollTopBtn = document.querySelector('#scrollTopBtn');
const scrollBottomBtn = document.querySelector('#scrollBottomBtn');
let curriculum;
let currentPart;
let currentVocabAudio = null;

const vocabPlayer = new Audio();
vocabPlayer.preload = 'metadata';
let vocabStopAt = null;
let activeVocabButton = null;

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
  stopVocabularyAudio();
  const partRes = await fetch(meta.file, { cache: 'no-store' });
  currentPart = await partRes.json();
  currentVocabAudio = null;
  if (meta.audioFile) {
    try {
      const audioRes = await fetch(meta.audioFile, { cache: 'no-store' });
      if (audioRes.ok) currentVocabAudio = await audioRes.json();
    } catch (err) {
      console.warn('Vocabulary audio metadata could not be loaded.', err);
    }
  }
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
      ${renderTeachingMedia(data.heroMedia, true)}
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
  attachTeachingMedia();
  renderLessonDirectory();
  applySearch();
}

function renderJumpNav(data) {
  return `<nav class="part-jump" aria-label="Part 内快速导航">${sectionMeta.map(([en, zh, id]) => {
    const key = id === 'useful-lines' ? 'usefulLines' : id;
    const count = Array.isArray(data[key]) ? data[key].length : 0;
    return `<a href="#${id}">${escapeHtml(en)}${count ? ` · ${count}` : ''}</a>`;
  }).join('')}</nav>`;
}

// Media is owned by the course renderer, never injected by an observer.
function renderTeachingMedia(media, hero = false) {
  if (!media) return '';
  const markers = media.markers || [];
  const audioItems = currentPart?.vocabulary || [];
  return `<figure class="teaching-media${hero ? ' teaching-media--hero' : ''}">
    <p class="teaching-media-status" role="status">场景图片加载中…</p>
    <a class="teaching-image-stage" href="${escapeHtml(media.src)}" target="_blank" rel="noopener" aria-label="查看大图：${escapeHtml(media.alt)}">
      <img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt)}" width="${Number(media.width)}" height="${Number(media.height)}" decoding="async" loading="eager">
      <svg class="teaching-leaders" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">${markers.filter(marker => Number.isFinite(marker.targetX) && Number.isFinite(marker.targetY)).map(marker => `<line x1="${Number(marker.x)}" y1="${Number(marker.y)}" x2="${Number(marker.targetX)}" y2="${Number(marker.targetY)}" vector-effect="non-scaling-stroke" />`).join('')}</svg>
      ${markers.map((marker, i) => `<span class="teaching-marker" aria-hidden="true" style="left:${Math.max(0, Math.min(100, Number(marker.x)))}%;top:${Math.max(0, Math.min(100, Number(marker.y)))}%">${i + 1}</span>`).join('')}
    </a>
    <figcaption>
      <div class="teaching-media-heading">看图学表达 <small>点击图片查看大图 ↗</small></div>
      <ol class="teaching-legend">${markers.map(marker => {
        const index = audioItems.findIndex(item => item.term === marker.term);
        const hasAudio = index >= 0 && currentVocabAudio?.audioUrl && currentVocabAudio?.segments?.[index];
        return `<li><span><strong>${escapeHtml(marker.term)}</strong><small>${escapeHtml(marker.zh)}</small></span>${hasAudio ? `<button class="teaching-audio us-speak" type="button" data-audio-index="${index}" aria-label="播放 ${escapeHtml(marker.term)} 的美式发音">🔊 US</button>` : ''}</li>`;
      }).join('')}</ol>
    </figcaption>
  </figure>`;
}

function attachTeachingMedia() {
  app.querySelectorAll('.teaching-media').forEach(figure => {
    const img = figure.querySelector('img');
    const status = figure.querySelector('.teaching-media-status');
    const loaded = () => {
      if (!img.naturalWidth) return failed();
      figure.classList.add('is-ready');
      status.hidden = true;
    };
    const failed = () => {
      figure.classList.remove('is-ready');
      status.hidden = false;
      status.textContent = '图片暂时无法显示，仍可使用下方表达与点读。';
    };
    img.addEventListener('load', loaded, { once: true });
    img.addEventListener('error', failed, { once: true });
    // Cached images can finish before the handlers are attached.
    if (img.complete) img.naturalWidth ? loaded() : failed();
  });
  app.querySelectorAll('.teaching-audio').forEach(button => {
    button.addEventListener('click', () => playVocabularySegment(Number(button.dataset.audioIndex), button));
  });
}

const desktopDirectory = window.matchMedia('(min-width: 1100px)');
let lessonDirectory = null;
let directoryFrame = null;

function renderLessonDirectory() {
  lessonDirectory?.remove();
  lessonDirectory = document.createElement('details');
  lessonDirectory.className = 'lesson-directory';
  lessonDirectory.open = false;
  lessonDirectory.innerHTML = `<summary>本课目录 <span aria-hidden="true">☰</span></summary>
    <nav aria-label="本课六模块目录"><p class="lesson-directory-title">本课目录</p>
      ${sectionMeta.map(([en, zh, id]) => `<a href="#${id}"><span>${escapeHtml(en)}</span><small>${escapeHtml(zh)}</small></a>`).join('')}
    </nav>`;
  document.querySelector(desktopDirectory.matches ? '.course-layout' : '.toolbar').appendChild(lessonDirectory);
  lessonDirectory.addEventListener('toggle', updateLessonDirectory);
  lessonDirectory.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', event => {
      const section = document.getElementById(link.hash.slice(1));
      if (!section || section.hidden) return;
      event.preventDefault();
      lessonDirectory.open = false;
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
      section.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      history.replaceState(null, '', link.hash);
    });
  });
  updateLessonDirectory();
}

function updateLessonDirectory() {
  if (!lessonDirectory) return;
  const sections = sectionMeta.map(([, , id]) => document.getElementById(id)).filter(section => section && !section.hidden);
  let active = sections[0]?.id;
  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= Math.max(130, innerHeight * 0.25)) active = section.id;
  });
  lessonDirectory.querySelectorAll('a').forEach(link => {
    const section = document.getElementById(link.hash.slice(1));
    link.hidden = !section || section.hidden;
    if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

window.addEventListener('scroll', () => {
  if (directoryFrame !== null) return;
  directoryFrame = requestAnimationFrame(() => {
    directoryFrame = null;
    updateLessonDirectory();
  });
}, { passive: true });
desktopDirectory.addEventListener('change', event => {
  if (lessonDirectory) {
    lessonDirectory.open = false;
    document.querySelector(event.matches ? '.course-layout' : '.toolbar').appendChild(lessonDirectory);
  }
});
window.addEventListener('resize', updateLessonDirectory);
document.addEventListener('click', event => {
  if (lessonDirectory && !lessonDirectory.contains(event.target)) lessonDirectory.open = false;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && lessonDirectory?.open) {
    lessonDirectory.open = false;
    lessonDirectory.querySelector('summary').focus({ preventScroll: true });
  }
});

function section(en, zh, body, id, count) {
  return `<section id="${id}" class="content-section searchable"><div class="section-title"><div class="section-title-text"><span>${en}</span><h3>${zh}</h3></div>${Number.isFinite(count) ? `<div class="section-count">${count} 项</div>` : ''}</div>${body}</section>`;
}

function renderVocabulary(items = []) {
  const audioSegments = currentVocabAudio?.segments || [];
  return `<div class="vocab-grid">${items.map((item, index) => {
    const hasAudio = Boolean(currentVocabAudio?.audioUrl && audioSegments[index]);
    return `
    <article class="vocab-card searchable">
      <div class="vocab-row">
        <button class="vocab-summary" type="button" aria-expanded="false" aria-controls="vocab-detail-${index}">
          <span><span class="vocab-term">${escapeHtml(item.term)}</span>${item.pronunciation ? `<span class="vocab-ipa">美 · ${item.pronunciation.word === item.term ? '' : escapeHtml(item.pronunciation.word) + ' '}${escapeHtml(item.pronunciation.ipa)}</span>` : ''}<span class="vocab-zh">${escapeHtml(item.zh)}</span></span>
          <span class="vocab-chevron" aria-hidden="true">⌄</span>
        </button>
        ${hasAudio ? `<button class="vocab-audio-btn" type="button" data-audio-index="${index}" aria-label="播放 ${escapeHtml(item.term)} 的美式发音" title="播放美式发音"><span aria-hidden="true">🔊</span></button>` : ''}
      </div>
      <div class="vocab-detail" id="vocab-detail-${index}">
        ${item.note ? `<p class="note">${escapeHtml(item.note)}</p>` : ''}
        ${item.example ? `<div class="example"><p>${escapeHtml(item.example.en)}</p><p>${escapeHtml(item.example.zh)}</p></div>` : '<p class="note">点击词条可收起或展开详细说明。</p>'}
      </div>
    </article>`;
  }).join('')}</div>`;
}

function attachVocabInteractions() {
  document.querySelectorAll('.vocab-summary').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.vocab-card');
      const open = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.querySelectorAll('.vocab-audio-btn').forEach(btn => {
    btn.addEventListener('click', event => {
      event.stopPropagation();
      playVocabularySegment(Number(btn.dataset.audioIndex), btn);
    });
  });
}

function playVocabularySegment(index, button) {
  const segment = currentVocabAudio?.segments?.[index];
  const url = currentVocabAudio?.audioUrl;
  if (!segment || !url) return;

  if (activeVocabButton === button && !vocabPlayer.paused) {
    stopVocabularyAudio();
    return;
  }

  stopVocabularyAudio(false);
  activeVocabButton = button;
  button.classList.add('playing');
  button.setAttribute('aria-pressed', 'true');
  vocabStopAt = Number(segment.end) + 0.08;

  const startPlayback = () => {
    try {
      vocabPlayer.currentTime = Math.max(0, Number(segment.start) - 0.03);
      const playPromise = vocabPlayer.play();
      if (playPromise?.catch) playPromise.catch(() => stopVocabularyAudio());
    } catch (err) {
      console.warn('Vocabulary audio could not be played.', err);
      stopVocabularyAudio();
    }
  };

  if (vocabPlayer.src !== url) {
    vocabPlayer.src = url;
    vocabPlayer.load();
  }
  if (vocabPlayer.readyState >= 1) startPlayback();
  else vocabPlayer.addEventListener('loadedmetadata', startPlayback, { once: true });
}

function stopVocabularyAudio(resetTime = true) {
  vocabPlayer.pause();
  if (resetTime && Number.isFinite(vocabPlayer.currentTime)) {
    try { vocabPlayer.currentTime = 0; } catch (_) {}
  }
  vocabStopAt = null;
  if (activeVocabButton) {
    activeVocabButton.classList.remove('playing');
    activeVocabButton.setAttribute('aria-pressed', 'false');
  }
  activeVocabButton = null;
}

vocabPlayer.addEventListener('timeupdate', () => {
  if (vocabStopAt !== null && vocabPlayer.currentTime >= vocabStopAt) stopVocabularyAudio();
});
vocabPlayer.addEventListener('ended', () => stopVocabularyAudio());

function renderScenes(scenes = []) {
  return scenes.map((scene, i) => `
    <article class="scene-card searchable">
      <div class="scene-head"><div><p class="scene-kicker">Scene ${i + 1}</p><h4>${escapeHtml(scene.title)}</h4><p>${escapeHtml(scene.zh)}</p></div></div>
      ${renderTeachingMedia(scene.media)}
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
  updateLessonDirectory();
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
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
scrollBottomBtn?.addEventListener('click', () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

loadCurriculum().catch(err => {
  console.error(err);
  app.innerHTML = '<div class="empty">课程加载失败，请刷新页面。</div>';
});
