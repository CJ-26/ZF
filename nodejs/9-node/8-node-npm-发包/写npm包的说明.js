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




*/




