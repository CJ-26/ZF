import ts from 'rollup-plugin-typescript2';
import {nodeResolve} from "@rollup/plugin-node-resolve"
import path from "path"
import serve from "rollup-plugin-serve"
// rollup是支持es6语法的所以用 export default 和 import from 就可以；
export default {
  input: 'src/index.ts',
  output: {
    //format可配置的模式,有amd  iife  commonjs umd 等等
    format: "iife", // 导出的格式。 iife为导出后立即执行，（也就是打包后是一个只执行函数）
     file:path.resolve(__dirname,"dist/bundle.js"),
     sourcemap:true, // 根据源码生成映射文件
  },

  plugins:[
    nodeResolve({
      extensions:['.js','.ts']  // 解析第三方插件，找 .js  .ts 结尾的文件
    }),
    ts({
      tsconfig:path.resolve(__dirname,"./tsconfig.json")   // ts的配置文件
    }),
    serve({
      open:true,
      openPage:"/public/index.html",
      contentBase:"",
      port:8080,
    })
   ]
  }