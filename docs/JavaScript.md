##H5 meta viewport

```html
<script>!function(){var e;function t(){var e=document.querySelector('meta[name="viewport"]'),t=window.screen.width;e.setAttribute("content","width=750,initial-scale="+t/750+",user-scalable=no,viewport-fit=cover")}window.addEventListener("resize",function(){clearTimeout(e),e=setTimeout(t,300)}),t()}()</script>
```


## 控制栏提示

```js

console.log(
["%c                                                                            "
,"                                                                            "
,"                                                                            "
,"                               %c REC WARNING %c                                "
,"                                                                            "
,"                                                                            "
,"%c        请不要试图阅读本demo的源码，不然你会去想这么丑的代码是谁写的        "
,"              本文件包括附属的js文件的代码是经过长时间积累出来的            "
,"              代码虽然已经分层/分开写了，也许者作者也已经不认识了           "
,"                                                                            "
,"              如果想要快速入门，请阅读github项目内首页README文档            "
,"                     参考文档内的快速使用部分，简单快捷高效                 "
,"                                                                            "
,"                请不要试图阅读本demo的源码，正常情况下意义不大              "
,"                                                                            "
,"                                                                            "
,""].join("\n"),
'background: #000; font-size: 18px; font-family: monospace',
'background: #f33; font-size: 18px; font-family: monospace; color: #eee; text-shadow:0 0 1px #fff',
'background: #000; font-size: 18px; font-family: monospace',
'background: #000; font-size: 18px; font-family: monospace; color: #ddd; text-shadow:0 0 2px #fff'
)

```

## 去掉微信浏览器前进、后退和刷新底部按钮

```js
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		WeixinJSBridge.call('hideToolbar');
		WeixinJSBridge.call('hideOptionMenu');
	});
```


## vConsole
```js 
<script src="https://cdn.bootcdn.net/ajax/libs/vConsole/3.9.0/vconsole.min.js"></script>
<script>
	// init vConsole
	var vConsole = new VConsole();
	console.log('Hello world');
</script>
```


## rem 适用于获取屏幕宽度等分设置 兼容flexible.js 库

```js
/*
 * 适用于获取屏幕宽度等分设置 html 的 font-size 情况，比如 flexible.js 库
 */
(function (window, document) {
    var tid;
    window.addEventListener('resize', function () {
        clearTimeout(tid);
        tid = setTimeout(modifileRootRem, 300);
    }, false);
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(modifileRootRem, 300);
        }
    }, false);

    // 计算最终 html font-size
    function modifileRootRem() {
        var root = document.documentElement
        console.log(root.clientWidth / 10);
        root.style.fontSize = root.clientWidth / 10 + 'px' // 【关键代码：差异补上】
    }
    if (typeof window.onload === 'function') {
        var oldFun = window.onload
        window.onload = function () {
            oldFun()
            modifileRootRem()
        }
    } else {
        window.onload = modifileRootRem
    }
})(window, document);
```

## ios端兼容input光标高度
> 问题详情描述：input输入框光标，在安卓手机上显示没有问题，但是在苹果手机上
当点击输入的时候，光标的高度和父盒子的高度一样。例如下图，左图是正常所期待的输入框光标，右边是ios的input光标。

<img src="../_media/912738961263.jpg"  />

> 通常我们习惯用height属性设置行间的高度和line-height属性设置行间的距离（行高），当点击输入的时候，光标的高度就自动和父盒子的高度一样了。（谷歌浏览器的设计原则，还有一种可能就是当没有内容的时候光标的高度等于input的line-height的值，当有内容时，光标从input的顶端到文字的底部

> 解决办法：高度height和行高line-height内容用padding撑开

```css
.content{
      float: left;
      box-sizing: border-box;
      height: 88px;
      width: calc(100% - 240px); 
      .content-input{
        display: block;
        box-sizing: border-box;
        width: 100%;
        color: #333333;
        font-size: 28px;
        //line-height: 88px;
        padding-top: 20px;
        padding-bottom: 20px;
      }
} 
```


