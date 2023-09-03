# 宿主环境

宿主环境(Host environment) 指的是程序运行所必须的依赖环境。例如：

Android 系统和 IOS 系统是两个不同的宿主环境。

1. 通信模型
2. 运行机制
3. 组件
4. API

## 1.通信的主体

小程序中通信的主体是渲染层和逻辑层，其中：

1. WXML 模板和 WXSS 样式工作在渲染层
2. JS 脚本工作在逻辑层

## 2.通信模型

1. **渲染层**和**逻辑层**之间的通信
   1. 由微信客户端进行转发
2. **逻辑层**和**第三方服务器**之间的通信
   1. 由微信客户端进行转发

![image-20230727171719266](C:\Users\86155\AppData\Roaming\Typora\typora-user-images\image-20230727171719266.png)

## 3.运行机制

### 启动过程

1. 把小程序的代码包下载到本地
2. 解析 app.json 全局配置文件
3. 执行 app.js 小程序入口文件，调用 App()创建小程序实例
4. 渲染小程序首页
5. 小程序启动完成

### 页面渲染的过程

1. 加载解析页面的 json 配置文件
2. 加载页面 wxml 模板和 wxss 样式
3. 执行页面的 js 文件，**调用 Page()创建页面实例**
4. 页面渲染完成

## 4.组件

小程序中的组件也是由宿主环境提供的，开发者可以基于组件快速搭建出漂亮的页面结构。

官方把小程序的组件分为 9 大类

1. 视图容器
2. 基础内容
3. 表单组件
4. 导航组件
5. 媒体组件
6. map 地图组件
7. canvas 画布组件
8. 开放能力
9. 无障碍访问

### 常见的视图容器类组件

1. view
   1. 普通视图区域
   2. 类似于 HTML 的 div，是一个块级元素
   3. 常用来实现页面的布局效果
2. scroll-view
   1. 可滚动的视图区域
   2. 常用来实现滚动列表效果
3. swiper 和 swiper-item
   1. 轮播图容器组件和轮播图 item 组件

### 常用的基础内容组件

1. text
   1. 文本组件
   2. 类似于 HTML 的 span 标签，是一个行内标签
   3. 长按选中：selectable 属性
2. rich-text
   1. 富文本组件
   2. 支持把 html 字符串渲染为 WXML 结构
   3. 用于从后端获取数据渲染到页面上
   4. 例子: <rich-text nodes="<h1 style='color:red;'>标题</h1>"></rich-text>

### 其他常用组件

1. button
   1. 按钮组件
   2. 功能比 HTML 中的 button 按钮丰富
   3. 通过 type 属性调节颜色（主题），size 设置大小
   4. 通过 open-type 属性可以调用微信提供的各种服务（客服、转发、获取用户授权、获取用户信息等）
2. image
   1. mode 属性用来指定图片的裁剪和缩放模式
3. navigator

## 5.API

小程序中的 API 是由宿主环境提供的，通过这些丰富的小程序 API，开发者可以方便的调用微信提供的能力。

例如：获取用户信息、本地存储、支付功能等。

小程序官方把 API 分为了 3 大类。

1. 事件监听 API
   1. 特点，以**on**开头，用来监听某些事件的触发。
   2. 举例：wx.**onWindowResize**(function callback)监听窗口尺寸变化的事件。
2. 同步 API
   1. 特点 1：以**Sync**结尾的 API 都是同步 API。
   2. 特点 2：同步 API 的执行结果，可以通过函数返回值之间获取，如果执行出错会抛出异常。
   3. 举例：wx.**setStorageSync**('key','value')向本地存储中写入内容。
3. 异步 API
   1. 特点:类似于 JQuery 中的**$.ajax(options)**函数，需要通过 success、fail、complete 接收调用的结果。
   2. 举例：wx.**request()**发出网络请求，通过 success 回调函数接收数据。

## 全局配置

小程序根目录下的 `app.json` 文件用来对微信小程序进行全局配置，决定页面文件的路径、窗口表现、设置网络超时时间、设置多 tab 等。

[小程序全局配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)

## 页面配置

每一个小程序页面也可以使用同名 `.json` 文件来对本页面的窗口表现进行配置，页面中配置项会覆盖 `app.json` 的 `window` 中相同的配置项。

[小程序页面配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html)
