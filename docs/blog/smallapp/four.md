# Skyline渲染引擎

## 概览

### 介绍

Skyline 创建了一条渲染线程来负责 Layout, Composite 和 Paint 等渲染任务，并在 AppService 中划出一个独立的上下文，来运行之前 WebView 承担的 JS 逻辑、DOM 树创建等逻辑。这种新的架构相比原有的 WebView 架构，有以下特点：

- 界面更不容易被逻辑阻塞，进一步减少卡顿
- 无需为每个页面新建一个 JS 引擎实例（WebView），减少了内存、时间开销
- 框架可以在页面之间共享更多的资源，进一步减少运行时内存、时间开销
- 框架的代码之间无需再通过 JSBridge 进行数据交换，减少了大量通信时间开销

而与此同时，这个新的架构能很好地保持和原有架构的兼容性，基于 WebView 环境的小程序代码基本上无需任何改动即可直接在新的架构下运行。WXS 由于被移到 AppService 中，虽然逻辑本身无需改动，但询问页面信息等接口会变为异步，效率也可能有所下降；为此，我们同时推出了新的 [Worklet](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/worklet.html) 机制，它比原有的 WXS 更靠近渲染流程，用以高性能地构建各种复杂的动画效果。

![image-20230729194402097](C:\Users\86155\AppData\Roaming\Typora\typora-user-images\image-20230729194402097.png)

### 特性

Skyline 以性能为首要目标，因此 CSS 特性上在满足基本需求的前提下进行了大幅精简，目前 Skyline 只保留更现代的 CSS 集合。另一方面，Skyline 又添加了大量的特性，使开发者能够构建出类原生体验的小程序。在编码上，Skyline 与 WebView 模式保持一致，仍使用 WXML 和 WXSS 编写界面。在不采用 Skyline 新增特性的情况下，适配了 Skyline 的小程序在低版本或未支持 Skyline 的平台上可无缝自动退回到 WebView 渲染。



#### 支持和WebView混合使用

小程序支持页面使用 WebView 或 Skyline 任一模式进行渲染，Skyline 页面可以和 WebView 页面混跳，开发者可以页面粒度按需适配 Skyline。

```json
//skyline渲染
{
	"renderer":"skyline"
}

//webView渲染
{
    "renderer":"webview"
}
```

### 提供更好的性能

#### 1.单线程版本组件框架

Skyline 下默认启用了新版本的组件框架 glass-easel，该版本适应了 Skyline 的单线程模型，使得建树流程的耗时有效降低（优化 30%-40%），同时 setData 调用也不再有通信开销和序列化开销。

#### 2.组件下沉

Skyline 内置组件的行为更接近原生体验，部分内置组件（如 scroll-view、swiper 等）借助于底层实现，有更好的性能和交互体验。同时，我们将部分内置组件（如 view、text、image 等）从 JS 下沉到原生实现，相当于原生 DOM 节点，降低了创建组件的开销（优化了 30% 左右）。

#### 3.长列表按需渲染

长列表是一个常用的但又经常遇到性能瓶颈的场景，Skyline 对其做了一些优化，使 scroll-view 组件只渲染在屏节点（用法上有一定的约束），并且增加 lazy mount 机制优化首次渲染长列表的性能，后续我们也计划在组件框架层面进一步支持 scroll-view 的可回收机制，以更大程度降低创建节点的开销。

#### 4.WXSS预编译

同 WebView 传输 WXSS 文本不同，Skyline 在后台构建小程序代码包时会将 WXSS 预编译为二进制文件，在运行时直接读取二进制文件获得样式表结构，避免了运行时解析的开销（预编译较运行时解析快 5 倍以上）。

#### 5.样式计算更快

Skyline 通过精简 WXSS 特性大幅简化了样式计算的流程。在样式更新上，与 WebView 全量计算不同，Skyline 使用局部样式更新，可以避免对 DOM 树的多次遍历。Skyline 与小程序框架结合也更为紧密，例如： Skyline 结合组件系统实现了 WXSS 样式隔离、基于 wx:for 实现了节点样式共享（相比于 WebView 推测式样式共享更为精确、高效）。在节点变更、内联样式和继承样式的更新上，Skyline 也进行了一些优化，从而保证样式计算的性能。

此外，对于 rpx 单位，我们直接在样式计算阶段原生支持，这样避免了在 JS 层面做太多额外的计算。

#### 6.降低内存占用

在 WebView 渲染模式下，一个小程序页面对应一个 WebView 实例，并且每个页面会重复注入一些公共资源。而 Skyline 只有 AppService 线程，且多个 Skyline 页面会运行在同一个渲染引擎实例下，因此页面占用内存能够降低很多，还能做到更细粒度的页面间资源共享（如全局样式、公共代码、缓存资源等）。