## ios端微信h5页面上下滑动时卡顿、页面缺失

> 在ios端，上下滑动页面时，如果页面高度超出了一屏，就会出现明显的卡顿，页面有部分内容显示不全的情况，例如下图，右图是正常页面，边是ios上下滑动后，卡顿导致如左图下面部分丢失。

![](../_media/123123153dsgdsfg.jpg)

>解决办法：只需要在公共样式加入下面这行代码

```css
*{
    -webkit-overflow-scrolling: touch;
}
```

## ios键盘唤起，键盘收起以后页面不归位

>输入内容，软键盘弹出，页面内容整体上移，但是键盘收起，页面内容不下滑

```html
<div class="list-warp">
   <div class="title"><span>投·被保险人姓名</span></div>
   <div class="content">
     <input class="content-input" placeholder="请输入姓名"  
     	v-model="peopleList.name" 
     	@focus="changefocus()" 
     	@blur.prevent="changeBlur()"/>    
	</div>
</div>
<script>
changeBlur(){
      let u = navigator.userAgent, app = navigator.appVersion;
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if(isIOS){
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
          window.scrollTo(0, Math.max(scrollHeight - 1, 0))
          }, 200)
      }
    } 
</script>
```
## 安卓弹出的键盘遮盖文本框
>安卓微信H5弹出软键盘后挡住input输入框，如下左图是期待唤起键盘的时候样子，右边是实际唤起键盘的样子

![](../_media/1231asdjflksajlf.jpg)

>解决办法：给input和textarea标签添加focus事件，如下，先判断是不是安卓手机下的操作，当然，可以不用判断机型，Document 对象属性和方法，setTimeout延时0.5秒，因为调用安卓键盘有一点迟钝，导致如果不延时处理的话，滚动就失效了


```js
changefocus(){
  let u = navigator.userAgent, app = navigator.appVersion;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  if(isAndroid){
    setTimeout(function() {
     document.activeElement.scrollIntoViewIfNeeded();
     document.activeElement.scrollIntoView();
    }, 500);       
  }
}, 
```
## js 封装php get方法

```js
    var $_GET = (function () {
        var url = window.document.location.href.toString();
        var u = url.split("?");
        if (typeof (u[1]) == "string") {
            u = u[1].split("&");
            var get = {};
            for (var i in u) {
                var j = u[i].split("=");
                get[j[0]] = j[1];
            }
            return get;
        } else {
            return {};
        }
    })();
```

## H5 键盘自动隐藏

```js
    $("input,select,textarea").blur(function () {
        setTimeout(function () {
            var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
            window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        }, 100);
    });
```


## canvas 图片压缩

```js
function zipImg(imgpath) {
    //开始canvas绘图
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    //src赋值给临时的隐藏的图片
    var img = document.getElementById("HidImg");
    img.src = imgpath;
    //图片载入开始执行压缩
    img.onload = function() {
        var height = img.height;
        var width = img.width;
        //判断图片宽高
        var chu = 6;
        //如果图片宽度在4080-3656之间，5倍压缩宽高
        if (width <= 4080 && width >= 3656) {
            chu = 5;
        }
        //如果图片宽度在2500-1440之间，4.5倍压缩宽高 
        else if (width <= 3656 && width >= 2500) {
            chu = 4.5;
        }
        //如果图片宽度在2500-1440之间，3.5倍压缩宽高
        else if (width <= 2500 && width >= 1440) {
            chu = 3.5;
        }
        //如果图片宽度在1440-1080之间，2倍压缩宽高
        else if (width <= 1440 && width >= 1080) {
            chu = 2;
        }
        //如果图片宽度在1080-800之间，1.6倍压缩宽高
        else if (width <= 1080 && width > 800) {
            chu = 1.6;
        }
        //低于800不进行宽高压缩
        else if (width <= 800) {
            chu = 1
        }
        //获取倍率后开始宽高压缩
        img.height = height / chu;
        img.width = width / chu;
        c.width = width / chu;
        c.height = height / chu;
        //开始绘图
        ctx.drawImage(img, 0, 0, c.width, c.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        //转化成base64数据，记住一定要转化成jpeg格式，转化成png不能选择清晰度，并且base64长度
        //会特别长 括号里的0.5即为0.5的清晰度。0-1之间，越高越清晰(当然base64的体积也会越来越大)
        var dataURL = myCanvas.toDataURL("image/jpeg", 0.5);
        //由于base64转码属于异步操作，给1.2秒延迟，转码1.2秒后获取转码后的base64数
        //据(针对WebAPP，PC端可直接忽略)
        setTimeout(function() {
            $(".NewImg").attr("src", dataURL); //dataURL即为压缩后的图片
        },
        1200)
    }
}
```



