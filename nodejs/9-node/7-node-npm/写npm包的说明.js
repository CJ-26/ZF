/*
npm init  回车
package name:                      你的项目名字叫啥
version:                          版本号
description:                       对项目的描述
entry point:                      项目的入口文件（一般你要用那个js文件作为node服务，就填写那个文件）
test command:                     项目启动的时候要用什么命令来执行脚本文件（默认为node app.js）
git repository:                    如果你要将项目上传到git中的话，那么就需要填写git的仓库地址（这里就不写地址了）
keywirds：                       项目关键字（我也不知道有啥用，所以我就不写了）
author:                         作者的名字（也就是你叫啥名字）
license: (ISC)  MIT               发行项目需要的证书（ MIT:为开源的)



首先要建立bin文件夹。一般情况下可执行文件都要放在bin文件下
在bin文件下建立www文件为项目的入口
在package.json中配置一个变量为bin来告诉使用者我的这个包可以执行bin变量的值为这个包执行的命令，命令对应的是执行那个文件例如：
{
  "name": "haha",
  "version": "1.0.0",
  "description": "第一个包",
  "main": "index.js",
  "bin":{  // 添加bin变量
    "ha":"./bin/www"  //执行命令为ha执行的文件为./bin/www 也就是入口文件为www
  },
  "scripts": {
    "test": "node index.js"
  },
  "author": "th",
  "license": "MIT"
}

这个包配置好了之后想要在命令行使用，需要将这个包放到全局下也就是npm 。。。-g现在的目录里面
在本地了话可以使用npm root -g 来查找全局目录在那个文件夹下
如何将当前包放进全局那可以在当前包的目录下执行 npm link  （npm link是先将包暂时的链接在全局下，好处就是可以直接在命令行运行，做本地测试这个包好用不）
当执行完命令npm link 会输出：
C:\Users\jjj\AppData\Roaming\npm\ha -> C:\Users\jjj\AppData\Roaming\npm\node_modules\haha\bin\www
C:\Users\jjj\AppData\Roaming\npm\node_modules\haha -> D:\练习代码\珠峰\nodejs\9-node\7-node-npm


解释：
表示npm下又有一个ha命令这个命令执行的文件在： C:\Users\jjj\AppData\Roaming\npm\node_modules\haha\bin\www
C:\Users\jjj\AppData\Roaming\npm\ha -> C:\Users\jjj\AppData\Roaming\npm\node_modules\haha\bin\www

表示：全局包下有一个haha包 而C:\Users\jjj\AppData\Roaming\npm\node_modules\haha这只路径是一个虚拟路径指向D:\练习代码\珠峰\nodejs\9-node\7-node-npm这个指向的路径为真实路径
C:\Users\jjj\AppData\Roaming\npm\node_modules\haha -> D:\练习代码\珠峰\nodejs\9-node\7-node-npm

当执行完npm link 之后就可以直接在命令行运行但当我在命令行输入 ha 时
会输出： 
"C:\Users\jjj\AppData\Roaming\npm\\node_modules\haha\bin\www"' 不是内部或外部命令，也不是可运行的程序
或批处理文件。
因为他不知道www文件里面运行的是js代码呀，所以需要在www文件中加一个title（标题）来告诉它我运行的是js代码：
需要加上：#! /usr/bin/env node   意思为：使用本地的环境变量 node来执行也就是使用node环境来执行

注意文件执行环境变了需要重新执行npm link



当测试完这个包没有问题如何将包发送到npm上？
1、如果本地的npm源指向不是官方的npm源例如指向的是taobao那就需要先切换到npm的官方源上
2、登陆npm 明令为 npm addUser  （登陆前如果没有账号可以去npm官网注册一个）
$ npm addUser
Username: let-c  //用户名
Password: hanxu8130099        // 密码，密码是暗文看不见的哦
Email: (this IS public) 146795535@qq.com  // 邮箱
Logged in as let-a on https://registry.npmjs.org/.  // 登陆成功
登陆成功之后法法包命令为 npm publish
但是要要注意一下在发包前要在根路径下建立一个.npmignore文件用来告诉那些文件不要发上去
例如文件的内容为：
.vscode
1.js
表示.vscode和1.js文件不会发上去

注册npm时一定要记住邮箱验证否则发包不成功还有npm已有的包名也不要用否则发包也不会成功

发包成功后可以npm i 包名(就是backage.json中name对应的名字) 下载使用了

如果要升级包需要先更新版本号之后在npm publish 

删除npm 上的包 命令： npm unpublish --force


注意24只内就不能重新发同一个包了
*/

