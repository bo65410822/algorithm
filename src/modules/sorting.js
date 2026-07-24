import { arrayView, moduleMeta, parseNumbers, snapshotFactory } from '../core/module-utils.js';

const common = { category: 'sorting', categoryLabel: '排序', renderer: 'array', inputLabel: '实验数组', quiz: { question: '算法中被标记为已完成的区域具有什么性质？', options: ['仍需要参与全部比较', '位置或相对顺序已经确定', '其中元素都相等'], answer: 1 } };

export const bubbleSort = moduleMeta({ ...common, id: 'bubble-sort', title: '冒泡排序', file: 'BubbleSort.java', description: '相邻比较，让最大值逐轮移动到末端', objective: '理解每轮如何确定一个最大值', defaultInput: '7, 3, 9, 4, 2, 6', complexity: 'O(n²)', code: [
  'static void bubbleSort(int[] a) {','  for (int end = a.length - 1; end > 0; end--) {','    for (int i = 0; i < end; i++) {','      if (a[i] > a[i + 1]) {','        int temp = a[i];','        a[i] = a[i + 1];','        a[i + 1] = temp;','      }','    }','  }','}'
], parseInput: parseNumbers, run(input) {
  const a = [...input], s = snapshotFactory(arrayView(a)); let comparisons = 0, swaps = 0; s.ready();
  for (let end = a.length - 1; end > 0; end--) {
    let changed = false;
    for (let i = 0; i < end; i++) {
      comparisons++; s.emit('compare', 4, '比较相邻元素', `比较 ${a[i]} 和 ${a[i + 1]}，较大值应向右移动。`, arrayView(a,{active:[i,i+1],completed:Array.from({length:a.length-1-end},(_,k)=>end+1+k)}),{i,end},{comparisons,swaps});
      if (a[i] > a[i+1]) { const l=a[i],r=a[i+1]; [a[i],a[i+1]]=[r,l]; swaps++; changed=true; s.emit('swap',7,'交换元素',`${l} 大于 ${r}，交换后 ${l} 向右移动一格。`,arrayView(a,{active:[i,i+1],completed:Array.from({length:a.length-1-end},(_,k)=>end+1+k)}),{i,end},{comparisons,swaps}); }
    }
    s.emit('mark',9,'本轮完成',`${a[end]} 是当前未排序区最大值，下标 ${end} 已就位。`,arrayView(a,{completed:Array.from({length:a.length-end},(_,k)=>end+k)}),{end},{comparisons,swaps});
    if (!changed) break;
  }
  s.emit('done',11,'排序完成',`数组已升序排列，共比较 ${comparisons} 次、交换 ${swaps} 次。`,arrayView(a,{completed:a.map((_,i)=>i)}),{}, {comparisons,swaps}); return s.steps;
}});

export const selectionSort = moduleMeta({ ...common, id:'selection-sort',title:'选择排序',file:'SelectionSort.java',description:'每轮选择未排序区最小值',objective:'理解最小值选择与已排序边界',defaultInput:'8, 4, 6, 2, 7, 1',complexity:'O(n²)',code:['static void selectionSort(int[] a) {','  for (int i = 0; i < a.length - 1; i++) {','    int min = i;','    for (int j = i + 1; j < a.length; j++)','      if (a[j] < a[min]) min = j;','    int t = a[i];','    a[i] = a[min]; a[min] = t;','  }','}'],parseInput:parseNumbers,run(input){
  const a=[...input],s=snapshotFactory(arrayView(a));let comparisons=0,swaps=0;s.ready();
  for(let i=0;i<a.length-1;i++){let min=i;s.emit('select',3,'设定候选最小值',`先把 ${a[min]} 作为未排序区的最小值。`,arrayView(a,{active:[min],completed:a.slice(0,i).map((_,k)=>k)}),{i,min},{comparisons,swaps});for(let j=i+1;j<a.length;j++){comparisons++;s.emit('compare',5,'寻找更小元素',`比较候选值 ${a[min]} 与 ${a[j]}。`,arrayView(a,{active:[min,j],completed:a.slice(0,i).map((_,k)=>k)}),{i,j,min},{comparisons,swaps});if(a[j]<a[min])min=j;}if(min!==i){[a[i],a[min]]=[a[min],a[i]];swaps++;s.emit('swap',7,'放置最小值',`${a[i]} 是本轮最小值，交换到下标 ${i}。`,arrayView(a,{active:[i,min],completed:a.slice(0,i+1).map((_,k)=>k)}),{i,min},{comparisons,swaps});}}
  s.emit('done',9,'排序完成','每个位置都放入了当前未排序区的最小值。',arrayView(a,{completed:a.map((_,i)=>i)}),{}, {comparisons,swaps});return s.steps;
}});

