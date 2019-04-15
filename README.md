# AJAX

我以前学习AJAX的时候，被各种概念搞得晕晕乎乎，其实AJAX说白了，就是在浏览器环境中通过JavaScript发起HTTP请求的方式。

仅此而已，没有任何复杂的概念，并不要需要知道AJAX这个单词是什么意思，也不要研究它的历史。

阅读本文之前，你需要知道：

- HTTP的基本概念
- JS的异步编程模型

如果你熟悉上面两点，那么恭喜你，学习AJAX如喝水一样简单。如果你不熟悉，建议你先学习它们。

#### 如何用AJAX发起一个HTTP GET请求？

1. 创建一个XMLHttpRequest对象
2. 给这个对象绑定onload 方法
3. 调用

``` js
var xhr = new XMLHttpRequest();

xhr.onloadstart = res => {
    console.log(res.target.status)
    var result = res.target.responseText
    console.log(JSON.parse(result))
}

xhr.onprogress = res => {
    console.log(res.target.status)
    var result = res.target.responseText
    console.log(JSON.parse(result))
}

xhr.onload = res => {
    console.log(res.target.status)
    var result = res.target.responseText
    console.log(JSON.parse(result))
}

xhr.onloadend = res => {
    console.log(res.target.status)
    var result = res.target.responseText
    console.log(JSON.parse(result))
}

xhr.open('GET', 'https://api.github.com/repos/vuejs/vue/issues');
xhr.send();
```

如上图所示