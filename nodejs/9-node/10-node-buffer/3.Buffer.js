/*
Buffer可以更改存储的内容但是更改时是不能超过声明这个Buffer是的内存长度的（也就是不能扩容）例如：
let b = Buffer.from("好好") // 两个汉字为六个字节，也就是这个Buffer，的内存为6个字节，如果这个Buffer想存8个字节是不可能的，也没办法存


改变Buffer的内容
let a  =  Buffer.from([1,2,3])
console.log(a) //<Buffer 01 02 03>
a[1] =12
console.log(a) //<Buffer 01 0c 03>

*/






//很多时候数据是分片传输的，收到后需要进行组合；
/*
比如说我有两段Buffer，
需要对内存进行拼接处理，
这种情况是不能直接进行扩容因为一个Buffer的内存是固定的你在拼接是容不下的的例如：
现在有:
let b1 =Buffer.from("珠峰")
b1有6个字节把b1扩容成一个12字节的Buffer，这个情况是做不到的因为你声明时只能存6个字符你把12个字符给它，它是存不下的

那我们如何把Buffer变成长那？或者说怎样把多个Buffer拼接在一起那？
可以声明一个更大的Buffer将多个Buffe拼接进去（我们不能直接更改Buffer的大小但是可以将多个小Buffer拷贝到一个更大的Buffer中）

*/


/*
Buffer的原型方法copy()用于拷贝Buffer
copy()方法的用发法copy为Buffer的原型方法 :要拷贝的Buffer.copy(拷贝到的Buffer,拷贝到这个Buffer的第几位，要拷贝的Bufer从哪一位开始拷贝被，要拷贝的Buffer到哪一位结束）
例如：
例一、
let a = Buffer.from("珠峰")  //声明要被拷贝的a
let c = Buffer.alloc(6); //声明c将a拷贝到c中，主要c的字节长度一定要大于等于a，也就是大于等于a.length
a.copy(c,0,0,6)  //解释：将a拷贝到c中，copy中的四个参数，第一个就是c，第二个参数为将a拷贝到c中c从c中的那个字节开始接收拷贝a中的内容(当前参数为0，也就在a中拷贝的内容从c的第一字节开始接受，如果参数是1那c就从第二个字节开始接收可以理解为下标)，第三个参数是从a的哪个字节开始拷贝，将a全拷贝到c中也就从第0个字节开始拷贝所以第三个参数就是0(当前是0，那复制a的内容就从第1个字节开始复制，如果当前参事是1，那就从a的第2个字节开始复制，可以理解为下标)，第四个参数是拷贝到a的第几个字节，因为将a全拷贝到c中，a 中一共有六个字节，所以第四个参数为6(当前参数是6所以要复制到a的第6个字节包括第6个字节，  可以理解为下标但是下标是开区间的也就是此时为下标6了话复制a中的内容是不包含下标为6的及下标为6以后的，而是复制a的内用是从开始下标到下标为5的全都复制包括开始下标和下标为5的字节）
console.log(a)  //<Buffer e7 8f a0 e5 b3 b0>
console.log(c)  //<Buffer e7 8f a0 e5 b3 b0>



例二、
let a = Buffer.from("珠峰");
let c = Buffer.alloc(12); 
a.copy(c,1,0,5)       //将a复制到c中，复制a的内容是从a的第0个字节开始到第5个字节结束，不包含开始字节包含结束字节，从c的第0个字节开始接受复制a的内容不包含开始字节
console.log(a) //    <Buffer e7 8f a0 e5 b3 b0>
console.log(c) // <Buffer 00 e7 8f a0 e5 b3 00 00 00 00 00 00>



例三、
let a = Buffer.from("珠峰");
let c = Buffer.alloc(12); 
a.copy(c,1,2,5)          //将a复制到c中，复制a的内容是从a的第2个字节开始到第5个字节结束，不包含开始字节（不包含第二个字节）包含结束字节，从c的第1个字节开始接受复制a的内容不包含开始字节（不包含）第一个字节，接收从a复制的内容从c的第二个字节接收）
console.log(a)  //<Buffer e7 8f a0 e5 b3 b0>        
console.log(c)     //<Buffer 00 a0 e5 b3 00 00 00 00 00 00 00 00>




例四、
将多个小Buffer拷贝到一个大的Buffer中：
let a = Buffer.from("珠峰")
let b = Buffer.from("架构")
let c = Buffer.alloc(12)
//先将a拷贝到c中
a.copy(c,0,0,6)
b.copy(c,6,0,6)
console.log(a)    //<Buffer e7 8f a0 e5 b3 b0>
console.log(b)                      //<Buffer e6 9e b6 e6 9e 84>
console.log(c)    //<Buffer e7 8f a0 e5 b3 b0 e6 9e b6 e6 9e 84>
console.log(c.toString()) // 珠峰构架







封装copy：
Buffer.prototype.copy = function(targetBuffer,targeStart,sourceStart=0,soutceEnd = this.length){
  for(let i=sourceStart;i<soutceEnd;i++){
    targetBuffer[targeStart++] = this[i];
  }
}
*/



