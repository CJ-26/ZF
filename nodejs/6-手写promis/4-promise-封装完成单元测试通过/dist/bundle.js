'use strict';

// 处理如果第一次then返回的是一个promise，核心逻辑解析x的类型来决定promise2返回成功还是失败
function resolvePromise(promise2, x, resolve, reject) {
    //判断x的值决定promise的关系，（注意x有可能是别人的promise,也就是说then中可以返回别人的promise，但如果是别人的promise就有可能会出现问题）
    if (x === promise2) { // promise A+ 规定如果then返回的promise于promise2相同则抛出一个类型错误
        return reject(new TypeError('出错了'));
    }
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') { // 这个判断条件考虑到了被人的promise(typeof x==='object' && x !== null) || typeof x === 'function'因为我自己写的promise为对象，但是别人写的有可能是函数，（promise A+ 中写道promise可以是对象也可以是函数）
        //根据 promise A+ 中规定promise只能是对象或者是函数，也就是说只有 (typeof x==='object' && x !== null) || typeof x === 'function'这个条件x才有可能是promise
        var called_1 = false; //为保证promise的状态是不可逆的开关（主要是为了防止then里面返回的promise有可能不是自己的,因为不是自己的那就没办法确定他人的promise的状态是否可逆，所以要设置开关，如果调了一次成功就不能在调成功或者失败了，同理如果调了失败就不能在调一次失败或者成功）
        try { // 为何取then要捕获异常那，如果返回的对象是这样的：let obj={} Object.defineProperty(obj,'then',{get(){throw new Error("出错了")}}) 返回这样的obj对象肯定就出现异常了
            var then = x.then;
            if (typeof then === "function") { //判断then为一个函数；
                // 并且调用x的then传入y为成功的值传入r为失败的值，但为何是这种写法then.call(x,y=>{},x=>{})而不是x.then(y=>{},r=>{}),因为在上面有 let then = x.then进行了异常捕获了一次，如果这使用x.then如果传入的对象的为let obj={} let index=0 Object.defineProperty(obj,'then',{get(){ index++ if(index==2){throw new Error("出错了")}}})第一次取没有报错但第二次在取就报错了，所以x.then着这样调用有可能会出现异常；
                then.call(x, function (y) {
                    if (called_1)
                        return;
                    called_1 = true; // 开关，调了成功就不能调失败，也不能再次调成功
                    // 如果这个y还是promise那，所以就要递归调用resolvePromise解析y 直到为普通值位置
                    resolvePromise(promise2, y, resolve, reject);
                }, function (r) {
                    if (called_1)
                        return;
                    called_1 = true; //开关如果调了失败就不能在调成功或者在调一次失败
                    reject(r); //失败是不用在解析判断是不是promise的因为已经都失败了，所以就没必要在继续了
                });
            }
            else {
                // 如果不是一个函数那就是普通值了，普通值直接resolve就可以了 
                resolve(x);
            }
        }
        catch (e) {
            if (called_1)
                return;
            called_1 = true; //开关如果异常调了失败就不能在调成功或者在调一次失败
            reject(e);
        }
    }
    else {
        // 如果x不是对象也不是函数，那只能是一个普通值(promise A+中规定如果是普通值，将这个值做为成功参数传入)
        resolve(x);
    }
}
var Promise = /** @class */ (function () {
    function Promise(executor) {
        var _this = this;
        this.status = "PENDING" /* pending */; // 默认为pending 状态
        this.value = undefined; //成功的值
        this.reason = undefined; //失败的值
        this.onResolvedCallback = []; // 当为pending状态的时候将成功的resolve函数存起来（发布订阅模式）                                                                                                          
        this.onRejectedCallback = []; //当为pending状态的时候将失败的reject函数存起来 （发布订阅模式） 
        var resolve = function (value) {
            if (_this.status === "PENDING" /* pending */) { //只有在pending状态下才能修改状态
                _this.status = "FULFILLED" /* fulfilled */; // 调用成功resolve函数 改变状态为，成功态 fulfilled
                _this.value = value; // 赋成功值
                _this.onResolvedCallback.forEach(function (fn) { return fn(); }); //发布成功的方法
            }
        };
        var reject = function (reason) {
            if (_this.status === "PENDING" /* pending */) { //只有在pending状态下才能修改状态
                _this.status = "REJECTED" /* rejected */; // 调用失败reject函数 改变状态为，失败态 rejected
                _this.reason = reason; //赋失败值
                _this.onRejectedCallback.forEach(function (fn) { return fn(); }); //发布失败的方法
            }
        };
        try { // 当   executor(resolve, reject);执行异常的时候走下面的catch （例如  executor方法种有  throw new Error()就会走catch）
            executor(resolve, reject); //  executor为new Promise传入的函数 (new Promise((resolve,reject)=>{}))
        }
        catch (e) {
            reject(e); // 如果抛出异常直接调用reject
        }
    }
    Promise.prototype.then = function (onfulfilled, onRejected) {
        var _this = this;
        /* promise A+ 中规定then的参数可传可不传,
        在不传的情况下将会有then穿透例如：
         new Promise((resolve,reject)=>{ resolve("成功")}).then().then().then((res)=>{console.log(res)}) 将会输出成功，
         所以要判断是否传了参，如果表示成功函数没有传(onfulfilled),将赋给表示成功的参参数一个有返回值的函数例如：onfulfilled=val=>val，因为在传参的情况下就是传进来一个函数，但有穿透就的有return了
         如果失败的函数没有传，则将表示失败的参数(onRejected),赋给一个抛出错误的函数onRejected:err=>{throw err}
         throw:
         throw 语句抛出一个错误。当错误发生时， JavaScript 会停止执行并抛出错误信息,抛出的异常。可以是字符串、数字、逻辑值或对象。
         为何throw会终止程序，还要onRejected:err=>{throw err}因为代码中有这样的逻辑：
                    try{
                    let x =onRejected(this.reason)
                    resolvePromise(promise2,x,resolve,reject)
                   }catch(e){
                     reject(e)
                   }
               catch会捕获throw抛出的错误，并将这个错误传给catch的参数：例如：
               try{
                 throw "异常了了了了"
               }catch(e){
                 console.log(e) // 出输出:异常了了了了
               }
              所以throw会配合try{}catch(e){}来使用，就不会终止程序了
        */
        onfulfilled = typeof onfulfilled === "function" ? onfulfilled : function (val) { return val; };
        onRejected = typeof onRejected === "function" ? onRejected : function (err) { throw err; };
        //为何不能  let promise2 = new Promise((resolve,reject)=>{ resolve(x)}这样写而将then中的逻辑再用new Promise包起来因为上次then中return的值是拿不到的，而new Promise中的逻辑会立即执行所以就这样包起来写了，在去拿返回值
        var promise2 = new Promise(function (resolve, reject) {
            if (_this.status === "FULFILLED" /* fulfilled */) { // 成功状态时
                setTimeout(function () {
                    try { //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
                        var x = onfulfilled(_this.value); // 调用成功执行的函数
                        resolvePromise(promise2, x, resolve, reject); //resolvePromise的作用是处理当第一个then返回一个promise的时候下一个then接受上一个then中返回的promise的成功或者失败的值；
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (_this.status === "REJECTED" /* rejected */) { //失败状态时：
                setTimeout(function () {
                    try { //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
                        var x = onRejected(_this.reason); //调用失败的函数
                        resolvePromise(promise2, x, resolve, reject); //resolvePromise的作用是处理当第一个then返回一个promise的时候下一个then接受上一个then中返回的promise的成功或者失败的值；
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (_this.status === "PENDING" /* pending */) { //  pending状态时
                //订阅，成功和失败的方法
                _this.onResolvedCallback.push(function () {
                    // 可以写其它逻辑 之后在执行 onfulfilled
                    setTimeout(function () {
                        try { //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
                            var x = onfulfilled(_this.value);
                            resolvePromise(promise2, x, resolve, reject); //resolvePromise的作用是处理当第一个then返回一个promise的时候下一个then接受上一个then中返回的promise的成功或者失败的值；
                        }
                        catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                _this.onRejectedCallback.push(function () {
                    setTimeout(function () {
                        try { //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
                            var x = onRejected(_this.reason);
                            resolvePromise(promise2, x, resolve, reject); //resolvePromise的作用是处理当第一个then返回一个promise的时候下一个then接受上一个then中返回的promise的成功或者失败的值；
                        }
                        catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
        return promise2;
    };
    return Promise;
}());
Promise.deferred = function () {
    var dfd = {};
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};

module.exports = Promise;
