/*
node 是什么？
 node不是语言,他是一个让js可以运行在服务端的一个运行时（也就是执行环境）也就相当于让浏览器的js可以在服务端运行，但是浏览器运行js是很弱的比如饿哦我
 想调用一些系统的api或者想创建一个服务器或者想读写文件，node想让js在后端编写代码它提供一些模块我们叫内置模块例如：文件读写，操作系统级的api，也就是node没有继承浏览器所有的api只继承了一部分
 js语言组成部分有： Bom  DOM  ECMASCRIPT 而node中只包含：ECMASCRIPT+模块

*/

/*
能做什么?
1、做中间层解决跨域问题，前端可以先访问同域下的node，
在用node再去访问后台的接口例如java，因为node和java都是后端，后端和后端之间是不存在域的概念的 
但是换来的问题就是以前一次请求完成的现在的两次请求来完成，

2、实现ssr(服务端渲染)因为node能跑js所以就能解析react，vue，就可以做服务端渲染


3、 可以编写工具例如webpack  deng

4、可以做企业及的后台（例如 egg和nest框架就可以做企业级的后台）

*/



/*
什么是高并发？
同一时间用户的访问量。
解决高并发的场景一般就是单线程，node就是单线程的，因为js的主线程是单线程；
所有node可以做高并发

*/


/*

非阻塞异步i/o的特性：
 我们常说，异步非阻塞，同步阻塞：
 例如有一个漂亮姑娘，你对她说我喜欢那嫁给我好吗？ ，姑娘说你等一等我马上给你答案，她没给我答案之前我就的等着她的答案，  你要向姑娘表白， 那我对她谁她才知道呀，那我就的调用她的方法对她说，此时我就是调用，方
 她是被调用方。 这里的我就是客户端，漂亮姑娘就是服务端，她没给我答案的这段时间我就等着，那我就阻塞了，  我阻不阻塞要取决于被调用方，她说你等我一会给你答案就是同步的，  那我就的等着我就阻塞了，如果她说你不用等了过几天给你答案就是异步的，那我就会先去做别的事了，我就不会阻塞
 所以同步还是异步是被调用方

由上面的例子可知，我调用了一个方法后，我是否阻塞，要取决于这个方法是否是同步还是异步的；


i/o：指i/o密集型，例如读取文件，请求接口，没有大量计算的 的操作叫i/o密集型，
除了i/o密集型还有cpu密集型例如：压缩合并 大量的计算相关的都是cpu密集型

*/


// 阻塞非阻塞 和 异步同步
/*



*/




//  单线程和多线程 ：
/*
node中自己实现了一套异步非阻塞的库叫libuv（所有的异步的底层都是由多线程来实现的）
异步非阻塞：例如 ：把node服务器比作一个服务员（一个服务员就是单线程），客户比作客人，来了好多客人点菜，服务员会快速的记下一个客人点的菜，通知厨房做菜（厨房就是异步要做的事），在去服务下一客人，等到厨房做完菜在通知服务员去取菜（node是件驱动的也就是做完菜通知服务员的的通知就是事件驱动）
这样点菜和做菜两不耽误，但是如果客人要求比较多让服务员做了好多别的事，因为只有一个服务员（一条线程）那就不能服务下一位客人了就卡在了这里，所以node只能做一些简单的web服务
例如读写文件，但如果你让它做大量的计算它就会卡在这里没办法去处理下一请求了

node适合去做i/o密集型也就例如：读取文件，请求接口，没有大量计算的，因为node做大量的计算会阻塞因为它是单线程的，如果非要做也可以node是由子进程的(node单线程说的主线程为单线程)
大量的计算叫cpu密集型适合适合多线程同步来做




java：
多线程： 当用户访问服务器，服务器在访问数据库，在数据库拿到数据再返给用户，这个过程会开一条线程，这个线程要等到服务器将数据返回后
才结束，但是当前这线程来没有完成，又来了个客户，访问这个服务器，但发现当前线程在被占用，就的在开一个线程来处理
如有n个人同时访问就得开n个线程；


多线程的缺陷： 
1、有可能多条线程操作同一个文件，那要听谁的那，所以在java会有锁的问题，
也就是让谁先来让谁后来，但是在单线程中就没有锁的问题
2、在切换线程时，会有消耗，（消耗的是时间）（多线程同步是：通过切换时间片的方式，达到同时执行多个任务）
3、多线程占用内存 (可以通过线程池来解决但也浪费内存)
同步阻塞+加多线程

多线程的好处：可以做压缩合并 大量的计算相关的 (这种大量的计算压缩合并叫做 cpu密集型 ，cpu密集型会让代码阻塞不会向下执行，所以适合多线程)
*/







/*
一般来讲，多线程+同步阻塞
        单线程+异步非阻塞
*/


/*
一个进程里只有一个主线程
*/