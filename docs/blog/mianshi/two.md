# Vue

## 1.优点

```
-轻量级框架：只关注视图层，是一个构建数据的视图集合，大小只有几十kb；
-简单易学：国人开发，中文文档，不存在语言障碍 ，易于理解和学习；
-双向数据绑定：保留了angular的特点，在数据操作方面更为简单；
-组件化：保留了react的优点，实现了html的封装和重用，在构建单页面应用方面有着独特的优势；
-视图，数据，结构分离：使数据的更改更为简单，不需要进行逻辑代码的修改，只需要操作数据就能完成相关操作；
-虚拟DOM：dom操作是非常耗费性能的， 不再使用原生的dom操作节点，极大解放dom操作，但具体操作的还是dom不过是换了另一种方式；
-运行速度更快:相比较与react而言，同样是操作虚拟dom，就性能而言，vue存在很大的优势。
```

## 2.keep-alive标签的作用

```
keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染。
```

## 3.如何获取DOM

```
ref="domName" 用法：this.$refs.domName
```

## 4.为什么使用key

```
需要使用key来给每个节点做一个唯一标识，Diff算法就可以正确的识别此节点。
作用主要是为了高效的更新虚拟DOM。
```

## 5.v-model

```
v-model用于表单数据的双向绑定，其实它就是一个语法糖，
这个背后就做了两个操作：
1.v-bind绑定一个value属性；
2.v-on指令给当前元素绑定input事件。
```

## 6.computed和watch的应用场景

```
computed:
　　　　当一个属性受多个属性影响的时候就需要用到computed
　　　　最典型的栗子： 购物车商品结算的时候
watch:
　　　　当一条数据影响多条数据的时候就需要用watch
　　　　栗子：搜索数据
```

## 7.v-on监听多个事件

```
<input type="text" v-on="{ input:onInput,focus:onFocus,blur:onBlur, }">。
```

## 8.$nextTick的使用

```
当你修改了data的值然后马上获取这个dom元素的值，是不能获取到更新后的值，
你需要使用$nextTick这个回调，让修改后的data值渲染更新到dom元素之后在获取，才能成功。
```

## 9.vue组件中data为什么一定是一个函数

```
因为JavaScript的特性所导致，在component中，data必须以函数的形式存在，不可以是对象。
　　组建中的data写成一个函数，数据以函数返回值的形式定义，这样每次复用组件的时候，都会返回一份新的data，相当于每个组件实例都有自己私有的数据空间，它们只负责各自维护的数据，不会造成混乱。而单纯的写成对象形式，就是所有的组件实例共用了一个data，这样改一个全都改了。
```

## 10.渐进式框架的理解

```
主张最少；可以根据不同的需求选择不同的层级；
```

## 11.Vue中双向绑定如何实现

```
vue 双向数据绑定是通过 数据劫持 结合 发布订阅模式的方式来实现的， 也就是说数据和视图同步，数据发生变化，视图跟着变化，视图变化，数据也随之发生改变；
核心：关于VUE双向数据绑定，其核心是 Object.defineProperty()方法。
```

## 12.单页面应用和多页面应用区别及优缺点

```
单页面应用（SPA），通俗一点说就是指只有一个主页面的应用，浏览器一开始要加载所有必须的 html, js, css。所有的页面内容都包含在这个所谓的主页面中。但在写的时候，还是会分开写（页面片段），然后在交互的时候由路由程序动态载入，单页面的页面跳转，仅刷新局部资源。多应用于pc端。
多页面（MPA），就是指一个应用中有多个页面，页面跳转时是整页刷新
单页面的优点：
用户体验好，快，内容的改变不需要重新加载整个页面，基于这一点spa对服务器压力较小；前后端分离；页面效果会比较炫酷（比如切换页面内容时的专场动画）。
单页面缺点：
不利于seo；导航不可用，如果一定要导航需要自行实现前进、后退。（由于是单页面不能用浏览器的前进后退功能，所以需要自己建立堆栈管理）；初次加载时耗时多；页面复杂度提高很多。
```

## 13.Vue中常用的修饰符

