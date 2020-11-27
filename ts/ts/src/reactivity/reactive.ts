import { mutableHandlers } from './baseHandlers';
import { isObject } from './../shard/inex';

export const reactive = (target:object)=>{
 // 传入一个对象（target） 我要把这个对象变成个响应式的利用Proxy
  //以前在vue2中的时候defineProprety直接循环对对象的每一个属性做代理，无法对不存在的属性做处理
  // vue3中没有对象的每一个属性做代理而是直接利用proxy直接对原对象进行代理。vue3中对不存在的属性也能监控
  // vue2会一上来的递归代理，而vue3没有一上来就递归
 
 
  return createReactiveObject(target,mutableHandlers); //利用高阶函数createReactiveObject，根据不同参数传入实现不同功能( 根据参数创建不同的响应式对象 )
  
}

const reactiveMap = new WeakMap(); // Es6中的弱引用（对象的key必须是对象，并且对象的引用清空了也不会出现内存泄漏的现象），表示映射表中的key必须是一个对象而且不会有内存泄漏的问题
function createReactiveObject(target,baseHandler){
  //判断传入的target是不是一个对象如果是对象就的代理
  if(!isObject(target)){
   return target
 }
let existProxy = reactiveMap.get(target) //因为下面利用 reactiveMap.set(target,proxy)记录了该代理的对象，如果记录里有就能获取的到没有就获取不到，用于判断这个对象是否代理过,如果代理过返回代理后的对象
 if(existProxy){  // 判断这个对象是否代理过了如果代理过了就不用代理
   return  existProxy
 }
 
 const proxy = new Proxy(target,baseHandler)  // reative的核心功能就是Proxy
 reactiveMap.set(target,proxy) //记录 要代理的对象（targt），和代理后的该对象(proxy)
return proxy
}