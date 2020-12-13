//文件模块的解析流程 解析流程每个版本都不一样,  大致的流程；
/*
在require引入的时候不添加后缀名的情况下找文件的流程是：
先找这个名字的文件之后会去匹配文件后缀匹配文件后缀的顺序是先匹配.js文件如果就引入如果没有在匹配.json文件匹配到了就返回
如果文件没有引入的这个名字在去找文件夹找到文件夹去找文件夹中的index.js文件

但在老本版本中如果require引入的文件没有后缀，但在这个路径下有一文件名和一个文件夹名都是引入的这个名字，但是文件夹的里面有package.json文件则就会先找文件夹
例如：有文件夹里面有a文件夹和a.js文件，和b.js文件但a文件夹中有backage.json文件内用为{nain:"index.js"}; 还有index.js文件，
当在b.js文件中let r = require("./a")这会直接找a文件夹下的index.js而不是先找a.js文件因为有backage.json文件的为一个包node老版本默认先找包





*/
let r = require("./jquery")
console.log(r)  //Holle


/*
如果require一入的没有 ./或者../ 或者决定路径，它会认为此模块为第三方模块或者为内置模块

*/

//第三方模块也就是npm下载的模块会放到node_modules文件夹下的本地第三方
/*
第三方模块查规范：module.paths
 console.log(module.paths) 在当前文件打印输出为：
 [
  'd:\\练习代码\\珠峰\\nodejs\\9-node\\6\\node_modules',
  'd:\\练习代码\\珠峰\\nodejs\\9-node\\node_modules',
  'd:\\练习代码\\珠峰\\nodejs\\node_modules',
  'd:\\练习代码\\珠峰\\node_modules',
  'd:\\练习代码\\node_modules',
  'd:\\node_modules'
]
由此找第三方模块的的属性会逐层向上查找node_modules文件知道找到找到位置最到盘符目录下如果没有就没有了
*/
const j = require("jquery")
 console.log(j) //jquery
 console.log(module.paths)

 //第三方模块分为全局模块和本地模块：
 //本地就是项目中下载安装在node_modules中的
//全局模块就是-g安装的全局模块只能只命令行使用 
//因为npm是放到全局下所以npm先的命令是可以直接执行的；

//全局模块（-g安装的只能命令行使用）和本地模块(就是安装到项目中的也就是项目中的node_modules中的)那什么时候安全局什么时候安本地那？
//如果这个包只能安全局那就安在全局但像webpack就要安装在本地

/*在安装在本地又分为两种情况:
 npm install .. ---save  (简写为 npm i ... -S或者不写直接npm i ...) 安装在生产环境
 npm install ..--save-dev (简写为 npm i ... -D)   安装在开发环境
 */


 /*
 
 
 */