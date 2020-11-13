import { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./schedular";

let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.cb = cb;
    this.options = options;
    this.id = id++;
    this.deps = []; //记录dep的数组
    this.depsId = new Set(); //去重dep，当同一个属性多次调用的时候dep是同一个dep所以只需要存储一次
    this.getter = exprOrFn; // 只是让 fn执行当我new一次Watcher时候就执行一次
    this.get(); //调用传入的函数，调用了render方法，此时会对模板中的数据进行取值
  }
  get() {
    // 这个方法会对属性进行取值操作；
    // 当属性取值时需要记住这个watcher，稍后 数据变化了，去执行自己记住的watcher（这就导致如果属性太都时vue的性能就会下降）（属性就是data中的属性）
    pushTarget(this); //将当前的Watcher传入pushTarget来收集watcher
    this.getter();
    popTarget();
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(id);
      dep.addSub(this); //dep记录watcher，// 在if(!this.depsId.has(id))判断条件里调用，间接的watcher存储的时候也去重，这里dep去重了catcher也是非重的；
    }
  }
  run() {
    this.get();
  }
  update() {
    //this.get()  // 如果这里直接调用this.get()数据反复更新但最后又变成初始数据，这里就会反复渲染，影响性能
    //所以要批量处理
    queueWatcher(this); //批量处理方法 (调度更新几次)
  }
}



export default Watcher;
