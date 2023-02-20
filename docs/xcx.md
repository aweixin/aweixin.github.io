## 微信小程序下载文件视频，图片

```js
//downloadSaveFile.js
/** 
const DownloadSaveFile = require('downloadSaveFile.js');

downloadSaveFile(e) {
  let url = e.currentTarget.dataset.url;
  DownloadSaveFile.downloadFile('video', url); //video或image
}

*/
/**
 * 下载单个文件
 * @param {string} [type]
 * @param {string} url
 * @callback successCallback
 * @callback failCallback
 */
function downloadFile(type, url, successc, failc) {
  checkAuth(() => {
    wx.showLoading({
      title: '正在下载',
      mask: true
    })
    downloadSaveFile(
      type,
      url,
      () => {
        wx.hideLoading();
        wx.showToast({
          title: '下载成功',
          icon: 'none',
        })
        successc && successc();
      },
      (errMsg) => {
        wx.hideLoading();
        wx.showToast({
          title: errMsg,
          icon: 'none',
        })
        failc && failc();
      }
    );
  })
}

/**
 * 下载多个文件
 * @param {string} [type]
 * @param {string[]} urls
 * @callback completeCallback
 */
function downloadFiles(type, urls, completec) {
  let success = 0;
  let fail = 0;
  let total = urls.length;
  let errMsgs = [];

  checkAuth(() => {
    wx.showLoading({
      title: '正在下载',
      mask: true
    })
    for (let i = 0; i < urls.length; i++) {
      downloadSaveFile(
        type,
        urls[i],
        () => {
          success++;
          if (success + fail === total) {
            saveCompleted(success, fail, completec, errMsgs);
          }
        },
        (errMsg) => {
          fail++;
          errMsg && errMsgs.push(`视频${i}${errMsg}`);
          if (success + fail === total) {
            saveCompleted(success, fail, completec, errMsgs);
          }
        }
      );
    }
  })
}

//保存完成
function saveCompleted(success, fail, completec, errMsgs) {
  wx.hideLoading();
  let errMsg = '无';
  if (errMsgs.length) {
    errMsg = errMsgs.join('\n');
  }

  wx.showModal({
    title: `成功${success}项，失败${fail}项`,
    content: `失败信息:\n${errMsg}`,
    showCancel: false,
    success(res) {
      if (res.confirm) {
        completec && completec();
      }
    }
  })
}

//下载文件
function downloadSaveFile(type, url, successc, failc) {
  wx.downloadFile({
    url: url,
    success: res => {
      if (res.statusCode === 200) {
        if (type === 'video') {
          //类型为视频
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success: res => {
              successc && successc();
            },
            fail: res => {
              failc && failc('保存失败');
            }
          })
        } else if (type === 'image') {
          //类型为图片
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: res => {
              successc && successc();
            },
            fail: res => {
              failc && failc('保存失败');
            }
          })
        }
      } else {
        failc && failc('状态码非200');
      }
    },
    fail: res => {
      failc && failc('下载失败');
    }
  })
}

//检查权限
function checkAuth(gotc) {
  //查询权限
  wx.showLoading({
    title: '检查授权情况',
    mask: true
  })
  wx.getSetting({
    success(res) {
      wx.hideLoading();
      if (!res.authSetting['scope.writePhotosAlbum']) {
        //请求授权
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            //获得授权，开始下载
            gotc && gotc();
          },
          fail() {
            wx.showModal({
              title: '',
              content: '保存到系统相册需要授权',
              confirmText: '授权',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success(res) {
                      if (res.authSetting['scope.writePhotosAlbum'] === true) {
                        gotc && gotc();
                      }
                    }
                  })
                }
              },
              fail() {
                wx.showToast({
                  title: '打开设置页失败',
                  icon: 'none',
                })
              }
            })
          }
        })
      } else {
        //已有授权
        gotc && gotc();
      }
    },
    fail() {
      wx.hideLoading();
      wx.showToast({
        title: '获取授权失败',
        icon: 'none',
      })
    }
  })
}

module.exports = {
  downloadFile,
  downloadFiles
};
```

## 微信小程序处理HTML标签图片自适应

