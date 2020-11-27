import { activeEffect } from './effect';
import { reactive } from './reactive';
import { isObject, hasOwn, isArray, hasChange } from './../shard/inex';
// 使用了proxy就会使用reflect （reflect为Es6的语法，详情看MDN，reflect以后会取代object上的一切方法，例如以前为Object.defineProPerty,以后就会使Reflect.defineProperty 了）

export const mutableHandlers = {
  get(target,key,recevier){  //取时时的参数：target表示取值时的目标对象或者数组，key为取值属性后者数组下标，recevier表示代理后的对象或者数组
    // 当取值时应该将effect储存起来
    console.log("0000")
   //   return target[key]  // 这里取的是源对象的属性不会死循环，如果 操作代理对象recevier[key]就会死循环
   let res = Reflect.get(target,key,recevier)  // return Reflect.get(target,key,recevier)与return target[key] 是等价的
   return isObject(res)?reactive(res):res // 取值时递归属性的值如果为对象添加proxy代理（又称懒代理为取值时递归代理而不是vue2中一上来就递归都代理了）
  },
  set(target,key,value,recevier){ //设置值的参数；target表示设置值时的目标对象或者数组，key为设置值的属性或者数组，value设置的值，recevier表示代理后的对象
    const oldValue = target[key] //上一次的值；
    //isArray(target)：判断是不是数组，(parseInt(key,10)==key)：判断是不是修改的是数组索引对应的(例如[a,b,c:{name:"xx"}] 如果修改的是a就是索引对应的，如果修改的是c中的name就不是索引对应的了或者let arr=[1,2];arr.a="22",修该arr.a的时候(parseInt(key,10)==key)的值为false，但如果arr['0'],就相当于arr[0]但是这里的key就是'0',所以要parstInt(key,10))，Number(key)<target.length判断是修改数组原有的还是数组新增的， 如果不是数组那就是对象：hasOwn(target,key)是 判断该对象属性是否存在，存在表示为修改，不存在表示添加属性
    const hadKey = isArray(target)&&(parseInt(key,10)==key)?Number(key)<target.length:hasOwn(target,key)
   // 当数组执行push的是时候set会走两次，第一次 key为新增的下标，target[key]为undefined，value为push的值，第二次key为length，target[key]和value都为push的值，因为第二次执行settarget[key]和value也就是新值和老值是相同所以第二执行是没有意义的，下面hasChange(oldValue,value)就是判断新值和老值是否相同不相同在在去走其它逻辑相同则不在走其它逻辑了(第一次监控到了数组增加了元素执行了set，但数组增加了元素后数组的length也发生了改变所以有监控到了length在走一次set（因为length也是数组的属性呀属性变了length肯定会走呀），就走了两次)
      
   if(!hadKey){ //添加属性或者是添加数组的项
     //  console.log("新增")
   }else if(hasChange(oldValue,value)){  //修改属性或者修个数组中的某一项，但要判断修改的值是否和原值一样(hasChange(oldValue,value)新值和老值不同返回true)
    // console.log('修改')
   }

 
    // target[key] = value // 这里设置的是源对象的属性不会死循环，如果 操作代理对象 recevier[key]= value就会死循环
   let result = Reflect.set(target,key,value,recevier) //  Reflect.set(target,key,value,recevier) 与target[key] = value 为等价 但是Reflect.set(target,key,value,recevier)有返回值设置成功返回ture
  // 设置一般分为两种一种是添加属性一种的修改属性
  
   return result 
  } // 当设置值的时候，应该通知对应的effect来更新                                                                                                                       
}


/*
vue3响应式的思路
默认加载页面时，会先调用一次effect，此时effect方法中的数据会进行取值操作，在取值操作时对应的属性保存当前的effect（保存effect时，要标记时哪个对象中的哪个属性，防止不同对象中用相同的属性）                                                                                                                                                         
某个对象的属性值变了们需要找到对应的effect列表（effect有可能多个所以是列表）让它依次执行
*/ 