import { arrayMethods } from "./array";
import Dep from "./dep"; 

class Observer {
  constructor(value) {
    this.dep = new Dep() // 给data中的数组和对象本身增加一个dep,下面的defineReactive中的dep是给data中的每个属性值不是对象也不是数组的只是基本数据类型添加的；
    // value._b_ = this.observeArray // 将监控数组中的元素是否为对象的的方法添加在该数组的_b_属性下，为以后当数组改变，并且是增加，因为增加的的可能是一个对象，当是对象的时候需要添加监控，方便调用，（但这样写会出现死循环，因为 给当前的value添加一个_b_属性但这属性为对象呀，因为对象要进行监控的，所以会递归成死循环）应该如下添加：
    Object.defineProperty(value,"__b__",{
      value:this,
      enumerable:false, //不能被枚举，也就是不能被循环
      configurable:false //不能改变不能被删除
    })
    if (Array.isArray(value)) {
      // 如果是数组则不用defineProperty因为当数组有好多项时例如有10000项，没一个都利用defineProperty加数据劫持会很耗费性能；
      // 那数组怎么办哪？ 例如数组常用的方法有：push shift pop unshift splice  reverse sort  则需要重写这些逻辑添加更新方法(注意改写的数组的方法是能改变原数组的的方法，不改变原数组的方法不用重写因为重写数组的原因是要监控数组的变换数组都不变还重写什么哪)；

      value.__proto__ = arrayMethods; //或者使用 Object.setPrototypenOf(value,arrayMethods)

      // 那么数组中的元素是对象哪？ 是监控不到，那就需要一个监控的方法给对像添加get和set放法：
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
  observeArray(value){
    for(let i=0;i<value.length;i++){
      observer(value[i])
    }
  }
}



function dependArray(value) {  // 多维数组的内层数组进行依赖收集的函数
for(let i=0;i<value.length; i++){
  let current = value[i];
  current.__b__&&current.__b__.dep.depend();
  if(Array.isArray(current)){
     dependArray(current)
  }
}
}
function defineReactive(data,key,value){
  //如果value的值还是一个对象，就要在通过observer监测把对象中的对象也变成响应式以此类推直到value的值为基本数据类型为止(也就是递归，所以使用vue的时候数据结构不要嵌套的太深，否则会影响性能)
  let childOb = observer(value);  // 会返回一个Observer实例；
   let dep = new Dep() // 每次都会创建一个Dep，需要给每个属性加一个Dep
 Object.defineProperty(data,key,{ 
   get(){
     if(Dep.target){
       dep.depend(); //当取值的时候让watcher记住dep，但是同时也需要让dep记住watcher;
       if(childOb){
        childOb.dep.depend();//如果data中的属性值数组取值会将当前的watcher和数组进行关联（如果是对象也会进这个条件，但watcher和对象关联的逻辑没有写哈哈，这里只考虑数组） （如果是数组只能给数组添加dep，不能给数组的索引添加）
          if(Array.isArray(value)){// 当多维数组的时候，需要递归使内层数组也要收集外层数组的依赖（watcher）/否则内层数组有变化视图是不会更新的；
            dependArray(value)  // 多维数组的内层数组进行依赖收集的函数
          }
      }
     }
    
     return value;
   },
   set(newValue){
      if(newValue===value)return;
      observer(newValue); //如果用户重新复制赋值但值又是一个对象，则需要继续观测，将用户新设置的对象变成响应式的；
      value = newValue;
      dep.notify() // 通知dep中记录的watcher让watcher执行更新视图
   }
 })
}
export function observer(data){
  //只对对象类型进行观测，非对象类型无法观测；
  if(typeof data !== "object" || data === null){
    return;
  }
  if(data.__b__)return; //因为在检测的过程中，被监测的数据都会添加一个___b__属性， 为了防止循环引用在这里做判断，如果被观测过的 就不用在添加观测了；
  //通过类来对实现对数据的观测  因为类可以方便扩展，会产生实例；
  return new Observer(data);
}