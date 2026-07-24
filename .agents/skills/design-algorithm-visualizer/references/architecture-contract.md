# 架构契约

## 分层

| 层 | 责任 | 禁止事项 |
| --- | --- | --- |
| Module | 校验输入、执行算法、生成步骤、提供代码和解释 | 操作 DOM、管理定时器 |
| Engine | 建立快照、控制游标、播放、暂停、前进、回退、重置 | 理解具体算法含义 |
| Renderer | 根据当前快照绘制数组、节点、边、指针和高亮 | 修改算法状态 |
| Shell | 模块选择、课程导航、主题、响应式页面布局 | 嵌入算法分支 |

## 建议接口

```js
const module = {
  id: 'bubble-sort',
  title: '冒泡排序',
  category: 'sorting',
  code: [{ line: 1, html: '...' }],
  parseInput(raw) {},
  run(input, emit) {},
  initialState(input) {},
  reduce(state, step) {},
  explain(step, state) {},
  metrics(state) {}
};
```

通用步骤至少包含：

```js
{
  id: 12,
  type: 'compare',
  line: 5,
  payload: { left: 1, right: 2 },
  narrationKey: 'compare-adjacent'
}
```

算法特有数据放在 `payload`。不要让通用引擎出现 `if (module.id === ...)`。

## 状态与快照

- `reduce` 对相同输入和步骤必须得到相同结果。
- 优先预计算快照；数据规模增大后才考虑检查点加重放。
- 状态包含渲染所需内容、代码行、变量、统计和完成标记。
- 动画属于前后快照之间的视觉过渡，不属于算法状态。

## 目录目标

```text
src/
  core/          engine, step types, registry
  modules/       bubble-sort, selection-sort, linked-list...
  renderers/     array, nodes, graph
  ui/            shell and shared controls
```

当前为无构建工具 Demo。增加第二个模块时再迁移到此结构；不要只为目录好看而拆文件。

## 架构决策

- 默认保留原生 Web 技术，直到状态组合与组件复用确实需要框架。
- 若迁移 React/Vue，先说明收益、迁移成本和现有行为回归范围。
- 不引入后端，除非需求涉及账户、持久化、分享或真实代码执行。
