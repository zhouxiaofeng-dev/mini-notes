# 小程序框架

## 场景值

场景值用来描述用户进入小程序的路径。

[场景值列表](https://developers.weixin.qq.com/miniprogram/dev/reference/scene-list.html)



## 逻辑层

### App

每个小程序都需要在 `app.js` 中调用 `App` 方法注册小程序实例，绑定生命周期回调函数、错误监听和页面不存在监听函数等。

[App参考文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html)

### 页面

对于小程序中的每个页面，都需要在页面对应的 `js` 文件中进行注册，指定页面的初始数据、生命周期回调、事件处理函数等。

[Page参考文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html)

### 页面路由

```javascript
//打开新页面
wx.navigateTo

//页面重定向
wx.redirectTo

//页面返回
wx.navigateBack

//Tab切换
wx.switchTab

//重启动
wx.reLaunch


navigateTo、redirectTo只能打开非tabBar页面
switchTab只能打开tabBar页面
reLaunch可以打开任意页面
```

### 模块化

可以将一些公共的代码抽离成为一个单独的 js 文件，作为一个模块。模块只有通过 [`module.exports`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/module.html) 或者 `exports` 才能对外暴露接口。

exports 是 [`module.exports`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/module.html) 的一个引用，因此在模块里边随意更改 `exports` 的指向会造成未知的错误。所以更推荐开发者采用 `module.exports` 来暴露模块接口，除非你已经清晰知道这两者的关系。

## 视图层

### WXML

#### 什么是WXML

WXML（WeiXin Markup Language）是小程序框架设计的一套标签语言，用来构建小程序页面的结构，其作用类似于网页开发的HTML

#### WXML和HTML的区别

1. 标签名称不同

- HTML（div、span、img、a）
- WXML（view、text、image、navigator）

2. 属性节点不同

- < a href="#">超链接< /a>
- < navigator url="/pages/home/home">< /navigator>

3. 提供了类似于Vue中的模板语法

- 数据绑定
- 列表渲染
- 条件渲染



#### 数据绑定

1. 在data中定义数据
2. 在WXML中使用数据（Mustache语法（双大括号））

​		

#### 事件绑定

##### 1.什么是事件

事件是**渲染层到逻辑层的通讯方式**，通过事件可以将用户在渲染层产生的行为，反馈到逻辑层进行业务的处理。

##### 2.常见的事件

1. tap（bindtap/bind:tap）：手指触摸后马上离开，类似于HTML中的click事件
2. input（bindinput或bind:input）：文本框的输入事件
3. change（bindchange/bind:change）：状态改变时触发

##### 3.事件对象的属性列表

当事件回调发生的时候，会收到一个事件对象event，它的详细属性如下所示：

1. type：事件类型
2. timeStamp：页面打开到触发事件所经过的毫秒数
3. target：触发事件的组件的一些属性值集合
4. currentTarget：当前组件的一些属性值集合
5. detail：额外的信息
6. touches：触摸事件，当前停留在屏幕中的触摸点信息的数组
7. changedTouches：触摸事件，当前变化的触摸点信息的数组

target和currentTarget的区别

1. target是**触发该事件的源头组件**，通俗的讲就是谁绑定事件就是谁
2. currentTarget是**当前事件所绑定的组件**，意思就是当前点击或触发的对象是谁就是谁
3. 为什么会不一样：因为有些事件会以**冒泡**的方式向外扩散。



##### 4.给data赋值

```javascript
this.setData({
	count:this.data.count + 1
})
```

##### 5.事件传参

```javascript
<button type="primary" bindtap="btnHandler(123)">   //×

<button type="primary" bindtap="btnHandler" bind-aaa="{{2}}">   //√
//传入的参数名为aaa 参数值为2
//保存在event.target.dataset.aaa 中
    
//另外
    "{{2}}"  传入的是数字
    "2"      传入的是字符串
```

#### bindinput的语法格式

```java
<input bindinput="inputHandler"></input>

inputHandler(e){
	console.log(e.target.value)      //最新的值
}
```

#### 实现文本框和data之间数据同步

```javascript
<input value="{{msg}}" bindinput="changeInput">

changeInput(e){
	this.setData({
		msg:e.target.value;
	})
}
```

#### 条件渲染

```html
<!-- 1.wx:if 判断是否渲染该代码块 -->
<view wx:if="{{condition}}">123</view>          

<view wx:if="{{type == 1}}">男</view>
<view wx:elif="{{type == 2}}">女</view>
<view wx:else>未知</view>


<!-- 2.一次性控制多个组件的展示和隐藏  使用<block>标签将多个组件包装起来 -->
<!-- block只是一个容器，不会被渲染 -->
<block wx:if="{{true}}">
    <view>1</view>
    <view>2</view>
</block>
    
<!-- 3.也可以使用hidden="{{condition}}" 来控制展示(false)和隐藏(true) -->
<view hidden="{{condition}}">132</view>

<!-- 4.wx:if和hidden的不同 -->
<!-- 	
		1.运行方式不同: wx:if以动态创建和移除元素的方式，控制元素的展示和隐藏。而hidden则是切换样式的方式		(display:none/block来控制)  
		2.使用建议:频繁使用时，建议使用hidden。控制条件复杂时，建议使用wx:if搭配wx:elif、wx:else
-->


<!-- 5.wx:for -->
<!-- 使用wx:for-index 和wx:for-item可以修改使用的变量名 -->
<view wx:for="{{array}}" wx:key="index">
	{{index}} {{item}}
</view>

<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="data">
	{{idx}} {{data}}
</view>

```



### WXSS

#### 1.什么是WXSS

WXSS（WeiXin Style Sheet）是一套样式语言，用于描述WXML的组件样式，类似于网页开发中的CSS

#### 2.WXSS和CSS的区别

1. 新增了rpx尺寸单位
   1. CSS中需要手动进行像素单位换算，例如rem
   2. WXSS在底层支持新的尺寸单位rpx。在不同大小的屏幕上小程序会自动进行换算
2. 提供了全局的样式和局部样式
   1. 项目根目录中的app.wxss会作用于所有小程序页面
   2. 局部页面的.wxss样式仅对当前页面生效
3. WXSS仅支持部分CSS选择器 
   1. .class和#id
   2. element
   3. 并集选择器和后代选择器
   4. ::after和::before等伪类选择器



#### 3.rpx尺寸单位

rpx（responsive pixel）是微信小程序独有的，用来解决屏适配的尺寸单位

rpx把所有设备的屏幕分为750份，就是750rpx



#### 4.样式导入

使用WXSS提供的import语法

```css
/** common.css**/
.data{
    padding:5px;
}

/** app.wxss **/
@import "common.css"
```



### WXS

WXS（WeiXin Script）是内联在 WXML 中的脚本段。通过 WXS 可以在模版中内联少量处理脚本，丰富模板的数据预处理能力。另外， WXS 还可以用来编写简单的 [WXS 事件响应函数](https://developers.weixin.qq.com/miniprogram/dev/framework/view/interactive-animation.html)。

[WXS](https://developers.weixin.qq.com/miniprogram/dev/reference/wxs/)



### 简易双向绑定

双向绑定语法

在WXML中，普通的属性的绑定是单向的

```html
<input value="{{value}}" />
```

如果使用this.setData来更新value，this.data.value会改变，但是input框里面的数据不会被改变。

我们需要在value前面加上**model:**前缀

```html
<input model:value="{{value}}" />
```

**简单的双向绑定也可以运用到自定义组件上**

### 基础组件

#### 什么是组件

1. 组件是视图层的基本组成单元
2. 组件自带一些功能与微信风格一致的样式
3. 一个组件通常包括**开始标签**和结束标签，**属性**用来修饰这个组件，内容在两个标签之间

```html
<tagname property="value">
Context goes here
</tagname>
```

### 获取界面上的节点信息

#### WXML节点信息

[节点信息查询API](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createSelectorQuery.html)可以用于获取节点属性、样式、在界面上的位置等信息。

最常见的用法是使用这个接口来查询某个节点的当前位置，以及界面的滚动位置。

在自定义组件或包含自定义组件的页面中，推荐使用this.createSelectorQuery来代替wx.createSelectQuery,这样可以确保在正确的范围内选中节点

#### WXML节点布局相交状态

[节点布局相交状态API](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createIntersectionObserver.html)可用于监听两个或多个组件节点在布局位置上的相交状态。这一组API常常可以用于推断某些节点是否可以被用户看见、有多大比例可以被用户看见。

这一组API涉及的主要概念如下。

- 参照节点：监听的参照节点，取它的布局区域作为参照区域。如果有多个参照节点，则会取它们布局区域的 **交集** 作为参照区域。页面显示区域也可作为参照区域之一。
- 目标节点：监听的目标，默认只能是一个节点（使用 `selectAll` 选项时，可以同时监听多个节点）。
- 相交区域：目标节点的布局区域与参照区域的相交区域。
- 相交比例：相交区域占参照区域的比例。
- 阈值：相交比例如果达到阈值，则会触发监听器的回调函数。阈值可以有多个。

### 响应显示区域变化

#### 在手机上启用屏幕旋转支持

从小程序基础库版本2.4.0开始，小程序在手机上支持屏幕旋转。使小程序中的页面支持屏幕旋转的方法是：在 `app.json` 的 `window` 段中设置 `"pageOrientation": "auto"` ，或在页面 json 文件中配置 `"pageOrientation": "auto"` 。

```javascript
{
	"pageOrientation":"auto"	
}
```

如果页面添加了上述声明，则在屏幕旋转时，这个页面将随之旋转，显示区域尺寸也会随着屏幕旋转而变化。

从小程序基础库版本 [2.5.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 开始， `pageOrientation` 还可以被设置为 `landscape` ，表示固定为横屏显示。

#### 在iPad上启用屏幕旋转支持/在Window或Mac上启用大屏模式

从小程序基础库版本 [2.3.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 开始，在 iPad 上运行的小程序可以支持屏幕旋转。使小程序支持 iPad 屏幕旋转的方法是：在 `app.json` 中添加 `"resizable": true` 。

```javascript
{
	"resizable":true	
}
```

注意：在iPad上不能单独配置某个页面是否支持屏幕旋转

#### Media Query

有时，对于不同尺寸的显示区域，页面的布局会有所差异。此时可以使用media Query来解决大多数问题

```css
.my-class {
	width:40px;
}
@media(min-width:480px){
    /**仅在480px或更宽的屏幕上生效的样式规则*/
    .my-class{
        width:200px;
    }
}
```

在WXML中，可以使用match-media组件来根据media query匹配状态展示、隐藏节点。

#### 屏幕旋转事件

```javascript
Page({
  onResize(res) {
    res.size.windowWidth // 新的显示区域宽度
    res.size.windowHeight // 新的显示区域高度
  }
})
```

```javascript
Component({
  pageLifetimes: {
    resize(res) {
      res.size.windowWidth // 新的显示区域宽度
      res.size.windowHeight // 新的显示区域高度
    }
  }
})
```

还可以使用wx.onWindowResize来监听（不推荐）

### 分栏模式

在 PC 等能够以较大屏幕显示小程序的环境下，小程序支持以分栏模式展示。分栏模式可以将微信窗口分为左右两半，各展示一个页面。

目前， Windows 微信 3.3 以上版本支持分栏模式。对于其他版本微信，分栏模式不会生效。

#### 启用分栏模式

在 app.json 中同时添加 `"resizable": true` 和 `"frameset": true` 两个配置项就可以启用分栏模式。

```javascript
{
    "resizable":true,
    "frameset":true,
}
```

#### 分栏占位图片

当某一栏没有展示任何页面时，会展示一张图片在此栏正中央。

如果代码包中的 `frameset/placeholder.png` 文件存在，这张图片将作为此时展示的图片。

#### 避免使用更改页面展示效果的接口

更改当前页面展示效果的接口，总是对最新打开的页面生效。

例如，在右栏打开一个新页面后，更改页面标题的接口 [wx.setNavigationBarTitle](https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.setNavigationBarTitle.html) 即使是在左栏的页面中调用，也将更改右栏内页面的标题！

因此，应当尽量避免使用这样的接口，而是改用 [page-meta](https://developers.weixin.qq.com/miniprogram/dev/component/page-meta.html) 和 [navigation-bar](https://developers.weixin.qq.com/miniprogram/dev/component/navigation-bar.html) 组件代替。

#### 变更路由接口调用

如果在路由接口中使用相对路径，总是相对于最新打开的页面路径。

例如，在右栏打开一个新页面后，路由接口 [wx.navigateTo](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html) 即使是在左栏的页面中调用，跳转路径也将相对于右栏内页面的路径！

因此，应当将这样的路由接口改成 [Router](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Router.html) 接口调用，如 `this.pageRouter.navigateTo` 。

### 动画

在小程序中，通常可以使用CSS渐变和CSS动画来创建简易的界面动画

动画过程中，可以使用 `bindtransitionend` `bindanimationstart` `bindanimationiteration` `bindanimationend` 来监听动画事件。

但是大部分使用的都是关键帧动画

从小程序基础库 [2.9.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 开始支持一种更友好的动画创建方式，用于代替旧的 [wx.createAnimation](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/wx.createAnimation.html) 。它具有更好的性能和更可控的接口。

在页面或自定义组件中，当需要进行关键帧动画时，可以使用 `this.animate` 接口：

```javascript
this.animate(selector,keyframs,duration,callback)
```

**参数说明**

| 属性      | 类型     | 默认值 | 必填 | 说明                                                         |
| :-------- | :------- | :----- | :--- | :----------------------------------------------------------- |
| selector  | String   |        | 是   | 选择器（同 [SelectorQuery.select](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.select.html) 的选择器格式） |
| keyframes | Array    |        | 是   | 关键帧信息                                                   |
| duration  | Number   |        | 是   | 动画持续时长（毫秒为单位）                                   |
| callback  | function |        | 否   | 动画完成后的回调函数                                         |

**keyframes 中对象的结构**

| 属性            | 类型          | 默认值 | 必填                              | 说明                                    |
| :-------------- | :------------ | :----- | :-------------------------------- | :-------------------------------------- |
| offset          | Number        |        | 否                                | 关键帧的偏移，范围[0-1]                 |
| ease            | String        | linear | 否                                | 动画缓动函数                            |
| transformOrigin | String        | 否     | 基点位置，即 CSS transform-origin |                                         |
| backgroundColor | String        |        | 否                                | 背景颜色，即 CSS background-color       |
| bottom          | Number/String |        | 否                                | 底边位置，即 CSS bottom                 |
| height          | Number/String |        | 否                                | 高度，即 CSS height                     |
| left            | Number/String |        | 否                                | 左边位置，即 CSS left                   |
| width           | Number/String |        | 否                                | 宽度，即 CSS width                      |
| opacity         | Number        |        | 否                                | 不透明度，即 CSS opacity                |
| right           | Number        |        | 否                                | 右边位置，即 CSS right                  |
| top             | Number/String |        | 否                                | 顶边位置，即 CSS top                    |
| matrix          | Array         |        | 否                                | 变换矩阵，即 CSS transform matrix       |
| matrix3d        | Array         |        | 否                                | 三维变换矩阵，即 CSS transform matrix3d |
| rotate          | Number        |        | 否                                | 旋转，即 CSS transform rotate           |
| rotate3d        | Array         |        | 否                                | 三维旋转，即 CSS transform rotate3d     |
| rotateX         | Number        |        | 否                                | X 方向旋转，即 CSS transform rotateX    |
| rotateY         | Number        |        | 否                                | Y 方向旋转，即 CSS transform rotateY    |
| rotateZ         | Number        |        | 否                                | Z 方向旋转，即 CSS transform rotateZ    |
| scale           | Array         |        | 否                                | 缩放，即 CSS transform scale            |
| scale3d         | Array         |        | 否                                | 三维缩放，即 CSS transform scale3d      |
| scaleX          | Number        |        | 否                                | X 方向缩放，即 CSS transform scaleX     |
| scaleY          | Number        |        | 否                                | Y 方向缩放，即 CSS transform scaleY     |
| scaleZ          | Number        |        | 否                                | Z 方向缩放，即 CSS transform scaleZ     |
| skew            | Array         |        | 否                                | 倾斜，即 CSS transform skew             |
| skewX           | Number        |        | 否                                | X 方向倾斜，即 CSS transform skewX      |
| skewY           | Number        |        | 否                                | Y 方向倾斜，即 CSS transform skewY      |
| translate       | Array         |        | 否                                | 位移，即 CSS transform translate        |
| translate3d     | Array         |        | 否                                | 三维位移，即 CSS transform translate3d  |
| translateX      | Number        |        | 否                                | X 方向位移，即 CSS transform translateX |
| translateY      | Number        |        | 否                                | Y 方向位移，即 CSS transform translateY |
| translateZ      | Number        |        | 否                                | Z 方向位移，即 CSS transform translateZ |

实例代码

```javascript
this.animate('#container',[
    {opacity:1.0,rotate:0,backgroundColor:'#ff0000'},
    {opacity:0.5,rotate:45,backgroundColor:'00FF00'},
    {opacity:0,rotate:90,backgroundColor:'FF0000'},
], 5000,function(){
    this.clearAnimation('#container',{opacity:true,rotate:true},function(){
        console.log("清除了#container上的opacity和rotate属性")
    })
},bind(this))

this.animate('.block', [
    { scale: [1, 1], rotate: 0, ease: 'ease-out'  },
    { scale: [1.5, 1.5], rotate: 45, ease: 'ease-in', offset: 0.9},
    { scale: [2, 2], rotate: 90 },
], 5000, function () {
    this.clearAnimation('.block', function () {
      console.log("清除了.block上的所有动画属性")
    })
}.bind(this))
```

调用 animate API 后会在节点上新增一些样式属性覆盖掉原有的对应样式。如果需要清除这些样式，可在该节点上的动画全部执行完毕后使用 `this.clearAnimation` 清除这些属性。

```javascript
this.clearAnimation(selector,options,callback)
```

**参数说明**

| 属性     | 类型     | 默认值 | 必填 | 说明                                                         |
| :------- | :------- | :----- | :--- | :----------------------------------------------------------- |
| selector | String   |        | 是   | 选择器（同 [SelectorQuery.select](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.select.html) 的选择器格式） |
| options  | Object   |        | 否   | 需要清除的属性，不填写则全部清除                             |
| callback | Function |        | 否   | 清除完成后的回调函数                                         |

#### 滚动驱动的动画

我们发现，根据滚动位置而不断改变动画的进度是一种比较常见的场景，这类动画可以让人感觉到界面交互很连贯自然，体验更好。因此，从小程序基础库 [2.9.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 开始支持一种由滚动驱动的动画机制。

基于上述的关键帧动画接口，新增一个 `ScrollTimeline` 的参数，用来绑定滚动元素（目前只支持 scroll-view）。接口定义如下：

```javascript
this.animate(selector, keyframes, duration, ScrollTimeline)
```

**ScrollTimeline 中对象的结构**

| 属性              | 类型   | 默认值   | 必填 | 说明                                                         |
| :---------------- | :----- | :------- | :--- | :----------------------------------------------------------- |
| scrollSource      | String |          | 是   | 指定滚动元素的选择器（只支持 scroll-view），该元素滚动时会驱动动画的进度 |
| orientation       | String | vertical | 否   | 指定滚动的方向。有效值为 horizontal 或 vertical              |
| startScrollOffset | Number |          | 是   | 指定开始驱动动画进度的滚动偏移量，单位 px                    |
| endScrollOffset   | Number |          | 是   | 指定停止驱动动画进度的滚动偏移量，单位 px                    |
| timeRange         | Number |          | 是   | 起始和结束的滚动范围映射的时间长度，该时间可用于与关键帧动画里的时间 (duration) 相匹配，单位 ms |

```javascript
this.animate('.avatar', [{
    borderRadius: '0',
    borderColor: 'red',
    transform: 'scale(1) translateY(-20px)',
    offset: 0,
  }, {
    borderRadius: '25%',
    borderColor: 'blue',
    transform: 'scale(.65) translateY(-20px)',
    offset: .5,
  }, {
    borderRadius: '50%',
    borderColor: 'blue',
    transform: `scale(.3) translateY(-20px)`,
    offset: 1
  }], 2000, {
    scrollSource: '#scroller',
    timeRange: 2000,
    startScrollOffset: 0,
    endScrollOffset: 85,
  })

  this.animate('.search_input', [{
    opacity: '0',
    width: '0%',
  }, {
    opacity: '1',
    width: '100%',
  }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 120,
    endScrollOffset: 252
  })
```

### 初始渲染缓存

#### 初始渲染缓存工作原理

小程序页面的初始化分为两个部分。

- **逻辑层初始化**：载入必需的小程序代码、初始化页面 this 对象（也包括它涉及到的所有自定义组件的 this 对象）、将相关数据发送给视图层。
- **视图层初始化**：载入必需的小程序代码，然后等待逻辑层初始化完毕并接收逻辑层发送的数据，最后渲染页面。

在启动页面时，尤其是小程序冷启动、进入第一个页面时，逻辑层初始化的时间较长。在页面初始化过程中，用户将看到小程序的标准载入画面（冷启动时）或可能看到轻微的白屏现象（页面跳转过程中）。

启用初始渲染缓存，可以使视图层不需要等待逻辑层初始化完毕，而直接提前将页面初始 data 的渲染结果展示给用户，这可以使得页面对用户可见的时间大大提前。它的工作原理如下：

- **在小程序页面第一次被打开后，将页面初始数据渲染结果记录下来，写入一个持久化的缓存区域（缓存可长时间保留，但可能因为小程序更新、基础库更新、储存空间回收等原因被清除）；**
- **在这个页面被第二次打开时，检查缓存中是否还存有这个页面上一次初始数据的渲染结果，如果有，就直接将渲染结果展示出来；**
- **如果展示了缓存中的渲染结果，这个页面暂时还不能响应用户事件，等到逻辑层初始化完毕后才能响应用户事件。**

利用初始渲染缓存，可以：

- 快速展示出页面中永远不会变的部分，如导航栏；
- 预先展示一个骨架页，提升用户体验；
- 展示自定义的加载提示；
- 提前展示广告，等等。

#### 支持的组件

在初始渲染缓存阶段中，复杂组件不能被展示或不能响应交互。

目前支持的内置组件：

- `<view />`
- `<text />`
- `<button />`
- `<image />`
- `<scroll-view />`
- `<rich-text />`

自定义组件本身可以被展示（但它们里面用到的内置组件也遵循上述限制）。

#### 静态初始渲染缓存

若想启用初始渲染缓存，最简单的方法是在页面的json文件中添加配置项

"initialRenderingCache":"static"

```javascript
{
    "initialRenderingCache":"static"
}
```

如果想要对所有页面启用，可以在app.json的window配置段中添加这个配置

```javascript
{
	"window":{
		"initialRenderingCache":"static"
	}
}
```

#### 在初始渲染缓存中添加动态内容

有些场景中，只是页面 `data` 的渲染结果会比较局限。有时会想要额外展示一些可变的内容，如展示的广告图片 URL 等。

这种情况下可以使用“动态”初始渲染缓存的方式。首先，配置 `"initialRenderingCache": "dynamic"` ：

```javascript
{
	"initialRenderingCache":"dynamic",
}
```

此时，初始渲染缓存不会被自动启用，还需要在页面中调用 `this.setInitialRenderingCache(dynamicData)` 才能启用。其中， `dynamicData` 是一组数据，与 `data` 一起参与页面 WXML 渲染。

```javascript
Page({
  data: {
    loading: true
  },
  onReady: function() {
    this.setInitialRenderingCache({
      loadingHint: '正在加载' // 这一部分数据将被应用于界面上，相当于在初始 data 基础上额外进行一次 setData
    })
  }
})
```

```html
<view wx:if="{{loading}}">{{loadingHint}}</view>
```

从原理上说，在动态生成初始渲染缓存的方式下，页面会在后台使用动态数据重新渲染一次，因而开销相对较大。因而要尽量避免频繁调用 `this.setInitialRenderingCache` ，如果在一个页面内多次调用，仅最后一次调用生效。

注意：

- `this.setInitialRenderingCache` 调用时机不能早于 `Page` 的 `onReady` 或 `Component` 的 `ready` 生命周期，否则可能对性能有负面影响。
- 如果想禁用初始渲染缓存，调用 `this.setInitialRenderingCache(null)` 。