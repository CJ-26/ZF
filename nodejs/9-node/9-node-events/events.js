// 内置模块events(事件模块)解决发布订阅模式
// 使用方法：
const EventEmitter = require("events") // 事件触发器
/*
events模块是一个类我们可以去new它
也可以去继承它
events的上的方法都是原型上的方法
原型继承例如又构造函数 Gitl来继承events模块
原型继承的几种方式：
const EventEmitter = require("events")  //引入events模块
function Girl(){}
第一种原型继承：
Girl.prototype.__proto__ = EventEmitter.prototype
第二种原型继承：
Girl.prototype = Object.create(EventEmitter.prototype)

*/
function Girl(){}
//原型继承：
//继承方式一
Girl.prototype.__proto__ = EventEmitter.prototype
let girl = new Girl()
// on方法为订阅，两个参数一为订阅的名字二为要出发布后要执行的函数, 第二个参数为函数这个函数参数可以由发布时传入
girl.on("女生失恋",(...args)=>{
  console.log("哭",...args) 
})
girl.once("女生失恋",()=>{  // once在发布时在第一次发布时会执行，再次发布就不会执行了
  console.log("吃")
})
girl.on("女生失恋",()=>{
  console.log("逛街")
})


// emit发布（触发订阅的事件，传入订阅事件的名字）两个参数参数一个要发布的名字（也就是订阅时的第一个参数）参数二为给发布对应执行函数的参数（也就是订阅时第二个参数为一个函数给这个函数传递的参数）
girl.emit("女生失恋",1,2,3,4)  // 第一次发不输出为：哭 1 2 3 4  、  吃   、  逛街
girl.emit("女生失恋",1,2,3,4)// 第二次发不输出为：哭 1 2 3 4  、  逛街  少了一个吃因为输出吃的订阅调用的noce只执行一次








girl.on("女生谈恋爱",()=>{
  console.log('开心')
})

girl.on("女生谈恋爱",eit)
function eit(){
    console.log('拧不开瓶盖')
}
 girl.off("女生谈恋爱",eit)
girl.emit("女生谈恋爱")  //发布后输出 开心 因为off放方法把输出拧不开瓶盖的移除掉了



/*
node中有一个核心模块可以直接实现继承叫：util
用法： 
const util = require("util")
const EventEmitter = require("events") 
function Girl(){}
util.inherits(Girl,EventEmitter)  // Girl去继承EventEmitter
let girl = new Girl()
girl.on("hand",()=>{console.log(123)})
girl.emit ("hand")


util.inherits(Girl,EventEmitter)的实现原理：
Object.setPrototypeOf(Girl.prototype,EventEmitter.prototype)

*/




function Boy(){}
Boy.prototype.__proto__ = EventEmitter.prototype
let boy = new Boy()


/*
boy.on("newListener",(type)=>{   
console.log(type)
}) 
固定写法参数一必须是"newListener"
什么时候执行只要调用了on方法就会执行
参数二中的参数type打印出来为订阅的名字
例如下面：
boy.on("newListener", (type) => {
  console.log(type);
});
boy.on("男孩", () => {
  console.log(1);
});

boy.on("男孩", () => {
  console.log("2");
});
boy.on("小男孩", () => {
  console.log(3);
});
会执行执行3次输出依次为  男孩  、 男孩  、 小男孩

当on方法绑定newListener和订阅其它的执行顺序是当遇到使用on方法时就会执行boy.on("newListener", (type) => {});之后再将on中订阅的事件订阅进去


*/
boy.on("newListener", (type) => {
  process.nextTick(()=>{   //由于on绑定"newListener"的执行顺序问题想要emit都发布就要写下process.nextTick里面
    boy.emit(type)
  })
  console.log(type);
});
boy.on("男孩", () => {
  console.log(1);
});

boy.on("男孩", () => {
  console.log("2");
});
boy.on("小男孩", () => {
  console.log(3);
});
      











/*
发布订阅主要解决的问题？
代码解耦

*/