


//Promise.resolve(1).then(res=>2).catch(err=>3).then(res=>console.log(res))

//调用的promise的成功方法
let p1 = Promise.resolve(1) 
//x为上次resolve传的值1，因为有retrun x+1 ，会传到下次的then的成功的回调中 
let p2=p1.then((x)=>x+1) 
//当前的x值为2，但是这个then的成功的回调没有用到x，也没有返回值可是它抛出了一个异常
//这个异常会被下一次then的失败的回调拿到，
//但是后面跟了个catch(catch其实就是调用then的失败回调catch的原理：then(nell,(err)=>{}))
//所以catch里的x是它前面then中抛出的异常但是catch里面的x没有用到返回了一个1
//这个1将会传到下次的then的成功的回调中
let p3=p2.then((x)=>{throw new Error("My Error")}).catch((x)=>{return 1}) 
 //上次的catch返回的1会传到当前then里面这个then的x就是1，又返回了个2(x+1=2),
 //这个2将会传递到下一个then的成功的回调里
let p4=p3.then((x)=>x+1) 
//当前x的值就是上一次传递的2了，           
let p5 = p4.then((x)=>console.log(x)).catch((err)=>{console.log('err===',err)})





// const { promises: { readFile } } = require('fs');  
//  readFile('./age.txt', 'utf8').then((res)=>console.log(res))


// let arr =[]
// let list = [1,2,3,4]
// function fn(arr){
//   arr[3] = "55"
//   console.log(arr)
//   if(arr.length===list.length){
//     console.log("77777")
//   }
// }
// fn(arr)
class Item{
  fn(){
    console.log(1234458888888) //1234458888888
  }
}
Item.prototype.fn()
