const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin") //如果使用vue-loader就的使用VueLoaderPlugin
module.exports = {
  output:{
    filename:"[name].bundle.js",
    path:path.resolve(__dirname,"../dist")
  },
  module:{
    rules:[
      {
        test:/\.vue$/,
        use:"vue-loader"
      },
      {
        test:/\.css$/,
        use:[
          "vue-style-loader",
         {
           loader: "css-loader",
           options:{
             esModule:false
           }
         }
        ]
      },
      {
        test:/\.js$/,
        exclude: /node_modules/, 
        use:{
          loader:"babel-loader",
          options: { presets: ["@babel/preset-env"] },
        }
      }
    ]
  },
  plugins:[
    new VueLoaderPlugin()
  ],
  
}