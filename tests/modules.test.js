import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DEFAULT_DELAY, PlaybackEngine } from '../src/core/engine.js';
import { modules, moduleMap } from '../src/modules/registry.js';

test('核心目录注册 14 个唯一模块', () => {
  assert.equal(modules.length, 14);
  assert.equal(moduleMap.size, 14);
  assert.ok(modules.every(module=>module.status==='complete'));
  assert.deepEqual(modules.map(m => m.id), [
    'bubble-sort','selection-sort','insertion-sort','merge-sort','quick-sort',
    'linear-search','binary-search','stack','queue','singly-linked-list',
    'binary-search-tree','heap','graph-bfs','graph-dfs'
  ]);
});

test('实验室入口在新标签页打开并隔离 opener',()=>{
  const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const appSource=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
  assert.match(index,/href="#\/lab\/bubble-sort" target="_blank" rel="noopener"/);
  assert.match(appSource,/href="#\/lab\/\$\{m\.id\}" target="_blank" rel="noopener"/);
  assert.doesNotMatch(appSource,/class="back-link"[^>]+target="_blank"/);
});

test('共用顶部栏提供可访问的联系邮箱',()=>{
  const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  assert.match(index,/class="contact-email" href="mailto:15811131141@163\.com"/);
  assert.match(index,/联系方式：15811131141@163\.com/);
  assert.match(index,/aria-label="联系方式：发送邮件至 15811131141@163\.com"/);
});

test('所有模块包含总览、教学和交互所需元数据',()=>{
  for(const m of modules){
    for(const key of ['id','title','category','categoryLabel','renderer','difficulty','minutes','description','objective','defaultInput','inputLabel','complexity','file']) assert.ok(m[key],`${m.id}.${key}`);
    assert.ok(Array.isArray(m.code)&&m.code.length>1);
    assert.equal(m.quiz.options.length,3);
    assert.ok(Number.isInteger(m.quiz.answer));
  }
});

for (const module of modules) {
  test(`${module.id}: 默认输入生成有效可回放步骤`, () => {
    const input = module.parseInput(module.defaultInput);
    const steps = module.run(input);
    assert.ok(steps.length >= 2);
    assert.deepEqual(steps.map(s => s.id), steps.map((_, i) => i));
    assert.equal(steps[0].type, 'ready');
    assert.equal(steps.at(-1).type, 'done');
    assert.equal(steps.at(-1).done, true);
    for (const step of steps) {
      assert.ok(step.line >= 1 && step.line <= module.code.length, `invalid line ${step.line}`);
      assert.ok(step.title && step.text);
      assert.ok(['array','linear','tree','graph'].includes(step.view.kind));
      assert.doesNotThrow(() => structuredClone(step));
    }
  });
}

for (const id of ['bubble-sort','selection-sort','insertion-sort','merge-sort','quick-sort']) {
  test(`${id}: 正确处理逆序和重复值`, () => {
    const module = moduleMap.get(id);
    const steps = module.run(module.parseInput('9, 3, 9, 1, 5, 1'));
    assert.deepEqual(steps.at(-1).view.values, [1,1,3,5,9,9]);
  });
}

test('五种排序与参考实现进行随机对照',()=>{
  const ids=['bubble-sort','selection-sort','insertion-sort','merge-sort','quick-sort'];
  for(let round=0;round<20;round++){
    const input=Array.from({length:3+round%6},(_,i)=>(round*7+i*11)%23+1);
    const expected=[...input].sort((a,b)=>a-b);
    for(const id of ids) assert.deepEqual(moduleMap.get(id).run(input).at(-1).view.values,expected,`${id} round ${round}`);
  }
});

test('线性查找返回存在与不存在结果', () => {
  const m=moduleMap.get('linear-search');
  assert.equal(m.run(m.parseInput('4, 2, 8 | 2')).at(-1).metrics.result,1);
  assert.equal(m.run(m.parseInput('4, 2, 8 | 9')).at(-1).metrics.result,-1);
});

test('二分查找返回存在与不存在结果并拒绝无序数组', () => {
  const m=moduleMap.get('binary-search');
  assert.equal(m.run(m.parseInput('2, 4, 6, 8 | 6')).at(-1).metrics.result,2);
  assert.equal(m.run(m.parseInput('2, 4, 6, 8 | 7')).at(-1).metrics.result,-1);
  assert.throws(()=>m.parseInput('4, 2, 8 | 2'));
});

test('数值模块拒绝空值、小数、超范围和过长输入', () => {
  const m=moduleMap.get('bubble-sort');
  for(const raw of ['', '1, 2', '1, 2.5, 3', '0, 2, 3', '1,2,3,4,5,6,7,8,9']) assert.throws(()=>m.parseInput(raw));
});

test('图模块拒绝未知起点', () => {
  assert.throws(()=>moduleMap.get('graph-bfs').parseInput('Z'));
  assert.throws(()=>moduleMap.get('graph-dfs').parseInput(''));
});

test('所有模块运行时不修改解析后的输入',()=>{
  for(const m of modules){const input=m.parseInput(m.defaultInput),before=structuredClone(input);m.run(input);assert.deepEqual(input,before,m.id);}
});

test('二叉搜索树最终结构保持左小右大',()=>{
  const final=moduleMap.get('binary-search-tree').run([8,4,12,2,6,10,14]).at(-1).view;
  const values=new Map(final.nodes.map(n=>[n.id,Number(n.label)]));
  for(const [parent,child] of final.edges){
    const p=values.get(parent),c=values.get(child);
    assert.ok(c<p||c>p);
  }
  assert.equal(final.nodes.length,7);
});

test('最大堆最终满足父节点不小于孩子',()=>{
  const final=moduleMap.get('heap').run([4,9,3,7,8,2,11,5]).at(-1).view;
  const values=final.nodes.map(n=>Number(n.label));
  for(let i=1;i<values.length;i++)assert.ok(values[Math.floor((i-1)/2)]>=values[i]);
});

test('BFS 和 DFS 从任意起点覆盖全部节点且不重复',()=>{
  for(const id of ['graph-bfs','graph-dfs'])for(const start of ['A','B','C','D','E','F']){
    const completed=moduleMap.get(id).run(start).at(-1).view.completed;
    assert.equal(completed.length,6,`${id}:${start}`);
    assert.equal(new Set(completed).size,6,`${id}:${start}`);
  }
});

test('播放器前进、回退、重置保持确定状态', () => {
  const steps=moduleMap.get('bubble-sort').run([3,2,1]);
  const engine=new PlaybackEngine();engine.load(steps);
  assert.equal(engine.delay,DEFAULT_DELAY);
  const first=structuredClone(engine.current);engine.move(1);assert.equal(engine.cursor,1);
  engine.move(-1);assert.deepEqual(engine.current,first);
  engine.move(2);engine.reset();assert.deepEqual(engine.current,first);
  engine.stop();
});

test('播放器自动运行到末尾并清理定时器', async()=>{
  const steps=moduleMap.get('linear-search').run({values:[1,2,3],target:3});
  const engine=new PlaybackEngine();engine.load(steps);engine.setDelay(5);engine.play();
  await new Promise(resolve=>setTimeout(resolve,steps.length*8+20));
  assert.equal(engine.cursor,steps.length-1);
  assert.equal(engine.timer,null);
});
