/*在node中有一些不算全局属性，的属性叫模块属性
例如：__dirname __filename require module exports
*/

/*
在没有模块化的时候：使用单例模式和自执行函数来解决模块化的问题                                                            
单例模式的缺点是无法保证共同开发的时候命名冲突例如：
一个人let obj ={} 而另一个也 let obj={} 注：一个对象就是一个单例，可以存放方法和 属性

模块化设计的初衷是为了解决冲突实现高内聚低耦合；
目前模块规范比较火的有ES6的esModule规范和commonjs规范 umd规范(umd规范为统一规范它整合了commonjs和AMD但是不包括esmodule规范)
*/

/*
commonjs和es6的模块化的区别：
commonjs规范是依赖node的，可以按需依赖，例如：
if(true){
  require("xxx")
  
}

es6模块不能实现按需加载是静态的，所以每次引用都要在文件的顶端作用域引入，就是最外层作用域

commonjs规范是无法实现tree-shaking
 
es6模块是可以实现tree-shaking的

为什es6的能实现tree-shaking那，而commonjs不能那？
因为 es6的引用方式可以改写例如：
import{Button} from "vant"引用了vant中的Button，因为已经知道
因为的是一个Button了所以打包的时候就可以改写成 import Button from 'vant/lib/Button' 指应用一个Button就可以了呀；

而commonjs的require('vant')这样引入没办法确定自用了什么包了；
*/


/*
commonjs的规范：
1.每个文件都是一个模块
2.需要通过module。exports导出需要给别人使用的值
3.通知require拿到需要的结果
*/
/*
commonjs简单的原理：
例如在同文件夹下有：a.js文件下有module.exports ="holle" 
b.js文件下有 cosnt a = require("./a.js")

在b文件中是如何引入a文件的那？
首先回去读取文件中的内容，之后将内容用自执行函数包起来在return给const a
也就是const a = require("./a.js")的原理就是：
const a = (function(module,expirt,require,__dirname,__filename){
  module.exports = "holle"
  return module.export
})(module,expirt,require,__dirname,__filename)


*/

/*
commonjs中有三种模块：
1. 自定义模块也就文件模块（就是我们自己写一个文件之后用module.export导出require引入使用，自己写的这个文件就是自定义模块）                                                                                                                                    
2、第三方模块（npm只能装的）
3、内置模块也叫核心模块（node中自带的引用的时候不需要安装直接require引入就可以了）

*/

// fs内置模块
const fs =require('fs');
let r = fs.readFileSync('./1.js','utf8')   // fs.readFileSync(文件路径，编码格式) 为同步读取文件的方法
let r1 = fs.existsSync("./1.js") //fs.existsSync(文件)判断文件是否存在返回boolean

//path内置模块
let path = require("path")  //path模块为处理文件路径的模块
let p=path.resolve('1.js')  ////解析为一个绝对路径 默认会以process.cwd()解析运行根目录下的这个文件是会变的，要根据运的文件目录来决定
let p1 = path.resolve(__dirname,"./1.js") // 是以该文件目录为根目录中的1.js，也就是1.js的绝对路径，不会发生改变的；
let p2 = path.resolve(__dirname,"1.js","2.js") // 当有多个参数色为时候会拼接在一起  D:\练习代码\珠峰\nodejs\9-node\4-node-模块\1.js\2.js
let p3 = path.resolve(__dirname,"1.js","2.js","/")  //如果多个参数的时候遇到 / 就会回到根路径，盘符路径，这里的为:d:\
let p4 = paht.join(__dirname,"1.js",'2.js') // join和resolve几乎是一样的join表示是拼接在参数没有/的情况下是可以互换使用的当有/的情况下join会正常拼接而resolve会返回盘符路径；
let p5 = path.join(__dirname,"1.js","2.js","/") // 遇见/会正常拼接 ： D:\练习代码\珠峰\nodejs\9-node\4-node-模块\1.js/2.js/
// join和resolve还有一点不一样的就是 不写_dirname的情况下，path.resolve("1.js",'2.js');path.join("1.js","2.js") resolve会在运行目录进行拼接，而join只是单纯的拼接；

/*
因为__dirname也会使出固定的文件的固定的相对路径只要在拼接一个文件的名字就行了了例如：
let t=__dirname  
console.log(t) //  d:\练习代码\珠峰\nodejs\9-node\4-node-模块
t+"/1.js" 不是文件的路径了吗为啥好用path.resolve()那？

因为当运行文件的电脑系统不同文件的路径有的使用 /来拼接的但有的使用 \ 拼接的而path.resolve()会自动识别电脑系统的文件路径拼写是 /还是\
*/

// path.extname()获取文件的后缀
let p6 = path.extname("1.js")
console.log(p6) // .js
let p7 = path.extname("min.1.js")
console.log(p7)  //.js

//path.relative()路径相减；
let p8 = path.relative("a","a/b/1.js")
console.log(p8) // b/1.js

//path.dirname() 取目录名
let p9=path.dirname("a/b.js")
console.log(p9) // a




// vm模块
const vm= require("vm"); // 可以执行字符串代码：

//js中的eval()函数也可以执行字符串代码但有一个缺陷
//就是可以拿到字符串外面的变量没有沙箱机制例如：
let a = 1;
let v = eval("console.log(a)")
console.log(v)  // 会输出a ，没有沙箱机制（有沙箱机制就是不能拿到外面的变量）

// js中的new Function()可以将字符串变成函数来执行，有沙箱机制；
//例如:
let fn = new Function("console.log(1)")
fn()  //打印 1
let b = 2
let fn1 = new Function("console.log(b)")
fn1() // 报错 因为new Function() 存在沙箱机制是拿不到外面的 变量的

global.c = 3
let fn2 = new Function("console.log(c)")
fn2()  // 3 ,全局上的是可以拿到的

var  c = 3
let fn3 = new Function("console.log(c)")
fn3() //换成 var也会报错



// vm与new Function()运行方式相同，但是vm不需要将要运行的字符串包成函数 
vm.runInThisContext("console.log(e)") //报错
global.f= 6
vm.runInThisContext("console.log(f)")  //6