export const insertionSort = moduleMeta({ ...common,id:'insertion-sort',title:'插入排序',file:'InsertionSort.java',description:'把元素插入左侧有序区',objective:'理解有序区扩张与元素右移',defaultInput:'7, 4, 5, 2, 8, 3',complexity:'O(n²)',code:['static void insertionSort(int[] a) {','  for (int i = 1; i < a.length; i++) {','    int key = a[i], j = i - 1;','    while (j >= 0 && a[j] > key) {','      a[j + 1] = a[j];','      j--;','    }','    a[j + 1] = key;','  }','}'],parseInput:parseNumbers,run(input){
  const a=[...input],s=snapshotFactory(arrayView(a));let comparisons=0,writes=0;s.ready();for(let i=1;i<a.length;i++){const key=a[i];let j=i-1;s.emit('select',3,'取出待插入元素',`取出 ${key}，准备插入左侧有序区。`,arrayView(a,{active:[i],completed:Array.from({length:i},(_,k)=>k)}),{i,j,key},{comparisons,writes});while(j>=0){comparisons++;s.emit('compare',4,'比较有序区',`比较 ${a[j]} 与待插入值 ${key}。`,arrayView(a,{active:[j,j+1],completed:Array.from({length:i},(_,k)=>k)}),{i,j,key},{comparisons,writes});if(a[j]<=key)break;a[j+1]=a[j];writes++;s.emit('write',5,'元素右移',`${a[j]} 大于 ${key}，向右移动腾出位置。`,arrayView(a,{active:[j,j+1]}),{i,j,key},{comparisons,writes});j--;}a[j+1]=key;writes++;s.emit('insert',8,'完成插入',`${key} 插入下标 ${j+1}，有序区扩大。`,arrayView(a,{active:[j+1],completed:Array.from({length:i+1},(_,k)=>k)}),{i,j,key},{comparisons,writes});}s.emit('done',10,'排序完成','所有元素都已插入到左侧有序区的正确位置。',arrayView(a,{completed:a.map((_,i)=>i)}),{},{comparisons,writes});return s.steps;
}});

export const mergeSort = moduleMeta({ ...common,id:'merge-sort',title:'归并排序',file:'MergeSort.java',description:'先分解，再有序合并',objective:'理解分治和辅助数组合并',defaultInput:'8, 3, 6, 2, 7, 1',complexity:'O(n log n)',code:['static void mergeSort(int[] a, int l, int r) {','  if (l >= r) return;','  int m = (l + r) / 2;','  mergeSort(a, l, m);','  mergeSort(a, m + 1, r);','  merge(a, l, m, r);','}'],parseInput:parseNumbers,run(input){
  const a=[...input],s=snapshotFactory(arrayView(a));let comparisons=0,writes=0;s.ready();function sort(l,r){if(l>=r)return;const m=Math.floor((l+r)/2);s.emit('split',3,'分解区间',`把区间 [${l}, ${r}] 分成 [${l}, ${m}] 和 [${m+1}, ${r}]。`,arrayView(a,{active:Array.from({length:r-l+1},(_,k)=>l+k)}),{l,m,r},{comparisons,writes});sort(l,m);sort(m+1,r);const temp=[];let i=l,j=m+1;while(i<=m&&j<=r){comparisons++;if(a[i]<=a[j])temp.push(a[i++]);else temp.push(a[j++]);}while(i<=m)temp.push(a[i++]);while(j<=r)temp.push(a[j++]);temp.forEach((v,k)=>{a[l+k]=v;writes++;});s.emit('merge',6,'合并有序区间',`合并 [${l}, ${m}] 与 [${m+1}, ${r}]，得到 ${temp.join(', ')}。`,arrayView(a,{active:Array.from({length:r-l+1},(_,k)=>l+k)}),{l,m,r},{comparisons,writes});}sort(0,a.length-1);s.emit('done',7,'排序完成','所有子区间已合并为一个有序数组。',arrayView(a,{completed:a.map((_,i)=>i)}),{},{comparisons,writes});return s.steps;
}});

export const quickSort = moduleMeta({ ...common,id:'quick-sort',title:'快速排序',file:'QuickSort.java',description:'围绕基准值完成分区',objective:'理解基准值与分区不变量',defaultInput:'7, 2, 8, 4, 1, 6',complexity:'平均 O(n log n)',code:['static void quickSort(int[] a, int lo, int hi) {','  if (lo >= hi) return;','  int pivot = a[hi], i = lo;','  for (int j = lo; j < hi; j++)','    if (a[j] <= pivot) swap(a, i++, j);','  swap(a, i, hi);','  quickSort(a, lo, i - 1);','  quickSort(a, i + 1, hi);','}'],parseInput:parseNumbers,run(input){
  const a=[...input],s=snapshotFactory(arrayView(a));let comparisons=0,swaps=0;s.ready();function sort(lo,hi){if(lo>=hi)return;const pivot=a[hi];let i=lo;s.emit('pivot',3,'选择基准值',`选择末端 ${pivot} 为基准，开始分区 [${lo}, ${hi}]。`,arrayView(a,{active:[hi]}),{lo,hi,i,pivot},{comparisons,swaps});for(let j=lo;j<hi;j++){comparisons++;s.emit('compare',5,'与基准比较',`比较 ${a[j]} 和基准 ${pivot}。`,arrayView(a,{active:[j,hi]}),{lo,hi,i,j,pivot},{comparisons,swaps});if(a[j]<=pivot){if(i!==j){[a[i],a[j]]=[a[j],a[i]];swaps++;}i++;}}[a[i],a[hi]]=[a[hi],a[i]];swaps++;s.emit('partition',6,'基准值就位',`基准 ${pivot} 放到下标 ${i}，左侧不大于它，右侧不小于它。`,arrayView(a,{active:[i],completed:[i]}),{lo,hi,i,pivot},{comparisons,swaps});sort(lo,i-1);sort(i+1,hi);}sort(0,a.length-1);s.emit('done',9,'排序完成','所有分区的基准值均已就位。',arrayView(a,{completed:a.map((_,i)=>i)}),{},{comparisons,swaps});return s.steps;
}});
