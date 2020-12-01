//浏览器 解决异步的发展史 回调函数===》promise==》generator==>async/await

//generator函数:
// function * _read(){
//   console.log(444)  // 是不会输出444的因为没有执行next()所以generator函数是不会往下执行的
// }

// let _it  = _read()

// function * _read1(){
//   console.log(444)  // 输出 444，之所以能输出是因为执行next
// }

// let _it1  = _read1()
// _it1.next()




//-------------------------------------------   ---------------------------

// // 执行next返回值都是什么：
// function * read(){ 

// }

// let it = read()  // read()返回一个迭代器(iterator),在迭代器中有next()方法；
// console.log(it.next());  // 输出为： { value: undefined, done: true } 解释value的值为产出结果 undefined表示没有产出值，done的值为true时表示函数执行结束，为false表示函数没有执行结束还可以next()                                                                    
 

//  --------------------------------   ---------------------------------------
//generator中的yield
//yield：表示产出的结果，yield有中断的功能，碰到yield就停止执行
// function * read1(){
//   let a = yield 1
//   console.log(a) 
//   /* console.log(a) 打印为undefined，为什时undefined那而不是1， 你要将第一次next产出的值，传递给第二次的next中
// 第二次的next会将传入的值返回给上次，也就是说返回给a这时console.log(a)会输出你第二次next传入的结果
//     */             
// }
// let it1 = read1()
// console.log(it1.next()) // { value: 1, done: false } //产出结果为1，done为false，证明没有执行结束, （执行顺序：此时代代码执行到yield 1,并没有执行 let a = ，也就是a还是没有被赋值，遇到yield程序就会中断）
// console.log(it1.next()) //{ value: undefined, done: true }  //产出结果没有，done的值为true执行结束



// -----------------------------    -----------------------------------
// 下一次的next传递的值会返回给上一次，也就是上一次的执行结果
// function * read2 (){
//   let a = yield 1
//   console.log(a)  // 这里会打印 1 的原因是：let {value,done} = it2.next();it2.next(value);当next(value)会将value返回给上一次，也就是返回给a，也就是执行yied 1的返回值要通过下一次的next返回才会赋值给a
// }
// let it2 = read2()
// let {value,done} = it2.next()  //it2.next()会返回{ value: 1, done: false } 解构赋值，将产出的结果value和done
// it2.next(value)  // 将产出的结果传递给next这个传递的值会返回给上一次，也就是上一执行的结果



// -----------------------------------------------   --------------------------------------
// // next的传值
// function * read3 (){
//   let a = yield 2
//    console.log(a)  // 输出为6，那为何是6而不是1那，因为第二次next的时候传递的值为6，所以赋给a的值就是6
// }
// let it3 = read3()
// it3.next()
// it3.next(6) // 这个6会当作上次执行的返回值，也就是yield 1 的返回值为 6，所以打印a的输出结果为6



//------------------------------------------------            ----------------------------------
//第一次next传值是没有意义的；
// function * read4(){
//   let a = yield 1
//   console.log(a)  //undefimed   第一next传值是没有任何意义的
// }
// let it4 = read4()
// it4.next(3) //第一次next传递的值是没有任何意义的




//-----------------------------------------------------  ----------------------------------------------

// generator执行顺序解释：
// function * read5(){
//   let a = yield 1
//   console.log(a)
//   let b = yield 2
//   console.log(b)
//   let c = yield 3
//   console.log(c)
// }
// let it5 = read5()
// console.log(1,it5.next()) //输出为：  1 { value: 1, done: false } 这个next会执行：read5(){ yield 1
// console.log(2,it5.next()) //输出为：  2 { value: 2, done: false } 这个next会执行： let a = 到yield 2
// console.log(3,it5.next()) //输出为：  3 { value: 3, done: false } 这个next会执行： let b = 到 yield 3
// console.log(4,it5.next()) //输出为：  4 { value: undefined, done: true } 这个next会执行：let c}  执行完毕 




// -----------------------------       --------------------------------------------





//next传入值返回个给上一个
// function * read6(){
//   let a = yield 1
//   console.log(a)  //1
//   let b = yield 2
//   console.log(b)  //2
//   let c = yield 3
//   console.log(c) //  3  c
// }
// let it6 = read6()
//  let{value:value1,done:done1} = it6.next()
// let {value:value2,done:done2} = it6.next(value1)  // 将 value1传入赋给let a
// let {value:value3,done:done3} = it6.next(value2)  // 将 value2传入赋给let b
//  it6.next(value3)   // 将 value3传入赋给let c




//如果有return的时候next的返回值：
// function * read7(){
//   let a = yield 1
//   return 100
// }  
// let it7 = read7()
// console.log(it7.next())   //{ value: 1, done: false }   //value: 1,的1是由yield 1 返回的
// console.log(it7.next())  // { value: 100, done: true }  //value: 100的100 是由 return 100 返回的






//每个迭代器之间互不干扰，作用域独立。
// function* g() {
//   var o = 1;
//   yield o++;
//   yield o++;
//   yield o++;

// }
// var gen = g();

// console.log(gen.next()); // { value: 1, done: false }

// var xxx = g();

// console.log(gen.next()); //  { value: 2, done: false }
// console.log(xxx.next()); // { value: 1, done: false }
// console.log(gen.next()); // { value: 3, done: false }


// 如果将上面的generator函数的第二个yield o++;改成yield;会怎样？
// function* g1() {
//   var o = 1;
//   yield o++;
//   yield ;
//   yield o++;

// }
// var gen1= g1();

// console.log(gen1.next()); // { value: 1, done: false }

// var xxx1 = g1();