```js
/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.修改所有style里的width属性为max-width:100%
 * 3.img标签添加style属性：max-width:100%;height:auto
 * 4.去掉<br/>标签
 * @param html
 * @return string
 */
function formatRichText(html) {
    // 去掉img标签里的style、width、height属性
    let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
        match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
        match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
        match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
        return match;
    });
    // 修改所有style里的width属性为max-width:100%
    newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
        match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
        return match;
    });
    // 去掉<br/>标签
    // newContent = newContent.replace(/<br[^>]*\/>/gi, '');
    // img标签添加style属性：max-width:100%;height:auto
    newContent = newContent.replace(/\<img/gi,
    '<img style="max-width:100%;height:auto;display:block;margin:0px auto;"');
    return newContent;
}

export default {
    formatRichText,
};
```

## Grace

一个精巧、易用的微信小程序开发辅助库

### 特点

1. 轻量、小巧、上手简单
2. 支持和Vue一样优雅的数据响应式
3. 支持数据自动更新、更改缓存、批量更新
4. 强大的网络功能
5. 支持全局事件总线
6. 支持跨页面传值
7. 支持mixins

### 使用

1. 将 <https://github.com/wendux/grace/blob/master/dist/grace.js> 拷贝到小程序根目录下的grace目录,并命名为index.js
2. 创建页面时用`grace.page` 替换 `Page` 即可。

## 微信小程序接口封装

```js
const host = 'host';
// 小程序请求接口
module.exports = {
    // 图片上传接口
    uploadFile: `${host}/upload`
}
```

## 微信小程序方法封装

