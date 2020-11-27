// promis 都是基于回调模式的
//1、高阶函数： 一函数的参数是一个函数或者一个函数内部返回一个函数

//高阶函数的用法： 基于原来的代码来扩展
type Callback=()=>void
type Returnfn = (...args:any[])=>void
declare global{
  interface Function{
     before(fn:Callback):Returnfn
  }
}
Function.prototype.before = function(fn){
   return (...args)=>{
     fn() // 先调用传进来的fn函数
     this() // 因为用的箭头函数这个this就是谁调用before方法就是谁。所以这里的this就是下面的core函数，this()就是执行core函数                                                                              
   }
}
function core(...args){
  console.log('core..')
}
let fn_ = core.before(()=>{
  console.log('before core')
})

fn_(1,2,3)

export{}