```
.stop：等同于JavaScript中的event.stopPropagation()，防止事件冒泡；
.prevent：等同于JavaScript中的event.preventDefault()，防止执行预设的行为（如果事件可取消，则取消该事件，而不停止事件的进一步传播）；
.capture：与事件冒泡的方向相反，事件捕获由外到内；
.self：只会触发自己范围内的事件，不包含子元素；
.once：只会触发一次。
```

## 14.delete和Vue.delete删除数组的区别

```
delete只是被删除的元素变成了empty/undefined，其他元素的键值还是不变。
Vue.delete直接删除了数组，改变了数组的键值
```

## 15.Vue-router跳转和location.href有什么区别

```
使用location.href="/url"来跳转，简单方便，但是刷新了页面
使用history.pushState('/url')，无刷新页面，静态跳转
引进router，然后使用router.push('/url')来跳转，使用了diff算法，实现了按需加载，减少了dom的消耗。
其实使用router跳转和使用history.pushState()没什么差别的，因为vue-router就是用了history.pushState()，尤其是在history模式下
```

## 16.vue slot

```
简单来说，假如父组件需要在子组件内放一些DOM，那么这些DOM是显示、不显示、在哪个地方显示、如何显示，就是slot分发负责的活。
```

## 17.Vue里面router-link在电脑上有用，在安卓上没反应怎么解决

```
Vue路由在Android机上有问题，babel问题，安装babel polypill插件解决。
```

## 18.Vue2中注册在router-link上事件无效解决方法

```
使用@click.native。原因：router-link会阻止click事件，.native指直接监听一个原生事件。
```

## 19.axios的特点

```
从浏览器中创建XMLHttpRequests；
node.js创建http请求；
支持Promise API；
拦截请求和响应；
转换请求数据和响应数据；
取消请求；
自动换成json。
axios中的发送字段的参数是data跟params两个，两者的区别在于params是跟请求地址一起发送的，data的作为一个请求体进行发送
params一般适用于get请求，data一般适用于post put 请求。
```

## 20.组件封装的过程

```
1. 建立组件的模板，先把架子搭起来，写写样式，考虑好组件的基本逻辑。(os：思考1小时，码码10分钟，程序猿的准则。)
　　2. 准备好组件的数据输入。即分析好逻辑，定好 props 里面的数据、类型。
　　3. 准备好组件的数据输出。即根据组件逻辑，做好要暴露出来的方法。
　　4. 封装完毕了，直接调用即可
```



## 21.params和query的区别

```
用法：query要用path来引入，params要用name来引入，接收参数都是类似的，分别是this.$route.query.name和this.$route.params.name。
url地址显示：query更加类似于我们ajax中get传参，params则类似于post，说的再简单一点，前者在浏览器地址栏中显示参数，后者则不显示
注意点：query刷新不会丢失query里面的数据
params刷新 会 丢失 params里面的数据。
```

## 22.vue初始化页面闪动问题

```
使用vue开发时，在vue初始化之前，由于div是不归vue管的，所以我们写的代码在还没有解析的情况下会容易出现花屏现象，看到类似于{{message}}的字样，虽然一般情况下这个时间很短暂，但是我们还是有必要让解决这个问题的。
首先：在css里加上
[v-cloak] {
	display: none;
}。
```

## 23.vue更新数组时触发视图更新的方法

```
push()；pop()；shift()；unshift()；splice()； sort()；reverse()
```

## 24.Vue常用的UI库

```
Mint UI element，VUX
```

## 25.vue修改打包后静态资源路径的修改

```
cli2版本
将config/index.js里的assetsPublicPath的值改为'./'
```

## 26.Vue生命周期

