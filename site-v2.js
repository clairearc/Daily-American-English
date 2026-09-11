(() => {
  // HeyGen Starfish · Adam Stone · male · American English
  const SCENE_AUDIO = {
    'The Alarm Goes Off':'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=90d6cf4d-86da-4ac2-8bc5-d404401f4389.wav',
    'Someone Is Trying to Wake You Up':'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=d8c7122a-2ef1-4e96-af7d-da8205f76cc7.wav',
    'Sleeping In on the Weekend':'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=57f14154-11f9-4ffc-9df5-b09b7a1cbc73.wav',
    'I Overslept':'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=11059e6d-faa5-421d-a513-9dffbff16843.wav',
    'Looking Rough in the Morning':'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=607a4a5b-41ae-4fda-9e5e-3c9c2e5ecc9c.wav',
    "I'm Not a Morning Person":'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=5631acc0-018c-482e-8b72-cc2c5e256d2a.wav'
  };
  const EXPRESSION_AUDIO={url:'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=824ced3a-cd34-4597-a187-b9d62e09e264.wav',segments:[[.199,.979],[1.679,2.999],[3.699,5.219],[5.919,8.139],[9.039,9.839],[10.539,12.158],[12.858,13.559],[14.259,15.459],[16.359,17.679],[18.28,19.159],[19.859,20.759],[21.459,23.099],[23.999,25.06],[25.64,27.999],[28.699,30.139]]};
  const COMPARISON_AUDIO={url:'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=7b1ecc35-1399-481b-a670-6332d4970313.wav',segments:[[.179,.659],[1.519,1.999],[2.74,3.299],[4.199,4.96],[5.699,6.219],[6.839,7.419],[8.119,9.079],[9.629,11.489],[12.39,13.049],[13.749,14.39],[14.89,15.81],[16.35,17.69],[18.11,19.569]]};
  const USEFUL_AUDIO=[
    {url:'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=d9343e99-c457-40c2-909f-60822c00a5a0.wav',segments:[[.179,1],[1.65,2.59],[3.05,4.07],[4.53,5.691],[6.341,7.482],[8.132,8.971],[9.621,10.88]]},
    {url:'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=59331d89-06a2-4245-a9c9-ec77373e6256.wav',segments:[[.179,1.36],[2.01,3.649],[4.69,6.069],[6.719,7.859],[8.509,10.309],[10.79,12.089]]}
  ];
  const PRACTICE_AUDIO={url:'https://resource2.heygen.ai/text_to_speech/6870446e0ccf4bbeaa2fb63b202a1d4c/88bb9ee1c81b466eb2a08fdde86d3619/id=f66f3715-72f7-4f2c-b30f-b6ea30b2c51d.wav',segments:[[.159,2.44],[3.24,6.06],[6.96,9.02],[9.72,12.279],[12.979,14.258]]};

  const player = new Audio();
  player.preload='metadata';
  let stopAt=null, activeButton=null;
  function clearButton(){if(activeButton){activeButton.classList.remove('playing');activeButton.setAttribute('aria-pressed','false');}activeButton=null;}
  function stopAudio(reset=true){player.pause();if(reset){try{player.currentTime=0;}catch(_){}}stopAt=null;clearButton();}
  function playUrl(url,button){if(activeButton===button&&!player.paused){stopAudio();return;}stopAudio(false);activeButton=button;button.classList.add('playing');button.setAttribute('aria-pressed','true');stopAt=null;const start=()=>player.play().catch(()=>{button.classList.add('audio-error');clearButton();});if(player.src!==url){player.src=url;player.load();}if(player.readyState>=1)start();else player.addEventListener('loadedmetadata',start,{once:true});}
  function playSegment(url,start,end,button){if(activeButton===button&&!player.paused){stopAudio();return;}stopAudio(false);activeButton=button;button.classList.add('playing');button.setAttribute('aria-pressed','true');stopAt=end+.06;const go=()=>{try{player.currentTime=Math.max(0,start-.03);player.play().catch(()=>{button.classList.add('audio-error');clearButton();});}catch(_){clearButton();}};if(player.src!==url){player.src=url;player.load();}if(player.readyState>=1)go();else player.addEventListener('loadedmetadata',go,{once:true});}
  player.addEventListener('timeupdate',()=>{if(stopAt!==null&&player.currentTime>=stopAt)stopAudio();});
  player.addEventListener('ended',()=>stopAudio());
  player.addEventListener('error',()=>{if(activeButton){activeButton.classList.add('audio-error');activeButton.title='音频加载失败，请刷新后重试';}clearButton();});

  function audioButton(handler,label='播放 Adam Stone 美式男声',full=false){const b=document.createElement('button');b.type='button';b.className='us-speak'+(full?' us-scene-play':'');b.innerHTML=full?'▶ 播放整段 · US 男声':'🔊 <span>US</span>';b.setAttribute('aria-label',label);b.title=label;b.addEventListener('click',e=>{e.stopPropagation();handler(b);});return b;}
  function fixSceneAudio(){document.querySelectorAll('#scenes .scene-card').forEach(card=>{const title=card.querySelector('.scene-head h4')?.textContent?.trim(),url=SCENE_AUDIO[title];if(!url)return;let box=card.querySelector('.scene-audio');if(!box){box=document.createElement('div');box.className='scene-audio';card.querySelector('.dialogue')?.insertAdjacentElement('beforebegin',box);}if(box.dataset.adam==='1')return;box.dataset.adam='1';box.innerHTML='<span>🎧 对话音频 · Adam Stone 美式男声</span>';box.appendChild(audioButton(b=>playUrl(url,b),'播放整段 Adam Stone 美式男声',true));const tip=document.createElement('small');tip.textContent='HeyGen Starfish · 正常语速';box.appendChild(tip);});}
  function attachSegment(node,url,segment){if(!node||!segment||node.dataset.adamAudio==='1')return;node.dataset.adamAudio='1';node.classList.add('v2-audio-line');node.appendChild(audioButton(b=>playSegment(url,segment[0],segment[1],b)));}
  function addSectionAudio(){document.querySelectorAll('#expressions .expression-card h4,#expressions .alternatives .en').forEach((n,i)=>attachSegment(n,EXPRESSION_AUDIO.url,EXPRESSION_AUDIO.segments[i]));document.querySelectorAll('#comparisons .compare-row strong').forEach((n,i)=>attachSegment(n,COMPARISON_AUDIO.url,COMPARISON_AUDIO.segments[i]));document.querySelectorAll('#useful-lines .line-card .en').forEach((n,i)=>{const a=i<7?USEFUL_AUDIO[0]:USEFUL_AUDIO[1],seg=i<7?a.segments[i]:a.segments[i-7];attachSegment(n,a.url,seg);});document.querySelectorAll('#practice .prompt-box .en').forEach((n,i)=>attachSegment(n,PRACTICE_AUDIO.url,PRACTICE_AUDIO.segments[i]));document.querySelectorAll('#practice .rewrite .better').forEach((n,i)=>attachSegment(n,PRACTICE_AUDIO.url,PRACTICE_AUDIO.segments[i+2]));}

  function run(){fixSceneAudio();addSectionAudio();}
  const app=document.querySelector('#app');if(!app)return;
  new MutationObserver(()=>requestAnimationFrame(run)).observe(app,{childList:true,subtree:true});
  requestAnimationFrame(run);
})();