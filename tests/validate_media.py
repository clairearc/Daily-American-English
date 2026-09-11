"""Run with Python + Pillow. Checks asset integrity and protected course/audio data."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BASELINE = 'fd169f920ce2812b71e429344a116cc27947aa1b'

def original(path):
    return subprocess.check_output(['git', 'show', f'{BASELINE}:{path}'], cwd=ROOT).decode('utf-8')

course_path = 'curriculum/chapter-1/unit-1/part-1.json'
course = json.loads((ROOT / course_path).read_text(encoding='utf-8'))
original_course = json.loads(original(course_path))
media = [course.pop('heroMedia')]
for scene in course['scenes']:
    if 'media' in scene:
        media.append(scene.pop('media'))
assert course == original_course, 'Course text or structure changed'
assert len(media) == 4
terms = {item['term'] for item in course['vocabulary']}
for item in media:
    path = ROOT / item['src']
    payload = path.read_bytes()
    assert payload[:4] == b'RIFF' and payload[8:12] == b'WEBP'
    assert int.from_bytes(payload[4:8], 'little') + 8 == len(payload), path.name
    assert hashlib.sha256(payload).hexdigest()[:12] in path.name
    with Image.open(path) as image:
        image.load()
        assert image.size == (item['width'], item['height'])
        assert image.width >= 1040
    assert len(item['markers']) == 3
    for marker in item['markers']:
        assert marker['term'] in terms
        assert 0 <= marker['x'] <= 100 and 0 <= marker['y'] <= 100
    print(f'PASS: {path.name}, {len(payload)} bytes, {item["width"]}x{item["height"]}')

audio_path = 'curriculum/chapter-1/unit-1/part-1-audio.json'
assert json.loads((ROOT / audio_path).read_text(encoding='utf-8')) == json.loads(original(audio_path))
old_js = original('site-v2.js')
new_js = (ROOT / 'site-v2.js').read_text(encoding='utf-8')
for start, end in [('  // HeyGen Starfish', '  function findVocabButton'), ('  function fixSceneAudio', '  function run()')]:
    preserved = old_js[old_js.index(start):old_js.index(end)].rstrip()
    assert preserved in new_js, f'Audio code changed at {start}'
old_app, new_app = original('app.js'), (ROOT / 'app.js').read_text(encoding='utf-8')
preserved = old_app[old_app.index('function playVocabularySegment'):old_app.index('function renderScenes')].strip()
assert preserved in new_app, 'Vocabulary player changed'
entry = (ROOT / 'index.html').read_text(encoding='utf-8')
assert re.findall(r'<script src="([^?\"]+)', entry) == ['app.js', 'site-v2.js']
assert 'function addMedia' not in new_js
print('PASS: course content, all existing audio code/data, and single media entry preserved')
