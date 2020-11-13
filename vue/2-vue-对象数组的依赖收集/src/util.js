let callbacks = [];

let waiting = false;  
//waiting变量的作用：
// 第一次nextTick把回调函数存入callbacks数组中 开关为false进入条件并把开关置为true开起Promise
//第二次紧接着执行是将数据存入callbacks里，但开关为true所以进不了条件，但是回调函数存到callbacks数组之中了，当第一次执行的Promins是循坏回调数组，因为第二次已经存入了，所以也会执行


function flushCallbacks() {
  for (let i = 0; i < callbacks.length; i++) {
    let callback = callbacks[i];
    callback();
  }
  waiting = true;
  callbacks = [];
}

export function nextTick(cb) { // 用户的逻辑要放到渲染逻辑之后例如我在改变属性后去获取该元素中属性表示的内容，如果渲染逻辑在用户逻辑之后获取的内容将是没改变之前的
  callbacks.push(cb);
  if (!waiting) {
    waiting = true;

    //  这里源码的内部逻辑会判断兼容性如下判断：
    /*
       先看Promise支不支持
       在看mutationObserver支不支持
       在看setTimmdiate支不支持
       在看setimeout支不支持
       vue@3中的nextTick就是直接用Promise没有考虑兼容性；
    */  
  
    Promise.resolve().then(flushCallbacks);
  }
}
