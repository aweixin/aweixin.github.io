## rem 适配
```html
    <script type="text/javascript">
        ;(function(designWidth, maxWidth) {
            var doc = document,
            win = window,
            docEl = doc.documentElement,
            remStyle = document.createElement("style"),
            tid;
    
            function refreshRem() {
                var width = docEl.getBoundingClientRect().width;
                maxWidth = maxWidth || 540;
                width>maxWidth && (width=maxWidth);
                var rem = width * 100 / designWidth;
                remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
            }
    
            if (docEl.firstElementChild) {
                docEl.firstElementChild.appendChild(remStyle);
            } else {
                var wrap = doc.createElement("div");
                wrap.appendChild(remStyle);
                doc.write(wrap.innerHTML);
                wrap = null;
            }
            //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
            refreshRem();
    
            win.addEventListener("resize", function() {
                clearTimeout(tid); //防止执行两次
                tid = setTimeout(refreshRem, 300);
            }, false);
    
            win.addEventListener("pageshow", function(e) {
                if (e.persisted) { // 浏览器后退的时候重新计算
                    clearTimeout(tid);
                    tid = setTimeout(refreshRem, 300);
                }
            }, false);
    
            if (doc.readyState === "complete") {
                doc.body.style.fontSize = "16px";
            } else {
                doc.addEventListener("DOMContentLoaded", function(e) {
                    doc.body.style.fontSize = "16px";
                }, false);
            }
        })(750, 750);
    </script>
```


## 下载图片

```javascript
/**
*下载图片
*/
const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(`下载图片失败 ${src}`)
        img.crossOrigin = 'anonymous'
        img.src = src
        if (img.complete === true) {
            // Inline XML images may fail to parse, throwing an Error later on
            setTimeout(() => resolve(img), 500)
        }
    })
}

/**
* 绘制文字
* @param {Object} view
*/
const fillText = (ctx, view) => {
    return new Promise((resolve, reject) => {
        ctx.save();
        // 设置字体
        ctx.font = `${view.fontSize || '20px'} ${view.fontFamily}`;
        // 设置颜色
        ctx.fillStyle = view.color || '#000';
        // 设置水平对齐方式
        ctx.textAlign = view.textAlign || 'left';
        // 设置垂直对齐方式
        ctx.textBaseline = "middle";
        // 绘制文字（参数：要写的字，x坐标，y坐标）
        ctx.fillText(view.text, view.x, view.y);
        ctx.restore(); 
        resolve();
    });
}


/**
* 绘制图片 
*/
const drawCanvasBgImg = () => {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    loadImage('/src/assets/logo.png').then(res => {
        canvas.width = res.width;
        canvas.height = res.height;
        ctx.drawImage(res, 0, 0);
        fillText(ctx, {
            text: '李明',
            x: 100,
            y: 100,
            fontSize: '24px',
            color: '#fff',
            textAlign: 'center'
        }).then(font => {
            fillText(ctx, {
                text: pinyin.getFullChars('李明'),
                x: 100,
                y: 130,
                fontSize: '24px',
                fontFamily: "CATANLTN",
                color: '#fff',
                textAlign: 'center'
            }).then(font => {
                let base64 = canvas.toDataURL("image/jpeg");
				console.log(base64);
            })
        })
    })
};
```





## 工具方法

