# 小程序运行时

## 小程序的运行环境

微信小程序运行在多种平台上：iOS/iPadOS 微信客户端、Android 微信客户端、Windows PC 微信客户端、Mac 微信客户端、[小程序硬件框架](https://developers.weixin.qq.com/doc/oplatform/Miniprogram_Frame/)和用于调试的微信开发者工具等。

不同运行环境下，脚本执行环境以及用于组件渲染的环境是不同的，性能表现也存在差异：

- 在 iOS、iPadOS 和 Mac OS 上，小程序逻辑层的 JavaScript 代码运行在 JavaScriptCore 中，视图层是由 WKWebView 来渲染的，环境有 iOS 14、iPad OS 14、Mac OS 11.4 等；
- 在 Android 上，小程序逻辑层的 JavaScript 代码运行在 [V8](https://developers.google.com/v8/) 中，视图层是由基于 Mobile Chromium 内核的微信自研 XWeb 引擎来渲染的；
- 在 Windows 上，小程序逻辑层 JavaScript 和视图层都是用 Chromium 内核；
- 在 开发工具上，小程序逻辑层的 JavaScript 代码是运行在 [NW.js](https://nwjs.io/) 中，视图层是由 Chromium Webview 来渲染的。

> JavaScriptCore 无法开启 JIT 编译 (Just-In-Time Compiler)，同等条件下的运行性能要明显低于其他平台。

### 平台差异

尽管各运行环境是十分相似的，但是还是有些许区别：

- `JavaScript` 语法和 API 支持不一致：语法上开发者可以通过开启 `ES6` 转 `ES5` 的功能来规避（[详情](https://developers.weixin.qq.com/miniprogram/dev/devtools/codecompile.html#es6-转-es5)）；此外，小程序基础库内置了必要的 Polyfill，来弥补 API 的差异（[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/js-support.html))。
- `WXSS` 渲染表现不一致：尽管可以通过开启[样式补全](https://developers.weixin.qq.com/miniprogram/dev/devtools/codecompile.html#样式补全)来规避大部分的问题，还是建议开发者需要在各端分别检查小程序的真实表现。

## JavaScript 支持情况

### 运行限制

基于安全考虑，小程序中不支持动态执行 JS 代码，即：

- 不支持使用 `eval` 执行 JS 代码
- 不支持使用 new Function 创建函数
  - `new Function('return this')` 除外

### Promise 时序差异

由于实现原因与 iOS JavaScriptCore 限制，iOS 环境下的 `Promise` 是一个使用 `setTimeout` 模拟的 Polyfill。这意味着 `Promise` 触发的任务为普通任务，而非微任务，进而导致 **在 iOS 下的 `Promise` 时序会和标准存在差异**。

```javascript
var arr = [];

setTimeout(() => arr.push(6), 0);
arr.push(1);
const p = new Promise((resolve) => {
  arr.push(2);
  resolve();
});
arr.push(3);
p.then(() => arr.push(5));
arr.push(4);
setTimeout(() => arr.push(7), 0);

setTimeout(() => {
  // 应该输出 [1,2,3,4,5,6,7]
  // 在 iOS 小程序环境，这里会输出 [1,2,3,4,6,5,7]
  console.log(arr);
}, 1000);
```

## 运行机制

### 1.小程序的生命周期

小程序从启动到最终被销毁，会经历很多不同的状态，小程序在不同状态下会有不同的表现。

![image-20230729160209551](C:\Users\86155\AppData\Roaming\Typora\typora-user-images\image-20230729160209551.png)

#### 1.1 小程序启动

从用户认知的角度看，广义的小程序启动可以分为两种情况，一种是**冷启动**，一种是**热启动**。

- 冷启动：如果用户首次打开，或小程序销毁后被用户再次打开，此时小程序需要重新加载启动，即冷启动。
- 热启动：如果用户已经打开过某小程序，然后在一定时间内再次打开该小程序，此时小程序并未被销毁，只是从后台状态进入前台状态，这个过程就是热启动。

从小程序生命周期的角度来看，我们一般讲的「**启动**」专指冷启动，热启动一般被称为后台切前台。

#### 1.2 前台与后台

小程序启动后，界面被展示给用户，此时小程序处于「**前台**」状态。

当用户「关闭」小程序时，小程序并没有真正被关闭，而是进入了「**后台**」状态，此时小程序还可以短暂运行一小段时间，但部分 API 的使用会受到限制。切后台的方式包括但不限于以下几种：

- 点击右上角胶囊按钮离开小程序
- iOS 从屏幕左侧右滑离开小程序
- 安卓点击返回键离开小程序
- 小程序前台运行时直接把微信切后台（手势或 Home 键）
- 小程序前台运行时直接锁屏

当用户再次进入微信并打开小程序，小程序又会重新进入「**前台**」状态。

#### 1.3 挂起

小程序进入「后台」状态一段时间后（目前是 5 秒），微信会停止小程序 JS 线程的执行，小程序进入「**挂起**」状态。此时小程序的内存状态会被保留，但开发者代码执行会停止，事件和接口回调会在小程序再次进入「前台」时触发。

当开发者使用了[后台音乐播放](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioManager.html)、[后台地理位置](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.startLocationUpdateBackground.html)等能力时，小程序可以在「后台」持续运行，不会进入到「挂起」状态

#### 1.4 小程序销毁

如果用户很久没有使用小程序，或者系统资源紧张，小程序会被「**销毁**」，即完全终止运行。具体而言包括以下几种情形：

- 当小程序进入后台并被「挂起」后，如果很长时间（目前是 30 分钟）都未再次进入前台，小程序会被销毁。
- 当小程序占用系统资源过高，可能会被系统销毁或被微信客户端主动回收。
  - 在 iOS 上，当微信客户端在一定时间间隔内连续收到系统内存告警时，会根据一定的策略，主动销毁小程序，并提示用户 「运行内存不足，请重新打开该小程序」。具体策略会持续进行调整优化。
  - 建议小程序在必要时使用 [wx.onMemoryWarning](https://developers.weixin.qq.com/miniprogram/dev/api/device/memory/wx.onMemoryWarning.html) 监听内存告警事件，进行必要的内存清理。

### 2.小程序冷启动的页面

小程序冷启动时，打开的页面有以下情况

- （A 类场景）若启动的场景中不带 path
  - 基础库 2.8.0 以下版本，进入首页
  - 基础库 2.8.0 及以上版本遵循「重新启动策略」，可能是首页或上次退出的页面
- （B 类场景）若启动的场景中带有 path，则启动进入对应 path 的页面

#### 2.1 重新启动策略

小程序冷启动时，如果启动时不带 path（A 类场景），默认情况下将会进入小程序的首页。 在页面对应的 json 文件中（也可以全局配置在 app.json 的 window 段中），指定 `restartStrategy` 配置项可以改变这个默认的行为，使得从某个页面退出后，下次 A 类场景的冷启动可以回到这个页面。

```javascript
{
    "restartStrategy":"homePage"
}
```

`restartStrategy` 可选值：

| 可选值                | 含义                                                                                          |
| :-------------------- | :-------------------------------------------------------------------------------------------- |
| homePage              | （默认值）如果从这个页面退出小程序，下次将从首页冷启动                                        |
| homePageAndLatestPage | 如果从这个页面退出小程序，下次冷启动后立刻加载这个页面，页面的参数保持不变（不可用于 tab 页） |

注意：即使不配置为 `homePage` ，小程序如果退出过久（当前默认一天时间，可以使用**退出状态**来调整），下次冷启动时也将不再遵循 `restartStrategy` 的配置，而是直接从首页冷启动。

无论如何，页面中的状态并不会被保留，如输入框中的文本内容、 checkbox 的勾选状态等都不会还原。如果需要还原或部分还原，需要利用**退出状态**。

### 3.小程序热启动的页面

小程序热启动时，打开的页面有以下情况

- （A 类场景）若启动的场景中不带 path，则保留上次的浏览的状态
- （B 类场景）若启动的场景中带有 path，则 reLaunch 到对应 path 的页面

A 类场景常见的有下列[场景值](https://developers.weixin.qq.com/miniprogram/dev/component/xr-frame/core/scene.html)：

| 场景值 ID | 说明                                                                                                     |
| :-------- | :------------------------------------------------------------------------------------------------------- |
| 1001      | 发现栏小程序主入口，「最近使用」列表（基础库 2.2.4 版本起包含「我的小程序」列表）                        |
| 1003      | 星标小程序列表                                                                                           |
| 1023      | 系统桌面小图标打开小程序                                                                                 |
| 1038      | 从其他小程序返回小程序                                                                                   |
| 1056      | 聊天顶部音乐播放器右上角菜单，打开小程序                                                                 |
| 1080      | 客服会话菜单小程序入口，打开小程序                                                                       |
| 1083      | 公众号会话菜单小程序入口 ，打开小程序（只有腾讯客服小程序有）                                            |
| 1089      | 聊天主界面下拉，打开小程序/微信聊天主界面下拉，「最近使用」栏（基础库 2.2.4 版本起包含「我的小程序」栏） |
| 1090      | 长按小程序右上角菜单，打开小程序                                                                         |
| 1103      | 发现-小程序主入口我的小程序，打开小程序                                                                  |
| 1104      | 聊天主界面下拉，从我的小程序，打开小程序                                                                 |
| 1113      | 安卓手机负一屏，打开小程序                                                                               |
| 1114      | 安卓手机侧边栏，打开小程序                                                                               |
| 1117      | 后台运行小程序的管理页中，打开小程序                                                                     |

### 4.退出页面

每当小程序可能被销毁之前，页面回调函数 `onSaveExitState` 会被调用。如果想保留页面中的状态，可以在这个回调函数中“保存”一些数据，下次启动时可以通过 `exitState` 获得这些已保存数据。

**代码示例：**

```json
{
  "restartStrategy": "homePageAndLatestPage"
}
Page({
  onLoad: function() {
    var prevExitState = this.exitState // 尝试获得上一次退出前 onSaveExitState 保存的数据
    if (prevExitState !== undefined) { // 如果是根据 restartStrategy 配置进行的冷启动，就可以获取到
      prevExitState.myDataField === 'myData'
    }
  },
  onSaveExitState: function() {
    var exitState = { myDataField: 'myData' } // 需要保存的数据
    return {
      data: exitState,
      expireTimeStamp: Date.now() + 24 * 60 * 60 * 1000 // 超时时刻
    }
  }
})
```

`onSaveExitState` 返回值可以包含两项：

| 字段名          | 类型   | 含义                                                                       |
| :-------------- | :----- | :------------------------------------------------------------------------- |
| data            | Any    | 需要保存的数据（只能是 JSON 兼容的数据）                                   |
| expireTimeStamp | Number | 超时时刻，在这个时刻后，保存的数据保证一定被丢弃，默认为 (当前时刻 + 1 天) |

一个更完整的示例：[在开发者工具中预览效果](https://developers.weixin.qq.com/s/ELP5uTmN7E8l)

#### 注意事项

- 如果超过 `expireTimeStamp` ，保存的数据将被丢弃，且冷启动时不遵循 `restartStrategy` 的配置，而是直接从首页冷启动。
- `expireTimeStamp` 有可能被自动提前，如微信客户端需要清理数据的时候。
- 在小程序存活期间， `onSaveExitState` 可能会被多次调用，此时以最后一次的调用结果作为最终结果。
- 在某些特殊情况下（如微信客户端直接被系统杀死），这个方法将不会被调用，下次冷启动也不遵循 `restartStrategy` 的配置，而是直接从首页冷启动。

## 更新机制

### 小程序更新机制

开发者在管理后台发布新版本的小程序之后，微信客户端会有若干个时机去检查本地缓存的小程序有没有新版本，并进行小程序的代码包更新。但如果用户本地有小程序的历史版本，此时打开的可能还是旧版本。

### 1.启动时同步更新

在以下情况下，小程序启动时会同步更新代码包。同步更新会阻塞小程序的启动流程，影响小程序的启动耗时。

> 如果更新失败或超时，为了保障小程序的可用性，还是会使用本地版本打开。

#### 定期检查发现版本更新

微信运行时，会定期检查最近使用的小程序是否有更新。如果有更新，下次小程序启动时会同步进行更新，更新到最新版本后再打开小程序，尽可能保证用户能够尽快使用小程序的最新版本。

#### 用户长时间未使用小程序

用户长时间未使用小程序时，为保障小程序版本的实时性，会强制同步检查版本更新，更新到最新版本后再打开小程序。

若用户处于弱网环境、下载最新版本失败等情况下，仍会启动本地的较低版本。

### 2.启动时异步更新

即使启动前未发现更新，小程序每次[冷启动](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/operating-mechanism.html)时，都会异步检查是否有更新版本。如果发现有新版本，将会异步下载新版本的代码包。但当次启动仍会使用客户端本地的旧版本代码，即新版本的小程序需要等**下一次冷启动**才会使用。

#### 开发者手动触发更新

在启动时异步更新的情况下，如果开发者希望立刻进行版本更新，可以使用 [wx.getUpdateManager](https://developers.weixin.qq.com/miniprogram/dev/api/base/update/wx.getUpdateManager.html) API 进行处理。在有新版本时提示用户重启小程序更新新版本。

```js
const updateManager = wx.getUpdateManager();

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log(res.hasUpdate);
});

updateManager.onUpdateReady(function () {
  wx.showModal({
    title: "更新提示",
    content: "新版本已经准备好，是否重启应用？",
    success(res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate();
      }
    },
  });
});

updateManager.onUpdateFailed(function () {
  // 新版本下载失败
});
```

### 3.小程序管理后台的相关设置

小程序开发者可以通过在小程序管理后台进行设置，影响更新逻辑。

#### 优先使用本地版本设置

若开发者判断某些较新的小程序版本无需强制用户同步更新到最新版本，可以在小程序管理后台「设置」-「功能设置」-「优先使用本地版本设置」中进行设置，设置后若同步更新时检查本地版本不低于该版本，则优先使用本地版本，同时将会异步下载最新版本的代码包。

#### 小程序最低可用版本设置

若开发者判断某些较旧的小程序版本服务不再可用，可以在小程序管理后台「设置」-「功能设置」-「小程序最低可用版本设置」中进行设置。设置后若同步更新时检查本地版本低于该版本，则无法打开，并继续尝试下载最新版本、若异步更新，则会在检查到更新后提示用户重启小程序更新新版本。

#### 注意

1. 开发者在后台发布新版本之后，无法立刻影响到所有现网用户，正常情况下，在全量发布 24 小时之后，新版本可以覆盖 99% 以上的用户。
2. 小程序管理后台的「优先使用本地版本设置」和「小程序最低可用版本设置」不会影响同步更新与异步更新的选择。
