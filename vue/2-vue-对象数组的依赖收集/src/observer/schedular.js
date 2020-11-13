import { nextTick } from "../util";

//调度文件，也就是当属性多次修改批量执行而不是反复的去执行
let has = {}; //利用对象的属性唯一性去重；
let queue = []; // 存储去重的watcher；


let pending = false;
//pending变量的作用：
// 多次调用queueWatcher就调用生多个 nextTick，就有可能会产生多个Promise
// 所以设置开关pending




function flushSchedularQueue() {
  // 清空 queue
  for (let i = 0; i < queue.length; i++) {
    let watcher = queue[i];
    watcher.run();
  }
  queue = [];
  has = {};
  pending =true;
}



export function queueWatcher(watcher) {
  let id = watcher.id; // watcher的id只有在new watcher()时才会++，而new watcher()只有在初始化的时候才进行一次
  if (has[id] == null) {
    queue.push(watcher);
    has[id] = true;
    if(!pending){   //都次调用nextTick的时候
      pending = true;
    nextTick(flushSchedularQueue);
    }
  }
}