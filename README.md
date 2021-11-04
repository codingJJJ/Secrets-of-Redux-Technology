# redux-技术揭秘
揭秘redux工作原理及源码解读

## 前言
+ 这是本人第一次写技术文档，也是蛮紧张的，如果有不足之处还请指教。
+ 该文章主要介绍redux工作原理，以及`redux`,`redux-saga`,`react-redux`部分源码解读，通过该文章你将会收获`Flux架构`理念，函数式编程，中间件机制以及redux在react中的工作方式。
+ 本文章适合有一定redux基础，或者使用过redux的童鞋，如果你对redux还不是很熟，可以先阅读[官方文档](https://redux.js.org/)了解redux.

## Flux架构理念
1. Flux是什么
    + 简单来Flux是一种架构理念，处理动态数据流的一种方案。它采用单向数据流的方式控制用户行为，数据处理，以及视图展示，让动态数据的处理变得更加简单和清晰。
2. Flux的结构
    + Flux主要由4部分组成
        + `视图`View: 展示给用户的界面
        + `行为`Action: 描述事件类型和内容
        + `派发`Dispatch: 用户触发行为的唯一方式
        + `数据`Store: 储存数据的仓库

## redux
1. 什么是redux
    + redux是前端管理数据的JavaScript库,借鉴Flux思想，并受到了Elm语言的启发，它的体积极小（核心源码不足100行),其精妙的函数式理念，清晰的结构，受到了前端开发者的一致追捧，接来下我们将先从结构入手，一步一步揭开redux的神秘面纱。
2. redux的结构
    + Redux的核心结构主要由`state`,`action`,`dispatch`,`reducer`,`subscribe`组成.
        + state
            + 存储数据的对象
        + action
            + 事件行为
        + dispatch
            + 用户触发行为的唯一方式
        + reducer
            + 接受action,并处理state,返回一个新的state
        + subscribe
            + 订阅事件,监听数据变化,当数据变化时触发订阅时间
3. vue和react是如何监听数据的变化的?
    + vue监听数据的变化
       + 在Vue中用到了[Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)API去劫持数据,当我们尝试修改该属性时，会触发set函数,从而发起一次update()
         ```javascript
         let value;
         const obj = {};

         Object.defineProperty(obj, "value", {
           get() {
             return value;
           },
           set(newValue) {
             // 当设置的值跟原值一样，直接return
             if (newValue === value) {
               return;
             } else {
               // 当时设置值不一样表示数据发生了变化，触发update
               value = newValue;
               // update()
               console.log(`我已经监听到object.value的变化, 并将新的值${newValue}赋值给obj.value`);
             }
           },
         });

         obj.value = 3; // 触发更新
         obj.value = 3;
         obj.value = 4; // 触发更新
         ```
    + react监听数据变化的方式(react Hook为例)
       + react采用的`state`,`setState`的方式监听数据,如果直接给state赋值是无效的，我们简单那`useState`来举例.
         ```javascript
         function useState(initState) {
           let state = initState || undefined;

           const setState = (newValue) => {
             state = newValue;
             console.log(`已监听数据变化, 设置新的state为${newValue}`);
           }

           return [state, setState];
         }

         const [state, setState, getState] = useState(1);
         setState(2) // 已监听数据变化, 设置新的state为2
         setState(3) // 已监听数据变化, 设置新的state为2
         console.log(state); // 1
         ```
         + 注:上方的`useState`代码属于阉割版的,我们只借用了`React.useState`的部分结构,如果想了解`React hooks`源码的童鞋可以联系我，我可以后续再写一期关于`React hooks`源码的文章。 
       + 两者的区别
         + 从本质上实现方式同步，导致了`Vue`(双向绑定)，与`React`(单向数据流)的不同数据流特征。
         + Vue可以同步获取数据，而`React`获取数据的方式是异步的。
        *****
         + **分析**：在上面的代码中，我们注意到`console.log(state)`并没有获取到新set的数据,`useState`函数执行完成的时候，`return`的数据始终被拉在外层作用域，其实问题就出在`state = newValue`,当`newValue`直接将整个数据替换成了`state`,如果原`state`是引用数据类型，那么它的内存地址也将改变，而原先返回的return数据依然是之前的引用。基于上面的案列，我们不能同步拿到当前`state`的数据，那么有没有其他方式同步拿到新的`state`呢？请看下面的代码
         ```javascript
         function useState(initState) {
           let state = initState || undefined;

           const setState = (newValue) => {
             state = newValue;
             console.log(`已监听数据变化, 设置新的state为${newValue}`);
           }
           //这里新增了一个getState
           const getState = () => { // ++++
             return state
           }

           return [
             state,
             setState,
             getState // ++++ 并将getState返回
           ]
         }

         const [state, setState, getState] = useState(1);
         setState(2)
         setState(3)
         console.log(state);
         console.log(getState());  // ++++ 当我们调用getState方式时,会直接从函数内部的state获取数据
         ```
        ****
