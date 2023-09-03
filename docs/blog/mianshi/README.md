# 笔试题

## 1.null 和 undefined 的区别

```javascript
- null是被赋值的，表示啥也没有
- undefined通常是一个变量已经被声明，但是没有赋值
- null和undefined都是否定值
- unll和undefined都是原始值
- typeof null == object
- null!==undefined  但是null ==  undefined
```

## 2.如何判断是否为数组

```
1.从原型入手：Array.prototype.isPrototypeOf(obj)
2.从构造函数入手：obj instanceof Array
3.跨原型链调用toString():Object.prototype.toString.call(obj)
4.ES5新增的方法:Array.isArray()
```

## 3.typeof "off" 、typeof Object、typeof undefined、typeof null

```
依次输出
1.string
2.function
3.undefined
4.object
```

## 4.vue 和 react 的区别

```
相同点:
1.都使用虚拟DOM
2.提供了响应式和组件化的视图组件
3.把注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给其他相关的库(vue-router、vuex、react-router、redux)

不同点:
React:
1.灵活性和响应性：它提供最大的灵活性和响应能力。
2.丰富的JavaScript库：来自世界各地的贡献者正在努力添加更多功能。
3.可扩展性：由于其灵活的结构和可扩展性，React已被证明对大型应用程序更好。
4.不断发展： React得到了Facebook专业开发人员的支持，他们不断寻找改进方法。
5.web或移动平台： React提供React Native平台，可通过相同的React组件模型为iOS和Android开发本机呈现的应用程序。

Vue:
1.易于使用： Vue.js包含基于HTML的标准模板，可以更轻松地使用和修改现有应用程序。
2.更顺畅的集成：无论是单页应用程序还是复杂的Web界面，Vue.js都可以更平滑地集成更小的部件，而不会对整个系统产生任何影响。
3.更好的性能，更小的尺寸：它占用更少的空间，并且往往比其他框架提供更好的性能。
4.精心编写的文档：通过详细的文档提供简单的学习曲线，无需额外的知识; HTML和JavaScript将完成工作。
5.适应性：整体声音设计和架构使其成为一种流行的JavaScript框架。它提供无障碍的迁移，简单有效的结构和可重用的模板。
```

```
1、数据是否可变
React：整体是函数式的思想，在react中，是单向数据流，推崇结合immutable来实现数据不可变。
Vue：的思想是响应式的，也就是基于是数据可变的，通过对每一个属性建立Watcher来监听，当属性变化的时候，响应式的更新对应的虚拟dom。

2、编译&写法
React：思路是all in js，通过js来生成html，所以设计了jsx，还有通过js来操作css，社区的styled-component、jss等。
Vue：把html，css，js组合到一起，用各自的处理方式，Vue有单文件组件，可以把html、css、js写到一个文件中，html提供了模板引擎来处理。

3、类式的组件写法，还是声明式的写法
react是类式的写法，api很少，而Vue是声明式的写法，通过传入各种options，api和参数都很多。所以react结合typescript更容易一起写，Vue稍微复杂。

4、路由和状态管理解决方案
在像React和Vue这样的基于组件的框架中，当您开始扩展应用程序时，需要更加关注状态管理和数据流。这是因为有许多组件相互交互并共享数据。在这种情况下，React提供了一种称为Flux / Redux架构的创新解决方案，它代表单向数据流，是著名MVC架构的替代方案。现在，如果我们考虑Vue.js框架，就会有一个名为Vuex的更高级架构，它集成到Vue中并提供无与伦比的体验。

```

```
应用场景

React
1、构建一个大型应用项目时：React的渲染系统可配置性更强，和React的测试工具结合起来使用，使代码的可测试性和可维护性更好。大型应用中透明度和可测试性至关重要。
2、同时适用于Web端和原生APP时：React Native是一个使用Javascript构建移动端原生应用程序（iOS，Android）的库。 它与React.js相同，只是不使用Web组件，而是使用原生组件。


Vue
1、构建数据简单中小型应用时：vue提供简单明了的书写模板、大量api、指令等等，可快速上手、开发项目
2、应用尽可能的小和快时：随着vue3.0的发布，vue的体积进一步缩小，远小于react的体积，也配合diff算法，采用proxy去实现双向绑定，渲染大幅度提升
```

## 5.排序算法

### 冒泡排序

```js
比较所有相邻元素,如果第一个比第二个大，则交换它们
一轮下来保证可以找到一个数是最大的
执行n-1轮，就可以完成排序

//定义一个原生的bubbleSort方法
Array.prototype.bubbleSort = function () {
    for(let i = 0; i < this.length - 1; i += 1) {
        //通过 this.length 次把第一位放到最后,完成排序
        //-i是因为最后的位置是会动态改变的，当完成一次后,最后一位会变成倒数第二位
        for(let j = 0; j < this.length - 1 - i; j += 1) {
            if(this[j] > this[j+1]) {
                const temp = this[j];
                this[j] = this[j+1];
                this[j+1] = temp;
            }
        }
    }
}

const arr = [4,8,0,1,43,53,22,11,0];
arr.bubbleSort();
console.log(arr);
```

