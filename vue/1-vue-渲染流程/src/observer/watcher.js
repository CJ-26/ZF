let id = 0
class Watcher{
  constructor(vm,fn,cb,options){
    this.vm = vm;
    this.fn =fn;
    this.cb = cb;
    this.options = options;
    this.id = id++;
    this.fn(); // 只是让 fn执行当我new一次Watcher时候就执行一次
  }
}

export default Watcher