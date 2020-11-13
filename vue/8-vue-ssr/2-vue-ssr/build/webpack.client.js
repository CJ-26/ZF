const base = require("./webpack.config");
const {merge} = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports=merge(base,{
  entry:{
    client:"./src/client-entry.js",
  },
  plugins:[
    new HtmlWebpackPlugin({
      minify:false, // 打包的html为不压缩的；
      template:"./pubilc/index.html",
      filename:"./assets/index.html"
    })
  ],
  devServer:{
    contentBase:"./dist/assets",
    open:true,
    port:9000,

   }
})