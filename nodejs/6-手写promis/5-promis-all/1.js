let index = 0; //标识是判断是哪个App实例
class App {
  constructor(fn) {
    index++;
    console.log(index);
    this.name = "小明";
    this.age = index;
    const c = (val) => {
      this.name = val;
    };
    fn(c);
  }
  then(t, r) {
    let app2 = new App((fn) => {
      console.log(this);
    });
    return app2;
  }
}
let p1 = new App((c)=>{c('小红')})
let p2 = p1.then();
let p3 = p2.then();
