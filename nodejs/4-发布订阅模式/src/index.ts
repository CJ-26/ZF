
const fs = require('fs')
//发布订阅
interface events{
  arr:Array<Function>;
  on(fn:Function):void;
  emit():void
}
let events:events= {
  arr:[] ,
  on(fn:Function){
    this.arr.push(fn)
  },
  emit(){
     this.arr.forEach(fn=>fn())
  }
}

interface Iperson{
  age:number;
  name:string;
}
let person={}as Iperson
events.on(()=>{
  if(Object.keys(person).length==2){
    console.log(person)
  }
})

fs.readFile('./age.txt','utf-8',(err,data)=>{
  person.age = data
  events.emit();
})
fs.readFile('./name.txt','utf-8',(err,data)=>{
  person.name = data
  events.emit();
})


// 发布订阅：把需要做的事放到一个数组中(订阅)，等会事情发生了让订阅的事依次执行(发布)
//// 发布重点在发布和订阅中间是由第三方的就是储存订阅事情的数组，发布和订阅之间是没有关联的（我没有订阅也可以执行发布，我执行了订阅，每执行发布也可以）

