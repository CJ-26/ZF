import { mergeOptions } from "../util";
export function initGlobalAPI(Vue) {
  Vue.options = {}; //Vue.options为静态属性，用于存储全局的配置例如钩子函数、fliter directive component
  Vue.mixin = function (mixin) {  // 这里的this是Vue构造函数，而不是new Vue（）的实例；
    this.options = mergeOptions(this.options,mixin) //mergeOptions用于混合Vue.mixin({})和new Vu({})中的配置（是混合而不是覆盖）；（将mixin合并到this。options中，也就是说this.options为父亲，mixin为儿子）
     console.log(this.options)
    return this; //为了方便链式调用，所以return this；
  };
  

  Vue.options._base = Vue // 这个属性永远指向Vue的构造函数； 
  /*
   Vue.options.components = {}用来存放组件的定义
  组件的定义也就是：Vue.component("my-buttom",{name:"you-button",template:"<div></div>"})
  中的{name:"you-button",template:"<div></div>"}
*/
  Vue.options.components = {} 
  Vue.component = function(id,definiton){
     /*声明组件参数一为组件名字，参数二为一个对象该对象里放着组件的配置；
      例如：Vue.component("my-buttom",{template:"<div></div>"})
      第一个参数就是"my-buttom"第二个参数就是：{template:"<div></div>"}
     */

     /*
      组件名字的优先级例：
      Vue.component("my-buttom",{name:"you-button",template:"<div></div>"})
       "my-buttom"为组件的名字，但是我在组件的配置中还有name,那么就以name属性的值为准；
     */
       definiton.name = definiton.name || id;
       /* this.options._base.extend()（this.options._base的值就是Vue,为什么要将Vue的构造函数
        挂在this.options._base上这样能保证this.opthins._base的属性值永远都是Vue的构造函数在后面使用Vue函数的时候
        也可以用this.options._base）
       也就是Vue.extend()的作用是通过对象产生一个构造函数；
       */
       definiton = this.options._base.extend(definiton)
     
     
     /*this.options.components即使Vue.options.components = {}用于存放组件的定义
        组件的定义也就是：Vue.component("my-buttom",{name:"you-button",template:"<div></div>"})
        中的{name:"you-button",template:"<div></div>"}
       */
       this.options.components[id] = definiton;
  }

  let cid = 0; // 每创建一个Sub构造函数的id表示；
  Vue.extend = function(options){
   /*
    这里的this永远指向Vue构造函数，因为在调用extend的时候是
    调用Vue.options._base上的extend，而Vuw.options._base就是Vue构造函数；
   */
    const Super = this;
    // 在组件初始化的时候会  new VueComponent(optoins)参数optoins为用户传入的子组件的配置项
    const Sub = function VueComponent(options){

      /* 
       因为下面将父类的原型继承在子类的原型上了，在父类的原型上有
       _init()的方法所以在子类中也有了，子类中调用this._init()
       就是调用父类中的_init()方法了；
      */
         this._init(options)
      }
      Sub.cid = cid++

      /*
      原型继承由于使用了Object.create(Super.prototype) 
      会把Super.prototype的所有方法属性挂在子类的原型上
      */
      Sub.prototype = Object.create(Super.prototype)  
      Sub.prototype.constructor = Sub; //原型继承后需要将constructor改成当前继承后的类，原型继承的常规写法；
     
      /*
        Sub.component = Super.component;这里子类也有Vue构造函数（父类）的component放方法 
        如果上面不用Vu.optoins._base = Vue ;而component方法中
         definiton = this.options._base.extend(definiton)这行代码换成
         definiton = this.extend(definiton)看起来没问题但是
         子类上也有component方法呀（Sub.component = Super.component;），子类调用component（例如：Sub.component()）的时候this就会变成子类了
         子类在调用extende方法，extende里的继承就出问题了，继承不到父类
         也就没有了_init()方法了；

         Sub.prototype = Object.create(Super.prototype) 继承的只是父类上的
         原型上的方法和属性，父类的静态方法和静态属性是没有的，
         父类构造函数里面利用this添加的属性方法也是没有的例如：父类的构造函数为 function Fn(){this.name="小明"}
         这this.name,是没有，子类只会有父类的prototype上的属性和方法；
         如果使用父类中静态方法需要手动添加例如下面的
          Sub.component = Super.component; 将父类的component静态方法赋给了
          子类的 Sub.component 子类才会有的
      */
      Sub.component = Super.component; 
      /*
       父类（Vue的构造函数）存在options属性子类也应该存在，那么子类的options属性时怎么来的
        是把父类的和自己的合并在一起的
         Sub.options =  mergeOptions(Super.options,options)
          参数Super.options为父类的options
          参数options为调用extende传进来的子类的配置例如 Vue.component("my-buttom",{name:"you-button",template:"<div></div>"})传入extende的配置{name:"you-button",template:"<div></div>"}
         */
     Sub.options =  mergeOptions(Super.options,options) //每次声明组件都会把父级的放到子集上；
      return Sub; //这个Sub构造函数是由对象产生而来的，因为调用extend时传入了一个对象，才产生Sub类的，传入的这个对象就是子组件的配置例如 Vue.component("my-buttom",{name:"you-button",template:"<div></div>"})传入extende的对象就是{name:"you-button",template:"<div></div>"}
    }
}
