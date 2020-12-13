// const r =require("./a")
// console.log(r)
/*
如何调试node：
第一中可以通过chrome浏览器调试
在命令行输入命令 node  --inspect-brk 文件名例如调试当前文件：
 node  --inspect-brk index.js
 运行这个命令后代码会停留在第一行
 之后在谷歌浏览器中输入： chrome://inspect/#devices
 之后点击 inspet

 第二种调试方法：
1. 点击左边工具第三个按钮
2.单机完按钮会提示创建launch.json文件点击
3.点击创建launch.json文件之后会在编辑器的顶端弹出你要调试什么代码，调试node就选择Nodejs
3.选择了Nodejs会自动生成launch.json文件内容如下：

{
  // 使用 IntelliSense 了解相关属性。 
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "启动程序",
      "skipFiles": [
        "<node_internals>/**"  //这句话表示调试自己写的代码，如果删掉就可以看nodejs的源码了
      ],
      "program": "${workspaceFolder}\\index.js"  。。要调试的文件
    }
  ]
}

4.之后想调试哪一行代码在显示点击显示行数的地方就可以打一个断点了；

5.之后在点击左边工具第三个按钮会有有一个启动程序点击就可以了
*/



/*
靠打断点的方式查看require(）大致实现逻辑：
  1.require是一个函数内部会返回一个mod.require方法：
  require = function（path）{
    return mod.require(path)
  }
  2.mod.require方法为Modlue的原型上的方法：
  Modlue.prototype.require = function(id){
    return Modlue._load(id,this)
  }

3.mod.require方法会返回Modlue._load(id,this)的返回值（Modlue._load(id,this)为模块加载方法是Module上的静态方法）

4。Module._load = function(require,parent,isMain){

}

5.会执行Module._load中的const filename = Module._resolveFilename(require,parent,isMain) 用于解析文件名，变成一个绝对路径，并且加文件的后缀

6；会去判断引入的模块是否为原生的模块，是就加载原生模块不是就创建模块new Module(filename,parent)

7。Module上会有两个重要的属性，id模块的路径，exports一个空对像，最终会把模块的结果方到exports上，在文件中
require引入模块的时候，其实获取的就是modlue.exports
8.调用Module.prototype.load经行模块的加载
9.模块有json模块js模块等等。如果我不传文件后缀他会根据不同的文件后缀名，使用不同的策略去进行模块的加载
10.最核心的带码fs.readFileSync读取文件内容
11.调用module._compile方法作用是将fs.readFileSync读出来的内容用函数包裹起来在执行。
12.有一个这样的数组 const wrapper = ["(function(exports,require,module,__filename,__dirname){","\n});"] 
包装读取的script脚本，wrapper[0]+script+wrapper[1]






有node源码中可知：require是Module原型上的一个方法
*/


//简单实现require()
const path =require("path")
const fs = require("fs")
const vm = require("vm")


//Module构造函数：
function Module(id){
 this.id = id;
 this.exports = {}
}

//策略模式不同后缀对应这不同的方法
Module.extensions = {
  ".js"(modulde){
   let script = fs.readFileSync(modulde.id,"utf-8")
   let code  = `(function(exports,require,module,__fliename,__dirname){
     ${script}
   })`
   let func  = vm.runInThisContext(code)  //将字符串用函数包裹
   let exports = modulde.exports;  
   let thisValue = exports;
   let dirname = path.dirname(modulde.id) // 去掉文件名输出文件名，输出剩下的路径,例如：console.log(path.dirname("app/common/1.js")) 输出app/common
   console.log(dirname)//d:\练习代码\珠峰\nodejs\9-node\5-node-commonjs 
   func.call(thisValue,exports,req,modulde,modulde.id,dirname)  
  },
  ".json"(modulde){
    let script = fs.readFileSync(modulde.id,"utf-8")
    modulde.exports = JSON.parse(script)
  }
}
Module._resolveFilename =function(id){
let filePath = path.resolve(__dirname,id)
let isExsits = fs.existsSync(filePath) // 看一下这文件是否存在
if(isExsits){ //文件存在直接返回该文件的绝对路径
  return filePath
}
 //如果文件不存在尝试给文件添加后缀名，看是否存在，有时用户可能不会传文件的后缀只传了文件名
 let keys = Object.keys(Module.extensions)
 for(let i=0;i<keys.length;i++){
   let newFilePath = filePath+keys[i];
   if(fs.existsSync(newFilePath)) return newFilePath
 }
 throw new Error("模块文件不存在")
}
Module.prototype.load = function(){
  //核心加载方法根据不同的文件后缀进行加载；
 let extname =  path.extname(this.id)  // 获取文件的缀名
 Module.extensions[extname](this) 
}
Module._cache = {};// 用于缓存防止多次引用，引用文件会被引引来多次，如果已经引入一次了在引入就是用缓存中的了
Module._load = function(id){
  let filename = Module._resolveFilename(id) //将用户的路径变成绝对路径
   if(Module._cache[filename]){
       return Module._cache[filename].exports  // 如果缓存存在将上次的结果返回即可
   }
  let module = new Module(filename)
   module.load(); //加载模块，内部会读取文件，给Module的exports属性赋值                                                           
   Module._cache[filename] = module
  return module.exports
}
function req(id){  //require函数
  return Module._load(id)
}
const r = req("./a.js")
const _r = req("./b.json")
console.log(r)  // hello
console.log(_r)  //{ name: '小明' }


