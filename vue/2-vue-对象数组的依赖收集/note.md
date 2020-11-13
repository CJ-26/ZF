 ```
rollup把包类库用的打包工具，webpack打包的比较多，而rullup比较纯粹；

#   rollup 和 balbe的桥梁  bable核心模块

@babel/core (使用babel的核心模块)
@babel/preset-env (将高级语法转换成低级语法)
cross-env (设置环境变量)
rollup-plugin-babel (桥梁)
rollup-plugin-serve (实现静态服务)
cnpm install rollup rollup-plugin-babel  @babel/core @babel/preset-env rollup-plugin-server  -D



package.json中的rollup启动项目的配置，dev: "rollup -c -w" 意为 ：rollup 使用rollup打包 -c为启用配置文件 -w意为当文件变化是重新打包
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev" : "rollup -c -w"
  },

```
app
 |
 