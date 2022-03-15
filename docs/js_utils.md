# burries

一个 JS 工具库

## 使用方式

```shell
npm install h-bunny

```

```javascript
// es6模块系统
import { onHashChange } from "h-bunny";
onHashChange(() => console.log("onHashChange"));

// 浏览器
// 引入
<script src="h-bunny.min.js"></script>;
// 使用
utils.onHashChange(() => console.log("HashChange"));
```

## utils

### arrayEqual

#### 参与比较的两个数组，如果每个元素都相等，返回 true,否则返回 false

#### 参数

- 参与比较的两个数组

```javascript
console.log(arrayEqual([1, 2], [1, 2])); // true
```

### isNetAvailable

#### 检测当前环境网络状态,接受对象参数

#### 参数

- code： 无网络时的状态码（自定义）

```javascript
setInterval(() => {
  utils
    .isNetAvailable(-1)
    .then(() => {
      console.log("网络正常");
    })
    .catch((err) => {
      if (err.code === -1) {
        console.log("网络错误");
      }
    });
}, 1000);
```

### onError

#### 捕获页面的 JS 报错或者 Promise 错误(reject)事件，同时监听了 onerror 与 onunhandledrejection。

#### 参数

- 回调函数，任何一种错误触发，都会执行此回调函数

```javascript
const callback = (e) => {
  console.log(e);
};
try {
  console.log(a);
} catch (error) {
  utils.onError(callback);
}
```

### onVisibilityChange

#### 监听页面是否在前台显示（如果该页面只是被其它窗口挡住,document.hidden 仍然为 False）

#### 参数

- visibilityCallback ： 页面前台展示时候的回调函数
- hiddenCallback：页面被隐藏时候的回调函数

### locateByBaidu

#### 利用百度地图获取当前定位，返回一个携带当前定位经纬度的 promise

#### 参数

- 百度地图 ak

```javascript
locateByBaidu(your ak).then({lng, lat} => {
  // do sth
})
```

### locationByNavigator

#### H5 navigator 定位方式,返回一个携带当前定位经纬度的 promise

#### 参数

- timeout 超时时间, 默认 5S

```javascript
locationByNavigator().then(({lng, lat} => {
  // do sth
});
```

### jsonp

#### jsonp 方式实现 get 跨域，可用于获取地图等接口数据，返回一个携带返回信息的 promise

#### 参数

- timeout 超时时间, 默认 5S

```javascript
jsonp(
  "api.map.baidu.com/location/ip?ak=${your.ak}&coor=bd09ll&output=jsonp"
).then((res) => res);
```

### loadScript

#### loadScript 方式实现加载 JS 标签

#### 参数

- url

```javascript
loadScript("https://cdn.bootcdn.net/ajax/libs/vue/3.0.11/vue.cjs.js");
```

### utf8_to_b64

#### 将代入参数使用 base64 编码并且返回

#### 参数

- 转码的字符

```javascript
console.log(utf8_to_b64("移植")); // 56e75qSN"
```

### b64_to_utf8

#### 将使用同样规则编码的字符串使用逆规则解码

#### 参数

- 解码的字符

```javascript
console.log(b64_to_utf8("56e75qSN")); // 移植
```

### getCookie

#### 获取 cookie 中的某个字段

```javascript
getCookie("id");
```

### getExplore

#### 获取浏览器的版本，返回浏览器类型和版本

#### 可能得到浏览器的值

- IE
- EDGE
- Firefox
- Chrome
- Opera
- Safari

```javascript
getExplore(); // {browser: "Chrome"version: "90.0.4430.93"}
```

### getOS

#### 获取当前系统类型

#### 可能得到的值

- ios
- android
- windowsPhone
- MacOSX
- windows
- linux

```javascript
getOS(); // MacOSX
```

### isInWeiXin

#### 判断是否在微信环境

```javascript
utils.isInWeiXin(); // chrom 返回 false
```

### isInAlipay

#### 判断是否在支付宝环境

```javascript
utils.isInAlipay(); // chrom 返回 false
```

### getScrollTop

#### 获取窗口滚轴距离顶部的距离并返回

```javascript
getScrollTop();
```

### copyMsg

