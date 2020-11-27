

export const effect = (fn,options={})=>{
  // 需要将effect变成响应式的，数据变数化这个传进来的fn就重新执行；
  const effect = createReactiveEffect(fn)  //createReactiveEffect的方法为：创建一个响应的effect, 并且createReactiveEffect为高阶函数传入一个函数返回一个函数
   effect()
}
/*
effect1(()=>{
  name:"zf",
  effect2(()=>{
    age:"男"
  })
  age:12
})
*/


export const effectStack = []; // 栈型结构存储effect函数
export let activeEffect = null
let id = 0;
let num=0
function  createReactiveEffect(fn){
const effect =  function reactiveEffect(){   //const effect =  function reactiveEffect(){}  function后面的reactiveEffect不是函数名哦，是为提示的，没有用，effect才是函数名，effect能调用函数，reactiveEffect不能调用函数
  try{
    effectStack.push(effect)
     activeEffect = effect
     console.log(++num)
     return fn()
  }finally{
    console.log('finally')
    effectStack.pop()
   activeEffect = effectStack[effectStack.length-1]
  } 
 }
 effect.id = id++
 return  effect
}