```js
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function utils() {
    this.dev = this.getPara('dev') ? true : false;
    this.init();
}

utils.prototype.init = function () {
    this.dev && this.eruda();
    this.audioInit();
    this.metaInit(750);
    this.loadjs('./a.js');
    this.loadjs('./app.js');
    console.log(this)
};
/**
 * eruda
 * @returns {undefined}
 */
utils.prototype.eruda = function () {
    /dev=true/.test(window.location) && (document.write('<script src="//cdn.jsdelivr.net/npm/eruda" crossorigin="anonymous"><\/script>'), document.write("<script>eruda.init();<\/script>"));
};

/**
 * 设置mate设计图大小
 * @param {type} n
 * @returns {undefined} 
 */
utils.prototype.metaInit = function (n) {
    var e;
    function t() {
        var e = document.querySelector('meta[name="viewport"]'), t = window.screen.width;
        e.setAttribute("content", "width=" + n + ",initial-scale=" + t / n + ",user-scalable=no,viewport-fit=cover")
    }
    window.addEventListener("resize", function () {
        clearTimeout(e), e = setTimeout(t, 300)
    }), t()
}

/**
 * 随机数
 * @param {type} min
 * @param {type} max
 * @returns {Number}
 */
utils.prototype.RndInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};
/**
 * 获取URL参数
 * @param {type} variable
 * @returns {utils.prototype.getUrlParams.pair|Boolean}
 */
utils.prototype.getUrlParams = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
};

/**
 * 
 * 获取UA
 * @returns {utils.prototype.parseUA.utils}
 */
utils.prototype.parseUA = function () {
    var c = navigator.userAgent;
    var d = navigator.userAgent.toLowerCase();
    var e = d.match(/MicroMessenger/i) == "micromessenger";
    var b = e || (!!c.match(/(iPhone|iPod|Android|ios|Mobile)/i));
    return {
        mobile: b,
        pc: !b,
        ios: !!c.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android: c.indexOf("Android") > -1,
        weixin: e,
        newsapp: c.indexOf("NewsApp") > -1,
        yixin: c.indexOf("YiXin") > -1,
        weibo: c.indexOf("weibo") > -1,
        yunyuedu: c.indexOf("PRIS") > -1,
        cloudmusic: d.indexOf("neteasemusic") > -1
    }
};
/**
 * 
 * @returns {undefined}禁止页面滑动
 */
utils.prototype.noTouchmove = function () {
    document.body.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, {passive: false});
};
/**
 * input blur
 * @returns {undefined}
 */
utils.prototype.inputblur = function () {
    var self = this;
    $("input,select,textarea").blur(function () {
        setTimeout(function () {
            var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
            window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        }, 50);
    })
};

/**
 * 微信分享
 * @param {type} title
 * @param {type} desc
 * @param {type} imgUrl
 * @param {type} link
 * @returns {Boolean}
 */
utils.prototype.wxshare = function (param) {
    var title = param.title;
    var desc = param.desc;
    var imgUrl = param.imgUrl;
    var link = param.link;

    if (!title || !desc) {
        alert('缺少分享参数');
        return false;
    }
    $.get('/class/wxsdk/smala.php', function (res) {
        wx.config(res);
        wx.ready(function () {
            console.log('wx ready');
            param.callback && param.callback();
            var shareData64 = {
                title: title || ' ', // 必填 , 分享标题
                desc: desc || "", // 选填 , 分享描述
                imgUrl: imgUrl || '', // 选填 , 分享图链接
                link: link || window.location.href,
                success: function () {
                    //  用户确认分享后执行的回调函数
                },
                cancel: function () {
                    //  用户取消分享后执行的回调函数
                }
            };
            wx.updateAppMessageShareData(shareData64);
            wx.updateTimelineShareData(shareData64);
        });
        wx.error(function () {
            param.callback && param.callback();
        });
    }, 'json');
};


/**
 * 初始化音频文件
 */
utils.prototype.audioInit = function () {
    var audios = $('audio');
    if (audios.length > 0) {
        for (var i = 0; i < audios.length; i++) {
            (function (i) {
                var audio = audios[i];
                var play = function () {
                    document.removeEventListener("WeixinJSBridgeReady", play);
                    document.removeEventListener("YixinJSBridgeReady", play);
                    document.removeEventListener("touchstart", play, false);
                    audio.play();
                };
                $(audio).one("play", function () {
                    console.log(audio, '已预加载');
                    this.pause();
                });
                document.addEventListener("WeixinJSBridgeReady", play, false);
                document.addEventListener('YixinJSBridgeReady', play, false);
                document.addEventListener("touchstart", play, false);
            })(i);
        }
    }
};


/**
 * 加载资源
 * @param {type} param
 */
utils.prototype.addLoader = function (param) {
    var resources = param.resources;
    var preloader = new Preloader({
        resources: resources
    });
    preloader.addProgressListener(function (loaded, length) {
        param.cb && param.cb(Math.floor(loaded / length * 100));
    });
    preloader.start();
};


/**
 * 
 * @param {当前页面} page 
 * @param {事件描述} desc 
 */
utils.prototype.addEventBaidu = function (page, desc) {
    window._hmt.push(['_trackEvent', page, 'click', desc]);
}


/**
 * PC 二维码
 */
utils.prototype.pc_code = function () {
    var a = this;
    var c = a.parseUA().pc;
    if (c) {
        if (document.body.getAttribute("code") == "no") {
            return
        }
        var d = document.createElement("div");
        d.style.cssText =
                "width:100%;height:100%;position:fixed;left:0px;top:0px;z-index:9999999;background:#fff;";
        var e = document.createElement("img");
        e.style.cssText =
                "width:300px;height:300px;position:fixed;top:50%;left:50%;margin-left:-150px;margin-top:-220px;";
        e.setAttribute("src", "http://tool.oschina.net/action/qrcode/generate?data=" + encodeURIComponent(
                location.href) + "&output=image%2Fgif&error=L&type=0&margin=4&size=4");
        d.appendChild(e);
        var b = document.createElement("p");
        b.style.cssText =
                "width:300px;height:300px;position:fixed;top:50%;left:50%;margin-left:-150px;margin-top:80px;text-align:center;font-size:19px;font-weight:bold;";
        d.appendChild(b);

        document.body.innerHTML = '';
        document.body.appendChild(d)
    }
    if (console.group) {
        console.group(location.href)
    }
    console.log("%c ",
            "opacity:.6;display:block;padding:50px;background:url('http://tool.oschina.net/action/qrcode/generate?data=" +
            encodeURIComponent(location.href) +
            "&output=image%2Fgif&error=L&type=0&margin=4&size=4') no-repeat;background-size:contain;");
    if (console.group) {
        console.groupEnd()
    }
};

/**
 * 
 * @returns {undefined}横竖屏切换
 */
utils.prototype.landscape = function () {
    var b = document.createElement("div");
    b.className = "landscape";
    b.style.cssText =
            "width:100%;height:100%;position:fixed;left:0px;top:0px;z-index:999999999;background:#000 url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAKACAYAAAAMzckjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MkUwMTBBNjIyNzkxMUU4QTkxMkVGRDgwRkFCNDlDQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MkUwMTBBNzIyNzkxMUU4QTkxMkVGRDgwRkFCNDlDQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYyRTAxMEE0MjI3OTExRThBOTEyRUZEODBGQUI0OUNCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjYyRTAxMEE1MjI3OTExRThBOTEyRUZEODBGQUI0OUNCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+B91cnwAAGBxJREFUeNrs3XuMXNdd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gAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAtAUAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABgl/p/AQYAW3T9S1bjIBgAAAAASUVORK5CYII=') no-repeat center center;display:none;";
    setTimeout(function () {
        document.body.appendChild(b)
    }, 200);
    function c() {
        if (document.body.getAttribute("landscape") == "no") {
            return
        }
        if (window.orientation === 180 || window.orientation === 0) {
            setTimeout(function () {
                b.style.display = "none"
            }, 250)
        }
        if (window.orientation === 90 || window.orientation === -90) {
            setTimeout(function () {
                b.style.display = "block"
            }, 250)
        }
    }
    c();
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", c, false)
}

/**
 * 获取URL 参数
 * @param {type} e
 * @returns {RegExp.$1|String}
 */
utils.prototype.getPara = function (e) {
    var d = location.search;
    var c = new RegExp("[&|?]" + e + "=([^&$]*)", "gi");
    var b = c.test(d);
    return b ? RegExp.$1 : ""
}

/**
 * 加载js
 * @param src 路径
 */
utils.prototype.loadjs = function (src, cb) {
    var n = document.createElement("script");
    n.type = "text/javascript";
    n.src = src + '?v=' + (new Date()).getTime();
    n.onload = function () {
        console.log(n.readyState);
    };
    n.onerror = function () {
        e(!1)
    };
    document.body.appendChild(n);
}
/**
 * 加载css
 * @param src 路径
 */
utils.prototype.loadcss = function (src, cb) {
    var cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    cssLink.href = src + '?v=' + (new Date()).getTime();
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(cssLink);
}

/**
 * 小于10补0
 * @param {type} n
 */
utils.prototype.formatNumber = function (n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}


/**
 * 金钱格式化，三位加逗号
 * @param { number } num
 */
utils.prototype.formatMoney = function (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 格式化时间，转化为几分钟前，几秒钟前
 * @param timestamp 时间戳，单位是毫秒
 */
utils.prototype.timeFormat = function (timestamp) {
    var mistiming = Math.round((Date.now() - timestamp) / 1000);
    var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒'];
    var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
    for (var i = 0; i < arrn.length; i++) {
        var inm = Math.floor(mistiming / arrn[i]);
        if (inm != 0) {
            return inm + arrr[i] + '前';
        }
    }
}
window.utils = new utils();

```

## H5 meta viewport

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

