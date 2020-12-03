/* 

执行node文件，在命令行输入 node 文件的路径+文件名
因为在下载node的时候node会自动配置电脑的环境变量
电脑中的环境变量是什么意思？有什么作用！
比如你打开DOS窗口输入命令： node
此时windows干了什么事呢？
它首先去当前目录下找node.exe
如果发现没有就去shusystem32下找
如果还没有就去你电脑中配置的环境变量中找了，如果这里也没有，那么就告诉你没有这个命令

电脑的环境变量分为系统的环境变量和用户的环境变量，
系统环境变量，对所有用户起作用,而用户环境变量只对当前用户起作用。
例如你要用java，那么你把java的bin目录加入到系统的path变量下面，所用用户登陆，这台电脑。在命令行输入java都会有java的帮助信息出来。而如果你在某个用户的变量下面新建一个变量，那么它就只对这个用户有用，当你以其他用户登陆时这个变量就和不存在一样。（一个电脑可以添加多个用户）
*/





/*
npm  : node默认安装会送一个npm (npm的全名叫 node package manage表示node的包管理器)

nvm ：nvm的作用是切换node版本的，安装方法：
mac 安装nvm：在命令行输入 brew install nvm 就可以了，
如果是window 需要在github上下载 nvm-window，下载nvm-srtup.zip的版本输入nvm -v查看是否安装上了吗，如果没有重启电脑试试



nrm:
nrm(npm registry manager )是npm的镜像源管理工具，有时候国外资源太慢，使用这个就可以快速地在 npm 源间切换

2.安装nrm

在命令行执行命令，npm install -g nrm，全局安装nrm。

3.使用

执行命令nrm ls查看可选的源。

nrm ls                                                                                                                                   

*npm ---- https://registry.npmjs.org/

cnpm --- http://r.cnpmjs.org/

taobao - http://registry.npm.taobao.org/

eu ----- http://registry.npmjs.eu/

au ----- http://registry.npmjs.org.au/

sl ----- http://npm.strongloop.com/

nj ----- https://registry.nodejitsu.com/

其中，带*的是当前使用的源，上面的输出表明当前源是官方源。

5.切换

如果要切换到taobao源，执行命令nrm use taobao。

6.增加

你可以增加定制的源，特别适用于添加企业内部的私有源，执行命令 nrm add <registry> <url>，其中reigstry为源名，url为源的路径。

nrm add registry http://registry.npm.frp.trmap.cn/

7.删除

执行命令nrm del <registry>删除对应的源。

8.测试速度

你还可以通过 nrm test 测试相应源的响应时间。
nrm test npm                                                
*/



//node中this是谁？
//在命令行输入node回车在输入this回车这时的this为global

/*
但是如果你在命令行运行这个文件this就不是gLobal了
例如：在当前文件下有console.log(this)执行当前文件：node  ./node基础.js 输出：{}  ,这时this、指向的为module.exports默认为空对象所以就输出了了{}
因为node中有commonjs规范，表示所有的代码写到文件中，文件内部会自带一个函数，这个函数执行的时候改变了this
*/
//console.log(this)   // 输出：{}  




// 如果我在自执行函数中写console.log(this) 打印出来的就是 global了   //只执行函数的this为全局的
// (function(){
//   console.log(this)  //global    
// })()





// 如果我们想用global可以直接访问global
//注意在浏览器中是不可直接访问global的，都是通过window来代理的；
console.log(global)  //consloe.log打印的global属性是不全的
console.dir(global,{showHidden:true})  //用这样答应会将所有的global上的属性和变量都答应出来
/*
console.log()会在浏览器控制台打印出信息
console.dir()可以显示一个对象的所有属性和方法
*/




/*
是否为globle的上的方法和属性具体查看node的文档global-全局变量，有些变量虽然看似全局的，但实际上不是。 它们仅存在于模块的作用域中
*/




/*
global上的setImmediate可不是IE上的那个setImmediate而是node自己实现的
*/




//什么样的是全局的变量那，既可以用global.名字访问又可以直接 名字  访问的
//例如： Buffer类  ，是用于处理二进制的类
console.log(global.Buffer)  //输出：[Function: Buffer] {.......
console.log(Buffer)   // //输出：[Function: Buffer] {.......
//global.Buffer 和  Buffer都能访问像这样的就是全局的






//自执行函数的this永远是全局在浏览器里面就是window在node里面就是global(但这个自执行函数是普通函数而不是箭头函数)
//例如：
function fn (){
  console.log(this);   //{}  利用call将this指向{}
  (function(){
    console.log(this) //global， //自执行函数的this永远是全局的
  })()
}
fn.call({})