(() => {
  if (!('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  let currentButton = null;

  function pickUSVoice() {
    const voices = synth.getVoices();
    const us = voices.filter(v => /^en[-_]US$/i.test(v.lang));
    const preferred = ['David','Guy','Christopher','Ryan','Alex','Evan','Tom','Google US English'];
    for (const name of preferred) {
      const v = us.find(x => x.name.toLowerCase().includes(name.toLowerCase()));
      if (v) return v;
    }
    return us[0] || voices.find(v => /^en/i.test(v.lang)) || null;
  }

  function stopSpeech() {
    synth.cancel();
    if (currentButton) {
      currentButton.classList.remove('playing');
      currentButton.setAttribute('aria-pressed', 'false');
    }
    currentButton = null;
  }

  function speak(text, button) {
    if (!text?.trim()) return;
    if (currentButton === button && synth.speaking) {
      stopSpeech();
      return;
    }
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voice = pickUSVoice();
    if (voice) utterance.voice = voice;
    currentButton = button || null;
    if (button) {
      button.classList.add('playing');
      button.setAttribute('aria-pressed', 'true');
    }
    utterance.onend = stopSpeech;
    utterance.onerror = stopSpeech;
    synth.speak(utterance);
  }

  function makeButton(text, label = '播放美音') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'native-us-audio';
    btn.innerHTML = '<span aria-hidden="true">🔊</span><span>US</span>';
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      speak(text, btn);
    });
    return btn;
  }

  function replaceVocabAudio() {
    document.querySelectorAll('.vocab-card').forEach(card => {
      const term = card.querySelector('.vocab-term')?.textContent?.trim();
      if (!term) return;
      const old = card.querySelector('.vocab-audio-btn');
      if (!old || old.dataset.nativeUs === '1') return;
      const btn = makeButton(term, `播放 ${term} 的美式发音`);
      btn.classList.add('vocab-audio-btn');
      btn.dataset.nativeUs = '1';
      old.replaceWith(btn);
    });
  }

  function replaceSceneAudio() {
    document.querySelectorAll('#scenes .scene-card').forEach(card => {
      const box = card.querySelector('.scene-audio');
      if (!box || box.dataset.nativeUs === '1') return;
      const lines = [...card.querySelectorAll('.dialogue-turn .en')].map(x => x.textContent.trim()).filter(Boolean);
      if (!lines.length) return;
      box.dataset.nativeUs = '1';
      box.innerHTML = '';
      const label = document.createElement('span');
      label.textContent = '🎧 对话音频 · 美音';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'scene-native-audio';
      btn.textContent = '▶ 播放整段 · US';
      btn.addEventListener('click', () => speak(lines.join(' ... '), btn));
      const note = document.createElement('small');
      note.textContent = '自然美式英语 · 正常语速。点击可暂停，再点可重新播放。';
      box.append(label, btn, note);
    });
  }

  function addLineAudio(selector, textGetter) {
    document.querySelectorAll(selector).forEach(node => {
      if (node.dataset.nativeUsAudio === '1') return;
      const text = textGetter(node);
      if (!text) return;
      node.dataset.nativeUsAudio = '1';
      node.classList.add('native-audio-line');
      node.appendChild(makeButton(text));
    });
  }

  function addSectionAudio() {
    addLineAudio('#expressions .expression-card h4', n => n.childNodes[0]?.textContent?.trim() || n.textContent.trim());
    addLineAudio('#expressions .alternatives .en', n => n.childNodes[0]?.textContent?.trim() || n.textContent.trim());
    addLineAudio('#comparisons .compare-row strong', n => n.childNodes[0]?.textContent?.trim() || n.textContent.trim());
    addLineAudio('#useful-lines .line-card .en', n => n.childNodes[0]?.textContent?.trim() || n.textContent.trim());
    addLineAudio('#practice .prompt-box .en', n => n.childNodes[0]?.textContent?.trim() || n.textContent.trim());
    addLineAudio('#practice .rewrite .better', n => n.childNodes[0]?.textContent?.trim() || n.textContent.trim());

    const section = document.querySelector('#useful-lines');
    const title = section?.querySelector('.section-title');
    if (title && !title.querySelector('.native-play-all')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'native-play-all';
      btn.textContent = '▶ 连续播放 · US';
      btn.addEventListener('click', () => {
        const lines = [...section.querySelectorAll('.line-card .en')]
          .map(n => n.childNodes[0]?.textContent?.trim() || '')
          .filter(Boolean);
        speak(lines.join(' ... '), btn);
      });
      title.appendChild(btn);
    }
  }

  function enhance() {
    replaceVocabAudio();
    replaceSceneAudio();
    addSectionAudio();
  }

  const app = document.querySelector('#app');
  if (!app) return;
  new MutationObserver(() => requestAnimationFrame(enhance)).observe(app, { childList: true, subtree: true });
  window.addEventListener('voiceschanged', enhance);
  requestAnimationFrame(enhance);
})();