#### 将浏览器中输入框的内容写入剪切板--仅支持 input 和 textArea

#### 参数

- el: HTML 元素-input 或者 textArea
- callback: 写入剪切板之后的回调

```html
<input id="app" value="123" />
```

```javascript
var app = document.getElementById("app");
copyMsg(app, () => console.log("success")); // 授权剪切板权限之后即可粘贴内容
```

### scrollTo

#### 将当前 window 的滚轴，在某短时间内（ms），纵向滚动到某个位置

#### 参数

- to: 将要滚动到的位置
- duration: 时间段

```typescript
function scrollTo(to: number, duration: number): void;
```

### setScrollTop

#### 设置滚动条距顶部的距离

#### 参数

- to: 设置的位置

```javascript
setScrollTop(100);
```

### windowResize

#### 参数

#### H5 软键盘缩回、弹起回调

- downCallback: 键盘收起时候的回调
- upCallback: 键盘弹出时候的回调

```javascript
windowResize(
  () => console.log("down"),
  () => console.log("up")
);
```

### commaify

#### 给数字中间每 3 位加逗号

```typescript
function commaify(param: string | number): string;
```

```javascript
commaify(1000000); // 10,000,000
```

### filterCard

#### 身份证中间生日日期做掩码

```typescript
function filterCard(param: string | number): string;
```

```javascript
utils.filterCard("410987100018420987") === "4109871000****0987"; // true
```

### filterPhone

#### 电话号码中间四位做掩码

```typescript
function filterPhone(param: string | number): string;
```

```javascript
utils.filterPhone("10801229300") === "108****9300"; // true
```

### digitUppercase

#### 现金金额转大写

```typescript
export function digitUppercase(n: number): string;
```

```javascript
utils.digitUppercase(10801229300.69) ===
  "壹佰零捌亿零壹佰贰拾贰万玖仟叁佰元陆角玖分"; // true
```

### 判断文件类型是否为图片

```typescript
isAssetTypeAnImage(File file)
```

### 判断文件大小是不是超出范围

- 单位：M

```typescript
valiadateSize(File file, Number maxSize)
```

### formatTime

#### 将代入的毫秒数计算为天、时、分、秒

```typescript
type dateType = {
  day: number;
  hour: number;
  min: number;
  seconds: number;
};
export function formatTime(timer: number): dateType;
```

```javascript
const timer = formatTime(172800000 + 36000000 + 120000 + 30000);
console.log(timer);
```

### formatDate

#### 格式化时间为各种格式

```typescript
export function formatDate(param: number | Date | string): string;
```

```javascript
utils.formatDate("5/12/2021", "YYYY-MM-DD"); // 2021-05-12
utils.formatDate(1621243936598, "YYYY-MM-DD"); // "2021-05-17"
utils.formatDate(new Date().setDate(1), "YYYY-MM**DD"); // "2021-05**01"
utils.formatDate(new Date().getTime(), "YYYY/MM/DD hh:mm:ss"); // "2021/05/17 05:43:35"
```

### isLeapYear

#### 判断是否是闰年

```typescript
function isLeapYear(year: number): boolean;
```

```javascript
utils.isLeapYear(2021); // false
```

### isSameDay

#### 判断是否是同一天

```typescript
function isSameDay(date1: Date, date2: Date): boolean;
```

```javascript
utils.isSameDay(new Date(), new Date()); // true
```

### debounce

#### 防抖函数-高频触发的事件，如：按钮点击多次，只执行最后一次

- handler: 处理函数
- delay: 时间段，表示 多长时间后执行这一次函数
- immediate: 是否立即执行一次，true 为默认执行一次

```typescript
function debounce(
  handler: Function,
  delay: number,
  immediate: boolean
): Function;
```

#### 普通调用

```javascript
function fun() {
  console.log(1);
}
const d = debounce(fun, 1000, true);
d();
```

#### 绑定 this

```javascript
const obj = {
  value: 1,
  run: function () {
    console.log(this.value);
  },
};
const d = debounce(obj.run.bind(obj), 1000, false);
d();
```

#### 带参数的情形

```javascript
const obj = {
  value: 1,
  run: function (value) {
    console.log(value + 1);
  },
};
const d = debounce(obj.run.bind(obj), 1000, true);
d(1);
```