## canvas 绘制图片模式


```js
/**
 * @param {Number} box_w 固定盒子的宽, box_h 固定盒子的高
 * @param {Number} source_w 原图片的宽, source_h 原图片的高
 * @return {Object} {截取的图片信息}，对应drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)参数
 */

function coverImg(box_w, box_h, source_w, source_h) {
	var sx = 0,
		sy = 0,
		sWidth = source_w,
		sHeight = source_h;
	if (source_w > source_h || (source_w == source_h && box_w < box_h)) {
		sWidth = box_w * sHeight / box_h;
		sx = (source_w - sWidth) / 2;
	} else if (source_w < source_h || (source_w == source_h && box_w > box_h)) {
		sHeight = box_h * sWidth / box_w;
		sy = (source_h - sHeight) / 2;
	}
	return {
		sx, sy, sWidth, sHeight
	}
}


/**
 * @param {Number} sx 固定盒子的x坐标,sy 固定盒子的y左标
 * @param {Number} box_w 固定盒子的宽, box_h 固定盒子的高
 * @param {Number} source_w 原图片的宽, source_h 原图片的高
 * @return {Object} {drawImage的参数，缩放后图片的x坐标，y坐标，宽和高},对应drawImage(imageResource, dx, dy, dWidth, dHeight)
 */

function containImg(sx, sy, box_w, box_h, source_w, source_h) {
	var dx = sx,
		dy = sy,
		dWidth = box_w,
		dHeight = box_h;
	if (source_w > source_h || (source_w == source_h && box_w < box_h)) {
		dHeight = source_h * dWidth / source_w;
		dy = sy + (box_h - dHeight) / 2;

	} else if (source_w < source_h || (source_w == source_h && box_w > box_h)) {
		dWidth = source_w * dHeight / source_h;
		dx = sx + (box_w - dWidth) / 2;
	}
	return {
		dx, dy, dWidth, dHeight
	}
}
```




## Canvas 多行文本

```js
 CanvasRenderingContext2D.prototype.wrapText = function(text, x, y, maxWidth, lineHeight) {
 	if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
 		return;
 	}

 	var context = this;
 	var canvas = context.canvas;

 	if (typeof maxWidth == 'undefined') {
 		maxWidth = (canvas && canvas.width) || 300;
 	}
 	if (typeof lineHeight == 'undefined') {
 		lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
 	}

 	// 字符分隔为数组
 	var arrText = text.split('');
 	var line = '';

 	for (var n = 0; n < arrText.length; n++) {
 		var testLine = line + arrText[n];
 		var metrics = context.measureText(testLine);
 		var testWidth = metrics.width;
 		if (testWidth > maxWidth && n > 0) {
 			context.fillText(line, x, y);
 			line = arrText[n];
 			y += lineHeight;
 		} else {
 			line = testLine;
 		}
 	}
 	context.fillText(line, x, y);
 };
```




## Exif.js

