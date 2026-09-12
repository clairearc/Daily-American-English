# 05 · 存在的问题

> 状态说明（2026-09-12）：本文保留修复前的需求与问题快照。图片与目录已修复上线，另增加音标和词汇一键展开。当前实现、剩余限制和发布证据见 [HANDOFF](HANDOFF.md) 及 07–09；不要把下文历史故障当作尚未解决的现状。

本文档记录当前项目已知问题。重点是让 Codex 明确：哪些问题是真实存在的、哪些已经解决、哪些方案已经被用户否定。

---

## 1. 当前最高优先级：图片系统不稳定

用户最近实际看到的问题包括：

- 第一张图只显示编号，没有底图；
- 一度只有第一张图位置，其他 Scene 图消失；
- 更早版本出现第二、第四张能显示，但第一、第三张不显示；
- 有些版本图片明显模糊；
- 旧大图不显示但继续占据空白位置；
- 多次修复后页面行为不一致。

这说明问题不只是“单个图片路径写错”，而是资源质量、格式/编码、缓存、多代脚本注入、DOM 清理和旧资源残留共同造成的。

---

## 2. 当前视觉错误：极简 SVG 已被用户明确拒绝

当前仓库新增过：

- `hero-final.svg`
- `alarm-final.svg`
- `overslept-final.svg`
- `puffy-final.svg`

这些图采用极简扁平矢量风格。

用户明确表示它们与原来的目标视觉相差巨大，并再次提供了原始风格参考：精致、明亮、半写实动漫 / cinematic anime、人物和卧室环境都有细节。

因此这些 SVG 不是“可接受但需优化”的版本，而是错误方向，应废弃。

---

## 3. 图片资源目录已混入多代失败文件

`assets/chapter-1/unit-1/part-1/` 中存在旧 `.webp`、`-v3.webp`、`-hq.svg`、`-final.svg` 等多代资源。

风险：

- 容易引用错版本；
- 缓存难判断；
- 调试时不清楚真正源图；
- 后续维护者容易把失败资产当正式资产。

需要在新方案验证后做一次有计划的清理。

---

## 4. 图片代码职责分散且互相覆盖

仓库中存在：

- `lesson-enhancements.js`
- `lesson-teaching.js`
- `site-v2.js`
- `media-final.js`

当前 `index.html` 实际加载：

- `app.js`
- `site-v2.js`
- `media-final.js`

而：

- `site-v2.js` 有一套 `MEDIA` / `mediaFigure()` / `addMedia()`；
- `media-final.js` 又有另一套 `MEDIA` / `build()` / `ensure()`；
- `media-final.js` 会删除另一套 `.v2-media` 节点。

这是明显的重复职责和冲突来源。

---

## 5. 图片没有正式进入课程数据模型

目前图片主要靠 Part title / Scene title 字符串匹配和 JS 内部 `MEDIA` map。

问题：

- 未来每个 Part 都要改 JS；
- 标题变化会导致媒体失配；
- 内容数据和媒体数据分离；
- 不利于自动化生成更多课程。

建议把 media 配置正式加入 Part JSON。

---

## 6. 图片清晰度问题曾真实存在

用户反馈：

- 最初显示出的图片非常模糊；
- 后续版本虽然稍好，仍明显不够清晰。

历史资源中有些 WebP 文件体积很小，与较大网页展示尺寸不匹配。

后续必须以实际像素、浏览器 `naturalWidth` / `naturalHeight`、直接 URL 和肉眼效果共同验收。

---

## 7. 当前音频状态：已解决，不属于当前故障

历史上音频经历过：

1. HeyGen / Adam Stone；
2. 临时改浏览器 speechSynthesis；
3. 用户反馈变成女声、AI 痕迹更重；
4. 已恢复 HeyGen Starfish / Adam Stone 男声。

用户最近明确说：**“音频问题解决了。”**

因此当前图片和导航修复不得再次改音频体系。

---

## 8. 新确认的回归：桌面端右侧 Part 导航消失

用户最新检查发现：

**网站右侧用于当前 Part 六个模块跳转的浮动导航没有了。**

这是既定功能回归，不是新需求。

它应该覆盖：

- Vocabulary
- Scenes
- Expressions
- Don't Mix These Up
- Useful Lines
- Practice

必须注意：

- 这不是左侧 Chapter / Unit / Part Sidebar；
- 也不是页面右缘的 ↑顶部 / ↓底部按钮；
- 三者职责不同。

可能原因需要 Codex 审计：

- 历史 `lesson-enhancements.js` 中 floating Part nav 未迁移；
- `index.html` 已停止加载相关脚本 / CSS；
- `site-v2.js` 没有接管该功能；
- 样式存在但 DOM 生成逻辑丢失；
- 图片修复期间入口脚本整理造成回归。

详见 `06-right-side-navigation.md`。

---

## 9. README 已过时

README 仍描述旧的 `lessons/YYYY-MM-DD.json` 日更结构，而正式网站已经转向：

- `curriculum/index.json`
- Chapter → Unit → Part

README 后续应更新，但不是当前 P0。

---

## 10. 仓库仍保留旧 daily lessons 数据

`lessons/` 下仍有历史日更文件。

需要明确：

- 当前主课程导航来自 `curriculum/`；
- 不要误把 `lessons/` 当成当前主数据源。

---

## 11. 当前线上状态不能只靠代码推断

此前多次出现：

- 仓库代码看似正确；
- GitHub Pages 实际显示却不同。

因此 Codex 修复后必须做实际浏览器验证，包括：

- Network；
- Console；
- 图片直接 URL；
- 页面截图；
- 手机 viewport；
- 右侧导航实际可见性与跳转行为。

不能以“commit 成功”代替产品验收。

---

## 12. 视觉基准曾在长对话中被错误遗失

较早已经确定高质量半写实动漫 / 电影感场景，但后续为解决技术问题错误改成扁平 SVG。

因此后续应：

- 把视觉规范写入仓库；
- 不再依赖聊天上下文记忆；
- Codex 开始工作前先读本交接目录。

---

## 13. 当前不建议同时做的事情

在图片和右侧导航恢复正常前，不要同时：

- 重做页面整体视觉；
- 改课程文案；
- 换 TTS；
- 改 Chapter / Unit / Part 架构；
- 清空历史文件；
- 批量扩展 Chapter 2+。

先把 Part 1 作为稳定模板修好，再扩展。