/*
项目的版本号
在文件加夹中会有有一个package-lock.json文件是npm5添加的用来锁定版本的
项目中所有的依赖都会在package-lock.json文件中管理防止，别的开发使用该项目时下载的依赖于原开发者使用的
不同（例如版本不同）导致项目出错，


版本号都是根据semver规范定义的规范分别定义为：
majon(大版本)
majon.minor(小版本)
majon.minor.patch(补丁)

版本写法问题：^  ~   >=   <=  
例如: 
"^2.0.0"这个表示 2版本以上3版本以下都是稳定版的
"~1.2.0" 表示只能大于等于1.2.0不能大于1.3.0版本是稳定的
">=1.2.0" 表示只能大于等于1.2.0
"<=1.2.0"表示只能小于等于1.2.0

为何都要限制大版本：因为大版本是大变化而 像2.1.0 2.2.0 一般只是增加一些api之类的不会影响代码的。执行
在像2.1.1  2.1.2 一般只是修改bug也不会对代码的执行有很大的影响                                         


*/



/*
pm install .. ---save  (简写为 npm i ... -S或者不写直接npm i ...) 安装在生产环境
 npm install ..--save-dev (简写为 npm i ... -D)   安装在开发环境
如果我把node_modules给删了只安装生产依赖命令为 npm install --production





常用的依赖：
生产依赖(dependencies)     开发依赖（devDependencies）    同版本依赖(peerDependencies)  捆绑依赖(也叫打包依赖)   可选依赖
例如安装：npm i bootstrap@3 和   npm i webpack -D则package.json中的内容为：
{
  "name": "let-ha-x",
  "version": "1.0.0",
  "description": "第一个包",
  "main": "index.js",
  "bin": {
    "ha": "./bin/www"
  },
  "scripts": {
    "test": "node index.js"
  },
  "author": "th",
  "license": "MIT",
  "dependencies": {  //生产依赖
    "bootstrap": "^3.4.1"
  },
  "devDependencies": {  //开发依赖
    "webpack": "^5.10.1"
  }
}


如果在package.josn中添加属性peerDependencies(同版本依赖)并将"bootstrap": "^3.4.1"从dependencies中移到peerDependencies中
{
  "name": "let-ha-x",
  "version": "1.0.0",
  "description": "第一个包",
  "main": "index.js",
  "bin": {
    "ha": "./bin/www"
  },
  "scripts": {
    "test": "node index.js"
  },
  "author": "th",
  "license": "MIT",
  "dependencies": {
    "jquery": "^3.5.1",
    "production": "0.0.2"
  },
  "devDependencies": {
    "webpack": "^5.10.1"
  },
  "peerDependencies": {  //同等依赖如果没有安装会提示需要安装这里面的包  //记住希写在这里npm i色时候是不会自动安装的；
    "bootstrap": "^3.4.1"
  }
}

并将node_modlues删除掉在执行npm i  --production (只安装生产依赖)时会提示：
npm WARN let-ha-x@1.0.0 requires a peer of bootstrap@^3.4.1 but none is installed. You must install peer dependencies yourself. //需要安装这个这个包但是你没有安
也就说peerDependencies里面的包在npm i的时候如果没有安装peerDependencies里的包会 提示你需要安装
peerDependencies里面的包npm i 时是不会自动安装的





捆绑依赖：
npm pack 命令会将当前的包打包成一个压缩包这个压缩包不会将.npmignore中写入的文件打包默认也不将node_modules打包
但是是我想将jquery也打包进去这个需要要将node_modules打包进入因为jquery的包肯定下载了node_modules中了所以要在
package.json中添加bundledDependencies（捆绑依赖）属性 将要压缩的依赖放进去:
{
  "name": "let-ha-x",
  "version": "1.0.0",
  "description": "第一个包",
  "main": "index.js",
  "bin": {
    "ha": "./bin/www"
  },
  "scripts": {
    "test": "node index.js"
  },
  "author": "th",
  "license": "MIT",
  "dependencies": {
    "bootstrap": "^3.4.1",
    "jquery": "^3.5.1"
  },
  "devDependencies": {
    "webpack": "^5.10.1"
  },
  "bundledDependencies": {  //使用命令npm pack 是添加要压缩的依赖
    "jquery": "^3.5.1"
  }
}

*/



/*
npm run  命令会将当前文件夹中的 node_modules下的bin目录添加到电脑的path环境变量中
所以当以在backage.json中的script中配置的命令使用npm run 命令就能执行了因为当npm run 的时候一已经将node_modules下的bin目录添加到电脑的path环境变量中中了添加后就相当于可以在命令行直接输入命令了
例如： npm run dev  先执行 npm run添加环境变量在dev执行dev对应的文件



npx会直接运行当前文件夹中的 node_modules下的bin下的命令但是本地如果没有安装这个包在使用npx执行时会
先去下载下载之后执行脚本并且删除掉(删除下载的包)
*/


/**
 npm是node赠送的在node5.2又赠送了一个npx
*/


/*

rm -rf 文件名 表示删除文件但是rm为linux命令需要在安装git时选择则支持linux就可以了
 */