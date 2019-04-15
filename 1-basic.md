假设现在我们希望调用github 的api，接口如下：

```
GET https://api.github.com/repos/vuejs/vue/issues
```

那么我们如何通过JS代码来发起这个请求呢？

### 发起请求

```js
var xhr = new XMLHttpRequest();

xhr.open('GET', 'https://api.github.com/repos/bitfishxyz/ajax/issues/2');

xhr.send();
```

简单的来说就是上面的代码所示

- 创建xhr实例
- 指定请求方法以及目标的URL地址
- 调用send方法来开始发送报文

包上述代码复制到浏览器，然后我们来打开控制台看下结果：![20190415204226](assets/20190415204226.png)

果然发送成功并接受到了响应。

那么我们如何读取响应报文的信息呢？

### 解析响应

```js
var xhr = new XMLHttpRequest();

xhr.onload = function(){
  console.log(this.status)
  console.log(this.statusText)
  console.log(this.getAllResponseHeaders())
  console.log(this.responseText)
}

xhr.open('GET', 'https://api.github.com/repos/bitfishxyz/ajax/issues/2');

xhr.send();
```

![20190415204556](assets/20190415204556.png)

可以看到，我们完整的解析出了响应报文。当服务器收到正确的响应后，就会触发onload事件，然后我们可以从当前的xhr实例行读取到状态码、响应头部以及响应主体。





然后我们可以看到，前端JS发起HTTP请求是属于面对对象的风格，我们创建了一个xhr的实例，然后这个实例维护了一个状态。当浏览器就收到HTTP响应后，或把报文的信息写到这个实例中。



### 设置请求头部、请求体

如果我们希望设置请求头部、请求报文主体，我们可以这样写

```js
var xhr = new XMLHttpRequest();

xhr.onload = res => {
    console.log(res.target.status)
    var result = res.target.responseText
    console.log(JSON.parse(result))
}

xhr.open('POST', 'https://api.github.com/repos/fish46/HelloAJAX/issues/2/comments');
xhr.setRequestHeader('Authorization','bearer 6ce64984e6dd9186b2146108d1947c52ff1ab313')

var message = {
    "body": "I come from ajax!!!"
  }
xhr.send(JSON.stringify(message));
```

通过setRequestHeader方法设置报文头部，在send方法中传递报文主体。(注意，你复制我的代码的话，GitHub会返回401报文，因为上面的Authorization Token会过期。）



### 响应事件

之前我们使用的是onload事件，其实更加不同的触发时机，一共有下面这几个时间

| 事件名称    | 触发时机                        |
| ----------- | ------------------------------- |
| onloadstart | 在刚刚接收到HTTP响应时触发      |
| onprogress  | 在接收到HTTP报文中，不断的触发  |
| onload      | 成功接受完HTTP报文后触发        |
| onloadend   | 在onload之后或者onerror之后触发 |

| 异常事件  | 触发时机 |
| --------- | -------- |
| onerror   | 出错     |
| ontimeout | 超时     |
| onabort   | 退出     |

然后我们一个个看例子。

#### onerror

onerror会在HTTP请求出错的时候触发

```js
var xhr = new XMLHttpRequest();

xhr.onload = res => {
    console.log('onload')
}

xhr.onloadend = () => {
  console.log('onloadend')
}

xhr.onerror = ()=> {
    console.log('errrrrrrr')
}

xhr.open('GET', 'https://www.github.com');
xhr.send();
```

如果你复制上面的代码，在除了github以外的任意网页上执行，就会抛出CORS的错误。这个错误等会再说。

![20190415210801](assets/20190415210801.png)

确实触发了onerror事件。

同时我们也可以看出onload和onloadend之间的差异。onload是在请求成功后调用，而在请求失败后不会被调用。而onloadend无论请求是否成功，后面都会调用。

#### onloadstart  onload

好接下来我们来看看上面的几个事件，一个例子全部搞定：

```js
var xhr = new XMLHttpRequest();

xhr.onloadstart = res => {
    console.log('onloadstart')
    console.log(`Loaded ${res.loaded} bytes`)
}

xhr.onprogress = res => {
    console.log('onprogress')
    console.log(`Loaded ${res.loaded} bytes`)
}

xhr.onload = res => {
    console.log('onload')
    console.log(`Loaded ${res.loaded} bytes`)
}

xhr.onloadend = res => {
    console.log('onloadend')
    console.log(`Loaded ${res.loaded} bytes`)
}

xhr.open('GET', 'https://github.com/fish56');
xhr.send()
```

为了避免CORS，请在github的网页上执行上面的JS代码。

![20190415211812](assets/20190415211812.png)

看明白了吗？

- 浏览器收到HTTP响应报文后，立刻触发onloadstart事件，此时还没有收到数据
- 然后就我们知道，HTTP相信报文可能被分解成了多个TCP报文，有的时候不是一次接受完毕的，而是陆陆续续的接受。这样，每接受一段HTTP响应报文，就会触发一次onprogress事件，上面一共触发了3次
- onload会在完全接受到响应报文后触发
- onloadend会在onload或者onerror事件后触发

