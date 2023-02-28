## vue打包项目
> 这次给大家带来Vue在打包项目以后刷新显示404应该怎么处理，处理Vue在打包项目以后刷新显示404的注意事项有哪些。

```base
    server {
        listen   80;
        server_name localhost;
        index index.html;
        root /root/dist;
        location / {
            root /root/dist;
            try_files $uri $uri/ /index.html =404;
        }
    }
```



## 显示变量的解决方法

```js
    [v-cloak] {
        display: none !important;
    }
    v-cloak
```

## Vue本地部署

> history 模式下 页面空白不显示
> 修改config 下 `index.js` assetsPublicPath 为:'./'

```js
  mode: 'history',
  base: '/2020/7/vuetest', // 需要指定当前网站更目录
```



## 接口跨域解决

```js
proxyTable: {
	'/aiya/*': {
        target: 'http://api.xxxx.com',  // 后台api
        changeOrigin: true,  //是否跨域
        secure: true,
        pathRewrite: {
            '^/aiya': ''   //需要rewrite的,
        }
	}
},
```

## utils 方法类

```js
import axios from 'axios';
import qs from 'qs'
import Cookies from 'js-cookie'
import wx from 'weixin-js-sdk';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
var instance = axios.create({
    headers: { 'content-type': 'multipart/form-data' },
    // baseURL: process.env.BASE_API, // api 的 base_url
    // timeout: 15000 // 请求超时时间
});

//http request 拦截器
axios.interceptors.request.use((config) => {
    if (config.method === 'post') {
        config.data = qs.stringify(config.data);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
/**
 * 页面跳转， vue 路由 和https
 * @param url
 * @param data
 * @returns {Promise}
 */
export function gourl(url) {
    if (url.slice(0, 4) == 'http') {
        window.location.href = url;
    } else {
        var data = qs.parse(url);
        this.$router.push({
            name: data.url,
            query: data
        });
    }
}
/**
 * 跳转页面
 * @param {*} name 
 * @param {*} query 
 */
export function url(name, query) {
    this.$router.push({
        name: name,
        query: query ? query : {}
        // query: query ? Object.assign(query, { t: new Date().getTime() }) : { t: new Date().getTime() }
    });
}

/**
 * 关闭所有页面跳转
 * @param {*} name 
 */
export function replace(name, query) {
    this.$router.replace({
        name: name,
        query: query ? query : {}
        // query: query ? Object.assign(query, { t: new Date().getTime() }) : { t: new Date().getTime() }
    })
}
/**
 * 微信授权
 * @param url
 * @param data
 * @returns {Promise}
 */
export function weixin_auth() {
    // let urlrouter = window.location.href.split("#/")[1]; // 当前路由
    // console.log(urlrouter);

    if (!Cookies.get('openid')) {
        let urlrouter = window.location.href.split("#/")[1]; // 当前路由
        window.location.replace(`https://wx.xxxx.com/auth?callback=${urlrouter}`);
    }
}
/**
 * Url 转对象
 * @param url
 * @param data
 * @returns {Promise}
 */
export function urlParse(url) {
    return new Promise((resolve, reject) => {
        resolve(qs.parse(url));
    })
}
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
* 封装post请求
* @param url
* @param data
* @returns {Promise}
*/

export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
* 封装post请求 FormData方式
* @param url
* @param data
* @returns {Promise}
*/

