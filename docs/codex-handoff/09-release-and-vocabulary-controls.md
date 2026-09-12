# 发布记录与词汇一键展开 · 2026-09-12

## 已上线功能版本

| 提交 | 功能 | Pages 工作流 |
| --- | --- | --- |
| `76a35fa` | 统一图片渲染、接入四张无损场景图、恢复目录 | 随下一提交一同上线 |
| `d7bc2e1` | 17 个词条美式音标、可收缩固定目录 | [34660914583](https://github.com/clairearc/Daily-American-English/actions/runs/34660914583)，success |
| `f2b9502` | 词汇全部展开 / 全部收起 | [34661169123](https://github.com/clairearc/Daily-American-English/actions/runs/34661169123)，success |

以上结果在对应发布时通过 GitHub API 和正式网站浏览器实测确认。当前入口版本标记：`20260912-expand1`。后续修改需重新核对，不把历史验收当作永久保证。

## 词汇按钮约定

- 位置：Vocabulary / 词汇总表标题旁，与条目数量并列。
- 当前 41 个词条初始全部折叠；按钮初始显示“全部展开”。
- 点击展开所有词条，按钮变为“全部收起”；再次点击全部收起。
- 单条仍可独立切换。只有全部词条均展开时按钮才显示“全部收起”；部分展开时显示“全部展开”。
- 操作范围为当前 Part 的全部词条，包括被搜索暂时隐藏的条目；不清空搜索，不改变匹配结果。
- 状态不写入本地存储，重新加载/重新打开 Part 后恢复默认折叠。
- 按钮使用原生 button、`aria-expanded` 和指向全部词条详情的 `aria-controls`；单条按钮的状态同步更新。
- 原音频按钮和点读映射不变。

实现位于 `app.js` 的 `section()`、`attachVocabInteractions()`，样式为 `styles.css` 的 `.section-actions`、`.vocab-toggle-all`。无需新增脚本或第二套词汇渲染。

## 验证记录

- 语法检查与 diff 空白检查通过。
- 本地：展开数量 0 → 41；单独收起一项后为 40，按钮同步恢复“全部展开”；再次全展开、全收起后为 0。
- 本地 390px 宽度无横向溢出。
- 正式网站：新版脚本 `20260912-expand1` 已加载，按钮可见；全展开 41 项、全收起 0 项。
- 前一版上线时已验证：四张图 naturalWidth 分别为 1672、1448、1448、1448；17 个 IPA 可见；目录默认收起且 CSS 为 fixed，跳转成功；未记录到控制台 error。

## 发布位置

正式网址：https://clairearc.github.io/Daily-American-English/

Pages 来源为 `main` 分支、根目录。仓库本地路径：`G:\vibe coding\日常英语\Daily-American-English`。`http://127.0.0.1:31877/` 仅为临时本地预览，不是交付地址。
