import { observer } from "./observer/index.js";
export function initState(vm){
  //将所有数据都定义在 vm属性上，并且后续更改，需要触发视图更新
 const opts = vm.$options; //获取用户属性；
 if(opts.data){
 initData(vm)
}
}
function Proxy(vm,source,key){
  Object.defineProperty(vm,key,{
    get(){
      return vm[source][key];
    },
    set(newVlue){
      vm[source][key] = newVlue;
    }
  })
}

function initData(vm){
 //数据劫持
 let data = vm.$options.data;
 // 通过vm._data获取劫持后的数据用户就可以拿到_date了也就是可以利用vm._data获取到data中的数据了。
 data = vm._data = typeof data ==="function" ? data.call(vm):data;
 
 //将vm._data上的数据全部放到vm上
 for(let key in data){
   Proxy(vm,"_data",key); // Proxy的作用是例如用户获取 data中的name属性那么通过vm.name获取等价于vm._data.name
 }
 
 
 
 //观测数据
observer(data);
}