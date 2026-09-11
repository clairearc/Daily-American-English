const app = document.querySelector('#app');
const searchInput = document.querySelector('#searchInput');
const tabs = [...document.querySelectorAll('.tab')];
const template = document.querySelector('#lessonTemplate');

let manifest = [];
let lessons = [];
let currentView = 'today';
const favorites = new Set(JSON.parse(localStorage.getItem('dae-favorites') || '[]'));

const saveFavorites = () => localStorage.setItem('dae-favorites', JSON.stringify([...favorites]));
const prettyDate = value => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`));

async function loadData() {
  const indexRes = await fetch('lessons/index.json', { cache: 'no-store' });
  manifest = await indexRes.json();
  lessons = await Promise.all(manifest.map(async item => {
    const res = await fetch(`lessons/${item.file}`, { cache: 'no-store' });
    return res.json();
  }));
  lessons.sort((a, b) => b.date.localeCompare(a.date));
  render();
}

function makeLessonCard(lesson) {
  const node = template.content.cloneNode(true);
  node.querySelector('.lesson-date').textContent = prettyDate(lesson.date);
  node.querySelector('.lesson-title').textContent = lesson.title;
  node.querySelector('.setting').textContent = lesson.setting;

  const favoriteBtn = node.querySelector('.favorite-btn');
  const updateFavorite = () => {
    const active = favorites.has(lesson.date);
    favoriteBtn.textContent = active ? '★' : '☆';
    favoriteBtn.setAttribute('aria-label', active ? 'Remove from favorites' : 'Add to favorites');
  };
  updateFavorite();
  favoriteBtn.addEventListener('click', () => {
    favorites.has(lesson.date) ? favorites.delete(lesson.date) : favorites.add(lesson.date);
    saveFavorites();
    updateFavorite();
  });

  const player = node.querySelector('.audio-player');
  if (lesson.audio) player.src = lesson.audio;
  else node.querySelector('.audio-tip').textContent = '本课音频暂未生成。';

  const dialogue = node.querySelector('.dialogue');
  lesson.dialogue.forEach(turn => {
    const div = document.createElement('div');
    div.className = 'dialogue-turn';
    div.innerHTML = `
      <div class="speaker">${escapeHtml(turn.speaker)}</div>
      <p class="en">${escapeHtml(turn.en)}</p>
      <p class="zh">${escapeHtml(turn.zh)}</p>
      ${turn.note ? `<p class="usage-note">${escapeHtml(turn.note)}</p>` : ''}
    `;
    dialogue.appendChild(div);
  });

  const expressions = node.querySelector('.expressions');
  lesson.expressions.forEach(item => {
    const div = document.createElement('article');
    div.className = 'expression';
    div.innerHTML = `
      <h4>${escapeHtml(item.term)}</h4>
      <p class="expression-zh">${escapeHtml(item.zh)}</p>
      <p class="expression-note">${escapeHtml(item.note)}</p>
      ${item.example ? `<div class="example-box"><p class="example-en">${escapeHtml(item.example.en)}</p><p class="example-zh">${escapeHtml(item.example.zh)}</p></div>` : ''}
    `;
    expressions.appendChild(div);
  });

  const review = node.querySelector('.review-note');
  if (lesson.review) {
    review.hidden = false;
    review.textContent = lesson.review;
  }

  const exercise = node.querySelector('.exercise-content');
  if (lesson.exercise && typeof lesson.exercise === 'object') {
    exercise.innerHTML = `
      ${lesson.exercise.context ? `<p class="exercise-context">${escapeHtml(lesson.exercise.context)}</p>` : ''}
      ${lesson.exercise.prompt_en ? `<div class="prompt-box"><p class="prompt-en">${escapeHtml(lesson.exercise.prompt_en)}</p>${lesson.exercise.prompt_zh ? `<p class="prompt-zh">${escapeHtml(lesson.exercise.prompt_zh)}</p>` : ''}</div>` : ''}
      <p class="exercise-task">${escapeHtml(lesson.exercise.task || '')}</p>
      ${lesson.exercise.targets?.length ? `<p class="targets"><strong>尽量用到：</strong>${lesson.exercise.targets.map(escapeHtml).join(' · ')}</p>` : ''}
    `;
  } else {
    exercise.textContent = lesson.exercise || '';
  }

  return node;
}

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const matches = lessons.filter(lesson => JSON.stringify(lesson).toLowerCase().includes(q));
  app.innerHTML = '';

  if (q) return renderHistory(matches, `Search results (${matches.length})`);

  if (currentView === 'today') {
    if (lessons[0]) app.appendChild(makeLessonCard(lessons[0]));
    return;
  }

  if (currentView === 'favorites') {
    return renderHistory(lessons.filter(l => favorites.has(l.date)), 'Favorites');
  }

  renderHistory(lessons, 'Lesson History');
}

function renderHistory(items, heading) {
  const title = document.createElement('h2');
  title.textContent = heading;
  app.appendChild(title);

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = heading === 'Favorites' ? 'No favorites yet. Tap ☆ on a lesson to save it.' : 'No matching lessons.';
    app.appendChild(empty);
    return;
  }

  const list = document.createElement('div');
  list.className = 'history-list';
  items.forEach(lesson => {
    const item = document.createElement('article');
    item.className = 'history-item';
    const btn = document.createElement('button');
    btn.innerHTML = `<p>${prettyDate(lesson.date)}</p><h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.setting)}</p>`;
    btn.addEventListener('click', () => {
      app.innerHTML = '';
      app.appendChild(makeLessonCard(lesson));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    const star = document.createElement('span');
    star.textContent = favorites.has(lesson.date) ? '★' : '☆';
    star.setAttribute('aria-hidden', 'true');
    item.append(btn, star);
    list.appendChild(item);
  });
  app.appendChild(list);
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}

tabs.forEach(tab => tab.addEventListener('click', () => {
  currentView = tab.dataset.view;
  tabs.forEach(t => t.classList.toggle('active', t === tab));
  searchInput.value = '';
  render();
}));

searchInput.addEventListener('input', render);

loadData().catch(error => {
  console.error(error);
  app.innerHTML = '<div class="empty">Could not load lessons. Please refresh the page.</div>';
});