```
1.beforeCreate：在new一个vue实例后，只有一些默认的生命周期钩子和默认事件，其他的东西都还没创建。在beforeCreate生命周期执行的时候，data和methods中的数据都还没有初始化。不能在这个阶段使用data中的数据和methods中的方法
2.create：data 和 methods都已经被初始化好了，如果要调用 methods 中的方法，或者操作 data 中的数据，最早可以在这个阶段中操作
3.beforeMount：执行到这个钩子的时候，在内存中已经编译好了模板了，但是还没有挂载到页面中，此时，页面还是旧的
4.mounted：执行到这个钩子的时候，就表示Vue实例已经初始化完成了。此时组件脱离了创建阶段，进入到了运行阶段。 如果我们想要通过插件操作页面上的DOM节点，最早可以在和这个阶段中进行
5.beforeUpdate： 当执行这个钩子时，页面中的显示的数据还是旧的，data中的数据是更新后的， 页面还没有和最新的数据保持同步
6.updated：页面显示的数据和data中的数据已经保持同步了，都是最新的
7.beforeDestory：Vue实例从运行阶段进入到了销毁阶段，这个时候上所有的 data 和 methods ， 指令， 过滤器 ……都是处于可用状态。还没有真正被销毁
8.destroyed： 这个时候上所有的 data 和 methods ， 指令， 过滤器 ……都是处于不可用状态。组件已经被销毁了。


P1:第一次页面加载触发哪几个钩子？
beforeCreate,created,beforeMount,mounted.

P2:created和mounted的区别
created:在模板渲染成HTML前调用，即通常初始化某些属性值，然后再渲染成视图
mounted:在模板渲染成html后调用，通常是初始化页面完成的，再对html的dom节点进行一些需要的操作。

P3:vue获取数据在哪个周期函数
一般created/beforeMount/mounted皆可，
操作DOM，需要在mounted中
```

## 27.mvvm框架是什么

```
vue是实现了双向数据绑定的mvvm框架，当视图改变更新模型层，当模型层改变更新视图层。
在vue中，使用了双向绑定技术，就是View的变化能实时让model发生变化，而Model的变化也实时更新View。
```

## 28.怎么定义vue-router的动态路由？怎么获取传过来的值？

```
在router目录下的index.js文件中，对path属性加上/:id。使用route对象的params.id
```

## 29.vue-router有哪几种导航钩子

```
三种
1.全局导航钩子：router.beforeEach(to,from,next)  作用:跳转前进行判断拦截
2.组件内的钩子
3.单独路由独享组件
```

## 30.$route和$router的区别

```
$router是VueRouter的实例，在script标签中想要导航到不同的URL,使用$router.push方法。返回上一个历史history用$router.to(-1)
$route为当前router跳转对象。里面可以获取当前路由的name,path,query,parmas等。
```

## 31.vue-router的两种模式

```
hash模式：即地址栏 URL 中的 # 符号；
history模式：window.history对象打印出来可以看到里边提供的方法和记录长度。利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法。（需要特定浏览器支持）。
```

## 32.vue-router实现路由懒加载(动态加载路由)

```
三种方式
第一种：vue异步组件技术 ==== 异步加载，vue-router配置路由 , 使用vue的异步组件技术 , 可以实现按需加载 .但是,这种情况下一个组件生成一个js文件。
第二种：路由懒加载(使用import)。
第三种：webpack提供的require.ensure()，vue-router配置路由，使用webpack的require.ensure技术，也可以实现按需加载。这种情况下，多个路由指定相同的chunkName，会合并打包成一个js文件。
```

## 33.导航守卫和事件总线

```
导航守卫：导航守卫就是路由跳转过程中的一些钩子函数。路由跳转是一个大的过程，这个大的过程分为跳转前中后等等细小的过程，在每一个过程中都有一函数，这个函数能让你操作一些其他的事儿的时机，这就是导航守卫。

事件总线：EventBus 又称为事件总线。在Vue中可以使用 EventBus 来作为沟通桥梁的概念，就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件，所以组件都可以上下平行地通知其他组件，但也就是太方便所以若使用不慎，就会造成难以维护的灾难，因此才需要更完善的Vuex作为状态管理中心，将通知的概念上升到共享状态层次。
```

## 34.组件通信方式

```
props / $emit父组件通过props的方式向子组件传递数据，而通过$emit 子组件可以向父组件通信。



provide/ inject父组件中通过provide来提供变量, 然后再子组件中通过inject来注入变量。

ref / refs：ref：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例，可以通过实例直接调用组件的方法或访问数据。

eventBus又称为事件总线，在vue中可以使用它来作为沟通桥梁的概念, 就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件， 所以组件都可以通知其他组件。

Vuex

localStorage / sessionStorage

$attrs与 $listeners $attrs与$listeners 是两个对象，$attrs 里存放的是父组件中绑定的非 Props 属性，$listeners里存放的是父组件中绑定的非原生事件。
```