### 选择排序

```js
找到数组中的最小值，选中它并将其放置在第一位
接着找到第二个最小值，选中它并将其放置到第二位
执行n-1轮，就可以完成排序

Array.prototype.selectionSort = function() {
    for(let i = 0; i < this.length - 1; ++i) {
        // 假设最小的值是当前的下标
        let indexMin = i;
        //遍历剩余长度找到最小下标
        for(let j = i; j < this.length; ++j) {
            if(this[j] < this[indexMin] ) {
                indexMin = j;
            }
        }
        if(indexMin !== i) {
            //交换当前下标i与最小下标的值，重复this.length次
            const temp = this[i];
            this[i] = this[indexMin];
            this[indexMin] = temp;
        }
    }
};


const arr = [5,4,3,2,1];
arr.selectionSort();
console.log(arr);
```

### 插入排序

```js
从第二个数开始往前比;
比它大就往后排;
以此类推进行到最后一个数;

Array.prototype.insertionSort = function () {
  //从第二个数开始往前比
  for (let i = 1; i < this.length; ++i) {
    //先把值保存起来
    const temp = this[i];
    let j = i;
    while (j > 0) {
      if (this[j - 1] > temp) {
        this[j] = this[j - 1];
      } else {
        //因为已经是排序过的了，如果比上一位大，那就没必要再跟上上位比较了
        break;
      }
      j -= 1;
    }
    //这里的j有可能是第0位，也有可能是到了一半停止了
    this[j] = temp;
  }
};

const arr = [5, 4, 3, 2, 1];
arr.insertionSort();
```

### 归并排序

```js
分: 把数组劈成两半，再递归地对数组进行“分”操作，直到分成一个个单独的数
合：把两个数合并为有序数组，再对有序数组进行合并，直到全部子数组合并为一个完整数组

Array.prototype.mergeSort = function () {
    const rec = (arr) => {
        //如果数组长度为1，说明切完了，可以直接返回
        if (arr.length === 1) { return arr; }
        //切分数组，把每一项都单独切出来
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0,mid);
        const right = arr.slice(mid,arr.length);
        //有序的左边数组
        const orderLeft = rec(left);
        //有序的右边数组
        const orderRight = rec(right);
        //定义一个数组来存放顺序数组
        const res = [];
        // 把左右两个有序的合并为一个有序的返回
        while(orderLeft.length || orderRight.length) {
            if(orderLeft.length && orderRight.length) {
                res.push(orderLeft[0] < orderRight[0] ? orderLeft.shift() : orderRight.shift())
            } else if (orderLeft.length) {
                res.push(orderLeft.shift());
            } else if (orderRight.length) {
                res.push(orderRight.shift());
            }
        }
        return res;
    };
    const res = rec(this);
    //拷贝到数组本身
    res.forEach((n,i) => { this[i] = n; });
}


const arr = [5,4,3,2,1];
arr.mergeSort();
console.log(arr);
```

### 5.快速排序

```js
分区: 从数组中任意选择一个基准，所有比基准小的元素放到基准前面，比基准大的元素放到基准的后面
递归：递归地对基准前后的子数组进行分区

Array.prototype.quickSort = function () {
    const rec = (arr) => {
       // 预防数组是空的或者只有一个元素, 当所有元素都大于等于基准值就会产生空的数组
       if(arr.length === 1 || arr.length === 0) { return arr; }
       const left = [];
       const right = [];
       //以第一个元素作为基准值
       const mid = arr[0];
       //小于基准值的放左边，大于基准值的放右边
       for(let i = 1; i < arr.length; ++i) {
           if(arr[i] < mid) {
               left.push(arr[i]);
           } else {
               right.push(arr[i]);
           }
       }
        //递归调用，最后放回数组
       return [...rec(left),mid,...rec(right)];
    };
    const res = rec(this);
    res.forEach((n,i) => { this[i] = n; })
}

const arr = [2,3,4,5,3,1];
arr.quickSort();
console.log(arr);
```

## 6.数组方法

