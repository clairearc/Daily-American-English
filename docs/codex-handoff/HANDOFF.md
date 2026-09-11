# Daily American English · Codex 交接文档

> **Codex 请先完整阅读本文件，再阅读同目录 01–05。不要先修改代码。**

仓库：`clairearc/Daily-American-English`

网站：`https://clairearc.github.io/Daily-American-English/`

交接日期：2026-09-11

---

# 0. 一句话说明当前任务

这是一个面向中文母语成人学习者的现代美式英语数字教材网站。

**当前第一优先级不是重做网站，而是：在不破坏已经正常的 Adam Stone 美式男声音频和现有课程结构的前提下，彻底修复 Part 1 的教学图片系统，并恢复用户已经确认的高质量半写实动漫 / 电影感视觉。**

---

# 1. 接手前必须阅读

按顺序：

1. `01-project-purpose.md` — 产品目标与不可偏离的要求
2. `02-site-structure.md` — 页面和代码结构
3. `03-implementation-notes.md` — 已尝试的方法、成功经验与失败经验
4. `04-next-steps.md` — 建议执行顺序
5. `05-known-issues.md` — 当前已知问题

本文件是执行摘要，不替代以上文档。

---

# 2. 当前功能代码基线

在用户要求“先停止修网页、先写交接文档”之前，功能代码的基线 commit 是：

`9e13e34a66ff287aa452877c0e01fdebdebed915`

随后新增的 commits 仅用于 `docs/codex-handoff/` 文档，不应被理解为功能修复。

请先检查当前 `main`，不要假设所有历史补丁都仍被加载。

---

# 3. 当前站点主结构

当前正式课程来源：

- `curriculum/index.json`
- `curriculum/chapter-1/unit-1/part-1.json`
- `curriculum/chapter-1/unit-1/part-1-audio.json`

当前只有：

**Chapter 1 · Daily Life → Unit 1 · In the Morning → Part 1 · Waking Up & Being Late**

Part 固定模块顺序：

1. Vocabulary
2. Scenes
3. Expressions
4. Don't Mix These Up
5. Useful Lines
6. Practice

不要删除或改变这套课程模块结构。

---

# 4. 当前用户明确确认“正常”的部分

## 音频

用户最近明确反馈：

**“音频问题解决了。”**

当前标准：

- HeyGen Starfish
- Adam Stone
- en-US
- 男声
- 正常语速

所以：

### 当前图片修复任务中禁止

- 改成浏览器 `speechSynthesis`；
- 换女声；
- 换其他 voice；
- 大规模重写音频播放器；
- 因修图片而碰音频逻辑。

之前浏览器 TTS 曾导致女声和明显系统合成感，已经被用户否定。

---

# 5. 当前最严重的问题：图片

用户最近看到的线上结果包括：

- 一张图只有 ①②③，没有底图；
- 其他教学图消失；
- 更早版本出现部分图显示、部分图不显示；
- 显示出来的图曾明显模糊；
- 旧大图曾出现空白占位；
- 多轮补丁导致行为反复变化。

**不要把它当成单纯 CSS 问题。**

需要同时审计：

- 实际图片文件；
- 图片编码 / MIME / 像素尺寸；
- GitHub Pages 路径；
- 浏览器缓存；
- DOM 注入方式；
- 重复图片脚本；
- MutationObserver；
- 旧资源 / 旧节点清理逻辑。

---

# 6. 当前仓库图片代码存在明确冲突

目前 `index.html` 加载：

- `app.js`
- `site-v2.js`
- `media-final.js`

而：

- `site-v2.js` 自己有 `MEDIA` + `mediaFigure()` + `addMedia()`；
- `media-final.js` 又有另一套 `MEDIA` + `build()` + `ensure()`；
- `media-final.js` 还会删除 `.v2-media:not(.stable-teaching-media)`。

这意味着当前图片实际上有**两套运行中的渲染逻辑互相覆盖**。

此外仓库还保留：

- `lesson-enhancements.js`
- `lesson-teaching.js`

虽然当前 `index.html` 未必加载它们，但它们代表历史多代补丁，容易造成后续误判。

## 接手建议

不要再新增第三套 / 第四套图片 hotfix。

目标应该是：

**最终只留下一个正式媒体渲染来源。**

优先考虑把媒体配置放进课程 JSON，由 `app.js` 正式渲染。

---

# 7. 极重要：当前 SVG 图是错误方案

仓库中的：

- `hero-final.svg`
- `alarm-final.svg`
- `overslept-final.svg`
- `puffy-final.svg`

是为了解决加载问题临时做出的极简矢量插画。

用户已经明确表示：

- 风格完全变了；
- 和原图差距巨大；
- 不接受这种儿童 / 扁平 / 简笔图。

因此：

**这些 SVG 必须视为失败资产，不是设计基准，也不要在它们基础上继续优化。**

---

# 8. 正确图片视觉基准

正确方向是用户原来确认的：

- cinematic anime / 电影感动漫；
- 半写实；
- 成人审美；
- 人物脸部、头发、服饰细致；
- 完整室内空间和真实景深；
- 柔和自然白昼光；
- 清爽现代；
- 蓝白、天空蓝、浅灰、清新绿色为主；
- 避免整体橙黄暖滤镜；
- 不要变成真人摄影；
- 更不要变成简笔矢量。

用户最近重新给出的视觉参考是一张：

