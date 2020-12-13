

//global上的重要属性之process

//process (process:代表进程，可以在当前程序运行时获得一些环境和参数) 

//process下常用的属性：


// process.platform
/* 
process.platform表示当前代码运行在什么平台上，值有：
'aix'
'darwin'   ：表示代码运行在mac系统上
'freebsd'
'linux'      ：表示代码运行中Linux系统上
'openbsd'
'sunos'
'win32'  ：表示代码运行在window系统上


process.platfrom使用场景：
每个系统找一些用户文件，文件的位置可能不同，例如window系统下
用户文件在c盘下的用户文件夹里面路径就是：C:\Users，但mac的用户文件的位置肯定和window的不同，

*/
//console.log(process.platform)   //当前的电脑为window系统所以这里打印出了： win32





//process.cwd:
/*
process.cwd  (cwd的全名是：current working directory表示当前的工作目录)
process.cwd()//输出的是项目的根目录。例如：在d盘下有app文件夹，app文件夹下有item文件夹
item文件夹中有1.js文件，当我在item文件夹下输入命令node ./1.js 运行js文件，此时的根目录为：item
process.cwd()的返回值为：d:\app\item，
当我在app文件夹下输入命令 node ./item/1.js  运行js文件，此时的根目录为app
process.cwd()的返回值为：d:\app

所以process.cwb()的返回值为运行目录，也可以说时项目的根目录
*/
//console.log(process.cwd())   //输出结果要看运行的根目录在当前目录运行输出为：d:\练习代码\珠峰\nodejs\9-node\2-node-global上重要属性   



/*
process.chdir() 方法变更 Node.js 进程的当前工作目录，
如果变更目录失败会抛出异常（例如，如果指定的 目录不存在 不存在）。
try {
  process.chdir('/tmp'); //变更 Node.js 进程的当前工作目录为tmp文件夹下
} catch (err) {
  console.error(err);
}

*/
// 例如： 
//process.chdir("../../../")  //变更目录为当前文件夹的上一级的上一级的上一级的文件夹下
//console.log(process.cwd(),"222") //  由于使用了process.chdir()变更了目录所以在当前目录中执行输出为： d:\练习代码\珠峰




// 在node中还有一个属性能输出文件的绝对路径，__dirname这个属性不是global的属性
//__dirname与process.cwd()相比__dirname表示的路径时死的就是这个文件的绝对路径，而process.cwd()返回的路径是项目运行的根目录的路径，具体要看项目在哪个文件夹下运行，输出的就是哪个文件夹的绝对路径，是可变的由项目在那个目录下运行有关
//console.log(__dirname)  // 输出为：d:\练习代码\珠峰\nodejs\9-node\2-node-global上重要属性





// peocess.env 用来获取环境变量的H或者设置当前环境的临时变量。
// 设置临时变量的用法：window 的用法:cmd命令行输入 set 变量名=变量值 例如：
//set NODE_ENV = development 之后运行node 文件名
// 如果是 window powerShell窗口则输入 $env:变量名 = "变量值"例如：$env:NODE_ENV = "development",必须有引号否则报错
//mac系统设置环境变量例如：export NODE_ENV = development
//也可以用cross-env包来设置用法全局安装: npm i cross-env -g
//cross-env的使用方法为：
//window：在命令行直接入例如设置环境变量为a=b,则 cross-env a=b nodejs 运行文件名 之后 按回车
//mac：在命令行直接入例如设置环境变量为a=b,则 cross-env a=b && nodejs 运行文件名 之后 按回车
//记住设置临时变量只针对当前环境
//console.log(process.env)   //读取电脑的所有的环境变量   




