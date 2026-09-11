# Daily American English · Codex 交接文档

> 修复分支更新：先查看 [07-repair-verification.md](07-repair-verification.md)。下面关于重复媒体脚本、SVG 和导航缺失的“当前状态”是修复前记录；以 07 及实际入口为准。

> **Codex 请先完整阅读本文件，再阅读同目录 01–06。不要先修改代码。**

仓库：`clairearc/Daily-American-English`

网站：`https://clairearc.github.io/Daily-American-English/`

交接日期：2026-09-11

---

# 0. 当前任务摘要

这是一个面向中文母语成人学习者的现代美式英语数字教材网站。

当前有两个必须解决的回归问题：

1. **Part 1 教学图片系统不稳定**，且最近被错误替换成用户明确拒绝的极简 SVG 风格；
2. **桌面端右侧 Part 内浮动导航消失**。

修复这两个问题时，必须保持已经正常的 Adam Stone 美式男声音频、现有课程结构和其他交互不变。

---

# 1. 接手前必须阅读

按顺序阅读：

1. `01-project-purpose.md` — 项目目标与不可偏离的要求
2. `02-site-structure.md` — 页面和代码结构
3. `03-implementation-notes.md` — 已尝试的方法、经验与失败教训
4. `04-next-steps.md` — 建议执行顺序
5. `05-known-issues.md` — 当前已知问题
6. `06-right-side-navigation.md` — 右侧 Part 导航的明确要求

本文件是执行摘要，不替代以上文档。

---

# 2. 当前功能代码基线

在用户要求“先停止修网页、先写交接文档”之前，功能代码基线为：

`9e13e34a66ff287aa452877c0e01fdebdebed915`

之后新增的 commits 主要是 `docs/codex-handoff/` 文档，不应被当成新的功能修复。

请先检查当前 `main` 和实际 Pages 运行状态，不要只根据历史文件名推断。

---

# 3. 当前站点主结构

正式课程来源：

- `curriculum/index.json`
- `curriculum/chapter-1/unit-1/part-1.json`
- `curriculum/chapter-1/unit-1/part-1-audio.json`

当前课程：

**Chapter 1 · Daily Life → Unit 1 · In the Morning → Part 1 · Waking Up & Being Late**

Part 固定模块顺序：

1. Vocabulary
2. Scenes
3. Expressions
4. Don't Mix These Up
5. Useful Lines
6. Practice

不得删除或重排这六个模块。

---

# 4. 当前已经确认正常的部分：音频

用户最新明确反馈：**“音频问题解决了。”**

当前标准：

- HeyGen Starfish
- Adam Stone
- en-US
- 男声
- 正常语速

因此本轮禁止：

- 改成浏览器 `speechSynthesis`；
- 换女声或其他 voice；
- 大规模重写音频播放器；
- 因修图片或导航而改动音频体系。

浏览器 TTS 曾导致女声和明显系统合成感，已被用户否定。

---

# 5. 当前最高优先级问题：图片

用户最近实际看到过：

- 图片只剩 ①②③，底图不显示；
- 其他 Scene 图片消失；
- 早期版本部分图片显示、部分不显示；
- 显示出来的图片曾明显模糊；
- 旧大图不显示但继续占空白；
- 多轮 hotfix 后行为反复变化。

不要把它简化为单个 CSS 或路径问题。必须同时审计：

- 实际图片文件是否完整、能否解码；
- MIME / 像素尺寸；
- GitHub Pages 路径；
- 浏览器缓存；
- 多套 DOM 注入逻辑；
- MutationObserver；
- 旧节点删除逻辑；
- 多代媒体资源残留。

---

# 6. 当前图片代码存在明确冲突

当前 `index.html` 会加载：

- `app.js`
- `site-v2.js`
- `media-final.js`

其中：

- `site-v2.js` 有一套 `MEDIA` / `mediaFigure()` / `addMedia()`；
- `media-final.js` 又有另一套 `MEDIA` / `build()` / `ensure()`；
- `media-final.js` 还会删除另一套 `.v2-media` 节点。

