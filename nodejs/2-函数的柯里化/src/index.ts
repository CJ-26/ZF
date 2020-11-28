//柯里化函数
//柯里化的功能就是让函数的功能更具体一些(核心保留参数)


/*判断一个变量的类型方法：
1.typeof: 可以细分类型但不能细分是数组还是对象
2.constructor: 看我是由谁构造出来
3.intanceof: 可以断谁是谁的实例
4.Object.prototype.toString.call：更具体一些判断是是什么类型但判断不了谁是谁的实例
*/


// 判断类型函数
// function isType(val:unknown,typeing:string){
//   return Object.prototype.toString.call(val) ==`[object ${typeing}]`
// }
// let r= isType("hello",'String')




// 利用高阶函数可以保存参数的的性质封装判断类型的方法（函数的柯里化缩小判断类型只能判断['String','Number','Boolean']的类型）
type ReturnFn = (val:unknown)=>boolean;
let utils:Record<string,ReturnFn> = {};
function isType(typing:string){   //外面在调用 isType,所以参数 typing被保存了下来（闭包）
  return function(val:unknown){
    return Object.prototype.toString.call(val)==`[object ${typing}]`
  }
}
['String','Number','Boolean'].forEach(type=>{
  utils[`is${type}`] = isType(type)
})

console.log(utils.isString("33333"))  //true
console.log(utils.isNumber(1234))   //true



// 反柯里化 （主要作用时将使用方法的范围变大）
// 例如判断类型的方法Object.prototype.toString.call()
//其实Object.prototype.toString()就是判断类型的而后面的call
// 的作用是改变this的也就是判断当前传入的类型
//例如：我想简化此方法；
interface IttoString1{
   (val:any):any;
}
declare global{
  interface Function{
    unCurrying():any;
  }
}
let toString1:IttoString1 = Object.prototype.toString
console.log(toString1(123))  //[object Undefined], 为什么会输出：[object Undefined]，因为没有call指定this，当前this为window
console.log(toString1.call(123))  //[object Number]利用call指定了this
//那我就想使用的时候不用call，反柯里化封装通用的判断类型方法（Object.toString.call()）
Function.prototype.unCurrying=function(){
 return (...args)=>{
    // 为和不用这种方式调用call：this.call 而是  Function.prototype.call() 这样调用有可能会调用用户的自己的call方法，因为方法调用的顺序是先看自己身上有没有如果。才去原型上找
   //call.apply(this,arge)的作用是改变this的执行并执行call方法将参数arge传入call方法中；
    return Function.prototype.call.apply(this,args)
 }
}
let _toString = Object.prototype.toString.unCurrying()
// 使用判断类型
console.log(_toString(111))   //[object Number]  //如何将范围变大了那，因为Object.prototype.toString的方法只能在原型上使用，现在随意调_toString() 就可以了
















const curring = (fn)=>{
  const exec = (sumArgs)=>{
    //如果当前传入的参数的个数小于fn函数的参数个数 需要返回一个新函数并保存当前函数传入的参数（函数的length就是函数参数的个数）
    return sumArgs.length >= fn.length?fn(...sumArgs) : (...args)=>exec([...sumArgs,...args])                                                                                                  
  }
  return exec([]) //空的[] 是用来收集每次执行的时候传入的参数，第一次默认为空
}

function sum(a,b,c,d){ //如果当函数的参数的的个数不确定的情况下使用不了函数的柯里化，除非使用内置的toString方法
  return  a+b+c+d
}
console.log(curring(sum)(1)(2,3)(4)) //10


//根据上面实现一个通用判断类型方法：
const curring1 = (fn)=>{
  function exec(a){
   
    return a.length >= fn.length ? fn(...a):(...b)=>{ console.log(2222);return exec([...a,...b])}                                                                                                                                              
  }
  return exec([])
}
function isType1(typing:string,val:unknown){
 
  return Object.prototype.toString.call(val) == `[object ${typing}]`
}
let isString1 = curring1(isType)('String')
let isNumber1 = curring1(isType)('Number')
console.log(isString1("222"),isNumber1(11))  //true true


export {}