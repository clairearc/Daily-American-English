# Daily American English

面向中文母语成人学习者的现代美式英语数字教材，支持中英对照、场景学习与美式音频点读。

[正式网站](https://clairearc.github.io/Daily-American-English/) · [维护交接](docs/codex-handoff/HANDOFF.md)

## 当前功能

截至 2026-09-12，已上线 Chapter 1 → Unit 1 → Part 1：Waking Up & Being Late。

- 六模块：Vocabulary、Scenes、Expressions、Don't Mix These Up、Useful Lines、Practice。
- 41 个词汇条目默认折叠，支持单条展开及标题旁“全部展开 / 全部收起”；17 个条目附美式音标。
- 方案 C 多色系高雅视觉系统（海港暮蓝 + 珊瑚暖红 + 雅致橄榄金），支持 ☀️ 日间淡雅 / 🌙 夜间护眼 模式一键切换。
- 单词发音按钮升级为 16px 矢量 SVG 扬声器图标与播放微光动效。
- 四张高清教学图，图内编号、图下双语表达与点读；主图最大 520px，场景图最大 440px，可点击查看大图。
- 桌面右侧可收缩浮动目录，窄屏顶部粘性工具栏提供紧凑入口；另有课程层级导航、搜索和顶部/底部按钮。
- 保留既有 HeyGen Starfish / Adam Stone 美式男声音频。

## 当前文件结构

- `index.html`：页面入口，只加载 `app.js` 和 `site-v2.js`。
- `app.js`：课程加载、六模块渲染、媒体、音标、词汇展开、搜索与导航。
- `styles.css`：响应式页面、教学图、目录与词汇按钮样式。
- `site-v2.js` / `site-v2.css`：既有音频增强。
- `curriculum/index.json`：Chapter / Unit / Part 目录。
- `curriculum/chapter-1/unit-1/part-1.json`：正文、`heroMedia`、场景 `media`、词汇 `pronunciation`。
- `curriculum/chapter-1/unit-1/part-1-audio.json`：词汇音频及分段元数据。
- `assets/chapter-1/unit-1/part-1/`：教学图片资源。
- `tests/validate_media.py`：正式媒体完整性及原课程/音频保护检查。

旧 `lessons/`、旧媒体脚本和资产不是当前运行入口；勿因文件仍存在而重新加载。

## 本地预览和验证

从仓库根目录启动：

```sh
python -m http.server 31877 --bind 127.0.0.1
```

打开 http://127.0.0.1:31877/ 。停止服务器后该地址不可用，正式网站不受影响。

```sh
node --check app.js
node --check site-v2.js
python tests/validate_media.py
```

最后一项需要 Pillow。浏览器另行检查图片加载、音频、搜索、六模块导航、词汇单条/全部展开，以及窄屏溢出。脚本通过不等同于浏览器或线上验收通过。

## 发布

GitHub Pages 从 `main` 分支仓库根目录构建。推送经验证的提交后，等待 Pages 工作流成功，再在正式网站核对脚本版本和实际功能。不要把本地预览或仅推送成功当作发布成功。

最近功能版本、构建记录与验收结果见 [09-release-and-vocabulary-controls.md](docs/codex-handoff/09-release-and-vocabulary-controls.md)。人物脸部未按照片重新绘制；现有图是用户提供场景图的无损转换。
