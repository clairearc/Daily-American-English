# 音标和可收缩目录 · 2026-09-12

本记录补充并更新 07 的导航说明。用户已明确要求发布到现有 GitHub Pages 网站。

- 17 个词条增加 `pronunciation: {word, ipa}`，在英文和中文之间以小字号显示。词组只标注较难词。原词条顺序、正文及音频映射不变。
- 桌面（宽度至少 1100px）目录固定在右侧保留区域，默认收起。展开显示六模块、当前模块高亮；点击模块、外部区域或 Escape 收起。搜索栏也为目录让位。
- 较窄屏幕沿用顶部粘性工具栏的紧凑目录入口，避免永久占据正文宽度。
- 图片沿用 07 的四张无损 WebP 和紧凑显示，不改变人物脸部，不生成新图。

## 发音来源

2026-09-12 核对 Cambridge 的 US 栏，使用其主条目音标。以下链接按词对应；不同美式口音存在变体，不将它们判为错误。

| 词 | US IPA | 来源 |
| --- | --- | --- |
| stretch | /stretʃ/ | https://dictionary.cambridge.org/us/dictionary/english/stretch |
| pajamas | /pəˈdʒɑː.məz/ | https://dictionary.cambridge.org/us/dictionary/english/pajamas |
| oversleep | /ˌoʊ.vɚˈsliːp/ | https://dictionary.cambridge.org/us/dictionary/english/oversleep |
| crawl | /krɑːl/ | https://dictionary.cambridge.org/us/dictionary/english/crawl |
| snooze | /snuːz/ | https://dictionary.cambridge.org/pronunciation/english/snooze |
| sleepyhead | /ˈsliː.pi.hed/ | https://dictionary.cambridge.org/pronunciation/english/sleepyhead |
| drowsy | /ˈdraʊ.zi/ | https://dictionary.cambridge.org/us/dictionary/english/drowsy |
| puffy | /ˈpʌf.i/ | https://dictionary.cambridge.org/pronunciation/english/puffy |
| panic | /ˈpæn.ɪk/ | https://dictionary.cambridge.org/us/dictionary/english/panic |
| alarm | /əˈlɑːrm/ | https://dictionary.cambridge.org/us/dictionary/english/alarm |
| grumpy | /ˈɡrʌm.pi/ | https://dictionary.cambridge.org/us/dictionary/english/grumpy |
| barely | /ˈber.li/ | https://dictionary.cambridge.org/us/dictionary/english/barely |
| circle | /ˈsɝː.kəl/ | https://dictionary.cambridge.org/us/dictionary/english/circle |

`panicked /ˈpæn.ɪkt/` 和 `circles /ˈsɝː.kəlz/` 由上述词根按规则屈折推导，非直接引用独立词条音标。

## 发布前验证

- Python 媒体完整性、音频代码/数据不变、原正文不变检查通过；只允许新增媒体和音标字段。
- JavaScript 语法检查通过。
- 浏览器：1440px 下四图完整解码、17 个音标显示；滚动约 1398px 后目录仍保持视口 top=220px。
- 1100px 下展开目录与正文间隔 20px，无横向溢出；Escape 收起成功。
- 390px 下目录位于粘性工具栏，无横向溢出。

发布结果以 GitHub Pages 构建状态及正式网页实际内容为准，不能将本地通过当作发布成功。
