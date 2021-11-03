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
3. createStore
    + 创建仓库
