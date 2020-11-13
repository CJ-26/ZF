import creteApp from "./app"
export default ({url})=> {
return new Promise((resolve,reject)=>{
  const  {app,router} = creteApp();
  router.push(url)
  router.onReady(()=>{   // 表示组件已经准备完毕防止有异步组件没有加载完；
    const matchComponents = router.getMatchedComponents()  //判断路径是否匹配到具体的组件；
   if(!matchComponents){
    /// 这里服务器跳转页面，跳转之后没有匹配到具体组件
    return  reject({code:404})
   }
    resolve(app)
  },reject)
})
  
}