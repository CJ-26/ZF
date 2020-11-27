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




// 利用高阶函数可以保存参数的的性质封装判断类型的方法
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


//反柯里化将函数的功能放大(须自学)






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