- 明亮现代卧室；
- 蓝白条纹睡衣年轻女性；
- 刚醒、伸懒腰 / 打哈欠；
- 窗边城市景观；
- 白色床品和蓝色软装；
- 人物和环境细节丰富；
- 整体画面清澈、精致。

**Codex 如果拿不到聊天中的这张参考图，不要自行根据 `*-final.svg` 猜风格。应优先使用仓库中可恢复的高质量原始图，或请用户把原始高质量图片重新放入仓库 / 项目目录。**

---

# 9. 图片的教学交互已经定了，不要重新设计

用户选择的是“方案 2”：

## 图中

只放：

- ①
- ②
- ③

## 图下

对应：

- 英文表达；
- 中文解释；
- US 点读。

这样做的原因：

- 图片中文字生成不可靠；
- HTML 文本可编辑；
- 手机端更清楚；
- 可以复用 Vocabulary 音频。

### Part 1 四张图的映射

#### Hero

1. alarm / alarm clock — 闹钟
2. wake up — 醒来
3. stretch — 伸展；伸懒腰

#### The Alarm Goes Off

1. go off — （闹钟）响
2. snooze button — 贪睡按钮
3. hit the snooze button — 按下贪睡按钮

#### I Overslept

1. oversleep — 睡过头
2. panic — 惊慌
3. in a rush — 赶时间；匆忙

#### Looking Rough in the Morning

1. puffy eyes — 浮肿的眼睛
2. dark circles — 黑眼圈
3. drowsy — 昏昏欲睡的

不是所有 6 个 Scenes 都必须有图。

---

# 10. 建议的技术修复方案

## 第一步：建立修复分支

不要直接继续在 `main` 上试错。

## 第二步：审计当前运行链路

确认：

- 哪个脚本插入什么节点；
- 哪些资源请求 404 / decode error；
- 图片 naturalWidth / naturalHeight；
- 当前 Pages 实际响应 MIME；
- 是否存在缓存旧资源。

## 第三步：选定一套真实高清源图

不要再使用当前扁平 `*-final.svg`。

先做到每张最终图：

- 可以直接在浏览器打开；
- 资源请求 200；
- 分辨率足够；
- 肉眼清晰；
- 风格正确。

## 第四步：把媒体加入数据模型

优先把：

- hero media
- scene media
- marker positions
- legend terms

写进 Part JSON。

## 第五步：由 `app.js` 单一路径渲染

不要依赖多个 MutationObserver 插入 / 删除同一批节点。

## 第六步：删除旧图片补丁

新方案确认通过后，再删除：

- `media-final.js`；
- `site-v2.js` 中重复的图片注入代码；
- 不再需要的历史媒体文件。

但不要误删音频增强逻辑。

---

# 11. 图片尺寸要求

用户已经反馈以前图片太大。

推荐目标：

- Hero：桌面约 520–720px；
- Scene：桌面约 420–560px；
- 手机：100% 内容宽度；
- 源图至少约 2× 实际显示像素更稳；
- 不要拿低清缩略图用 CSS 放大。

图片不是装饰海报，正文仍然应是页面主角。

---

# 12. 验收标准

修复完成必须满足以下全部条件：

### 图片

- 4 张正确视觉风格图全部显示；
- 不再有“只有数字没有图片”；
- 不再有空白占位；
- 不模糊；
- 大小合适；
- ①②③ 位置合理；
- 图下 3 条表达正确；
- 手机端不溢出。

### 音频

- Vocabulary 点读继续工作；
- Scene 音频继续工作；
- Adam Stone 男声不变；
- Expressions / Useful Lines / Practice 的已实现音频不回归。

### 页面

- Search 正常；
- Sidebar 正常；
- Jump navigation 正常；
- Vocabulary 展开收起正常；
- 6 个课程模块完整；
- 无明显 console error。

---

# 13. 不要做的事

当前阶段请不要：

- 重新写课程内容；
- 重做全站 UI；
- 换 TTS；
- 用 speechSynthesis；
- 改为女声；
- 给所有 Scene 强行加图片；
- 把图片重新做成扁平图；
- 继续新增独立 hotfix 脚本；
- 在没有浏览器实测前说“已经修好”。

---

# 14. 推荐 Codex 第一条任务指令

可以直接使用：

> Read `docs/codex-handoff/HANDOFF.md` and all files `01` through `05` in that directory. Do not modify code yet. Audit the current image rendering pipeline for Chapter 1 / Unit 1 / Part 1, identify why the site has missing/blank teaching images and why multiple image implementations conflict, and propose a minimal refactor that preserves the currently working Adam Stone audio and all six course modules. Treat all `*-final.svg` flat illustrations as rejected assets, not design references. The target visual style is the high-detail, bright, cinematic semi-realistic anime style documented in the handoff. After the audit, show the exact files you plan to change and the test plan before implementation.

---

# 15. 交接结论

这个项目目前**不需要重新定义产品方向**。

已经明确的方向是：

- 现代真实美式英语；
- Chapter → Unit → Part 数字教材；
- Adam Stone 美式男声音频；
- 高品质半写实动漫场景；
- 图片承担教学作用；
- 图内编号 + 图下表达；
- 手机端可用；
- 可持续扩展。

现在最需要 Codex 解决的是：

**把图片从多轮补丁造成的不稳定状态，重构成一条简单、可验证、可扩展的正式媒体渲染链路，同时恢复正确的高质量视觉资源。**