```js
/*
 * @Author: aweixin 
 * @Date: 2021-01-04 10:35:49 
 * @Last Modified by: aweixin
 * @Last Modified time: 2021-01-04 11:05:04
 */

import config from './config.js'
import app from './g.js'


// 小程序主动更新
function updateManager() {
    if (!wx.canIUse('getUpdateManager')) {
        return false;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
    });
    updateManager.onUpdateReady(function () {
        wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，即将重启应用',
            showCancel: false,
            success(res) {
                if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                }
            }
        });
    });
    updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
            title: '更新提示',
            content: '新版本下载失败',
            showCancel: false
        })
    });
}

//  获取元素的信息
function getRect(obj) {
    return new Promise((resolve, reject) => {
        wx.createSelectorQuery().select(obj).boundingClientRect((rect) => {
            if (rect) {
                resolve(rect);
            } else {
                reject('error');
            }
        }).exec();
    });
}

// 胶囊按钮与顶部的距离
function checkFullSucreen() {
    const res = wx.getSystemInfoSync()
    wx.setStorage({
        data: res,
        key: 'systemInfo'
    })

    if (wx.getMenuButtonBoundingClientRect()) {
        let menuButtonObject = wx.getMenuButtonBoundingClientRect();
        wx.getSystemInfo({
            success: res => {
                let statusBarHeight = res.statusBarHeight,
                    navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
                    navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
                wx.setStorage({
                    data: navHeight,
                    key: 'navHeight',
                })
                wx.setStorage({
                    data: navTop,
                    key: 'navTop',
                })
                wx.setStorage({
                    data: menuButtonObject,
                    key: 'menuButtonObject',
                })
            }
        });
    }
}
// 获取时间
const formatTime = date => {
    var date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const getDay = date.getDay();

    const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const weekdayen = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


    // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
    const daystr = [year, month, day].map(formatNumber)
    // return year + '年' + month + '月' + day + '号';
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}


function removeAllSpace(str) { //删除空格
    return str.replace(/\s+/g, "");
}

function random(Max, Min) { // 随机数
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

function success(msg, callback) { //显示成功提示框
    wx.showToast({
        title: msg,
        icon: 'success',
        mask: true,
        duration: 1500,
        success: function () {
            callback && (setTimeout(function () {
                callback();
            }, 1500));
        }
    });
}

function alert(msg, callback) { //显示 showModal 提示框
    wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false,
        success: function (res) {
            callback && callback();
        }
    });
}

function confirm(msg, callback) { //显示 showModal 提示框
    wx.showModal({
        title: '提示',
        content: msg,
        showCancel: true,
        success: function (res) {
            if (res.confirm) {
                callback && callback();
            } else if (res.cancel) {
                console.log('用户点击取消')
            }
        }
    });
}

function urlEncode(data) { //对象转URL
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

function msg(title) { // 提示
    wx.showToast({
        title: title,
        icon: 'none'
    })
}

function sequenceTasks(tasks) { //图片上传-顺序处理函数  
    //记录返回值
    function recordValue(results, value) {
        results.push(value);
        return results;
    }
    let pushValue = recordValue.bind(null, []);
    let promise = Promise.resolve();
    // 处理tasks数组中的每个函数对象
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        promise = promise.then(task).then(pushValue);
    }
    return promise;
}

// 上传图片
function uploadFile(tempFilePaths, success) {
    var imgindex = 0;
    var imgarr = []; //上传保存图片路径
    console.log(tempFilePaths);
    console.log(`${config.uploadFile}`);
    wx.showLoading({
        title: "上传中"
    });
    //函数数组，每个函数的返回值是一个promise对象
    let promiseFuncArr = [];
    //图片地址数组
    let imageList = [];
    //将图片地址的上传的函数加入到promiseFuncArr数组中
    for (let i = 0; i < tempFilePaths.length; i++) {
        let promiseTemp = function () {
            return new Promise((resolve, reject) => {
                //微信图片上传
                var formData = {
                    openid: wx.getStorageSync('openid'),
                }
                // console.log(formData);
                wx.uploadFile({
                    url: `${config.uploadFile}`,
                    filePath: tempFilePaths[i],
                    name: 'img',
                    formData: formData,
                    success: function (res) {
                        //可以对res进行处理，然后resolve返回
                        resolve(res);
                    },
                    fail: function (error) {
                        reject(error);
                    },
                    complete: function (res) {
                        wx.hideLoading();
                    },
                })
            });
        };
        promiseFuncArr.push(promiseTemp)
    }

    sequenceTasks(promiseFuncArr).then((result) => {
        console.log(result);
        result.map(v => {
            imgarr.push(JSON.parse(v.data).data.src);
        });
        wx.hideLoading();
        success && success(imgarr);
        //对返回的result数组进行处理
    });
}

function chooseImage(num, success) { //上传照片 上传数量  回调函数
    var imgindex = 0;
    var imgarr = []; //上传保存图片路径
    wx.chooseImage({
        count: num ? num : 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
            const tempFilePaths = res.tempFilePaths;
            // console.log(tempFilePaths);
            // console.log(config);

            wx.showLoading({
                title: "上传中"
            });
            //函数数组，每个函数的返回值是一个promise对象
            let promiseFuncArr = [];
            //图片地址数组
            let imageList = [];
            //将图片地址的上传的函数加入到promiseFuncArr数组中
            for (let i = 0; i < tempFilePaths.length; i++) {
                let promiseTemp = function () {
                    return new Promise((resolve, reject) => {
                        //微信图片上传
                        var formData = {
                            openid: wx.getStorageSync('openid'),
                        }
                        // console.log(formData);
                        wx.uploadFile({
                            url: `${config.uploadFile}`,
                            filePath: tempFilePaths[i],
                            name: 'img',
                            formData: formData,
                            success: function (res) {
                                //可以对res进行处理，然后resolve返回
                                resolve(res);
                            },
                            fail: function (error) {
                                reject(error);
                            },
                            complete: function (res) {
                                wx.hideLoading();
                            },
                        })
                    });
                };
                promiseFuncArr.push(promiseTemp)
            }

            sequenceTasks(promiseFuncArr).then((result) => {
                console.log(result);
                result.map(v => {
                    imgarr.push(JSON.parse(v.data).data.src);
                });
                wx.hideLoading();
                success && success(imgarr);
                //对返回的result数组进行处理
            });
        }
    })
}

function getsys(key) { //获取本地存储
    return wx.getStorageSync(key);
}

function setsys(key, value) { //设置本地存储
    wx.setStorageSync(key, value);
}

function delsys(key) { //删除本地存储
    wx.removeStorageSync(key);
}

// 判断链接是否是https
function ishttps(url) {
    if (url.slice(0, 5) == 'https') {
        return true;
    } else {
        return false;
    }
}

function gourl(url) { //跳转到指定页面  如果是网址链接 /pages/webview/index 跳转到这个页面打开
    if (!url || url.length == 0) {
        return false;
    }
    if (ishttps(url)) {
        wx.navigateTo({
            url: '/pages/webview/index?url=' + url
        });
    } else {
        wx.navigateTo({
            url: url
        });
    }
}
function gotab(url) { //跳转tabBar页面
    if (!url || url.length == 0) {
        return false;
    }
    wx.switchTab({
        url: url
    });
}
/**
 *  把html转义成HTML实体字符
 */
function htmlEncode(str) {
    var s = "";
    if (str.length === 0) {
        return "";
    }
    s = str.replace(/&/g, "&");
    s = s.replace(/</g, "<");
    s = s.replace(/>/g, ">");
    s = s.replace(/ /g, " ");
    s = s.replace(/\'/g, "&#39;"); //IE下不支持实体名称
    s = s.replace(/\"/g, """);
    return s;
}
/**
 *  转义字符还原成html字符
 */
function htmlRestore(str) {
    var s = "";
    if (str.length === 0) {
        return "";
    }
    s = str.replace(/&/g, "&");
    s = s.replace(/</g, "<");
    s = s.replace(/>/g, ">");
    s = s.replace(/ /g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/"/g, "\"");
    return s;
}
/**
 * 去掉所有的html标签和 之类的特殊符合
 */
function deleteHtmlTag(str) {
    str = str.replace(/<[^>]+>|&[^>]+;/g, "").trim();
    return str;
}

// 微信小程序rich-text富文本图片自适应处理
function richtext(data) {
    var result = data;
    result = result.replace(/section/gi, 'div');
    result = result.replace(/data-src/gi, 'src');
    result = result.replace(/src="data:/gi, 'data-src="data:');


    result = result.replace(/<img[^>]*>/gi, function (match, capture) {
        var match = match.replace(/style/gi, 'styles');
        return match;
        console.log(match);
    });
    result = result.replace(/\<img/gi, '<img style="max-width:100%!important;height:auto!important;display:block;" ');


    return result;
}
// 获取 自定义  data 属性
function tapinfo(e) {
    return e.currentTarget.dataset;
}
/**
 * 获取php 时间戳 几小时之前
 */
function getDateDiff(dateStr) {
    var publishTime = parseInt(dateStr) * 1000,
        d_seconds,
        d_minutes,
        d_hours,
        d_days,
        timeNow = parseInt(new Date().getTime()),
        d,

        date = new Date(publishTime),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();



    //小于10的在前面补0
    if (M < 10) {
        M = '0' + M;
    }
    if (D < 10) {
        D = '0' + D;
    }
    if (H < 10) {
        H = '0' + H;
    }
    if (m < 10) {
        m = '0' + m;
    }
    if (s < 10) {
        s = '0' + s;
    }
    d = timeNow - publishTime;
    var miao = 1000;
    var minute = miao * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;

    d_days = parseInt(d / day);
    d_hours = parseInt(d / hour);
    d_minutes = parseInt(d / minute);
    d_seconds = parseInt(d / miao);

    if (d_days > 0 && d_days < 7) {
        return d_days + '天前';
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + '小时前';
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + '分钟前';
    } else if (d_seconds < 60) {
        if (d_seconds <= 0) {
            return '刚刚发表';
        } else {
            return d_seconds + '秒前';
        }
    } else if (d_days >= 7 && d_days < 30) {
        return M + '-' + D + ' ' + H + ':' + m;
    } else if (d_days >= 30) {
        return Y + '-' + M + '-' + D + '' + H + ':' + m;
    }
}
// 隐藏银行卡号码
function hidebank(s = "6104021990100952193") {
    return s.replace(/^(\d{8})\d+(\d{4})$/, "$1*******$2");
}
//  隐藏手机号
function hidephone(s = "13335309435") {
    return s.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2");
}

// 小程序 rpx 转 px
function rpxTopx(rpx) {
    return rpx / 750 * wx.getSystemInfoSync().windowWidth;
}

function toBack() {
    // 返回上一页
    wx.navigateBack();
}

/**
 * scene解码
 */
function scene_decode(e) {
    if (e === undefined)
        return {};
    let scene = decodeURIComponent(e),
        params = scene.split(','),
        data = {};
    for (let i in params) {
        var val = params[i].split(':');
        val.length > 0 && val[0] && (data[val[0]] = val[1] || null)
    }
    return data;
}

function wxPay(result) { // 微信支付
    var App = this;
    console.log('微信支付信息', result);
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            timeStamp: result.timestamp,
            nonceStr: result.nonceStr,
            package: result.package,
            signType: 'MD5',
            paySign: result.paySign,
            success: function (res) {
                resolve(res);
            },
            fail: function (e) {
                reject(e);
                console.log('微信支付错误信息：', e);
                // App.showError('订单未支付', function () {
                // const pages = getCurrentPages();
                // const currentPage = pages[pages.length - 1];
                // if (currentPage.route == 'pages/order/submit/index') {
                //     // 跳转到未付款订单
                //     wx.redirectTo({
                //         url: '/pages/order/index/index'
                //     });
                // }
                // });
            },
        });
    })

}

function getImageInfo(url) {
    return new Promise((resolve, reject) => {
        const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
        if (objExp.test(url)) {
            wx.getImageInfo({
                src: url,
                complete: res => {
                    if (res.errMsg === 'getImageInfo:ok') {
                        resolve(res.path)
                    } else {
                        this.triggerEvent('getImage', {
                            errMsg: 'canvasdrawer:download fail'
                        })
                        reject(new Error('getImageInfo fail'))
                    }
                }
            })
        } else {
            resolve(url)
        }
    })
}

function getImagesInfo(views, callback) {
    const imageList = []
    for (let i = 0; i < views.length; i++) {
        imageList.push(this.getImageInfo(views[i]))
    }

    const loadTask = []
    for (let i = 0; i < imageList.length; i++) {
        loadTask.push(new Promise((resolve, reject) => {
            Promise.all(imageList.splice(i * imageList.length, imageList.length)).then(res => {
                resolve(res)
            }).catch(res => {
                reject(res)
            })
        }))
    }

    Promise.all(loadTask).then(res => {
        let tempFileList = []
        for (let i = 0; i < res.length; i++) {
            tempFileList = tempFileList.concat(res[i])
        }
        console.log(tempFileList);
        callback && callback(tempFileList);
    })
}

// 打开文件预览
function opfile(url) {
    wx.downloadFile({
        url: url,
        success(res) {
            var filePath = res.tempFilePath;
            console.log(filePath);
            wx.openDocument({
                filePath: filePath,
                showMenu: true,
                success: function (res) {
                    console.log('打开文档成功')
                },
                fail: function (res) {
                    console.log(res);
                },
                complete: function (res) {
                    console.log(res);
                }
            })
        }
    })
}

// 微信小程序授权登陆
function wxlogin() {
    if (e.detail.errMsg !== 'getUserInfo:ok') {
        return false;
    }
    wx.showLoading({
        title: "正在登录",
        mask: true
    });
    return new Promise((resolve, reject) => {
        wx.login({
            success: function (data) {
                console.log(data);
                // 执行微信登录
                app.http.post(config.login, {
                    code: data.code,
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                }).then((d) => {
                    console.log(d);
                    if (d.code == 0) {
                        setsys('openid', d.msg.openid);
                        setsys('userinfo', d.msg);
                        resolve(d);
                    }
                    if (d.code == 1) {
                        reject(d);
                    }
                })
            }
        });
    })
}

// 手机号授权
function wxphone() {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
        return false;
    }
    wx.showLoading({
        title: "正在登录",
        mask: true
    });
    return new Promise((resolve, reject) => {
        wx.login({
            success: function (data) {
                console.log(data);
                // 执行微信登录
                app.http.post(config.phone, {
                    code: data.code,
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                }).then((d) => {
                    console.log(d);
                    if (d.code == 0) {
                        setsys('phone', d.data.phoneNumber);
                        resolve(d);
                    }
                    if (d.code == 1) {
                        reject(d);
                    }
                })
            }
        });
    })
}
//检测用户是否登录
function checkOpenid() {
    if (!getsys('openid')) {
        gourl(`/pages/login/index`);
        return false;
    }
}
// 检测时间是否过期
function checkTime(endtime) {
    console.log(endtime);

    var nowD = new Date(), //当前时间
        endD = new Date(endtime); //对比时间
    if (nowD.getTime() > endD.getTime()) {
        return true;
    }
    return false;
}


module.exports = {
    checkTime: checkTime,
    checkOpenid: checkOpenid,
    opfile: opfile,
    wxlogin: wxlogin,
    wxphone: wxphone,
    getImageInfo: getImageInfo,
    getImagesInfo: getImagesInfo,
    wxPay: wxPay,
    scene_decode: scene_decode,
    toBack: toBack,
    rpxTopx: rpxTopx,
    hidephone: hidephone,
    hidebank: hidebank,
    updateManager: updateManager,
    getRect: getRect,
    checkFullSucreen: checkFullSucreen,
    formatTime: formatTime,
    removeAllSpace: removeAllSpace,
    random: random,
    success: success,
    alert: alert,
    msg: msg,
    confirm: confirm,
    urlEncode: urlEncode,
    uploadFile: uploadFile,
    chooseImage: chooseImage,
    getsys: getsys,
    setsys: setsys,
    delsys: delsys,
    gourl: gourl,
    gotab: gotab,
    htmlEncode: htmlEncode,
    deleteHtmlTag: deleteHtmlTag,
    htmlRestore: htmlRestore,
    richtext: richtext,
    tapinfo: tapinfo,
    getDateDiff: getDateDiff,
}
```