export function postform(url, data = {}) {
    return new Promise((resolve, reject) => {
        instance.post(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}
/**
* 隐藏右上角菜单接口
*/
export function weixin_hide() {
    wx.ready(function () {
        //隐藏右上角菜单接口
        wx.hideOptionMenu();
    });
}

/**
* 微信分享
* @param data 
*/
export function weixin_share(data) {
    let title = '分享标题';
    let desc = '分享描述';
    let url = window.location.href;
    let pic = window.location.href + '/img/share.jpg';
    wx.ready(function () {
        var shareData64 = {
            title: data.title ? data.title : title, // 必填 , 分享标题
            desc: data.desc ? data.desc : desc, // 选填 , 分享描述
            imgUrl: data.pic ? data.pic : pic, // 选填 , 分享图链接
            link: url + '?' + data.url,
        };
        wx.onMenuShareAppMessage(shareData64);
        wx.onMenuShareTimeline(shareData64);
    });
}

/**
* 对象转URL
* @param data 对象
*/
export function urlEncode(data) {
    var _result = [];
    for (var key in data) {
        var value = data[key];
        if (value.constructor == Array) {
            value.forEach(function (_value) {
                _result.push(key + "=" + _value);
            });
        } else {
            _result.push(key + '=' + value);
        }
    }
    return _result.join('&');
}


/**
 * @returns 获取登陆的token
 */
export function getToken() {
    return Cookies.get('token');
}
/**
 * 清除token
 */
export function removeToken() {
    Cookies.set("token", '');
}

/**
 * 设置本地存储
 * @param {*} name 
 * @param {*} value 
 */
export function setsys(name, value) {
    window.localStorage.setItem(name, JSON.stringify(value));
}

/**
 * 获取本地存储
 * @param {*} name 
 * @returns 
 */
export function getsys(name) {
    return window.localStorage.getItem(name) ? JSON.parse(window.localStorage.getItem(name)) : false;
}

/**
 * 微信支付调用
 * @param {*} data 
 */
function onBridgeReady(data) {
    console.log('支付信息');
    console.table([data]);
    WeixinJSBridge.invoke('getBrandWCPayRequest', {
        "appId": "wx2421b1c4370ec43b",     //公众号ID，由商户传入     
        "timeStamp": "1395712654",         //时间戳，自1970年以来的秒数     
        "nonceStr": "e61463f8efa94090b1f366cccfbbb444", //随机串     
        "package": "prepay_id=u802345jgfjsdfgsdg888",
        "signType": "MD5",         //微信签名方式：     
        "paySign": "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
    }, function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        }
    });
}

/**
 * 微信支付
 * @param {*} data 
 */
export function wxpay(data) {
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady(data), false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady(data));
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(data));
        }
    } else {
        onBridgeReady(data);
    }
}

```

## keep-alive 

```js
//cache.js

import Vue from 'vue'

Vue.mixin({
	beforeRouteLeave: function (to, from, next) {
		if (from && from.meta.rank && to.meta.rank && from.meta.rank > to.meta.rank) {//如果返回上一层，则摧毁本层缓存。
			if (this.$vnode && this.$vnode.data.keepAlive) {
				if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache) {
					if (this.$vnode.componentOptions) {
						var key = this.$vnode.key == null
							? this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
							: this.$vnode.key;
						var cache = this.$vnode.parent.componentInstance.cache;
						var keys = this.$vnode.parent.componentInstance.keys;
						if (cache[key]) {
							if (keys.length) {
								var index = keys.indexOf(key);
								if (index > -1) {
									keys.splice(index, 1);
								}
							}
							delete cache[key];
						}
					}
				}
			}
			this.$destroy();
		}
		next();
	},
});
```

## base.js

```js
//判断是否是生产环境
var isPro = process.env.NODE_ENV === 'production';
//配置不同的接口baseURL
export default {
    aiya: isPro ? 'http://aiya.xxxx.com/api' : '/aiya/api/',
}
```

## 接口封装

```js
import base from './base';
import { get, post, postform } from './utils'

const http = {
    aiya: {
        init(obj) { // 初始化
            return get(`${base.aiya}/init`, obj);
        },
        reg(obj) {
            return post(`${base.aiya}/reg`, obj);
        },
    }
}

export default http;
```

## canvas 海报生成

```js
/**
 * 海报生成
 */
import VueCanvasPoster from 'vue-canvas-poster'
Vue.use(VueCanvasPoster)

<vue-canvas-poster v-if="painting.width" :widthPixels="1000" :painting="painting" @success="success" @fail="fail"></vue-canvas-poster>

/**
获取海报信息
*/

that.painting = {
    width: '1000px',
    height: (bg.height / (bg.width / 1000)) + 'px',
    background: data.backdrop.src.replace('http://aiya.snwechat.com/', '/aiya'),
    views: [
        {
            type: 'text',
            text: res.data.userinfo.realname,
            css: {
                top: data.nickName.top + 'px',
                left: data.nickName.left + 'px',
                maxLines: 1,
                color: data.nickName.color,
                fontSize: data.nickName.fontSize + 'px',
            },
        }, {
            type: 'text',
            text: pinyin.getFullChars(res.data.userinfo.realname),
            css: {
                top: data.englishNickname.top + 'px',
                left: data.englishNickname.left + 'px',
                maxLines: 1,
                color: data.englishNickname.color,
                fontSize: data.englishNickname.fontSize + 'px',
            },
        },
        {
            type: 'text',
            text: res.data.no,
            css: {
                top: data.code.top + 'px',
                left: data.code.left + 'px',
                maxLines: 1,
                color: data.code.color,
                fontSize: data.code.fontSize + 'px',
            },
        },

    ]
}

