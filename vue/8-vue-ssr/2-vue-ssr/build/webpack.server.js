const base = require("./webpack.config");
const {merge} = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports=merge(base,{
  entry:{
    server:"./src/server-entry.js",
  },
  target:"node", // 暴露出去 给node使用，也就是 可以在其它的文件中引入 用require()来引入
 output:{
  libraryTarget:"commonjs2" // 把打包的js文件变成 module.exports = ()=>{} 用于导出
 },
  module:{
   rules:[

   ]
 },
 plugins:[
  new HtmlWebpackPlugin({
    template:"./pubilc/index.ssr.html",
    filename:"index.ssr.html",
    excludeChunks:["server"] ,//排除不引入生成html的文件这里的server就是entry:{server:"./src/server-entry.js",}里面的server
    minify:false, // 打包的html为不压缩的；
    client:"client.bundle.js", //一个接口：表示打包生成的html文件中要引入什么用法进下面
  }),
 
],
})


/*如何使用 new HtmlWebpackPlugin({}) 将一段内用添加在打包生成的html里面例如：
将 在  <title></title> 中添加标题 ，和添加<script ></script>使src的路径
new HtmlWebpackPlugin({
  title:"标题",
  client:"client.js" 
})

上面的 title和client属性都是自定义的随便写但在模板的HTML文件中的对应
 

在html模板文件中的写入内容： 
  <title><%=htmlWebpackPlugin.options.title%></title>
  <script src="<%=htmlWebpackPlugin.options.client%>" ></script>

<%=htmlWebpackPlugin.options.title%>表示为： 一个变量 值为htmlWebpackPlugin.options的配置属性中的title属性对应的值，这个title就是上面对应的自定义的title


这种写法<%=htmlWebpackPlugin.options.title%>为ejs语法


*/
