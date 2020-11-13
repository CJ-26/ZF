===
vue服务端渲染需要的包
cnpm install vue vue-server-renderer koa koa-router -S
vue:vue框架包
vue-server-renderer:vue服务端渲染模块；
koa : node框架
koa-router : koa路由



合并配置：webpack-merge
cnpm i webpack-merge -D

例如：有一个公共的webpack配置，还有两个配置要用到这个公共的就可以用webpack-merge
用法：
const {merge} = require("webpack-merge");

module.exports=merge(base,{  // base为公用的会将当前的和dase进行合并；
})









nodemon插件可以运行node的server
cnpm i nodemon -g
nodemon的使用打开要运行的文件所在的文件夹，在命令行输入：nodemon 运行的文件名  例如： 要运行的文件为server.js
就输入nodemon server.js


cnpm i vue vue-loader vue-tamplate css-loader webapck webapck-cli @bacle/core babel-loader @babel/preset-env html-webapck-plugin webapck-dev-server  -D


可以多个脚本同时进行的包:
cnpm i concurrently -D
用法：下载之后在package.json中的配置
"scripts": {
      "client:build": "webpack --config ./build/webpack.client.js",
      "server:build": "webpack --config ./build/webpack.server.js",
      "run-all": "concurrently \"npm run client:build -- --watch\" \"npm run server:build -- --watch\""
  }

 //静态服务服务文件夹的包： npm i koa-static -D
 npm i koa-static -D是koa中的包
 用法：
 