## 授权拒绝

> 微信小程序授权拒绝之后解决方法

```js
    saveImageToPhotosAlbum(option) {
        return new Promise((resolve, reject) => {
            wx.saveImageToPhotosAlbum({
                ...option,
                success: resolve,
                fail: reject,
            })
        })
    },
    save() {
        var that = this;
        this.saveImageToPhotosAlbum({
            filePath: that.data.previewImageUrl
        }).then(() => {
            wx.showToast({
                icon: 'none',
                title: '分享图片已保存至相册',
                duration: 2000
            })
        }).catch((err) => {
            console.log(err)
            let errMsg = err.errMsg
            let msg = ''
            if (errMsg === "saveImageToPhotosAlbum:fail:auth denied" || errMsg === "saveImageToPhotosAlbum:fail auth deny" || errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
                // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                that.imageErrorAuth()
            } else {
                msg = '保存失败'
            }
            if (msg) {
                wx.showToast({
                    title: msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    imageErrorAuth() {
        // 授权失败 提示授权操作
        wx.showModal({
            title: '提示',
            content: '需要您授权保存至相册',
            showCancel: false,
            success: modalSuccess => {
                wx.openSetting({
                    success(settingData) {
                        console.log("settingData", settingData)
                        if (settingData.authSetting['scope.writePhotosAlbum']) {
                            wx.showModal({
                                title: '提示',
                                content: '获取权限成功,再次保存图片即可',
                                showCancel: false
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '获取权限失败，将无法保存到相册',
                                showCancel: false
                            })
                        }
                    },
                    fail(failData) {
                        console.log("failData", failData)
                    },
                    complete(finishData) {
                        console.log("finishData", finishData)
                    }
                })
            }
        })
    },
```

