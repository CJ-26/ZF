// 我们可以把当前的watcher放到一个全局变量上；这个全局变量就是 Dep这个类（可以将这类当成一个全局变量）；
let id = 0; //
class Dep {
  constructor() {
    this.id = id++; //让每一个dep都有一个唯一的id；
    this.subs = []; //记录watcher的数组
  }
  depend() {
    Dep.target.addDep(this); //这里的Dep。target就是watcher，而Dep.target.addDep(this),就是调用watcher中的addDep，传入this，的目的就是让watcher记录Dep
  }
  addSub(watcher) {
    // 记录watcher
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach(watcher=>{
      watcher.update()
    })
  }
}
Dep.target = null;
export function pushTarget(watcher) {
  // 收集watcher；
  Dep.target = watcher;
}
export function popTarget() {
  // 删除watcher;
  Dep.target = null;
}

export default Dep;
