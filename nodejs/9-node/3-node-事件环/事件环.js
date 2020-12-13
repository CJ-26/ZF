//事件环在文档的位置：nodejs官方文档(https://nodejs.org/zh-cn/docs/) =>文档=》指南=》Node.js 事件轮询，定时器和 process.nextTick()

/*
node的事件环在node10版本之后和浏览器的事件环输出结果是一样的但是本质是不一样的；
不一样的地方：
浏览器中只有一宏任务队列但在node中有多个宏任务队列
一样的地方：
node和 浏览器没执行一个宏任务都会清空微任务；
*/

/*
node事件环的组成（共有5个队列）：

node中代码执行顺序由上到下执行整体的代码为主栈（主栈也为一个宏任务）主栈中同步执行完毕后执行微任务之后去依次清空事件环中的每一个队列

 timers队列用于存放计时器 setInterval和setTimeout的回调
1. timers

 pending callbacks队列：执行延迟到下一个循环迭代的 I/O 回调。也就就是说上一次轮询没有执行完的会在这里执行，
因为轮询是执行I/O事件会有一个最大值超过这个最大值机会放到在该对列中执行这个最大值是依赖于系统的人为不可控
pending callbacks队列第一次执行为一个空队列
2. pending callbacks  

idle, prepare队列为内部系统调度的我们不需要管
3. idle, prepare  

poll为轮询队列:检索新的 I/O 事件,执行与 I/O 相关的回调
但是这里除了关闭的回调函数，计时器和 setImmediate() 调度的之外，其余情况 node 将在适当的时候在此阻塞
也就是说node中除了关闭的回调函数，计时器和 setImmediate() 调度的之外，其余异步回调api都会在这个阶段来处理
轮询的过程 pall==>timers==> pending callbacks  ==> idle, prepare =>pall ......... 轮询下去；
4. poll

check队列为：存放nonde的setImmediate()的回调
5.check   

6. close callbacks （close http关闭的方法例如：ws = new WebSocket("ws://...") 关闭Socket： ws.close()。这里的 ws。close就会存放在这个队列里面 )







有上所述我们除去，不可控的队列（就是有系统控制的pending callbacks 和idle, prepare）我们主要关注的有：

timers  存放计时器回调的（setTimeout和setInterval）

poll  轮询，node中除了关闭的回调函数，计时器和 setImmediate() 调度的之外，其余异步回调api都会在这个阶段来处理

check  存放setImmediate的回调

close callbacks   存放一些关闭的回调函数，如：socket.on('close', ...)


这里 timere、poll、check、close callback 都是宏任务队列
node中代码执行顺序由上到下执行整体的代码为主栈（主栈也为一个宏任务）主栈中同步执行完毕后执行微任务之后在依次清空 事件环中的队列，node事件环中每个队列存放都是宏任务，每执行完一个宏任务，就去清空微任务
但是在node老版本node10以后的执行顺序是每清空一个对列在去清空微任务


总结node事件环执行顺序：
先执行主栈中的同步代码==》清空主栈中的微任务==》检测有没有到达时间的定时器，
有就是执行并且清空里面的微任务==》poll先依次清空node中异步回调（i/o操作）
例如异步读写文件===》当poll清空完node中的i/o操作之后会看check队列中有无 setImmediate的回调
如果有就执行==》当poll看完check队列后在去看close callbacks队列中有无回调有就执行===》当poll也看完
close callbacks队列，就会再次查看有没有timers对列中有无到时间的定时器有就执行timers队列的定时器，如果有定时器但没到时间那么poll会在此等到它到时间执行清空微任务，如果定时器里有i/o操作就添加到poll中



poll是如何轮询的：
poll执行清空i/o=》由poll到查看checkc队列有执行==》poll在查看lose callback队列有就执行==》poll查看到时间的定时器，没到时间就等到时间执行清空微任务，如果定时器里有i/o操作就添加到poll中==》poll执行清空i/o==》。。。。。

*/



/*
process.nextTick() 为异步执行，原则来说是不在事件环中的，
它的执行顺序是在微任务之前执行

例如：
setTimeout(()=>{
  console.log("setTimeout")
})

Promise.resolve("promise").then((data)=>{
  console.log(data)
})
process.nextTick(()=>{
  console.log("nextTick")
})
console.log("同步")

输出顺序为 ：同步 、nextTick 、promise 、setTimeout
*/



//node 事件环题：


/*执行计时器的顺序将根据调用它们的上下文而异。如果二者都从主模块内调用，则计时器将受进程性能的约束（这可能会受到计算机上其他正在运行应用程序的影响）。
例如，如果运行以下不在 I/O 周期（即主模块）内的脚本，则执行两个计时器的顺序是非确定性的，因为它受进程性能的约束：
setTimeout(()=>{
  console.log("timeout")
},0)
setImmediate(()=>{
  console.log("immediate")
})
输出顺序为：有可能是 先timeout在immediate，也有可能是immediate，timeout

但是，如果你把这两个函数放入一个 I/O 循环内调用，setImmediate 总是被优先调用：
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
输出结果：先immediate，之后在timeout
*/















/*
console.time()和console.timeEnd()为一对可以测试执行时间例如：
console.time("start")
setTimeout(()=>{
  console.timeEnd("start")
},1000)
输出：start: 1.002s （每次输出会差一点因为会有误差的）
console.time()和console.timeEnd()输出的内容必须相同才可以，例如console.time("a")输出为a，则console.timeEnd("a")也的输出a；
*/