## 微信小程序 new Date()

> 微信小程序 new Date() 方法在iOS设备上无效的问题的解决方法

```js
    let date = "2021-01-04 00:00"
    let now = new Date(date.replace(/-/g,'/'))
```

## 小程序分包加载

### 1.1 小程序的限制

1. 正常情况下，小程序对代码包的限制是：大小不超过 2M，超过这个大小无法预览，也无法上传代码
2. 做了分包加载的情况下，限制是：每个包大小不超过 2M，所有包总共的大小不超过 16M。

### 1.2 按照逻辑划分项目页面

```js
// tabBar(放入主包)
"pages/index/index",
"pages/logs/logs"

// packageA(分包)
"pages/parent/parent",
"pages/child/child"
```

### 1.3 在 app.json 中配置路径

配置一个 subpackages 属性，值为一个数组。 数组中的每个对象都是一个分包。 每个分包中，需要配置几个属性：

1. root: 这个分包的根路径
2. Pages: 这个分包中的页面路径，其中页面路径为分包根路径的相对路径

```js
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
  ],
	"subpackages": [
    {
      "root": "pages/packageA",
      "pages": [
        "child/child",
        "parent/parent"
      ]
    }
  ],
}
```

### 1.4 保存页面后，生成对应的文件目录

配置完 app.json 文件，保存后，会发现自动生成了对应目录，如下：

![](/Users/xuzhixin/code/aweixin/_media/WX20230220-114430.png)

### 1.5 项目中使用路径

到了这一步，其实分包已经配置完成了，但是还有一个问题需要解决： 更改项目中的引用路径，如： 原来引用的路径是这样的

```js
gotoChild() {
    wx.navigateTo({
      url: '/pages/child/child',
    })
}
```

需要更改成最新路径：

```js
gotoChild() {
    wx.navigateTo({
      url: '/pages/packageA/child/child',
    })
}
```
