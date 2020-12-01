
//https://babeljs.io/ 此网址可以将es6的编译成es5的进入网页在导航栏选择 Try in out之后在选择es2015；

// generator的原理：
// function * fn(){
//   let a = yield 1;
//   let b = yield 2
// }

//https://babeljs.io/  将上面的genertor函数read编译成es5的结果

"use strict"
class Context{
  constructor(){
    this.next = 0;
    this.done = false;
  }
  stop(){
    this.done =true
  }
}
let regeneratorRuntime={
  mark(genFunc){
    return genFunc
  },
  wrap(innerFn,outterFn){
     let it = {}
     let context= new Context(); //上下文实例用来保存Genertot状态的实例
     it.next =function(v){  // v 为next传递的值
       context.sent = v
    let value =  innerFn(context)  
       return{
         value,
         done:context.done
       }
     }
     return it   // 返回带有next方法的对象
  }
}


// 调用了regeneratorRuntime中的mark方法将generator函数(也就是当前的_read函数)当作参数传入
var _marked = regeneratorRuntime.mark(fn);
 // 下面switch中的case对应的值为随机不重复的
function fn() {
  var a, b;
  return regeneratorRuntime.wrap(function _read$(_context) {
    while (1) {
      switch ((_context.prev = _context.next)) {
        case 0:
          _context.next = 2;
          return 1;
        case 2:
          a = _context.sent;
          _context.next = 5;
          return 2;
        case 5:       // 这里用case穿透
          b = _context.sent;
        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
let it = fn()
console.log(it.next()) //{ value: 1, done: false }
console.log(it.next(1))  // { value: 2, done: false }
console.log(it.next(2))  // { value: undefined, done: true }







