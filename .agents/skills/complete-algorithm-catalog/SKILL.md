---
name: complete-algorithm-catalog
description: 编排 Java 算法可视化教学工具的完整算法目录交付，按照固定清单逐个完成架构接入、算法实现、教学交互、自主验收和回归测试，直到所有目标模块及统一总览通过。用户要求连续开发全部算法、完成算法清单、逐项自验、不要中途停止或汇报整体完成度时使用。
---

# 完成算法目录

读取 [references/core-catalog.md](references/core-catalog.md) 获取范围和依赖顺序，读取 [references/delivery-gates.md](references/delivery-gates.md) 获取逐模块与最终门槛。

## 执行循环

1. 检查模块注册表、测试结果和工作区，确定第一个未通过模块。
2. 第一次扩展现有 Demo 时，先使用 `$design-algorithm-visualizer` 建立注册表、路由、通用播放器和总览入口，并让冒泡排序通过回归。
3. 使用 `$develop-algorithm-module` 实现当前模块的算法、Java 代码、步骤、解释、统计和注册信息。
4. 使用 `$design-learning-interaction` 完成当前模块适用的数组、节点、树或图交互。
5. 使用 `$verify-algorithm-visualizer` 执行当前模块验收和共享功能回归。
6. 仅在全部逐模块门槛通过后，将模块注册表状态设为 `complete`；保存验证证据。
7. 验收失败时留在当前模块，定位、修复并重新执行全部相关门槛，不得跳过或降低标准。
8. 继续下一个依赖已满足的模块，直到清单无未完成项。
9. 执行最终全量验收；只有总览、全部模块、目标视口和共享状态机均通过后才能报告完成。

## 状态规则

使用注册表作为进度的唯一事实来源：

```js
{
  id: 'selection-sort',
  status: 'planned' // planned | implementing | blocked | complete
}
```

- `planned`：尚未开始。
- `implementing`：存在实现，但尚未通过全部门槛。
- `blocked`：连续确认同一外部阻塞，且无法在项目内解决。
- `complete`：实现、模块验收和回归均已通过。

不得用页面能打开、人工观感良好或部分测试通过代替 `complete`。

## 自主执行原则

- 在范围内自行选择下一个模块、修复失败和补充测试，不要求用户逐项确认。
- 遇到会改变产品边界、引入后端、解析任意 Java、付费服务或大规模框架迁移时暂停并请求决策。
- 不为赶进度复制播放器、伪造指标、跳过边界输入或隐藏失败模块。
- 保留冒泡排序作为全程回归基线。

## 完成输出

报告已完成模块数量、全量测试结果、验证视口、未覆盖风险和本地体验地址。清单未清零时不得使用“全部完成”。
