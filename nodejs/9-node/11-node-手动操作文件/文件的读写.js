/*
文件操作api(file system) 
文件操作api分为同步api和异步api带Sync为同步api不带的为异步api
*/

/*
文件读写操作
同步读文件方法fs.readFileSync()：
fs.readFileSync()两个参数参数一为要读取的文件路径，
参数二为编码格式例如："utf8"为可选参数，默认不填读取的文件数据格式为二进制的（读取的数据默认编码都是null(什么都是null就是读取的数据默认都是二进制)）

同步写入文件fs.writeFileSync():
fs.writeFileSync()有三个参数
参数一为写入文件的路径，如果该路径没有这个文件则会自动创建该文件，如果有则会覆盖文件
参数二写入的内容可以是
参数三为编码格式，例如：{encoding:"utf8"}参数三为可选参数，默认为二进制写入，那为什么写入之后打开文件看到的不是二进制那，写入默认确实是二进制，当你打开文件是，是会根据你打开文件的工具的编码格式显示的所以看到的就不是二进制了，例如使用vscode打开，当前编码为utf8则就会将写入的二进制以utf8的编码格式显示了
const fs = require("fs")
const path = require("path") //为了代码的稳定性所有的文件操作都使用绝对路径
let r = fs.readFileSync(path.resolve(__dirname,"note.md"))
fs.writeFileSync(path.resolve(__dirname,"copy.md"),r,{encoding:"utf8"})


同步读写操作会阻塞代码
但同部读写的速度快，因为我读写文件的时候只能在这里等着读写完成才能取做别的事，
*/



/*
异步读写文件：
异步读取文件：fs.readFile()
参数一：表示要读取的文件的路径（必选），。
参数二：encoding（可选），表示文件的字符编码。  如果规定了编码在callback接受时的内容也是该编码的如果没有规定默认为二进制
参数三：callback 是回调函数，用于接收文件的内容。



异步写入文件：fs.writeFile
参数一：  文件路径。
参数二:　 要写入文件的数据，可以是 String(字符串) 或 Buffer(流) 对象。
参数三:　- 该参数是一个对象，包含 {encoding, mode, flag}。默认编码为 utf8, 模式为 0666 ，flag 为 'w'
参数四:　 回调函数，回调函数只包含错误信息参数(err)，在写入失败时返回。
const fs = require("fs");
const path = require("path");
fs.readFile(path.resolve(__dirname,"note.md"),function(err,data){
  if(err){
    throw new Error(err)
  }
    fs.writeFile(path.resolve(__dirname,"copy.md"),data,function(err){
      if(err){
        throw new Error(err)
      }
        console.log("copy ok")
    })
})

异步读写文件的问题，如果文件过大这种异步读写操作可能出现淹没可用内存(淹没可用内存是指例如我有1G的运行内存但是你读写操作占用了800M占用过多)者内存溢出，解决这种问题只需要读一部写一部分例如我
我直接异步读取大文件所有内容，占用运行内存为500M读写完之后才会释放这500M，但是我读一部分写一部分例如这一部分读写操作占用20M内存，读写之后释放，再去读一部分写一部分直至读完写完这样我这个读写过程只占用的20M运行内存


这种异步读写适合小文件node认为小于64k都算小文件
*/



