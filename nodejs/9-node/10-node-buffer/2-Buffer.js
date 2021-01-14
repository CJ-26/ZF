// Buffer代表的是node中的二进制 （表现给我们的是16进制）而且Buffer代表的是内存（内存的特点是大小不能随便更改）                                                                                               

//node中最小单位为字节

/* 
Buffer.alloc()方法声明一个Buffer可以存放多少个字节（固定长度声明）
用法：一个参数为声明这个Buffer可以存放的字节个数
例如：buf1 = Buffer.alloc(10) //表示buf1这个Buffer中可以存放10个字节；
console.log(buf1)// <Buffer 00 00 00 00 00 00 00 00 00 00>
*/



/*
Buffer.from() 可能用来声明一个固定内容的Buffer, 或者字符串声明字符串
用法：
let bu1 = Buffer.from([6,16,4,2])   //是一个固定内容的Buffer， [6,16,4,2]里面每一位代表一个字节，最大不能超过255，因为一个字节由八位组成，多以最大十进制的数就是255
console.log(bu1) //<Buffer 06 10 04 02>
console.log(bu1.length)  // 4    bu1的length是字节的长度，声明后是不能更改的；


let _bu1 = Buffer.from([6,16,4,2,255,257])   // []里面最大只能写255，如果大于255那这个字节会进行取余
console.log(_bu1) //<Buffer 06 10 04 02 ff 01>  257对应的是01所以大于255就会取余
console.log(_bu1.length)  // 6    _bu1的length是字节的长度，声明后是不能更改的；



let bu2 = Buffer.from("珠峰")  // 字符串声明Buffer
console.log(bu2)   //<Buffer e7 8f a0 e5 b3 b0>   // 一个字符串是3个字节所以这里输出了6个字节：e7 8f a0 e5 b3 b0
console.log(bu2.length)  // 6  注意这里的bu2.length的值是6，而不是字符串的长度2，因为两个汉字是由三个6个字节组成Buffer的length是表示字节的长度  bu2的length是字节的长度，声明后是不能更改的；


*/




/*
声明的Buffer.toString() 可以将Buffer转为字符串也可以设定转成字符串的编码格式，
用法：
let _buf = Buffer.from("你好")
let buf = _buf.toString()  // 将buf转成字符串 
console.log(buf)   // 你好



toString()的参数可以写编码格式但是不能写GBK因为node是不支持GBK的，支持的有：base64  utf8f(不写默认就是)
ascii 、 utf-8 、utf16le 、  ucs2 、 ucs-2 、 latin1 、hex 
let _buf = Buffer.from("你好")
let buf = _buf.toString("base64") //将这个Buffer转成base64的编码格式
console.log(buf)  //5L2g5aW9

*/






 /*
 Buffer的特点：声明Buffer后Buffer的长度(length)是不能更改的，因为：例如我要了一个G的内存，它就只给我了一个G的地方，我想要扩充但没有空余的地方让你扩充，所以不能扩充，我想要某一部分可以截取出来
 */


 //node可以做爬虫。去爬取别人的网站，但是node不支持GBK编码，如果别人的网站的编码就是
 //GBK的，怎么去爬取那？
 //可以使用第三方封好的包：iconv-lite
 //npm i iconv-lite
 /*
 先创建一个GBK格式的文件j叫gbk.js内容为：你好，取用utf8格式读取GBK的发发现是乱码
  const fs = require("fs")
  const path = require("path")
  let r = fs.readFileSync(path.resolve(__dirname,"gbk.js"),"utf8")
  console.log(r) //��� 出输出乱码
 因为node不支持GBK编码解决读取GBK乱码使用iconv-lite：
  const ico = require("iconv-lite")
  const fs = require("fs")
  const path = require("path")
  let r = fs.readFileSync(path.resolve(__dirname,"gbk.js"))
  let _r = ico.decode(r,"GBK")
 console.log(_r) //你好
 */
