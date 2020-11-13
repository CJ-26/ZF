//如果数组是在 data外面创建则需要数组原生的方法所以不能直接改写数组的原方法，只有受vue控制的才要改写

let oldArrayProtoMethods =  Array.prototype; 

//Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
export let arrayMethods = Object.create(Array.prototype) //这样写 原生的数组的方法会在 arrayMehods.__proto__ 上面，给arrayMohodes添加方法如arrayMehodes.push,则不会覆盖数组的原生的push
let methods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort"
];
methods.forEach((methods)=>{  // 这里用到的是AOP编程（切片编程）注释：在原有的方法中切出一块怎加逻辑之后在去执行原有的后续逻辑
  arrayMethods[methods] = function(...args){ //重写数组方法；
   
        // 因为数组改变了，更新视图逻辑；
         console.log("数组变化了")
       

          // 视图更新完了调原有的数组方法去改变数组
          let result  = oldArrayProtoMethods[methods].call(this,...args); //这里注意this的指向（this指向数组的本身）；

         //如果数组新增的元素为对象，那也需要进行拦截呀！数组增加并改变数组的方法有 push  unshift 就要进行判断是Object的进行拦截检测；
        let inserted;
        let ob = this.__b__
         switch(methods){
           case "push":
            case "unshift":
              inserted = args; 
            break;
            case "splice":
              inserted = args.slice(2); // splice的用法,第一参数是开始替换的下标，第二个参数为结束替换的下标，第三个到后面n个参数都是要替换成的元素，所以判断第三个参及后面的参数是否为object，args为参数集合为一个数组利用slice方法截取返回第三个参数及以后的参数
            default:
              break;
         }
        if(inserted)ob.observeArray(inserted)
       
        return result // 返回数组方法的返回值
      }
  // 
})

