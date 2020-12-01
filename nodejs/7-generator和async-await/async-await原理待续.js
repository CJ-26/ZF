
const fs = require("fs").promises


class Context{
  constructor(){
    this.next =0;
    this.done=false;
  }
  stop(){
    this.done = true
  }
  abrupt(type,val){
      this.next = 7;
      this.done = true;
      return val
      
  }
}

function asyncGeneratorStep(gen, resolve,reject,_next,_throw,key,arg){
  let info; let value;
    try{
       info = gen[key](arg)
       value= info.value;
    }catch(err){
      reject(err)
      return;
    }
  if(info.done){
    resolve(value)
  }else{
    Promise.resolve(value).then(_next._throw)
  }
}
function  _asyncToGenerator(fn){
  console.log(fn)
  return function (){
    let self = this,
     args = arguments
     return new Promise(function(resolve,reject){
      console.log(fn,args)
         let gen = fn.next.apply(self,args) //geenragtor返回的。
         function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
     })
  }
}
const regenertorRuntime={
  mark(cb){
   return cb()
      
  },
  wrap(innerFn,outterFn){
      let it = {}
       let context = new Context()
       it.next = function (v){
        context.sent = v;
        let value = innerFn(context)
        return {
          value,
          done:context.done
        }
       }
      return it
  }
}

 function read(){
   return _read.apply(this,arguments)
 }
function _read(){
  _read = _asyncToGenerator(
     regenertorRuntime.mark(function _callee(filePath){
     let name; let age;
     return regenertorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fs.readFile(filePath, "utf8");

          case 2:
            name = _context.sent;
            _context.next = 5;
            return fs.readFile(name, "utf8");

          case 5:
            age = _context.sent;
            console.log(age,222)
            return _context.abrupt("return", age);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
     return _read.apply(this,arguments)
}


//  function read(filePath) {
//     let name = fs.readFile(filePath, "utf8"); 
//     let age  =   fs.readFile(name, "utf8");
//     return age;
// }
//async执行完之后返回一个Promise；
let a = read("./name.txt")
console.log(a)



