const Vue =  require("vue");
const Koa = require("koa");
const Router = require("koa-router")
const VueServerRenderer = require("vue-server-renderer")
const fs = require("fs")
const path = require("path");
const vm = new Vue({
  data(){
    return{
      name : "zf"
    }
  },
  template:`<div>{{name}}</div>`
})

//利用fs模块读取html模板；
const template = fs.readFileSync(path.resolve(__dirname,"template.html"),"utf8")

//const tmpl = VueServerRenderer.createBundleRenderer
// VueServerRenderer是ue的服务端渲染模块，
//VueServerRenderer.createRenderer()为创建一个渲染器；
/* VueServerRenderer.createRenderer({ template:template}) 指定模板。将渲染的内容和模板混合在一起
  这里有这样的代码render.renderToString(vm)(注：render.renderToString(vm)也就是：VueServerRenderer.createRenderer({ template:template}).renderToString(vm))   
是将 vm混合在模板中那混在哪里那就需要在html文件中写占位符 <!--vue-ssr-outlet--> 意思是将要混入的内容放到html里的<!--vue-ssr-outlet-->位置上；
注意这个占位符<!--vue-ssr-outlet-->内不要加空格；
*/
const render = VueServerRenderer.createRenderer({
  template:template
})
const app = new Koa();
const router = new Router();
app.use(router.routes()); // koa应用中加载了路由系统；
router.get("/",async(ctx)=>{
   ctx.body = await render.renderToString(vm) // render.renderToString(vm)将vm实例渲染成字符串返回一个Promise
})

app.listen(3000,"127.0.0.1",()=>{
  console.log('成功')
});