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

export function nextTick(cb) {
  // 用户的逻辑要放到渲染逻辑之后例如我在改变属性后去获取该元素中属性表示的内容，如果渲染逻辑在用户逻辑之后获取的内容将是没改变之前的
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

// 判断是不是对象；
export const isObject = (val) => typeof val == "object" && val != null;
const LIFECYCLE_HOOKS = [
  //  存放 钩子、fliter、 directive、 component 等，这里没有写全，给合并策略对象strats对象添加属性（也就是利用对象的属性唯一性，将钩子等作为strats的属性）
  "befoerCreate",
  "created",
  "beforeMount",
  "mounted",
];
const strats = {}; // 合并策略对象，用于合并组件属性和 钩子钩子、fliter、 directive、等 如果合并的是钩子、fliter、 directive、 component 等就不能用对象的形式来合并了（不能去覆盖要并存的）
                   
LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook; // mergeHook函数为这些钩子等的合并函数
});
function mergeHook(parentVal, childVal) {
  if (childVal) {
    //如果儿子存在还要看一下父亲存在不
    if (parentVal) {
        return parentVal.concat(childVal) // concat数组拼接数组，也可以数组拼接元素例如 let arr=[1,2] let list = arr.concat(3) console.log(list)打印为[1,2,3]   //  第一次的时候父亲为一个空对象，父亲肯定没有，但儿子有options返回一个包含儿子的数组，第二次的时候父亲里面有一个包含儿子的数组,儿子是一个函数，拼接进去，
    } else {
      //如果儿子有父亲没有
      return [childVal];
    }
  } else {
    //如果儿子没有，就用父亲的，所以这里儿子不存在直接retutn父亲；
    return parentVal;
  }
}

/*
合并组件属性方法：strats.components
这里strats添加的属性对应的方法为组件的合并策略
但这个属性必须要叫components因为：
let vm = new Vue({el:"#app", components:{}}) vue的配置是components,在
调用extende时(调用Vue.componnet也会调用extende)就不然会产生子组件在new Vue({})中就必然会有
components属性除非不用这个子组件，调用extende后就会执行mergeOptions中会根据策略调用mergeField方法
在mergeField中有 if (strats[key]) 之后在执行strats[key]() 所以strats中就必须有components这个属性属性对应的
是个函数
*/
strats.components = function (partenVal,childVal){
   const res = Object.create(partenVal); // 将partenVal上大的方法和属性填加到res的__proto__这样当res上有相同的方法或者属性的时候就不会被覆盖了，合并父子组件形成一条链；
   if(childVal){
     for(let key in childVal){
       res[key] = childVal[key];
     }
   }
   return res
}

//  用于合并选项
export function mergeOptions(parent, child) {    ////{name: 2, beforeCreate: Array(1), created: Array(1)} { name：7, beforeCreate: fn, created: fn}
  const options = {}; //合并集合
  // 合并策略：
  //1.如果父亲有儿子也有，应该用儿子替换父亲； 例如父亲：{a:1}，儿子：{a:2} ,儿子翻盖覆盖父亲 {a:1}=>{a:2}=>{a:2}
  // 2.如果父亲有值，儿子没有，则听父亲的，  例如 父亲 ：{a:1} 儿子:{} 合并结果 {a:1}=>{}=>{a:1}听父亲的；
  // 3. 还有一些特殊的，如生命周期，叫自定义策略

  for (let key in parent) {
    // 以爸爸为准来合并儿子；
    mergeField(key);
  }

  for (let key in child) {
    //循环儿子将爸中没有的添加进去
    if (!parent.hasOwnProperty(key)) {
      //判断父亲中是否有儿子的属性，因为父亲中有儿子中也有，在循环父亲的时候就已经合并过了，不需要在合并了；
      mergeField(key);
    }
  }
  function mergeField(key) {
    if (strats[key]) {
      //策略模式：简化了大量的if(){}else{}的判断；
      return (options[key] = strats[key](parent[key], child[key]));
    }
    if (isObject(parent[key]) && isObject(child[key])) {
      // 如果爸爸中的属性是对象并且儿子中也有爸爸的这个属性并且值也是对象，将这两个属性的值合并，合并后结果就是儿子的属性值，在将这个属性和合并的属性值存取options中
      options[key] = { ...parent[key], ...child[key] };
    } else {
      if (child[key]) {
        options[key] = child[key];
      } else {
        options[key] = parent[key];
      }
    }
  }
  return options;
}


// 判断是否为原始标签是原始标签返回true：
function makUp(str){
  const map = {}
  str.split(",").forEach(tagName=>{
    map[tagName] = true;
  })
  return (tag)=>!!map[tag];  // !!表示转为布尔值，而不是两个非的意思；
}
//将所有原始标签以参数的形式传入makUp方法，来对比页面上的标签是否为u原始标签；
export const isReservedTag = makUp("a.,p,div,ui,li,span.input,button")