### throttle

#### 节流，事件在一段时间内按一定频率执行，多用于 resize,input 框输入

- handler: 处理函数
- delay: 执行频率 次/ms

```typescript
function throttle(handler: Function, delay: number): Function;
```

```javascript
let num = 0;
const a = throttle(() => {
  num++;
  console.log("throttle", num);
}, 1000);
```

### once

#### 只执行一次的函数

- handler: 处理函数

```typescript
function once(handler: Function): Function;
```

```javascript
let a = once(() => console.log("aa"));
setInterval(() => {
  a();
}, 1);
```

### getSize

#### 设置 H5 根元素的 font-size

- 用于 rem 布局
- 设计稿宽度 750 物理像素
- dpr = 2(iphone6/7/8 下开发视图)

```typescript
function getSize(base: number): void;
```

```javascript
utils.getSize(40); // iphone6 下 根元素 font-size 为20 px
```

### deepClone

#### 深拷贝对象

```typescript
function deepClone(values: any): any;
```

```javascript
const obj = { a: 1 };
const o = utils.deepClone(obj);

o.a = 2;
```

### isEmptyObject

#### 判断一个对象是否没有一个属性

```typescript
function deepClone(values: any): any;
```

```javascript
const obj = { a: 1 };
const o = utils.deepClone(obj);

o.a = 2;
```

### qsParam

#### 序列化对象为请求参数

```typescript
function qsParam(object: object): string;
```

```javascript
const obj = { a: 1, b: 2 };
utils.qsParam(obj);
// ?a=1&b=2
```

### getTypeof

#### 判断对象的类型

```typescript
function getTypeof(object: any): string;
```

```javascript
utils.getTypeof(new Map([])); // map
```

### isInt

#### 判断是不是一个正整数

```typescript
function isInt(str: string | number): boolean;
```

```javascript
utils.isInt(0); // false
```

### isNumber

#### 判断字符串是不是纯数字字符串

```typescript
function isNumber(str: string | number): boolean;
```

```javascript
utils.isNumber("123a"); // false
```

### isSpecialCode

#### 判断含不含有特殊字符

```typescript
function isSpecialCode(str: string | number): boolean;
```

```javascript
utils.isSpecialCode("埃美柯.-"); // true
```

### isEmail

#### 校验是否是邮箱

```typescript
function isEmail(str: string): boolean;
```

```javascript
utils.isEmail("123"); // false
```

### isIdCard

#### 校验是否是身份证号码

```typescript
function isIdCard(str: string): boolean;
```

```javascript
utils.isIdCard("123"); // false
```

### isPhoneNum

#### 校验是否是电话号码

```typescript
function isPhoneNum(str: string): boolean;
```

```javascript
utils.isPhoneNum("123"); // false
```

### isUrl

#### 校验是否是 URL

```typescript
function isUrl(str: string): boolean;
```

```javascript
utils.isUrl("http://git.daojia-inc.com/"); // true
```

### session

#### window.localStoreage 方法封装

- 没有第二个参数时为存储
- 有第二个参数时为读取，没获取到则返回空字符串''

```typescript
function session(key: string, value?: any): any;
```

```javascript
session("name", "小红"); // true
```

### local

- 用法同 session,是 localStorage 的存取方式

### monthDays

#### 获取代入的时间对象的参数，当前月总共多少天

- 参数为一个时间对象

```typescript
function monthDays(date: Date): number;
```

```javascript
monthDays(new Date("2020/2/11")); // 29
```

### randomNum

#### 生成随机整数

```typescript
function randomNum(min: number, max: number): number;
```

```javascript
randomNum(2.1， 5.1); // 5
```

### getRequest

#### 获取 URL 上的参数

```typescript
function getRequest(param: string, search?: string): string;
```

```javascript
getRequest("page", "?page=1"); // 1
```

### onHashChange

#### 监听 location.hash 变化

```typescript
export function onHashChange(callback: Function): boolean;
```

```javascript
const callback = () => console.log("success");
onHashChange(callback);
```

### onPopState

#### 监听 popstate

### onPushState

#### 监听 pushState

### onReplaceState

#### 监听 replaceState