### 根除旧有架构的问题

在基于 Web 体系的架构下，小程序的部分基础体验会受限于 WebView 提供的能力（特别是 iOS WKWebView 限制更大一些），使得一些技术方案无法做得很完美，留下一些潜在的问题。

#### 1.原生组件同层渲染更稳定

iOS 下原生组件[同层渲染的原理](https://developers.weixin.qq.com/community/develop/article/doc/000c4e433707c072c1793e56f5c813)先前有介绍过，本质上是在 WKWebView 黑盒下一种取巧的实现方式，并不能完美融合到 WKWebView 的渲染流程，因此很容易在一些特殊的样式发生变化后，同层渲染会失效。在 Skyline 下可以很好地融合到渲染流程中，因此会更稳定。

#### 2.无需页面恢复机制

iOS 下 WKWebView 会受操作系统统一管理，当内存紧张时，操作系统就会将不在屏的 WKWebView 回收，会使得小程序除前台以外的页面丢失，虽然在页面返回时，我们对页面做了恢复，但页面的状态并不能 100% 还原。在 Skyline 下则不再有该问题。

#### 3. 无页面栈层数限制。

由于 WebView 的内存占用较大，页面层级最多有 10 层，而 Skyline 在内存方面更有优势，因此在连续 Skyline 页面跳转（复用同一引擎实例）的情况下，不再有该限制。



### 全新的交互动画体系

要达到类原生应用的体验，除渲染性能要好外，做好交互动画也很关键。在 Web 体系下，难以做到像素级可控，交互动画衔接不顺畅，究其原因，在于缺失了一些重要的能力。为此，Skyline 提供一套全新的交互动画能力。

#### 1. Worklet 动画

Worklet 机制是 Skyline 交互动画体系的基础，它能够很方便地将 JavaScript 代码跑在渲染线程，那么基于 Worklet 机制的 [动画模块](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/worklet.html)，便能够在渲染线程同步运行动画相关逻辑，使动画不再会有延迟掉帧。

#### 2. 手势系统

在原生应用的交互动画里，手势识别与协商是一个很重要的特性，而这块在 Web 体系下是缺失的，因此 Skyline 提供了基于 Worklet 机制的 [手势系统](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/gesture.html)。

- 支持常用手势的识别，如缩放、拖动、双击等，并能够渲染线程同步监听手势、执行手势相关逻辑；
- 支持手势协商处理，能够在遇到手势冲突（常见于滚动容器下）时决定让哪个手势生效，以实现更顺畅的动画衔接。

#### 3. 自定义路由

页面间中转进行自定义的转场动画，在原生应用里也是一个很常见的交互动画。在原来的小程序架构下，每个页面都是独立的 WebView 渲染，互相隔离，其跨页能力是基本不具备的。因此，Skyline 提供了基于 Worklet 机制的 [自定义路由模块](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/custom-route.html)，能实现市面上大多数页面转场动画效果。

#### 4. 共享元素动画

支持 [跨页面共享元素](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/share-element.html)，能够很方便地将上一个页面的元素“共享”到下一个页面，并伴随着过渡动画，同时支持了一套可定制化接口，能实现自定义的过渡动画。

#### 5. 内置组件扩展

对内置组件的扩展也是重要一环，特别是 scroll-view 组件，很多交互动画与滚动息息相关，Skyline 添加了很多在 Web 下很难做到又非常重要的特性。

- 内置下拉刷新的实现，并完善相关事件。原来 WebView 的实现基于 transform，性能不够好且动画衔接不顺畅。
- 提供“下拉二楼”交互的机制。
- 提供 [sticky](https://developers.weixin.qq.com/miniprogram/dev/component/sticky-header.html) 吸顶组件，能很方便地实现吸顶元素交错切换。
- 使 scroll-view 组件在内容未溢出时也能滚动，让用户得到及时的交互反馈。
- 为 scroll-view 组件提供更多控制能力，如最小触发滚动距离（min-drag-distance）、滚动结束事件（scrollend）、滚动原因（isDrag）等。
- 提供原生的 swiper 实现，相比 WebView 基于 transform 的实现，性能更好。



### 更多的高级能力

除了交互动画的系列能力外，借助 Skyline 的优势，我们还提供了很多高级特性。

#### 1. 提供 [grid-view](https://developers.weixin.qq.com/miniprogram/dev/component/grid-view.html) 瀑布流组件。

瀑布流是一种常用的列表布局方式，得益于 Skyline 在布局过程中的可控性，我们直接在底层实现并提供出来，渲染性能要比 WebView 更优。

#### 2. 提供 snapshot 截图组件。

大多数小程序都会基于 canvas 实现自定义分享图的功能，一方面，需要通过 canvas 绘图指令手动实现，较为繁琐；另一方面，在分享图的布局较复杂时，canvas 的方案实现成本会更大。得益于 Skyline 在渲染过程中的可控性，Skyline 能直接对 WXML 子树进行截图，因此我们直接提供了截图组件，这样能复用更完善的 WXSS 能力，极大降低开发成本。

#### 3. [scroll-view](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view?property=skyline) 组件支持列表反转。

在聊天对话的场景下，列表的滚动常常是反向的（往底部往上滚动），若使用正向滚动来模拟会有很多多余的逻辑，而且容易出现跳动，而 scroll-view 提供的 reverse 属性很好的解决这一问题。

## 支持与差异

### 选择器支持

- 通配符选择器 ×
- 属性选择器 ×
- 一般兄弟选择器 ×
- 紧邻兄弟选择器 ×

其他 

[WXSS样式](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/wxss.html)



## 增强特性

### worklet动画

小程序采用双线程架构，渲染线程（UI 线程）和逻辑线程（JS 线程）分离。`JS` 线程不会影响 `UI` 线程的动画表现，如滚动效果。但引入的问题是，`UI` 线程的事件发生后，需跨线程传递到 `JS` 线程，进而触发开发者回调，当做交互动画（如拖动元素）时，这种异步性会带来较大的延迟和不稳定。

`worklet` 动画正是为解决这类问题而诞生的，使得小程序可以做到类原生动画般的体验。

#### 配置

使用 `worklet` 动画能力时确保以下两项：

- 确保开发者工具右上角 > 详情 > 本地设置里的 `将 JS 编译成 ES5` 选项被勾选上 (代码包体积会少量增加)
- worklet 动画相关接口仅在 `Skyline` 渲染模式下才能使用

#### 概念一：worklet函数

一种声明在开发者代码中，可运行在 `JS` 线程或 `UI` 线程的函数，函数体顶部有 `'worklet'` 指令声明。

> worklet函数定义

```js
function someWorklet(greeting) {
  'worklet';
  console.log(greeting);
}

// 运行在 JS 线程
someWorklet('hello') // print: hello

// 运行在 UI 线程
wx.worklet.runOnUI(someWorklet)('hello') // print: [ui] hello
```

> worklet函数间相互调用

```js
const name = 'skyline'

function anotherWorklet() {
  'worklet';
  return 'hello ' + name;
}

// worklet 函数间可互相调用
function someWorklet() {
  'worklet';
  const greeting = anotherWorklet();
  console.log('another worklet says ', greeting);
}

wx.worklet.runOnUI(someWorklet)() // print: [ui] another worklet says hello skyline
```

> 从UI线程调回到JS线程

```js
function someFunc(greeting) {
  console.log('hello', greeting);
}

function someWorklet() {
  'worklet'
  // 访问非 worklet 函数时，需使用 runOnJS
  // someFunc 运行在 JS 线程
  runOnJS(someFunc)('skyline')
}

wx.worklet.runOnUI(someWorklet)() // print: hello skyline
```

#### 概念二：共享变量

在 `JS` 线程创建，可在两个线程间同步的变量。

```js
const { shared, runOnUI } = wx.worklet

const offset = shared(0)
function someWorklet() {
  'worklet'
  console.log(offset.value) // print: 1
  // 在 UI 线程修改
  offset.value = 2
  console.log(offset.value) // print: 2
}
// 在 JS 线程修改
offset.value = 1

runOnUI(someWorklet)()
```

由 `shared` 函数创建的变量，我们称为 `sharedValue` 共享变量。用法上可类比 `vue3` 中的 `ref`，对它的读写都需要通过 `.value` 属性，但需注意的是它们并不是一个概念。`sharedValue` 的用途主要如下。

1. 跨线程共享数据

由 `worklet` 函数捕获的外部变量，实际上会被序列化后生成在 `UI` 线程的拷贝，如下代码中， `someWorklet` 捕获了 `obj` 变量，尽管我们修改了 `obj` 的 `name` 属性，但在 `someWorklet` 声明的位置，`obj` 已经被序列化发送到了 `UI` 线程，因此后续的修改是无法同步的。

```
const obj = { name: 'skyline'}
function someWorklet() {
  'worklet'
  console.log(obj.name) // 输出的仍旧是 skyline
}
obj.name = 'change name'

wx.worklet.runOnUI(someWorklet)() 
```

`sharedValue` 就是用来在线程间同步状态变化的变量

```js
const { shared, runOnUI } = wx.worklet

const offset = shared(0)
function someWorklet() {
  'worklet'
  console.log(offset.value) // 输出的是新值 1
}
offset.value = 1

runOnUI(someWorklet)()
```

2. 驱动动画

`worklet` 函数和共享变量就是用来解决交互动画问题的。相关接口 `applyAnimatedStyle` 可通过页面/组件实例访问

### 手势系统

`Skyline` 中 `wxs` 代码运行在 `JS` 线程，而事件产生在 `UI` 线程，因此 `wxs 动画` 性能有所降低，为了提升小程序交互体验的效果，我们内置了一批手势组件，使用手势组件的优势包括

1. 免去开发者监听 `touch` 事件，自行计算手势逻辑的复杂步骤
2. 手势组件直接在 `UI` 线程响应，避免了传递到 `JS` 线程带来的延迟

[手势系统](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/gesture.html)



### 自定义路由

小程序采用多 `WebView` 架构，页面间跳转形式十分单一，仅能从右到左进行动画。而原生 `App` 的动画形式则多种多样，如从底部弹起，页面下沉，半屏等。

`Skyline` 渲染引擎下，页面有两种渲染模式: `WebView` 和 `Skyline`，它们通过页面配置中的 `renderer` 字段进行区分。在**连续的 `Skyline` 页面**间跳转时，可实现自定义路由效果。

#### 接口定义

自定义路由相关的接口

- 页面跳转 [wx.navigateTo](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html)
- 路由上下文对象 [wx.router.getRouteContext](https://developers.weixin.qq.com/miniprogram/dev/api/route/router/base/router.getRouteContext.html)
- 注册自定义路由 [wx.router.addRouteBuilder](https://developers.weixin.qq.com/miniprogram/dev/api/route/router/base/router.addRouteBuilder.html)

```js
type AddRouteBuilder = (routeType: string, routeBuilder: CustomRouteBuilder) => void

type CustomRouteBuilder = (routeContext: CustomRouteContext) => CustomRouteConfig

interface SharedValue<T> {
  value: T;
}

interface CustomRouteContext {
  // 动画控制器，影响推入页面的进入和退出过渡效果
  primaryAnimation: SharedValue<number>
  // 动画控制器状态
  primaryAnimationStatus: SharedValue<number>
  // 动画控制器，影响栈顶页面的推出过渡效果
  secondaryAnimation: SharedValue<number>
  // 动画控制器状态
  secondaryAnimationStatus: SharedValue<number>
  // 当前路由进度由手势控制
  userGestureInProgress: SharedValue<number>
  // 手势开始控制路由
  startUserGesture: () => void
  // 手势不再控制路由
  stopUserGesture: () => void
  // 返回上一级，效果同 wx.navigateBack
  didPop: () => void
}

interface CustomRouteConfig {
  // 下一个页面推入后，不显示前一个页面
  opaque?: boolean;
  // 是否保持前一个页面状态
  maintainState?: boolean;
  // 页面推入动画时长，单位 ms
  transitionDuration?: number;
  // 页面推出动画时长，单位 ms
  reverseTransitionDuration?: number;
  // 遮罩层背景色，支持 rgba() 和 #RRGGBBAA 写法
  barrierColor?: string;
  // 点击遮罩层返回上一页
  barrierDismissible?: boolean;
  // 无障碍语义
  barrierLabel?: string;  
  // 是否与下一个页面联动，决定当前页 secondaryAnimation 是否生效
  canTransitionTo?: boolean;
  // 是否与前一个页面联动，决定前一个页 secondaryAnimation 是否生效
  canTransitionFrom?: boolean;
  // 处理当前页的进入/退出动画，返回 StyleObject
  handlePrimaryAnimation?: RouteAnimationHandler;
  // 处理当前页的压入/压出动画，返回 StyleObject
  handleSecondaryAnimation?: RouteAnimationHandler;
  // 处理上一级页面的压入/压出动画，返回 StyleObject <3.0.0 起支持>
  handlePreviousPageAnimation?: RouteAnimationHandler;
}

type RouteAnimationHandler = () => { [key: string] : any}
```

> 默认路由配置

```js
const defaultCustomRouteConfig = {
  opaque: true,
  maintainState: true,
  transitionDuration: 300,
  reverseTransitionDuration: 300,
  barrierColor: '',
  barrierDismissible: false,
  barrierLabel: '',
  canTransitionTo: true,
  canTransitionFrom: true
}
```



### 共享元素动画

