const Koa = require("koa");
const Router = require("koa-router")
const VueServerRenderer = require("vue-server-renderer")
const fs = require("fs")
const path = require("path");
const static = require('koa-static');
const { STATUS_CODES } = require("http");


//利用fs模块读取html模板；
const template = fs.readFileSync(path.resolve(__dirname,"dist/index.ssr.html"),"utf8")
const bundle = fs.readFileSync(path.resolve(__dirname,"dist/server.bundle.js"),"utf8")
//const tmpl = VueServerRenderer.createBundleRenderer
// VueServerRenderer是ue的服务端渲染模块，
//VueServerRenderer.createRenderer()为创建一个渲染器；
/* VueServerRenderer.createRenderer({ template:template}) 指定模板。将渲染的内容和模板混合在一起
  这里有这样的代码render.renderToString(vm)(注：render.renderToString(vm)也就是：VueServerRenderer.createRenderer({ template:template}).renderToString(vm))   
是将 vm混合在模板中那混在哪里那就需要在html文件中写占位符 <!--vue-ssr-outlet--> 意思是将要混入的内容放到html里的<!--vue-ssr-outlet-->位置上；
注意这个占位符<!--vue-ssr-outlet-->内不要加空格；
注意： 创建渲染器有两种方式 第一种：VueServerRenderer.createRenderer({})这样创建的是根据字符串渲染的，
第二种：VueServerRenderer.createBundleRenderer({})是根据模块来渲染的；
VueServerRenderer.createBundleRenderer(bundle,{template:xx}) 参数一为要渲染的vue包，参数2对象中的template为要渲染的html模板
*/
const render = VueServerRenderer.createBundleRenderer(bundle,{
  template   //根据bundle这个包去渲染html模板
})
const app = new Koa();
const router = new Router();

// router.get("/",async(ctx)=>{
//   //  ctx.body = await render.renderToString() : 这样写没有样式官方的一个bug
//    ctx.body = await new Promise((resolve,reject)=>{
//      render.renderToString((err,html)=>{   // 没有样式的原因虽然用的 async await但是还会返回一个promise,所以的 在用promise回调解决每有样式的bug
//        resolve(html)
//      })
//    })
// })
app.use(static(path.resolve(__dirname,'dist'))); //  所有的请求静态文件都去dis文件夹下找  例如 <script src ="server.budle.js"></script>   script的src是要发请求的，需要服务端返回的的，
app.use(router.routes()); // koa应用中加载了路由系统； 
router.get("/(.*)",async(ctx)=>{
  ctx.body =await new Promise((resolve,reject)=>{
    render.renderToString({url:ctx.url},(err,html)=>{
      if(err&&err.code==404){
        return reject('No found')
      }
      resolve(html)
    })
  })
})


app.listen(7000,"127.0.0.1",()=>{
  console.log('成功')
})
