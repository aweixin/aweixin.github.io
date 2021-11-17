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