/*
commonjs问答：
1.module.exports和exports的关系是什么？
例如有文件a.js内容为：module.exports = "holle"
有文件b.js内容为 let r = require("./a.js")  consle.log(r) //  "holle";

因为在commonjs的源码中有这样的代代码：
module.exports = {}
let exports =  module.exports
return module.exports
那可不可以将代码改为：
文件a.js内容为exports = "holle"
有文件b.js内容为 let r = require("./a.js")  consle.log(r) 
就相当于这样的代码：
module.exports = {}
let exports =  module.exports
exports ="111" // 我报exports的值改了
return module.exports
简单来讲将的就是这个原理;

let a = b = {
  name:'xx'
}

a=3
console.log(a,b)  // 3  {name:'xx'}   // 意思为a和b指向同一个空间，但是我把a的指向改变边了，那b还是指向他原来的空间，此时a和b不受影响

所以：
件a.js内容为exports = "holle"
有文件b.js内容为 let r = require("./a.js")  consle.log(r)  这样写是不行的


那么我将文件改为这样：a.js内容为：exports.a = "holle"
有文件b.js内容为 let r = require("./a.js")  
那就相当于：

let exports =  module.exports ={}
exports.a = "holle"
return module.exports   // exports和module.exports 指向同一空间而exports在这个空间之中怎增加了个属性，module.exports上当然也会有呀因为指向的都是同一个空间；
当consle.log(r) 会输出 {a:"holle"}






2、例如有文件a.jsa.js内容为：module.exports = "holle"
有文件b.js内容为 let r = require("./a.js")  
问a.js和b.js中global是一个吗？
是同一个global（所有相关联的文件都是同一个global）
有如下代码：a.js内容为：module.exports = "holle"  global.abc = 1000
有文件b.js内容为 let r = require("./a.js")  
consle.log(abc) // 会输出 "holle"; 证明是同一个global


原因： 因为：在require()的时候 会将读取引入文件件的内容在包裹函数执行，那这个函数也就相当于在reuire()文件中的函数所以是一个global

但是这样尽量不要使用可能会影响全局变量污染；




3.如果有这样的代码：文件a.jsa.js内容为：module.exports = "holle"；exports.a = "111"
有文件b.js内容为 let r = require("./a.js") 那么r会是什么那？

r会是：holle
因为：
let exports =  module.exports ={}
module.exports = "holle"
exports.a = "holle"
return module.exports   //开始的时候exports和module.export指向同一个空间，之后module.exports的空间改变成了module.exports = "holle"，exports的空间还是之前的在之前的空间中添加a属性但是最终返回的是module.exports，和exports指向的空间没有关系的所以r是holle





4、例如： 文件a.jsa.js内容为：let obj = {a:1} setTimeout(()=>{obj.a =2}); module.exports = obj
有文件b.js内容为 let r = require("./a.js")  
console.log(r) // {a:1}
setTomeout(()=>{
console.log(r) // {a:2}
},2000)

因为数据为引用类型即使是有缓存但是缓存的地址指向还是原来的指向
*/