/*
分段读写文件内容：
fs.open() ：
open方法用于打开文件要做那些事情：
三个参数：
参数一：为要打开的文件路径
参数二为：打开文件要做什么操作的标识常用的有：r(读文件操作)  w(写文件操作)  a(追加内容)    r+(在读的功能上增加写的功能，如果文件不存在会报错以读为基础)   w+(在写的功能上增加读的功能,文件不存在也能操作，以写为基础) 
参数三为回调函数，回调函的参数一为接受错误信息，参数二是一个Number类型叫做文件描述符(file descruot),作用是用来描述我要对这个文件做什么操作


fs.read()：读取文件但需要在open方法中第三个参数也就是回调函数中使用并且，只有open的第二参数表示读取文件时才能使用
fs.read()方法的6个参数，
参数一为： fs.open方法中第三个参数也就是回调函数中的第二个参数
参数二为：一个Buffer用于接受读取的内容
参数三为：从Buffer（参数二的Buffer）的第几个位置开始接受读取的内容
参数四为：要将读取的内容写入到Buffer中多少个字节
参数五为：读取文件从文件的第几字节开始读取
参数六为：回调函数参数一为报错时的信息，参数二为真实读取到的字节个数




fs.write()写入文件但需要在open方法中第三个参数也就是回调函数中使用并且，只有open的第二参数表示写入文件时才能使用
fs.write()方法有六个参数：
参数一为：fs.open方法中第三个参数也就是回调函数中的第二个参数
参数二为：一个Buffer要把哪个Buffer的内容写入文件中就是哪个Buffer
参数三为：从Buffer（参数二的Buffer）的第几个位置开始往文件中写入
参数四为：Buffer中多少个字要写入文件中
参数五为：从文件的第几个字符开始写入Buffer的内容
参数六为：回调函数参数一为报错时的信息，参数而为真实写入文件的字节个数

例如;
// 将文件test.txt中的前3个字节写入到copy.txt文件中
const fs = require("fs")
const path = require("path")
let buffer= Buffer.alloc(3)
fs.open(path.resolve(__dirname,"test.txt"),"r",function(err,fd){
  fs.read(fd,buffer,0,3,0,function(err,bytesRead){  //参数3为0表示参数二的Buffer从第0位开始接受读入文件的内容，参数4为3表示读取文件三个字符，参数五为0表示从文件的第0个字节开始读取
    fs.open(path.resolve(__dirname,"copy.txt"),"w",function(err,wfd){
      fs.write(wfd,buffer,0,3,0,function(err,written){  参数三为0，从Buffer的第0个位置开始往文件中写内容，参数四为3，表示要从Buffer中写入文件3个字节，参数五表示：从文件的第几个字符开始写入内容
        fs.close(fd,()=>{})  // 删除文件描述符fd （每开始一个open就会产生一个文件描述符操作过后要删掉）
        fs.close(wfd,()=>{})//删除文件描述符：wfd （每开始一个open就会产生一个文件描述符操作过后要删掉）
      })
    })
  })
})
*/

/*


//异步迭代分段读写
 const fs = require("fs");
 const path = require("path")
 let BUFFER_SIZE = 3; // 一次读取内容的长度一般为64k因为node默认64k以下为小文件这里就写3个字节了，
 let buffer =Buffer.alloc(BUFFER_SIZE);
 let readOffset = 0;  //读文件的偏移量，从文件的第几位字节开始读
 let writeOffset = 0;  //写文件的偏移量从文件的第几个字符开始写入
 fs.open(path.resolve(__dirname,"test.txt"),"r",function(err,fd){
   fs.open(path.resolve(__dirname,"copy.txt"),"w",function(err,wfd){
     function next(){  //next迭代递归函数
       fs.read(fd,buffer,0,BUFFER_SIZE,readOffset,function(err,bytesRead){  //第三个参数的0为每次递归读取文件后从Buffer的第0位开始存入读取的内容，(读取参数的作用：从文件的第readOffset(参数五)位置开始读取，读取的长度为BUFFER_SIZE(参数4)，读取后从Buffer的第0（参数3）为开始写入读取的内容）
         if(bytesRead>0){
           fs.write(wfd,buffer,0,BUFFER_SIZE,writeOffset,function(err,written){ //第三个参数的0为每次递归从Bufer的第0位开始往文件中写入，(写入参数的作用：从文件的第writeOffset(参数五)位开始写入，每次写入的长度为，BUFFER_SIZE(参数4)，写入的内容为读取文件时存入Buffer的内容，从这个Buffer的第0(参数3)位开始写入)
            readOffset+=bytesRead;
            writeOffset+=written;
            next()
           })
         }else{
           fs.close(fd,()=>{})
           fs.close(wfd,()=>{})
         }
       })
     }
     next()
   })
 })                      



*/

let arr=[{id:1},{id:2},{id:3},{id:4},{id:1},{id:1}]

function fn(arr){
  let list=[]
  for(var i=0;i<arr.length;i++){
    if(arr[i].id !==1){
     list.push(arr[i])
    }
  }
  arr = list
  arr.forEach(el => {
    console.log(arr)
  });
}
fn(arr)