> 使用到的库
* [exif.js](http://code.ciaoca.com/javascript/exif-js/)
* [html2canvas](http://html2canvas.hertzen.com/)

在微信中使用 `<input type="file" multiple accept="image/*">` 传入照片后，绘制到 Canvas 中时会发现绘制的图像方向不对（手 Q 端貌似不会存在这个问题），这时需要使用 exif.js 来解决。

> Exif.js 提供了 JavaScript 读取图像的原始数据的功能扩展，例如：拍照方向、相机设备型号、拍摄时间、ISO 感光度、GPS 地理位置等数据。


```html
<input class="uploadBtn" type="file" multiple accept="image/*">
```


```js
document.querySelector(".uploadBtn").addEventListener("change", previewImgFile, false);
 
function previewImgFile() {
 
    var _files = files || event.target.files;
    var _index = index || 0;
    var reader = new FileReader();
 
    reader.onload = function(event) {
 
        var image = new Image();
            image.src = event.target.result;
 
        var orientation;
 
        image.onload = function() {
 
            EXIF.getData(image, function() { // 获取图像的数据
 
                EXIF.getAllTags(this); // 获取图像的全部数据，值以对象的方式返回
                orientation = EXIF.getTag(this, "Orientation"); // 获取图像的拍摄方向
 
                var rotateCanvas = document.createElement("canvas"),
                    rotateCtx = rotateCanvas.getContext("2d");
 
                // 针对图像方向进行处理
                switch (orientation) {
 
                    case 1 :
                        rotateCanvas.width = image.width;
                        rotateCanvas.height = image.height;
                        rotateCtx.drawImage(image, 0, 0, image.width, image.height);
                        break;
                    case 6 : // 顺时针 90 度
                        rotateCanvas.width = image.height;
                        rotateCanvas.height = image.width;
                        rotateCtx.translate(0, 0);
                        rotateCtx.rotate(90 * Math.PI / 180);
                        rotateCtx.drawImage(image, 0, -image.height, image.width, image.height);
                        break;
                    case 8 :
                        rotateCanvas.width = image.height;
                        rotateCanvas.height = image.width;
                        rotateCtx.translate(0, 0);
                        rotateCtx.rotate(-90 * Math.PI / 180);
                        rotateCtx.drawImage(image, -image.width, 0, image.width, image.height);
                        break;
                    case 3 : // 180 度
                        rotateCanvas.width = image.width;
                        rotateCanvas.height = image.height;
                        rotateCtx.translate(0, 0);
                        rotateCtx.rotate(Math.PI);
                        rotateCtx.drawImage(image, -image.width, -image.height, image.width, image.height);
                        break;
                    default :
                        rotateCanvas.width = image.width;
                        rotateCanvas.height = image.height;
                        rotateCtx.drawImage(image, 0, 0, image.width, image.height);
 
                }
 
                var rotateBase64 = rotateCanvas.toDataURL("image/jpeg", 0.5);
 
            });
 
        }
 
    }
 
    reader.readAsDataURL(_files[_index]);
 
}
```




## 从网页向小程序发送消息

查阅[小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html?search-key=wx.miniProgram.postMessage)，有这样一个接口 `wx.miniProgram.postMessage` ，可以用来从网页向小程序发送消息，然后通过 `bindmessage` 事件来监听消息，如下是官方文档描述

以下是代码：

```html
// 网页代码
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>postMessage</title>
    </head>
    <body>
        <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
        <script type="text/javascript">
            wx.miniProgram.postMessage({ data: '获取成功' })
            wx.miniProgram.navigateBack({delta: 1})
        </script>
    </body>
</html>

```

```js
    <web-view bindmessage="handleGetMessage" src="test.html"></web-view>
    Page({
        handleGetMessage: function(e) {
            console.log(e.target.data)
        }
    })
```


**写完试了下，期待打印 “获取成功” ，而实际小程序里面啥也没打印。。。**

然后仔细看官方文档，发现有这句话：

> 网页向小程序 `postMessage` 时，会在**特定时机（小程序后退、组件销毁、分享）触发**并收到消息。

也就是只有在小程序后退、组件销毁、分享时才会触发

所以应该改变 `postMessage` 的时机，调换顺序就可以了


```js
    wx.miniProgram.navigateBack({delta: 1})
    wx.miniProgram.postMessage({ data: '获取成功' })
```


## [PxLoader](http://thinkpixellab.com/pxloader/)
> `PxLoader`是一个Javascript库，可帮助您下载图像，声音文件或您在网站上执行特定操作（例如显示用户界面或开始游戏）之前需要的其他任何内容。您可以使用它为HTML5游戏和网站创建预加载器。


## 微信H5 关闭页面

```js
setTimeout(function () {
    WeixinJSBridge.call('closeWindow');
    document.addEventListener('WeixinJSBridgeReady', function () {
        WeixinJSBridge.call('closeWindow');
    }, false)
}, 1000)
```




## 移动端调试
```html
	<script src="//cdn.jsdelivr.net/npm/eruda"></script>
```
```js
	eruda.init();
```

## base64_to_file
>将base64 的图片转换成file对象上传 atob将ascii码解析成binary数据
```js
    function base64ToFile(data) {
        console.log(data)
        将base64 的图片转换成file对象上传 atob将ascii码解析成binary数据
        var binary = atob(data.split(',')[1]);
        var mime = data.split(',')[0].match(/:(.*?);/)[1];
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        var fileData = new Blob([new Uint8Array(array)], {type: mime, });
        var file = new File([fileData], new Date().getTime() + '.png', {type: mime});
        return flie;
    }
```


## Base64字符串转二进制

```js
    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    }
```

## 等比例压缩图片

```js

    function compress(fileObj, callback) {
        if (typeof (FileReader) === 'undefined') {
            console.log("当前浏览器内核不支持base64图标压缩");
            return false;
        } else {
            try {
                var reader = new FileReader();
                var image = new Image();
                reader.readAsDataURL(fileObj);//开始读取指定的Blob中的内容。返回base64
                reader.onload = function (ev) {
                    image.src = ev.target.result;
                    image.onload = function () {
                        var imgWidth = this.width, imgHeight = this.height; //获取图片宽高
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = imgWidth;
                        canvas.height = imgHeight;
                        ctx.drawImage(this, 0, 0, imgWidth, imgHeight);//根据宽高绘制图片
                        var dataurl = canvas.toDataURL("image/jpeg", 0.5);//canvase 转为base64
    //                        var blogData = dataURLtoBlob(dataurl);//base64转为blog
                        callback(dataurl);
                    }
                }
            } catch (e) {
                console.log("压缩失败!");
            }
        }
    }

```


## 旋转图片

```js

    var rotationCanvas = document.createElement("canvas");
    var rotationCtx = rotationCanvas.getContext('2d');

    function rotationImage(img, image_angle, i, cb) {
        var rotationImg = new Image();
        rotationImg.src = img;
        rotationImg.onload = function () {
            var imgW = this.width;
            var imgH = this.height;
            if (image_angle === 360)
                image_angle = 0;
            if (image_angle === 0 || image_angle === 180) {
                rotationCanvas.width = imgW;
                rotationCanvas.height = imgH;
            } else {
                rotationCanvas.width = imgH;
                rotationCanvas.height = imgW;
            }

            rotationCtx.clearRect(0, 0, rotationCanvas.width, rotationCanvas.height);
            rotationCtx.save();
            rotationCtx.translate(rotationCanvas.width / 2, rotationCanvas.height / 2);
            rotationCtx.rotate(image_angle * Math.PI / 180);
            if (image_angle === 0 || image_angle === 180) {
                rotationCtx.drawImage(rotationImg, 0, 0, imgW, imgH, rotationCanvas.width / -2, rotationCanvas.height / -2, imgW, imgH);
            } else {
                rotationCtx.drawImage(rotationImg, 0, 0, imgW, imgH, rotationCanvas.height / -2, rotationCanvas.width / -2, imgW, imgH);
            }
            rotationCtx.restore();
            var imgData = rotationCanvas.toDataURL("image/jpeg");
            cb && cb(imgData, i);
    //        $("body").append('<img style="border:10px solid green;width:200px;" src="' + imgData + '"/>');
        };
    }

```


## js 获取cookie 

```js
    function getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }
```


## js 获取URL参数

```js
    function getQuery(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return(false);
    }
```


## js url编码 & 解码

```js
/**
 * 
 * @param {网址} url 
 * @param {true 解码  falsg 编码} flag 
 */
function urlcode(url,flag) {
    return flag ? decodeURIComponent(url):encodeURIComponent(url);
}
```

## js 随机数

```js
function getRndInteger (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
```

## 弹窗提示

```css
.am-toast.am-toast-mask {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 0;
    position: fixed;
    z-index: 9999;
    width: 100%;
}

.am-toast.am-toast-mask,
.am-toast.am-toast-nomask {
    -webkit-transform: translateZ(1px);
    transform: translateZ(1px)
}

.am-toast.am-toast-nomask {
    position: fixed;
    max-width: 50%;
    width: auto;
    left: 50%;
    top: 50%
}

.am-toast.am-toast-nomask .am-toast-notice {
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%)
}

.am-toast-notice-content .am-toast-text {
    min-width: 160px;
    border-radius: 3px;
    color: #fff;
    background-color: rgba(58, 58, 58, .9); 
    /*background: #000;*/
    /*line-height: 3.5;*/
    padding: 20px 15px;
    text-align: center;
    font-size: 26px;
}

.am-toast-notice-content .am-toast-text.am-toast-text-icon {
    border-radius: 5px;
    padding: 15px
}

.am-toast-notice-content .am-toast-text.am-toast-text-icon .am-toast-text-info {
    margin-top: 6px
}
```
```html
<div class="am-toast am-toast-mask" style="display: none;">
    <div class="am-toast-notice-content">
        <div class="am-toast-text" role="alert" aria-live="assertive">
            <div class="msg">发送成功</div>
        </div>
    </div>
</div>
```
```js
/**
弹窗提示
*/
function msg(text) {
    $(".am-toast-mask").fadeIn(function () {
        setTimeout(function () {
            $(".am-toast-mask").fadeOut();
        }, 1500);
    });
    $(".am-toast-mask .msg").html(text);
}
```

## Jquyer extend

```javascript
jQuery.extend({
    min: function (a, b) { return a < b ? a : b; },
    max: function (a, b) { return a > b ? a : b; }
});
jQuery.min(2, 3); //  2 
jQuery.max(4, 5); //  5


$.fn.extend({
     check: function() {
         return this.each(function() {
             this.checked = true;
         });
     },
     uncheck: function() {
         return this.each(function() {
             this.checked = false;
         });
     }
 });
// 使用新创建的.check() 方法
$( "input[type='checkbox']" ).check();

```

## 微信摇一摇

```javascript

var SHAKE_THRESHOLD = 1000;
var last_update = 0;
var x = y = z = last_x = last_y = last_z = 0;
function shakeInit() {
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', deviceMotionHandler, false);
    } else {
        // alert('not support mobile event');
    }
}
function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;//eventData.acceleration;
    var curTime = new Date().getTime();
    if ((curTime - last_update) > 100) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
        if (speed > SHAKE_THRESHOLD) {
            yaoyiyao();
        }
    }
    last_x = x;
    last_y = y;
    last_z = z;
}
shakeInit();

// 安卓手机均可正常实现摇一摇，以下代码针对ios手机做授权处理

function iosGrantedTips() {
    var ua = navigator.userAgent.toLowerCase(); //判断移动端设备，区分android，iphone，ipad和其它
    if (ua.indexOf("like mac os x") > 0) { //判断苹果设备
        // 正则判断手机系统版本
        var reg = /os [\d._]*/gi;
        var verinfo = ua.match(reg);
        var version = (verinfo + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, ".");
        // alert(version);
        // var arr=version.split(".");
        // console.log(arr[0]+"."+arr[1]+"."+arr[2]) //获取手机系统版本
        // if (arr[0]>12&&arr[1]>2) {  //对13.3以后的版本处理,包括13.3
        if (parseFloat(version) >= 13.3) {  //对13.3以后的版本处理,包括13.3
            DeviceMotionEvent.requestPermission().then(permissionState => {
                if (permissionState === 'granted') { //已授权
                    shakeInit() //摇一摇
                } else if (permissionState === 'denied') {// 打开的链接不是https开头
                    // alert("当前IOS系统拒绝访问动作与方向。请退出微信，重新进入活动页面获取权限。")
                }
            }).catch((err) => {
                // alert("用户未允许权限")
                //======这里可以防止重复授权，需要改动，因为获取权限需要点击事件才能触发，所以这里可以改成某个提示框===//
                console.log("由于IOS系统需要手动获取访问动作与方向的权限，为了保证摇一摇正常运行，请在访问提示中点击允许！")
                ios13granted();
            });
        } else {  //13.3以前的版本
            // alert("苹果系统13.3以前的版本")
        }
    }
}
function ios13granted() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(permissionState => {
            if (permissionState === 'granted') {
                shakeInit() //摇一摇
            } else if (permissionState === 'denied') {// 打开的链接不是https开头
                // alert("当前IOS系统拒绝访问动作与方向。请退出微信，重新进入活动页面获取权限。")
            }
        }).catch((error) => {
            // alert("请求设备方向或动作访问需要用户手势来提示")
        })
    } else {
        // 处理常规的非iOS 13+设备
        // alert("处理常规的非iOS 13+设备")
    }
}
iosGrantedTips();



$("#gamestart").on("click",function(){
    ios13granted(); // 默认调用获取用户权限
});
```

##	海报生成

```js
/**
 * 海报生成
 * @param {type} json
 * @returns {Promise}
 */
function CanvasToJpg(json) {
    return new Promise(function (resolve, reject) {
        var canvas = document.getElementById("posters");
        //做一些异步操作
        json2canvas.draw(json, '#posters', null, function () {
            resolve(canvas.toDataURL("image/jpg"));
        });
    });
}
```

##	 资源加载

```js

/**
 * 资源加载
 * @param {type} resources
 * @returns {Promise}
 */
function pageLoading(resources) {
    return new Promise(function (resolve, reject) {
        var loading = new PxLoader();
        for (var i = 0; i < resources.length; i++) {
            loading.add(new PxLoaderImage(resources[i]));
        }
        loading.addProgressListener(function (e) {
            var s = e.completedCount / e.totalCount * 100; // 加载进度
            if (s >= 100) {
                console.log('loading completed ');
                resolve(); // 加载成功
            }
        });
        loading.start();
    });
}
```

##	设置css3动画

```js

/**
 * 设置动画延迟
 * delay 延迟时间
 * duration 执行时间
 */
function setAnimated() {
    $(".animated").each(function () {
        var delay = $(this).attr('data-delay');
        var duration = $(this).attr('data-duration');
        if (delay) {
            $(this).css({
                'animation-delay': delay + 's'
            });
        }
        if (duration) {
            $(this).css({
                'animation-duration': duration + 's'
            });
        }
    });
}
```

## 解决微信头像跨域

```js

/**
 * 解决微信头像跨域
 * @param {type} src
 * @returns {Promise}
 */
function getAvatar(src) {
    return new Promise(function (resolve) {
        var canvas = document.createElement('canvas');
        var contex = canvas.getContext('2d');
        var img = new Image();
        img.crossOrigin = ''; //添加时间戳
        img.src = src + "?timeStamp=" + new Date();
        if (src == "") {
            resolve("");
        }
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            contex.clearRect(0, 0, img.width, img.height);
            contex.drawImage(img, 0, 0); // 在刚刚裁剪的园上画图
            resolve(canvas.toDataURL('image/jpg', 1));
        };
        img.onerror = function () {
            resolve("");
        };
    });
}
```

## H5适配全屏

```html
 <video id="test_video" width="100%" height="100%" x-webkit-airplay="true" playsinline="true"
 x5-video-player-type="h5-page" x5-video-player-fullscreen="true"
 src="videolib_repo_2105_12_4x5gblk5e8f_SD_4x5gblk5e8f-mobile.mp4" preload="auto">
 </video>
```

 ```css
.videoPage {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: rgba(0, 0, 0, 1);
    color: #ffffff;
    top: 0px;
    left: 0;
    display: none;
}
#test_video {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
}
 ```

