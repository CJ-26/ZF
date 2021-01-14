const util = require("util")
function EventEmitter(){
  this._events = {}  //实例属性
}

EventEmitter.prototype.on = function(eventName,callback){
  if(!this._events) this._events = {}   //如果调用的没有this._events则给它添加一个防止使用者原型继承再用继承者来调用
  if(eventName !=="newListener"){
    this.emit("newListener",eventName)
  }
  if(!this._events[eventName]){
       this._events[eventName] = [callback]
 }else{
  this._events[eventName].push(callback)
 }
}
EventEmitter.prototype.emit = function(eventName,...args){
  if(!this._events) this._events = {}
  if(this._events[eventName]){
    this._events[eventName].forEach(fn=>fn(...args))
  }
}
EventEmitter.prototype.once = function(eventName,callback){
/* this.on(eventName,callback)
 this.off(eventName,callback)
 这样写肯定不行因为当我调用once方法时
 将传入订阅的名字和对应的函数订阅进去之后
 就马上执行了off方法就卸载了等在调用emit时订阅的已经卸载了，
 就没有执行的了所以要下面的写法： 
*/
const _once = (...args)=>{
  callback(...args);
  _once.l = callback   //用于还没有调用emit执行once订阅的事件就先调用了off卸载了该事件（因为这里调用on方法订阅的是_once函数而off卸载事件找的是传入的callback，所以给_once添加属性，值为传入的callback方便在off中使用）
  this.off(eventName,_once)
}
this.on(eventName,_once)
/*
这样写的目的：将原本传入的callback包裹一层_once函数在调用on方法将_once函数传，这样订阅的对应的方法就是_once了
在_once函数中先效用传入callback函数之后在调用off去卸载_once
函数
当emit的时候会执行_once在_once中在执行once传进来的callbalck
在执行off卸载_once这样就可以了
*/
}
EventEmitter.prototype.off = function(eventName,callback){
if(!this._events)this._events;
if(this._events[eventName]){
  this._events[eventName] = this._events[eventName].filter(fn=>callback !== fn && fn.l !==callback) 
  /*
  callback !== fn && fn.l !==callback中的&& fn.l !==callback是为了卸载当调用once是订阅的方法
  为什么是&&而不是||那因为
  当为callback ！==fn || fn.l !==callback的时候只要callback ！==fn为true就不会在走 fn.l !==callback而
  callback !== fn && fn.l !==callback当callback ！==fn为true还是会走fn.l !==callback的
  
  
  */
}
}


// 使用：
let event = new EventEmitter()
event.on("ha",(...args)=>{
  console.log(...args)  // 1234
})
event.emit("ha",1234)



function Girl(){}
util.inherits(Girl,EventEmitter)  // Girl去继承EventEmitter
let girl = new Girl()
girl.on("hand",(...args)=>{console.log("哈哈哈",...args)})  // 111

girl.on("hand",handler)
function handler(){
  console.log(1000)
}
girl.emit ("hand","第一次")
girl.off("hand",handler)
girl.emit ("hand")




/*
一般带下下画线的都表示私有属性例如上面的this._events
是规定的只是大家都这么习惯用
*/