/*
Buffet的静态方法concat()是基于copy方法的但是不用自己在声明一个大的Buffer来合并小的Buffer了，会返回一个拼接好的Buffer
用法concat()两二个参参数，第一个参数为数组，数组中的项就是就是要拼接在一起的Buffer，第二个参数为数值用来指定拼接的新Buffer的长度的
例如：
let b =Buffer.from("珠峰")
let _b = Buffer.from("构架")
let maxB= Buffer.concat([b,_b])
console.log(maxB.toString()) //珠峰构架




上面是把珠峰和架构拼到一起但是我只想要：珠峰构
let b =Buffer.from("珠峰")
let _b = Buffer.from("构架")
let maxB= Buffer.concat([b,_b],9)  //参数二指定了这个新拼接Buffer只有9个字节，所以b和_b用共有有12字节，只能拼出9个，都有就是：珠峰构
console.log(maxB.toString()) //珠峰构



//使用concat方法的第二参数指定新Buffer的长度：
let b =Buffer.from("珠峰")
let _b = Buffer.from("构架")
let maxB= Buffer.concat([b,_b],20)  // 指定的长度为20个字节但是 b和_b一共的长度才是12个字节，剩下八个字节会用0来占位
console.log(maxB) //<Buffer e7 8f a0 e5 b3 b0 e6 9e 84 e6 9e b6 00 00 00 00 00 00 00 00>


封装Buffer的静态方法concat()
Buffer.concat = function(bufferList,length){
  if(length==="undefined"){
    length = 0;
    bufferList.forEach(buffer=>{
      length++ = buffer.length
    })
  }
  let newBuffer = Buffer.alloc(length);
   let offset=0
  bufferList.forEach(buffer=>{
    buffer.copy(newBuffer,offset)  //copy的后面两个参数不传，默认会将目标Buffer的内容全部拷贝
  offset+=buffer.length
  })
}
*/












/*
Buffer类似于数组它有长度（长度是Buffer中的字节长度）和下标（下标是Buffer中的字节下标）,同时Buffer也有一些类似数组的操作方法如下：
let b = Buffer.from([12,14,11])
console.log(b[1]) //14
console.log(b.length) //3



第一个Buffer的操作方法slice()表示在源内存地址上截取一部分Buffer，有两个参数，参数一位开始截取的下标（截取时包含开始下标），参数二为截取的结束下标（截取时不不包含结束下标），但当不传第二个参数时，表示第一个参数为开始下标开始截取截取掉最后
用法：
let b = Buffer.from([1,2,3,4,5,6,7,8,9])
  console.log(b)           //<Buffer 01 02 03 04 05 06 07 08 09>
  console.log(b.slice(0)) //<Buffer 01 02 03 04 05 06 07 08 09>  //全部截取
  console.log(b.slice(1)) //   <Buffer 02 03 04 05 06 07 08 09>  //从下标1开始截取直到最后
  console.log(b.slice(2,5))//     <Buffer 03 04 05 >     //从下标2开始截取，截到下标5.不包括下标为5的



因为slice方法截取出的一段Buffer指向还是原来的内存地址所以当截取出来的内容发生变化了，原来的Bufer的内容也就改变的例如：
let b = Buffer.from([1,2,3,4,5,6])
console.log(b)  //<Buffer 01 02 03 04 05 06>
let _b = b.slice(0,1)
_b[0] = 100
console.log(b) //<Buffer 64 02 03 04 05 06>
原来的Buffer的第1项也会改变

*/




/*
还有一种声明Buffer的方法但是不安全的;
let B  = Buffer.allocUnsafe()  //一个参数为数值表示，表示声明Buffer的字节长度是多少
但这种Buffer.allocUnsafe()声明方式会到内存中随机取一段和你声明字节长度一样长的Buffer
由于是随机抓取有可能抓取的是敏感信息，
注意这个抓取来是指拷贝一份给这个新Buffer，是内容和抓取的一样，引用的内存地址可不是一个



Buffer.allocUnsafe() 和Buffer.alloc()的关系：
例如
Buffer.alloc(10)相当于 Buffer.allocUnsafe(10).fill(0)  //声明了是个空间把每个空间填上0

但是Buffer.allocUnsafe()声明会比Buffer.alloc()声明快，因为Buffer.allocUnsafe()直接抓在内存中抓取，不用在把声明的空间填0
*/




/*
Buffer.isBuffer() //用来判断是不是Buffer的
例如
let b =Buffer.from("珠峰")
let n = 123
console.log(Buffer.isBuffer(b)) //true
console.log(Buffer.isBuffer(n)) //fasle
*/


/*
indexOf() 查找Buffer出现的位置返回出现位置的下标（为字节的下标），没有找到返回-1，两个参参数，参数一为要查找的，参数二为从下标为几的那个字节查找,如果没有第二个参数查找的为第一次出现的，
let b = Buffer.from("你好吗")
console.log(b.indexOf("好"))  //3

let b1 = Buffer.from("你好吗你好")
console.log(b1.indexOf("好",9)) //12

*/

/*
Buffer没有split截取方法在使用时需要手动封装：
Buffer.prototype.split =function(sep){
  let arr = [];
  let offset = 0 ; //偏移位置
  let current = 0; //找到的引索
  let len = Buffer.from(sep).length
  while(-1 != (current = this.indexOf(sep,offset))){
    arr.push(this.slice(offset,current))
    offset = current+len
  }
  arr.push(this.slice(offset)) // indexOf()返回-1时，不在进入while循环将剩下的字节存入arr中
  return arr;
}
let  b= Buffer.from("你好吗你还好吗你22222")
let list = b.split("你")
console.log(list) // [ <Buffer >, <Buffer e5 a5 bd e5 90 97>,<Buffer e8 bf 98 e5 a5 bd e5 90 97>,<Buffer 32 32 32 32 32>] ,第一项为一个空Buffer是因为slice(0,0)截出来的就会是空的Buffer
list.forEach(buffer => {
  console.log(buffer.toString())  //  好吗  还好吗  22222  在输出的好吗前面会有一个空串，因为slice(0,0)截出来的就会是一个空字符串
});
*/









let str = "好吗你还好吗你22222"
console.log(list.length,2)
console.log(str.slice(0,0),1)