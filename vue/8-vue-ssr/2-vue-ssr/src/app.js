import Vue from "Vue"
import App from "./app.vue"
import createRouter from "./router/index"
export default ()=>{
   const router = createRouter()
   const app =new Vue({
    router,
    render:h=>h(App)
  })
  return {
    app,
    router
  }//这样返回，可以返回多个，例如router，vuex
}  //不同的客户端访问服务端如果Vue实例是一个，有数据改变的那不就都变了吗，所以每次访问都是不同的实例，就要用函数的形式，每次执行都new Vue({})