这意味着图片有两套运行中的渲染逻辑互相覆盖。

仓库里还留着：

- `lesson-enhancements.js`
- `lesson-teaching.js`

虽然当前未必加载，但代表历史多代补丁，容易误判。

**目标：最终只保留一个正式媒体渲染来源。**

优先建议把 media 配置放进课程 JSON，由 `app.js` 正式渲染，不再新增独立 hotfix。

---

# 7. 当前 SVG 图片是错误方案，必须废弃

以下文件是为了绕过加载问题临时做出的极简扁平 SVG：

- `hero-final.svg`
- `alarm-final.svg`
- `overslept-final.svg`
- `puffy-final.svg`

用户已经明确否定：

- 风格完全变了；
- 与原图差距巨大；
- 不接受儿童 / 扁平 / 简笔图。

这些文件不是设计参考，不要继续在它们上面优化。

---

# 8. 正确图片视觉基准

正确方向：

- cinematic anime / 电影感动漫；
- 半写实；
- 成人审美；
- 人物脸部、头发、服饰细致；
- 完整室内空间、真实景深；
- 柔和自然白昼光；
- 清爽现代；
- 蓝白、天空蓝、浅灰、清新绿色为主；
- 避免整体橙黄暖滤镜；
- 不要变成真人摄影；
- 更不要变成简笔矢量。

用户最新重新提供的视觉参考：

- 明亮现代卧室；
- 蓝白条纹睡衣年轻女性；
- 刚醒、伸懒腰 / 打哈欠；
- 窗外城市景观；
- 白色床品和蓝色软装；
- 人物和环境细节丰富；
- 画面清澈、精致。

如果 Codex 看不到聊天里的参考图，不要从 `*-final.svg` 猜风格。应优先恢复真正的高质量原图，或请用户重新提供原始高清资产。

---

# 9. 图片教学交互已经确定

用户选择“方案 2”：

## 图中

只放：①②③

## 图下

显示：

- 英文表达；
- 中文解释；
- US 点读。

Part 1 四张图：

### Hero

1. alarm / alarm clock — 闹钟
2. wake up — 醒来
3. stretch — 伸展；伸懒腰

### The Alarm Goes Off

1. go off — （闹钟）响
2. snooze button — 贪睡按钮
3. hit the snooze button — 按下贪睡按钮

### I Overslept

1. oversleep — 睡过头
2. panic — 惊慌
3. in a rush — 赶时间；匆忙

### Looking Rough in the Morning

1. puffy eyes — 浮肿的眼睛
2. dark circles — 黑眼圈
3. drowsy — 昏昏欲睡的

不是所有 6 个 Scenes 都必须有图。

---

# 10. 右侧导航：不能再遗漏

这是已存在过、当前消失的既定功能，不是新需求。

## 三种导航必须区分

### A. Chapter / Unit / Part 课程层级导航

主要由左侧 Sidebar / 移动端抽屉承担。

### B. 当前 Part 内的六模块导航

桌面端必须有**右侧浮动 Part 导航**，包含：

- Vocabulary
- Scenes
- Expressions
- Don't Mix These Up
- Useful Lines
- Practice

用于长页面快速定位。

### C. 页面顶部 / 底部按钮

当前页面右侧还有 ↑顶部 / ↓底部按钮，它们只负责滚动，不等于 Part 内模块导航。

## 桌面端要求

- 右侧常驻/浮动；
- 不遮挡正文；
- 不和 ↑↓ 按钮冲突；
- 点击准确跳到对应 section；
- 顺序与课程模块一致；
- 视觉上是辅助导航，不抢正文。

## 手机端要求

不要把六个长模块名挤成右侧浮栏。

使用紧凑“本课目录”/抽屉式入口，可以访问同样六个模块；触控区域足够大，打开关闭后尽量保持阅读位置。

详见 `06-right-side-navigation.md`。

---

# 11. 推荐技术修复顺序