//process.argv:会输出用户执行的时候出传递的参数例如：
/*webpack中当你配置运行命令为 "dev":"webpack --config ./config/webpackconfig.js" 其中--config ./config/webpackconfig.js就是参数webpakc也是利用
process.argv获取的获取的内容为["--config","./config/webpackconfig.js"]*/
/*
process.argv的用法例如运行当前文件：
在命令行输入 node ./global重要属性之process.js --port 3000 --config webpack.config.js 
console.log(process.argv) 输出为
[
  'C:\\Program Files\\nodejs\\node.exe',
  'D:\\练习代码\\珠峰\\nodejs\\9-node\\2-node-global上重要属性\\global重要属性之process.js',
  '--port',
  '3000',
  '--config',
  'webpack.config.js'
]
'C:\\Program Files\\nodejs\\node.exe'表示node的安装路径为固定的所以获取node的安装路径可以使用process.argv[0]
'D:\\练习代码\\珠峰\\nodejs\\9-node\\2-node-global上重要属性\\global重要属性之process.js', 为运行文件的绝对路径也是固定输出的获取运行文件的路径可用process.argv[1]
数组下标1以后的内容为一次传递的参数。
因为process.argv获取的是一个数组需要进行参数解析，带--的为key，带--的下一项为它的value开始解析：
let program = {}
process.argv.slice(2).forEach((item,index,arrr)=>{
  if(item.startsWith('--')){   
    program[item.slice(2)] = arr[index+1]
  }
}) 
console.log(program)  // {port:"3000",config:"webpack.cofig.js"}
startsWith() 方法用于检测字符串是否以指定的子字符串开始。如果是以指定的子字符串开头返回 true，否则 false。startsWith() 方法对大小写敏感。



与process,argv一起使用的包commaner，用经行参数解析的使用方法：
安装commaner：npm i commander   
引入：const program = require("commander")
program.option("-p,--port <v>","端口号")   // -p 为别名  ，--port为名字 ，<v>为变量接收传递的参数 ，端口号为说明 （注意：--port <v>之间必须有空格）
program.option("-z,--zh-lang <v>","语言")  //  -z 为别名  ，--zh-lang为名字 ，<v>为变量接收传递的参数 ，端口号为说明，因为--zh-lang使用-来连接zh和lang的所以根据commander的使用发方法，在输出zh-lang的时候要用小驼峰的命名规则代替-例如console.log(program.zhLang)（注意：--zh-lang <v>之间必须有空格）
program.option("-s,--sex <v>","性别","男")   //  -s 为别名  ，--sex为名字 ，<v>为变量接收传递的参数 ，端口号为说明，男：为默认值（注意：--sex <v>之间必须有空格）
program.parse(process.argv);  // 解析用户传入的参数
在命令行输入 node 文件名 --port 3000 --zh-lang en    
或者在命令行输入：在命令行输入 node 文件名 --p 3000 --z en
console.log(program.port) // 3000s
console.log(program.zhLang) // en
console.log(program.sex) // 男


process.argv和commander包配合使用可在脚手架和工程化工具中解析用户传递的各种参数.


// 定义命令，例如创建vue-cli 输入的命令vue create 名字
例如：
const program = require('commander')
program.command("tj create").description("此时省略一万字").action(()=>{
  console.log("执行",program.args) //在命令行执行：node 文件名  tj create xxx。输出为：执行 [ 'tj', 'create', 'xxx' ]
})
program.parse(process.argv)
  

--help输出项目中传递的参数和参数说明例如：
const program = require('commander')
program.option("-p,--port <v>","端口号")  
program.option("-z,--zh-lang <v>","语言")
program.parse(process.argv)
在命令行输入 node 文件名  --help
会在命令行中输出：
Usage: global重要属性之process [options]
Options:
  -p,--port <v>     端口号
  -z,--zh-lang <v>  语言
  -h, --help        display help for command






  on() //on属性可以在--htlp输出中定义自己要输出的命令; （监听--help命令）
  const program = require("commander")
   program.option("-p,--port <v>","端口号")  
    program.on('--help',()=>{
  console.log("HollHollHollHoll")
  })
program.parse(process.argv)

命令行输入命令：node 文集名  --help
Usage: global重要属性之process [options]
Options:
  -p,--port <v>  端口号
  -h, --help     display help for command
HollHollHollHoll                  //自定义说明

*/
























// Buffer：(global上重要属性Buffer用来处理用于处理二进制数据，)
//因为在node中js是运行在服务端的，那我们就需要处理二进制数据流，数据都是以二进制包的形式发到服务器的，例如上传图片，服务器收到的是该图片二进制的包，再比如用户发一个请求，发到服务器也是二进制包的形式