success(src) {
    // 海报图片
    this.pic = src;
},
fail(error) {
    console.log(error);
},


```

## 汉字转拼音

```js
import pinyin from 'js-pinyin'

/**
* @typedef Option
* @type Object
* @property {Boolean} [checkPolyphone=false] 是否检查多音字
* @property {Number} [charCase=0] 输出拼音的大小写模式，0-首字母大写；1-全小写；2-全大写
*/

pinyin.setOptions({ checkPolyphone: false, charCase: 0 });

pinyin.getFullChars('汉字');
```

## vue-video-player

```cmd
npm install vue-video-player --save
```

```less

.videoPlay {
    .vjs-custom-skin > .video-js .vjs-control-bar {
        font-size: 0.29rem;
    }
    /*播放按钮设置成宽高一致，圆形，居中*/
    .vjs-custom-skin > .video-js .vjs-big-play-button {
        background-color: rgba(0, 0, 0, 0.45);
        font-size: 4.5em;
        border-radius: 50%;
        height: 2em !important;
        line-height: 2em !important;
        margin-top: -1em !important;
        margin-left: -1em !important;
        width: 2em !important;
        outline: none;
    }

    .video-js .vjs-big-play-button .vjs-icon-placeholder:before {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
    }

    /*control-bar布局时flex，通过order调整剩余时间的位置到进度条右边*/
    .vjs-custom-skin > .video-js .vjs-control-bar .vjs-remaining-time {
        order: 3 !important;
    }

    /*进度条背景轨道*/
    .video-js .vjs-slider {
        border-radius: 1em;
    }

    /*进度条进度*/
    .vjs-custom-skin > .video-js .vjs-play-progress,
    .vjs-custom-skin > .video-js .vjs-volume-level {
        border-radius: 1em;
    }

    /*鼠标进入播放器后，播放按钮颜色会变*/
    .video-js:hover .vjs-big-play-button,
    .vjs-custom-skin > .video-js .vjs-big-play-button:active,
    .vjs-custom-skin > .video-js .vjs-big-play-button:focus {
        background-color: rgba(0, 0, 0, 0.4) !important;
    }

    /*control bar*/
    .video-js .vjs-control-bar {
        background-color: rgba(0, 0, 0, 0.2) !important;
    }

    /*点击按钮时不显示蓝色边框*/
    .video-js .vjs-control-bar button {
        outline: none;
    }
}
```

```js



/**
 * 视频插件
 */
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'

Vue.use(VideoPlayer)



this.$refs.videoPlayer.player.play() // 播放
this.$refs.videoPlayer.player.pause() // 暂停
this.$refs.videoPlayer.player.src(src) // 重置进度条

 <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true"
 :options="playerOptions" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)"
@ended="onPlayerEnded($event)" @waiting="onPlayerWaiting($event)" @playing="onPlayerPlaying($event)"
@loadeddata="onPlayerLoadeddata($event)" @timeupdate="onPlayerTimeupdate($event)"
@canplay="onPlayerCanplay($event)" @canplaythrough="onPlayerCanplaythrough($event)"
@statechanged="playerStateChanged($event)" @ready="playerReadied">
     </video-player>


>> data


yerOptions: {
		// playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
		autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
            type: "video/mp4", // 类型
            src: require('../assets/img/pic.mp4') // url地址
        }],
        // poster: '../assets/img/pic.jpg', // 封面地址
        notSupportedMessage: ' ', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
            timeDivider: false, // 当前时间和持续时间的分隔符
            durationDisplay: false, // 显示持续时间
            remainingTimeDisplay: false, // 是否显示剩余时间功能
            fullscreenToggle: true // 是否显示全屏按钮
        }
    }
};


computed: {
    player() {
        return this.$refs.videoPlayer.player;
    },
},
    
 // 播放回调
onPlayerPlay(player) {
    console.log('player play!', player)
    console.log('视频开始播放');
    if (this.player_flag) {
        this.player.pause();
        this.player_flag = false;
    }
    this.subjectRs();
    /**
    * 设置当前播放时间
    */
    // this.player.currentTime(20.404563);
},
    
    // 暂停回调