1. 建立修复分支，不继续直接在 `main` 试错；
2. 审计当前 Pages 实际加载链路；
3. 找到并验证 4 张真正高清、风格正确的源图；
4. 把媒体配置放进课程 JSON；
5. 由 `app.js` 单一路径渲染；
6. 清理 `media-final.js` 和 `site-v2.js` 中重复图片逻辑；
7. 恢复右侧 Part 导航，优先复用现有 `sectionMeta` 和 section IDs；
8. 桌面/手机分别验收；
9. 新方案确认后再删除旧媒体和历史补丁。

---

# 12. 图片尺寸要求

- Hero：桌面约 520–720px；
- Scene：桌面约 420–560px；
- 手机：100% 内容宽度；
- 源图至少约 2× 实际显示像素；
- 不要用低清缩略图再由 CSS 放大。

图片不是装饰海报，正文仍然应是页面主角。

---

# 13. 验收标准

## 图片

- 4 张正确视觉风格图全部显示；
- 不再有“只有数字没有图片”；
- 不再有空白占位；
- 不模糊；
- 尺寸合适；
- ①②③ 位置合理；
- 图下表达正确；
- 手机端不溢出。

## 音频

- Vocabulary 点读继续工作；
- Scene 音频继续工作；
- Adam Stone 男声不变；
- Expressions / Useful Lines / Practice 的已实现音频不回归。

## 导航

- 左侧 Chapter / Unit / Part Sidebar 正常；
- 桌面右侧 Part 六模块浮动导航恢复；
- 六项顺序正确，跳转准确；
- 不遮挡正文或 ↑↓ 按钮；
- 手机端有紧凑的本课目录入口；
- `part-jump` / 右侧 nav / 手机目录应复用同一组 section IDs，不维护三套不一致链接。

## 页面其他功能

- Search 正常；
- Vocabulary 展开 / 收起正常；
- 六个课程模块完整；
- 无明显 console error。

---

# 14. 当前阶段不要做的事

- 不重新写课程内容；
- 不重做全站 UI；
- 不换 TTS；
- 不使用 speechSynthesis；
- 不改为女声；
- 不给所有 Scene 强行加图片；
- 不把图片重新做成扁平图；
- 不新增新的 hotfix 脚本；
- 不用顶部/底部按钮冒充右侧 Part 导航；
- 没有浏览器实测前，不要宣称“已经修好”。

---

# 15. 推荐 Codex 第一条任务指令

> Read `docs/codex-handoff/HANDOFF.md` and all files `01` through `06` in that directory. Do not modify code yet. Audit both (1) the current Part 1 image rendering pipeline and (2) the missing desktop right-side Part navigation. Identify why teaching images are missing/blank or blurred, why multiple media implementations conflict, and why the right-side six-section navigation disappeared. Propose a minimal refactor that preserves the currently working HeyGen Starfish / Adam Stone audio, all six course modules, the Chapter/Unit/Part sidebar, search, and top/bottom page controls. Treat all `*-final.svg` flat illustrations as rejected assets. The target image style is the documented high-detail bright cinematic semi-realistic anime style. The desktop right-side Part nav must contain Vocabulary, Scenes, Expressions, Don't Mix These Up, Useful Lines, and Practice; mobile should use a compact lesson-directory pattern. Before implementation, show the exact files to change and the browser test plan.

---

# 16. 交接结论

产品方向已经明确，不需要重新定义：

- 现代真实美式英语；
- Chapter → Unit → Part 数字教材；
- Adam Stone 美式男声音频；
- 高品质半写实动漫场景；
- 图片承担教学作用；
- 图内编号 + 图下表达；
- 桌面端右侧 Part 六模块导航；
- 手机端紧凑本课目录；
- 手机端可用；
- 可持续扩展。

当前最需要 Codex 做的是：

**把图片从多轮补丁造成的不稳定状态重构成一条简单、可验证、可扩展的正式媒体链路，同时恢复丢失的右侧 Part 导航，并保证音频和其他课程功能不回归。**
