// 发布重点在发布和订阅中间是由第三方的就是储存订阅事情的数组，发布和订阅之间是没有关联的（我没有订阅也可以执行发布，我执行了订阅，每执行发布也可以）

// 观察者模式：分为观察者和被观察者，两者之间是存在关联的 (两者之间的关联靠的还是发布订阅)

//观察者模式栗子：
class Subject {  //被观察者
  name: string;
  state: string;
  observer: Array<Observer>;  //储存观察者数组(订阅数组，订阅观察者)
  constructor(name:string) {
    this.name = name;
    this.state = "我现在很开心";
    this.observer=[]
  }
  attach(o: Observer) {  //观察者
    //传入观察者
    this.observer.push(o);
  }
  setState(newState: string) {
    this.state = newState;
    this.observer.forEach(o=>o.update(this)) //给观察者发布被观察者
  }
}

class Observer {
  name: string;
  constructor(name) {
    this.name = name;
  }
  update(baby:Subject){
     console.log(baby.name+this.name+'说'+baby.state)
  }
}

// 例如：我家由一个小宝宝，我和我媳妇，需要观测小宝宝的变化

let baby = new Subject("小宝宝");
let o1 = new Observer("爸爸");
let o2 = new Observer("妈妈");
//让小宝宝（baby）记住o1(爸爸)和o2(妈妈)
baby.attach(o1);
baby.attach(o2);
baby.setState("我不开心呢") //小宝宝变化了