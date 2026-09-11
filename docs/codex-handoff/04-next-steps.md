# 04 · 下一步要做的事

本文档给 Codex 一个明确的执行顺序。当前第一优先级只有一个：**修复 Part 1 图片系统，同时保持已经正常的音频与课程结构不变。**

---

## P0 · 先停止继续叠补丁

接手后第一件事不是继续写新 hotfix，而是审计当前图片链路。

必须确认：

- `index.html` 当前实际加载哪些脚本；
- `site-v2.js` 中哪些逻辑负责图片；
- `media-final.js` 中哪些逻辑负责图片；
- 哪些旧文件已不加载但仍留在仓库；
- 页面上重复图片节点 / 空白节点来自哪里。

目标：最终只保留**一个正式图片渲染入口**。

---

## P1 · 撤销错误视觉资源

以下文件代表已被用户否定的扁平 SVG 方案，不应继续作为正式图片：

- `assets/chapter-1/unit-1/part-1/hero-final.svg`
- `assets/chapter-1/unit-1/part-1/alarm-final.svg`
- `assets/chapter-1/unit-1/part-1/overslept-final.svg`
- `assets/chapter-1/unit-1/part-1/puffy-final.svg`

`media-final.js` 目前直接引用这些文件，因此应被替换或移除。

不要基于这些 SVG 继续改色、加细节或“优化”，因为问题不是局部样式，而是整体视觉方向错误。

---

## P2 · 确定 4 张正确的最终源图

需要 4 张符合已确认视觉基准的高清图：

1. Part hero：清晨卧室、人物刚醒 / stretch、床边闹钟；
2. The Alarm Goes Off：人物还躺床上，伸手按 snooze；
3. I Overslept：突然发现睡过头，慌张、赶时间；
4. Looking Rough in the Morning：镜前观察 puffy eyes / dark circles / drowsy。

### 视觉要求

- 电影感动漫 / 半写实动漫；
- 成人审美；
- 人物和环境细节完整；
- 清爽白昼；
- 蓝白、浅灰、天空蓝、清新绿色为主；
- 避免儿童扁平插画；
- 避免整体橙黄暖滤镜；
- 不要变成纯摄影风。

### 技术要求

每张源图在正式接入前必须验证：

- 文件可直接打开；
- 浏览器可解码；
- MIME 正确；
- 分辨率足够；
- 不是缩略图；
- 不是截断文件；
- GitHub Pages 最终 URL 可访问。

建议源图宽度至少 1200px；已有高质量 1536px 级图则直接使用。

---

## P3 · 把图片配置正式数据化

推荐方案：把媒体字段加入 `part-1.json`，而不是由独立脚本按标题硬编码匹配。

建议结构：

```json
{
  "heroMedia": {
    "src": "assets/.../hero.jpg",
    "alt": "...",
    "markers": [
      {"n":1,"x":20,"y":70,"term":"alarm / alarm clock","zh":"闹钟"}
    ]
  }
}
```

Scene：

```json
{
  "title": "The Alarm Goes Off",
  "media": {
    "src": "assets/.../alarm.jpg",
    "alt": "...",
    "markers": [ ... ]
  }
}
```

然后由 `app.js` 的正式 render 函数输出。

这样未来其他 Part 可以直接复用。

---

## P4 · 只保留一套媒体 DOM 结构

建议正式结构：

```html
<figure class="teaching-media">
  <div class="teaching-media__image-wrap">
    <img ...>
    <button/marker>1</button/marker>
    ...
  </div>
  <figcaption class="teaching-media__legend">
    ...
  </figcaption>
</figure>
```

要求：

- 编号只在图片成功加载后出现；
- 图片失败时，不应留下空白大框；
- 不应由多个 MutationObserver 反复删 / 插节点；
- 不应同时保留 `.v2-media`、`.teaching-visual`、`.part-hero-media` 等多代体系。

---

## P5 · 保留已确认的“方案 2”教学交互

用户已经选定：

**图内编号 + 图下表达**。

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

图下表达如果能复用 Vocabulary 点读按钮，应复用同一个 Adam Stone 音频体系。

---

## P6 · 图片尺寸与清晰度

不要把图片重新做得很大。

目标：

- Part hero：桌面约 520–720px；
- Scene 图：桌面约 420–560px；
- 手机：宽度 100%，不超过内容容器；
- 使用足够高分辨率源图，不靠 CSS 放大低清缩略图。

如果使用响应式图片，优先：

- `srcset`
- `sizes`
- `width` / `height` 属性避免布局跳动。

---

## P7 · 不要动当前音频

这是硬约束。

用户刚刚明确反馈：**音频问题已经解决。**

因此修图任务中：

- 不更换声音；
- 不切回 speechSynthesis；
- 不修改 Adam Stone；
- 不调整现有 HeyGen URL，除非确认其失效；
- 不重构 Audio 代码，除非图片修复完成后另开任务。

---

## P8 · 清理历史失败文件

在新图片方案完全验证后，再清理：

- 已废弃 SVG；
- 无效 / 重复 WebP；
- 不再加载的图片补丁脚本；
- 旧增强脚本中已被正式渲染替代的图片代码。

注意：先验证新实现，再删除旧资源，避免无回滚路径。

---

## P9 · 测试清单

### 桌面 Chrome

- 4 张正确风格图片都出现；
- 没有只有数字没有图；
- 没有空白大框；
- 图片清晰；
- 图片尺寸不过大；
- ①②③ 不遮挡关键脸部 / 物体；
- 图下表达正确；
- 音频仍是 Adam Stone 男声。

### 手机宽度

至少测试：

- 390px；
- 430px。

检查：

- 图片不横向溢出；
- 编号不挤在一起；
- 图下注释不拥挤；
- 英文 / 中文可读；
- 音频按钮可点击。

### 回归测试

- Vocabulary 展开 / 收起正常；
- Vocabulary 点读正常；
- Scene 对话音频正常；
- 搜索正常；
- Jump navigation 正常；
- Sidebar 正常；
- Expressions / Comparisons / Useful Lines / Practice 未被破坏。

---

## P10 · 合并前要求

在提交最终修复前：

1. 本地 / Preview 实际打开页面；
2. 截图核对 4 张图；
3. 浏览器 Network 确认 4 个图片请求 200；
4. 确认图片 naturalWidth 符合预期；
5. 确认没有 console image decode error；
6. 确认 Adam Stone 音频仍工作；
7. 再提交 / 合并。

不要仅根据“代码看起来正确”宣布修复完成。