// console.log(gen1.next()); //  { value: undefined, done: false }
// console.log(xxx1.next()); // { value: 1, done: false }
// console.log(gen1.next()); // { value: 2, done: false }





//如果将上面的generator函数的第二个yield o++;改成o++;yield;会怎样？
// function* g2() {
//   var o = 1;
//   yield o++;
//   o++
//   yield o++;

// }
// var gen2= g2();

// console.log(gen2.next()); // { value: 1, done: false }

// var xxx2 = g2();

// console.log(gen2.next()); //  { value: 3, done: false }
// console.log(xxx2.next()); // { value: 1, done: false }
// console.log(gen2.next()); // { value: undefined, done: true }



//for...of循环可以自动遍历Generator函数时生成的Iterator对象，且此时不再需要调用next方法。for...of循环的基本语法是：
//例如：
// function* foo() {
//   yield 1;
//   yield 2;
//   yield 3;
//   yield 4;
//   yield 5;
//   return 6;
// }

// let a = foo();

// for (let v of a) {
//   console.log(v);    // 1 2 3 4 5 为啥没有6那？ 因为一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象，
    

// 上面代码使用for...of循环，依次显示5个yield语句的值。这里需要注意，一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象，所以上面代码的return语句返回的6，不包括在for...of循环之中。





// 下面是一个利用Generator函数和for...of循环，实现斐波那契数列的例子。

// 斐波那契数列是什么？它指的是这样一个数列 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144........ 这个数列前两项是0和1，从第3项开始，每一项都等于前两项之和。

// function* fibonacci() {
//   let [prev, curr] = [0, 1];
//   for (;;) { // 状态机；
//     [prev, curr] = [curr, prev + curr];
//     yield curr;
//   }
// }

// for (let n of fibonacci()) {
//   if (n > 1000) {
//     break;
//   }
//   console.log(n);
// }



// next方法可以有参数
// 一句话说，next方法参数的作用，是为上一个yield语句赋值。由于yield永远返回undefined，这时候，如果有了next方法的参数，yield就被赋了值，比如下例，原本a变量的值是0，但是有了next的参数，a变量现在等于next的参数，也就是11。

// next方法的参数每次覆盖的一定是undefined。next在没有参数的时候，函数体里面写let xx = yield oo;是没意义的，因为xx一定是undefined。

// function* g() {
//     var o = 1;
//     var a = yield o++;
//     console.log('a = ' + a); // 在输出{ value: 1, done: false } 之后在输出a = 11
//     var b = yield o++;
// }
// var gen = g();

// console.log(gen.next()); // { value: 1, done: false }
// console.log(gen.next(11)); //{ value: 2, done: false }


// 首先说，console.log(gen.next());的作用就是输出了{value: 1, done: false}，注意var a = yield o++;，由于赋值运算是先计算等号右边，然后赋值给左边，所以目前阶段，只运算了yield o++，并没有赋值。

// 然后说，console.log(gen.next(11));的作用，首先是执行gen.next(11)，得到什么？首先：把第一个yield o++重置为11，然后，赋值给a，再然后，console.log('a = ' + a);，打印a = 11，继续然后，yield o++，得到2，最后打印出来。

// 从这我们看出了端倪：带参数跟不带参数的区别是，带参数的情况，首先第一步就是将上一个yield语句重置为参数值，然后再照常执行剩下的语句。总之，区别就是先有一步先重置值，接下来其他全都一样。

// 这个功能有很重要的语法意义，通过next方法的参数，就有办法在Generator函数开始运行之后，继续向函数体内部注入值。也就是说，可以在Generator函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

// 提问：第一个.next()可以有参数么？ 答：设这样的参数没任何意义，因为第一个.next()的前面没有yield语句。









/*
yield语句
迭代器对象的next方法的运行逻辑如下。

（1）遇到yield语句，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。

（2）下一次调用next方法时，再继续往下执行，直到遇到下一个yield语句。

（3）如果没有再遇到新的yield语句，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。

（4）如果该函数没有return语句，则返回的对象的value属性值为undefined。

yield语句与return语句既有相似之处，也有区别。

相似之处在于，都能返回紧跟在语句后面的那个表达式的值。


*/


/*
yield与return的区别：
在于每次遇到yield，函数暂停执行，
下一次再从该位置继续向后执行，
而return语句不具备位置记忆的功能。
一个函数里面，只能执行一次（或者说一个）return语句，
但是可以执行多次（或者说多个）yield语句。



正常函数与Generator函数的区别：
正常函数只能返回一个值，
因为只能执行一次return；Generator函数可以返回一系列的值，
因为可以有任意多个yield。
从另一个角度看，也可以说Generator生成了一系列的值，
这也就是它的名称的来历（在英语中，generator这个词是“生成器”的意思）。
*/





/*总结每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，
直到遇到下一个yield语句（或return语句）为止。
换言之，Generator函数是分段执行的，yield语句是暂停执行的标记，
而next方法可以恢复执行。


总之，每调用一次Generator函数，
就返回一个迭代器对象，
代表Generator函数的内部指针。
以后，每次调用迭代器对象的next方法，
就会返回一个有着value和done两个属性的对象。
value属性表示当前的内部状态的值，
是yield语句后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束。





Generator 函数的特点就是：
1、分段执行，可以暂停
2、可以控制阶段和每个阶段的返回值
3、可以知道是否执行到结尾
*/







/*
注意:
注意：yield语句只能用于function的作用域，
如果function的内部还定义了其他的普通函数，
则函数内部不允许使用yield语句。


注意:
yield语句如果参与运算，必须用括号括起来。
console.log(3 + yield 4); // 语法错误
console.log(3 + (yield 4)); // 打印7
*/

