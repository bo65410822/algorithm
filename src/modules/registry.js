import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort } from './sorting.js';
import { linearSearch, binarySearch } from './searching.js';
import { stack, queue, linkedList } from './structures.js';
import { binarySearchTree, heap, graphBfs, graphDfs } from './trees-graphs.js';

export const modules=[bubbleSort,selectionSort,insertionSort,mergeSort,quickSort,linearSearch,binarySearch,stack,queue,linkedList,binarySearchTree,heap,graphBfs,graphDfs];
export const moduleMap=new Map(modules.map(module=>[module.id,module]));
export const categories=[
  {id:'all',label:'全部'},
  {id:'sorting',label:'排序'},
  {id:'searching',label:'查找'},
  {id:'linear',label:'线性结构'},
  {id:'tree',label:'树'},
  {id:'graph',label:'图'}
];
