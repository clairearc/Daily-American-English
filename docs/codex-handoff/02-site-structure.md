# 02 · 网页安排

> 状态说明（2026-09-12）：本文保留修复前的需求与问题快照。图片与目录已修复上线，另增加音标和词汇一键展开。当前实现、剩余限制和发布证据见 [HANDOFF](HANDOFF.md) 及 07–09；不要把下文历史故障当作尚未解决的现状。

本文档描述当前网站的信息架构、页面模块、文件关系和应保留的页面行为。

---

## 1. 当前页面入口

- `index.html`：站点壳层；
- `styles.css`：主样式；
- `app.js`：课程加载、导航、搜索、Vocabulary 交互与基础渲染；
- `site-v2.css`：当前增强样式；
- `site-v2.js`：当前增强交互与 Adam Stone 音频逻辑；
- `media-final.js`：当前图片补丁逻辑，**属于失败尝试，后续应重构或删除**。

当前 `index.html` 会加载：

1. `styles.css`
2. `site-v2.css`
3. `app.js`
4. `site-v2.js`
5. `media-final.js`

这意味着当前图片功能存在“基础渲染 + 增强脚本 + 图片补丁脚本”的叠加风险。

---

## 2. 当前课程数据结构

### `curriculum/index.json`

目前只正式暴露：

- Chapter 1 · Daily Life — 生活的样貌
  - Unit 1 · In the Morning — 早晨
    - Part 1 · Waking Up & Being Late — 起床和迟到

Part 1 指向：

- `curriculum/chapter-1/unit-1/part-1.json`
- `curriculum/chapter-1/unit-1/part-1-audio.json`

---

## 3. Part 页面布局顺序

`app.js` 当前按以下顺序渲染一个 Part：

### Part Header

- Breadcrumb：Chapter / Unit；
- Part 标题；
- 中文标题；
- Intro；
- Learning Objectives。

### Part Jump Navigation

快速跳转：

- Vocabulary
- Scenes
- Expressions
- Don't Mix These Up
- Useful Lines
- Practice

### 正文模块

固定顺序：

1. `#vocabulary`
2. `#scenes`
3. `#expressions`
4. `#comparisons`
5. `#useful-lines`
6. `#practice`

这个顺序应保留。

---

## 4. Vocabulary 模块

当前行为：

- 卡片式布局；
- 每个词显示英文和中文；
- 点击词条展开 / 收起 note 和 example；
- 如果 `part-1-audio.json` 中有对应 segment，则显示点读按钮；
- 播放时使用一个长音频条 + 时间戳切片，而不是每个词一个独立文件。

当前 Vocabulary 音频元数据：

- voice：Adam Stone；
- locale：en-US；
- 一个 `audioUrl`；
- `segments[]` 与词条顺序一一对应。

这个方案已工作，不应为了修图片而改动。

---

## 5. Scenes 模块

每个 Scene 当前包含：

- Scene 编号；
- 英文标题；
- 中文场景说明；
- 对话音频；
- 双语对话。

Part 1 当前有 6 个 Scene：

1. The Alarm Goes Off
2. Someone Is Trying to Wake You Up
3. Sleeping In on the Weekend
4. I Overslept
5. Looking Rough in the Morning
6. I'm Not a Morning Person

当前只有其中 3 个 Scene 计划配教学图：

- The Alarm Goes Off
- I Overslept
- Looking Rough in the Morning

另外 Part Header 有 1 张主图。

即：**不是每个 Scene 都必须有图。**

---

## 6. Expressions 模块

用于收纳：

- 高频表达；
- 更自然的说法；
- 同一意思的口语替换；
- 具有现实语用价值的短语。

增强目标：

- 表达本身可以点读；
- 中文解释清晰；
- 不要和 Vocabulary 简单重复堆砌。

---

## 7. Don't Mix These Up 模块

只用于真正需要辨析的项目，例如：

- wake up vs get up
- sleep in vs oversleep
- sleepy vs drowsy
- in a rush vs hurry up

不要把普通词性变化或非常简单的关系强塞进该模块。

---

## 8. Useful Lines 模块

目标：高频、可直接说出口的短句。

最终需要：

- 每句英文；
- 中文；
- 单句点读；
- 整组 Play All。

当前音频增强逻辑已经由 `site-v2.js` 处理，用户反馈音频已经恢复正常。

---

## 9. Practice 模块

主要两种形式：

### Mini role-play / output prompt

- 英文情境；
- 中文说明；
- 目标表达；
- 学习者输出 3–5 句。

### Rewrite

- 原句；
- 更自然版本；
- 中文解释。

最终目标还包括题目音频和参考答案音频，但当前最优先问题不是这里。

---

## 10. 图片在页面中的正确位置

### Part 主图

位置：Part Header 中，Intro 之后、Objectives 前后均可，但建议在 Objectives 前，保持导入作用。

内容：

- 1 张场景图；
- 图片内部 ①②③；
- 图片下方“看图学表达”3 项。

### Scene 教学图

位置：

- Scene 标题之后；
- 对话音频 / dialogue 之前。

每张图：

- 图片内部 ①②③；
- 下方 3 个对应表达；
- 每个表达英文 + 中文；
- 能复用 Vocabulary 音频时可直接点读。

---

## 11. 图片尺寸原则

用户已明确：此前图片过大。

建议：

- 桌面端 Part hero：约 520–720px 宽，根据页面主栏宽度自适应；
- Scene 图：约 420–560px 宽；
- 手机端：100% 宽，但不超过内容容器；
- 不要用低分辨率资源拉伸；
- 不要为了“清晰”无限放大图片。

最终应根据实际原始图片分辨率和页面容器做 `srcset` / `sizes` 或至少使用足够大的源图。

---

## 12. 当前仓库中的图片资源状态

`assets/chapter-1/unit-1/part-1/` 下现在混杂了多代尝试：

- `hero.webp`
- `hero-v3.webp`
- `hero-hq.svg`
- `hero-final.svg`
- `scene-alarm-snooze.webp`
- `scene-alarm-snooze-v3.webp`
- `scene-alarm-snooze-hq.svg`
- `alarm-final.svg`
- `scene-overslept.webp`
- `scene-overslept-v3.webp`
- `overslept-final.svg`
- `scene-puffy-eyes.webp`
- `scene-puffy-eyes-v3.webp`
- `puffy-final.svg`

其中：

- `*-final.svg` 是为了绕过加载故障临时生成的极简扁平图，**用户明确否定，必须废弃**；
- 多个 WebP 文件出现过不显示、模糊、只剩编号等问题；
- 不应继续在这些文件之间做“猜路径式切换”。

Codex 应先确定一组真正有效的高质量源图，再把页面只绑定到这一组。

---

## 13. 推荐的重构方向

图片不应继续靠多个独立“增强脚本”在 DOM 加载后反复注入。

更稳妥的方向：

- 把图片元数据正式加入 Part JSON；或
- 在 `app.js` 的 `renderPart` / `renderScenes` 中作为正式渲染逻辑；
- 只保留一个图片渲染来源；
- 删除旧的图片补丁逻辑。

这样未来每个 Part 只需在 JSON 里配置图片和标注，不需要再增加一个新的 JS 补丁文件。