onPlayerPause(player) {
    console.log('player pause!', player)
    clearInterval(this.timer);
},

 // 视频播完回调
onPlayerEnded($event) {
    // console.log($event)
},

// DOM元素上的readyState更改导致播放停止
    onPlayerWaiting($event) {
        // console.log($event)
    },

// 已开始播放回调
	onPlayerPlaying($event) {
        // console.log($event)
    },

        // 当播放器在当前播放位置下载数据时触发
onPlayerLoadeddata($event) {
 // console.log($event)
 },

        // 当前播放位置发生变化时触发。
        onPlayerTimeupdate(player) {
            /**
             * 当前播放时间
             */

            // console.log('player Timeupdate!', player.currentTime())

            // var startedTime = this.getShowTime(player.currentTime());
            // console.log('用户观看时间', startedTime);

        },

        //媒体的readyState为HAVE_FUTURE_DATA或更高
        onPlayerCanplay(player) {
            // console.log('player Canplay!', player)

            //解决自动全屏
            var ua = navigator.userAgent.toLocaleLowerCase();
            //x5内核
            if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
                // console.log('====================document.getElementsByTagName(video)', document.getElementsByTagName('video'))
                document.getElementsByTagName('video')[0].setAttribute('x-webkit-airplay', true)
                document.getElementsByTagName('video')[0].setAttribute('x5-playsinline', true)
                document.getElementsByTagName('video')[0].setAttribute('webkit-playsinline', true)
                document.getElementsByTagName('video')[0].setAttribute('playsinline', true)
            } else {
                // console.log('====================document.getElementsByTagName(video)', document.getElementsByTagName('video'))
                //ios端
                document.getElementsByTagName('video')[0].setAttribute('webkit-playsinline', true)
                document.getElementsByTagName('video')[0].setAttribute('playsinline', true)
            }
        },

        //媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
        onPlayerCanplaythrough(player) {
            // console.log('player Canplaythrough!', player)
        },

        //播放状态改变回调
        playerStateChanged(playerCurrentState) {
            // console.log('player current update state', playerCurrentState)
        },

        //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
playerReadied(player) {
    // console.log('example player 1 readied', player);
}
```

## vue-loader-v16

>解决Error: Cannot find module ‘vue-loader-v16/package.json‘

```bash
cnpm i --save-dev vue-loader-v16
```

## keep-alive 缓存和清除

```js
include - string | RegExp | Array。只有名称匹配的组件会被缓存。
exclude - string | RegExp | Array。任何名称匹配的组件都不会被缓存。
max - number | string。最多可以缓存多少组件实例。
```

封装 `useRouteCache.ts` 类文件

```js
/*
 * @Author: Mr.xu
 * @Date: 2023-02-22 15:02:29
 * @LastEditors: Mr.xu
 * @LastEditTime: 2023-02-28 12:19:57
 * @Description:
 */
import { ref, nextTick } from 'vue';

const caches = ref<string[]>([]);

export const useRouteCache = () => {
  return caches;
};

export const addCache = (componentName: string | string[]) => {
  if (Array.isArray(componentName)) {
    componentName.forEach(addCache);
    return;
  }
  if (!componentName || caches.value.includes(componentName)) return;
  caches.value.push(componentName);
  console.log('缓存路由组件：', componentName);
};

// 移除缓存的路由组件
export const removeCache = (componentName: string) => {
  const index = caches.value.indexOf(componentName);
  if (index > -1) {
    console.log('清除缓存的路由组件：', componentName);
    return caches.value.splice(index, 1);
  }
};

// 移除缓存的路由组件的实例
export const removeCacheEntry = async (componentName: string) => {
  if (removeCache(componentName)) {
    await nextTick();
    addCache(componentName);
  }
};

// 清除缓存的路由组件的实例
export const clearEntry = () => {
  caches.value.slice().forEach((key) => {
    removeCacheEntry(key);
  });
};
```

`Layout.vue`

> 引入 `useRouteCache.ts` 

```vue
<router-view v-slot="{ Component }">
    <keep-alive :include="useRouteCache">
      <component :is="Component" />
    </keep-alive>
</router-view>
<script>
	import {useRouteCache} from '../hooks/useRouteCache';
</script>
```



