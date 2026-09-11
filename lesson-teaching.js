(() => {
  const mediaRoot = 'https://raw.githubusercontent.com/clairearc/Daily-American-English/main/assets/chapter-1/unit-1/part-1/';
  const media = {
    hero: {file:'hero.webp',alt:'清晨卧室里刚醒来伸懒腰的动漫场景插画',markers:[
      {n:1,x:22,y:70,term:'alarm / alarm clock',zh:'闹钟'},
      {n:2,x:58,y:48,term:'wake up',zh:'醒来'},
      {n:3,x:72,y:20,term:'stretch',zh:'伸展；伸懒腰'}]},
    scenes:{
      'The Alarm Goes Off':{file:'scene-alarm-snooze.webp',alt:'清晨躺在床上伸手按闹钟贪睡按钮的动漫场景插画',markers:[
        {n:1,x:25,y:66,term:'go off',zh:'（闹钟、警报器）响'},
        {n:2,x:31,y:58,term:'snooze button',zh:'闹钟的贪睡按钮'},
        {n:3,x:48,y:58,term:'hit the snooze button',zh:'按下贪睡按钮'}]},
      'I Overslept':{file:'scene-overslept.webp',alt:'发现睡过头后慌忙惊醒的动漫场景插画',markers:[
        {n:1,x:28,y:68,term:'oversleep',zh:'睡过头'},
        {n:2,x:62,y:38,term:'panic',zh:'恐慌；惊慌'},
        {n:3,x:69,y:72,term:'in a rush',zh:'赶时间；很匆忙'}]},
      'Looking Rough in the Morning':{file:'scene-puffy-eyes.webp',alt:'清晨在镜子前观察浮肿眼睛和黑眼圈的动漫场景插画',markers:[
        {n:1,x:47,y:39,term:'puffy eyes',zh:'浮肿的眼睛；泡泡眼'},
        {n:2,x:53,y:46,term:'dark circles',zh:'黑眼圈'},
        {n:3,x:65,y:57,term:'drowsy',zh:'昏昏欲睡的'}]}
    }
  };

  const sceneAudio={
    'The Alarm Goes Off':'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=90d6cf4d-86da-4ac2-8bc5-d404401f4389.wav',
    'Someone Is Trying to Wake You Up':'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=d8c7122a-2ef1-4e96-af7d-da8205f76cc7.wav',
    'Sleeping In on the Weekend':'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=57f14154-11f9-4ffc-9df5-b09b7a1cbc73.wav',
    'I Overslept':'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=11059e6d-faa5-421d-a513-9dffbff16843.wav',
    'Looking Rough in the Morning':'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=607a4a5b-41ae-4fda-9e5e-3c9c2e5ecc9c.wav',
    "I'm Not a Morning Person":'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=5631acc0-018c-482e-8b72-cc2c5e256d2a.wav'
  };
  const expressionAudio={url:'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=824ced3a-cd34-4597-a187-b9d62e09e264.wav',segments:[[.199,.979],[1.679,2.999],[3.699,5.219],[5.919,8.139],[9.039,9.839],[10.539,12.158],[12.858,13.559],[14.259,15.459],[16.359,17.679],[18.28,19.159],[19.859,20.759],[21.459,23.099],[23.999,25.06],[25.64,27.999],[28.699,30.139]]};
  const comparisonAudio={url:'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=7b1ecc35-1399-481b-a670-6332d4970313.wav',segments:[[.179,.659],[1.519,1.999],[2.74,3.299],[4.199,4.96],[5.699,6.219],[6.839,7.419],[8.119,9.079],[9.629,11.489],[12.39,13.049],[13.749,14.39],[14.89,15.81],[16.35,17.69],[18.11,19.569]]};
  const usefulAudio=[
    {url:'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=d9343e99-c457-40c2-909f-60822c00a5a0.wav',segments:[[.179,1],[1.65,2.59],[3.05,4.07],[4.53,5.691],[6.341,7.482],[8.132,8.971],[9.621,10.88]]},
    {url:'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=59331d89-06a2-4245-a9c9-ec77373e6256.wav',segments:[[.179,1.36],[2.01,3.649],[4.69,6.069],[6.719,7.859],[8.509,10.309],[10.79,12.089]]}
  ];
  const practiceAudio={url:'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=f66f3715-72f7-4f2c-b30f-b6ea30b2c51d.wav',segments:[[.159,2.44],[3.24,6.06],[6.96,9.02],[9.72,12.279],[12.979,14.258]]};

  const player=new Audio(); player.preload='metadata';
  let stopAt=null, activeButton=null, queue=[];
  function stopAudio(reset=true){player.pause();if(reset){try{player.currentTime=0}catch(_){}}stopAt=null;queue=[];if(activeButton){activeButton.classList.remove('playing');activeButton.setAttribute('aria-pressed','false')}activeButton=null}
  function playSegment(url,start,end,btn){if(activeButton===btn&&!player.paused){stopAudio();return}stopAudio(false);activeButton=btn;btn.classList.add('playing');btn.setAttribute('aria-pressed','true');stopAt=end+.05;const go=()=>{try{player.currentTime=Math.max(0,start-.03);player.play().catch(stopAudio)}catch(_){stopAudio()}};if(player.src!==url){player.src=url;player.load()}if(player.readyState>=1)go();else player.addEventListener('loadedmetadata',go,{once:true})}
  function playNext(){const url=queue.shift();if(!url){stopAudio();return}player.src=url;player.load();player.play().catch(stopAudio)}
  function playAll(urls,btn){stopAudio(false);activeButton=btn;btn.classList.add('playing');btn.setAttribute('aria-pressed','true');stopAt=null;queue=[...urls];playNext()}
  player.addEventListener('timeupdate',()=>{if(stopAt!==null&&player.currentTime>=stopAt)stopAudio()});
  player.addEventListener('ended',()=>queue.length?playNext():stopAudio());

  function audioButton(url,start,end,label='播放美音'){const b=document.createElement('button');b.type='button';b.className='lesson-audio-btn';b.innerHTML='<span aria-hidden="true">🔊</span><span class="audio-us">US</span>';b.setAttribute('aria-label',label);b.title=label;b.addEventListener('click',e=>{e.stopPropagation();playSegment(url,start,end,b)});return b}
  function findVocabAudio(term){return [...document.querySelectorAll('.vocab-card')].find(c=>c.querySelector('.vocab-term')?.textContent.trim()===term)?.querySelector('.vocab-audio-btn')||null}
  function imageUrls(file){return{primary:`${mediaRoot}${file}?v=20260911c`,fallback:new URL(`assets/chapter-1/unit-1/part-1/${file}`,document.baseURI).href}}

  function buildTeachingVisual(config,cls){const fig=document.createElement('figure');fig.className=`teaching-visual ${cls}`;const frame=document.createElement('div');frame.className='teaching-frame';const img=document.createElement('img');const urls=imageUrls(config.file);img.src=urls.primary;img.dataset.fallback=urls.fallback;img.alt=config.alt;img.loading=cls==='teaching-hero'?'eager':'lazy';img.decoding='async';img.addEventListener('error',()=>{if(!img.dataset.usedFallback){img.dataset.usedFallback='1';img.src=img.dataset.fallback}else frame.classList.add('image-failed')});frame.appendChild(img);config.markers.forEach(m=>{const s=document.createElement('span');s.className='teaching-marker';s.textContent=m.n;s.style.left=`${m.x}%`;s.style.top=`${m.y}%`;frame.appendChild(s)});const err=document.createElement('div');err.className='teaching-error';err.textContent='图片加载失败，请刷新页面。';frame.appendChild(err);fig.appendChild(frame);const cap=document.createElement('figcaption');cap.className='teaching-legend';cap.innerHTML='<div class="teaching-legend-title">看图学表达</div>';const grid=document.createElement('div');grid.className='teaching-legend-grid';config.markers.forEach(m=>{const row=document.createElement('div');row.className='teaching-legend-item';row.innerHTML=`<span class="teaching-number">${m.n}</span><span class="teaching-copy"><strong>${m.term}</strong><span>${m.zh}</span></span>`;const vb=findVocabAudio(m.term);if(vb){const ab=document.createElement('button');ab.type='button';ab.className='legend-audio-btn';ab.innerHTML='<span aria-hidden="true">🔊</span><span class="audio-us">US</span>';ab.setAttribute('aria-label',`播放 ${m.term} 的美音`);ab.addEventListener('click',e=>{e.stopPropagation();vb.click()});row.appendChild(ab)}grid.appendChild(row)});cap.appendChild(grid);fig.appendChild(cap);return fig}

  function decorateImages(){const part=document.querySelector('.course-part');if(!part||!part.querySelector('.part-header h2')?.textContent.includes('Waking Up & Being Late'))return;const oldHero=part.querySelector('.part-hero-media');if(oldHero&&!part.querySelector('.teaching-hero'))oldHero.replaceWith(buildTeachingVisual(media.hero,'teaching-hero'));document.querySelectorAll('#scenes .scene-card').forEach(card=>{const title=card.querySelector('.scene-head h4')?.textContent.trim();const cfg=media.scenes[title];if(!cfg||card.querySelector('.teaching-scene'))return;const old=card.querySelector('.scene-illustration');const fig=buildTeachingVisual(cfg,'teaching-scene');if(old)old.replaceWith(fig);else card.querySelector('.scene-head')?.insertAdjacentElement('afterend',fig)})}
  function decorateScenes(){document.querySelectorAll('#scenes .scene-card').forEach(card=>{const title=card.querySelector('.scene-head h4')?.textContent.trim(),url=sceneAudio[title];if(!url)return;let box=card.querySelector('.scene-audio');if(!box){box=document.createElement('div');box.className='scene-audio';box.innerHTML='<span>🎧 对话音频 · 美音</span><audio controls preload="none"></audio><small>先不看文字听 1 遍 → 看着文字听 1 遍 → shadowing 跟读 1 遍。</small>';card.querySelector('.dialogue')?.insertAdjacentElement('beforebegin',box)}box.querySelector('audio').src=url;box.querySelector('span').textContent='🎧 对话音频 · 美音'})}
  function attach(node,url,seg){if(!node||node.dataset.usAudio)return;node.dataset.usAudio='1';node.classList.add('audio-enabled-line');node.appendChild(audioButton(url,seg[0],seg[1]))}
  function decorateSectionAudio(){document.querySelectorAll('#expressions .expression-card h4,#expressions .expression-card .alternatives .en').forEach((n,i)=>expressionAudio.segments[i]&&attach(n,expressionAudio.url,expressionAudio.segments[i]));document.querySelectorAll('#comparisons .compare-row strong').forEach((n,i)=>comparisonAudio.segments[i]&&attach(n,comparisonAudio.url,comparisonAudio.segments[i]));document.querySelectorAll('#useful-lines .line-card .en').forEach((n,i)=>{const t=i<7?usefulAudio[0]:usefulAudio[1],s=i<7?t.segments[i]:t.segments[i-7];s&&attach(n,t.url,s)});document.querySelectorAll('#practice .practice-card .prompt-box .en').forEach((n,i)=>practiceAudio.segments[i]&&attach(n,practiceAudio.url,practiceAudio.segments[i]));document.querySelectorAll('#practice .practice-card .rewrite .better').forEach((n,i)=>practiceAudio.segments[i+2]&&attach(n,practiceAudio.url,practiceAudio.segments[i+2]));const sec=document.querySelector('#useful-lines'),title=sec?.querySelector('.section-title');if(title&&!title.querySelector('.section-play-all')){const b=document.createElement('button');b.type='button';b.className='section-play-all';b.innerHTML='<span aria-hidden="true">▶</span> 连续播放 · US';b.addEventListener('click',()=>activeButton===b&&!player.paused?stopAudio():playAll(usefulAudio.map(x=>x.url),b));title.appendChild(b)}}
  function enhance(){if(!document.querySelector('.course-part'))return;decorateImages();decorateScenes();decorateSectionAudio()}
  const app=document.querySelector('#app');if(!app)return;new MutationObserver(()=>requestAnimationFrame(enhance)).observe(app,{childList:true,subtree:true});requestAnimationFrame(enhance);
})();