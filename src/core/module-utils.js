export function parseNumbers(raw, { min = 3, max = 8, sorted = false } = {}) {
  const values = String(raw).split(/[,，\s]+/).filter(Boolean).map(Number);
  if (values.length < min || values.length > max || values.some(v => !Number.isInteger(v) || v < 1 || v > 99)) {
    throw new Error(`请输入 ${min}-${max} 个 1-99 的整数，用逗号分隔`);
  }
  if (sorted && values.some((v, i) => i && values[i - 1] > v)) throw new Error('二分查找要求数组按升序排列');
  return values;
}

export function parseSearch(raw, sorted = false) {
  const [list, target] = String(raw).split('|').map(v => v?.trim());
  if (!list || !target || !/^-?\d+$/.test(target)) throw new Error('格式应为：数组 | 目标值');
  return { values: parseNumbers(list, { sorted }), target: Number(target) };
}

export function snapshotFactory(initialView) {
  const steps = [];
  return {
    steps,
    emit(type, line, title, text, view, variables = {}, metrics = {}) {
      steps.push({ id: steps.length, type, line, title, text, view: structuredClone(view), variables: { ...variables }, metrics: { ...metrics }, done: type === 'done' });
    },
    ready(text = '点击播放或单步执行，观察算法状态变化。') {
      this.emit('ready', 1, '准备开始', text, initialView);
    }
  };
}

export const arrayView = (values, extra = {}) => ({ kind: 'array', values: [...values], active: [], completed: [], excluded: [], ...extra });
export const linearView = (values, mode, extra = {}) => ({ kind: 'linear', values: [...values], mode, active: [], ...extra });

export function moduleMeta(config) {
  return { difficulty: '入门', minutes: 6, status: 'complete', ...config };
}
