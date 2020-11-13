import serve from 'rollup-plugin-serve';
import babel from 'rollup-plugin-babel';
export default {
  //用于打包配置
  input: "./src/index.js", //入口文件
  output: {
    file: "dist/vue.js", //打包的到路径
    name: "Vue", //全局的名字（全局变量的名字）；
    format: "umd", //模块格式（叫统一模块规范） umd格式可以支撑es6规范和CommonJs规范，umd格式默认把全局的变量放到window上（window.Vue）
    sourcemap: true, //源码映射文件 例如打包后es6转成es5的，而我们要看es6的所以要用sourcemap映射；
  },
  plugins: [
    babel({
      exclude: "node_modules/**", //这个目录不需要babel配置；
    }),

    serve({
      open: true,
      openPage: "/public/index.html",
      port: 9000,
      contentBase: "",
    }),
  ],
};