```javascript
1.push():push方法可以向数组的末尾添加一个或者多个元素，并返回新的长度.
2.pop():pop方法用于删除并返回数组的最后一个元素。
3.unshift():unshift方法可向数组的开头添加一个或更多元素，并返回新的长度。
4.shift():shift方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
5.isArray():isArray() 这个方法用来判断一个对象是不是数组，是的话返回true，否则返回false
6.map():map方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。
map() 方法按照原始数组元素顺序依次处理元素
参数：currentValue当前元素的值,index当前元素的索引值,arr当前元素属于的数组对象

7.filter():filter方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
filter() 不会对空数组进行检测。
filter() 不会改变原始数组。
参数：currentValue当前元素的值,index当前元素的索引值,arr当前元素属于的数组对象

8.every():every方法用于检测数组所有元素是否都符合指定条件（通过函数提供）。
every方法使用指定函数检测数组中的所有元素：
如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。
如果所有元素都满足条件，则返回 true。
every() 不会对空数组进行检测。
every() 不会改变原始数组。
参数：currentValue当前元素的值,index当前元素的索引值,arr当前元素属于的数组对象

9.some():some方法用于检测数组中的元素是否满足指定条件（函数提供）。
some() 方法会依次执行数组的每个元素：
如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
如果没有满足条件的元素，则返回false。
some() 不会对空数组进行检测。
some() 不会改变原始数组。
参数：currentValue当前元素的值,index当前元素的索引值,arr当前元素属于的数组对象

10.splice():splice方法用于添加或删除数组中的元素。
这种方法会改变原始数组。
如果仅删除一个元素，则返回一个元素的数组。 如果未删除任何元素，则返回空数组。
参数：index 必须，规定从何处添加/删除元素。该参数是开始插入和删除的数组元素的下标，必须是数字
howmany 可选，规定应该删除多少元素。必须是数字，但可以是“0”，如果为规定此参数，则删除从index开始到原数组结 尾的所有元素。
item…itemX 可选，要添加到数组的新元素

11.slice():slice方法可从已有的数组中返回选定的元素。
slice()方法可提取字符串的某个部分，并以新的字符串返回被提取的部分。
slice() 方法不会改变原始数组。
参数：start 规定从何处开始选取。如果该参数为负数，则表示从原数组的倒数第几个元素开始提取，slice(-2) 表示提取原数组中 的倒数第二个元素到最后一个元素（包含最后一个元素）。
end() 规定从何处结束选取。没有指定该参数，那么切分的数组包含从 start 到数组结束的所有元素。如果该参数为负数， 则它表示在原数组中的倒数第几个元素结束抽取

12.indexOf():indexOf方法可返回某个指定的字符串值在字符串中首次出现的位置。
如果没有找到匹配的字符串则返回 -1。
indexOf() 方法区分大小写。
参数：search value 必须，规定需要检查的字符串值
start 可选，规定在自负串开始检索的位置，如果省略，则将从字符串的首字符开始检索

13.includes():includes方法用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false。
参数：searchElement 必须，需要查找的元素值
fromIndex 从该索引处开始查找 searchElement。如果为负值，则按升序从 array.length + fromIndex 的索引开始搜索。默 认为 0。

14.concat():concat方法用于连接两个或多个数组。
该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本

15.join():join方法用于把数组中的所有元素放入一个字符串。
该元素是通过指定的分隔符进行分隔的。

16.split():split方法用于把一个字符串分割成字符串数组。
split() 方法不改变原始字符串。
参数：separator 可选。字符串或正则表达式，从该参数指定的地方分割 string Object。
limit 可选。该参数可指定返回的数组的最大长度。

17.forEach():forEach方法用于调用数组的每个元素，并将元素传递给回调函数。
18.sort():sort() 方法用于对数组的元素进行排序。
数组在原数组上进行排序，不生成副本。
19.reverse():reverse方法用于颠倒数组中元素的顺序。
20.find():find方法返回通过测试（函数内判断）的数组的第一个元素的值。
find() 方法为数组中的每个元素都调用一次函数执行：
当数组中的元素在测试条件时返回 true 时, find() 返回符合条件的元素，之后的值不会再调用执行函数。
如果没有符合条件的元素返回 undefined
find() 对于空数组，函数是不会执行的。
find() 并没有改变数组的原始值。

21.findIndex():findIndex方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
findIndex() 方法为数组中的每个元素都调用一次函数执行：
当数组中的元素在测试条件时返回 true 时, findIndex() 返回符合条件的元素的索引位置，之后的值不会再调用执行函数。
如果没有符合条件的元素返回 -1
findIndex() 对于空数组，函数是不会执行的。
findIndex() 并没有改变数组的原始值。

22.fill():fill方法用于将一个固定值替换数组的元素。
参数：value 必须，填充的值
start 可选，开始填充的位置
end 可选，停止填充的位置，默认为array.length

23.keys()、values()、entries():keys()是对键名的遍历、values()对键值的遍历、entries()是对键值对的遍历。
```

## 7.会话跟踪技术

cookie和session

## 8.不使用for和while实现1...100的数组

好像可以用递归

## 9.栈排序的时间复杂度和空间复杂度



## 10.label和input

label的for指向input的id

