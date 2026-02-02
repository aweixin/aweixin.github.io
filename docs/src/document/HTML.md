# HTML

## postcss-px-to-viewport-8-plugin

[postcss-px-to-viewport-8-plugin](https://www.npmjs.com/package/postcss-px-to-viewport-8-plugin)


> 将 px 单位转换为视口单位的 (vw, vh, vmin, vmax) 的 PostCSS 插件

## px-to-viewport

```base
npm install postcss-px-to-viewport-8-plugin -D
```

package.json

```json
{
  "name": "blog",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "dev": "NODE_ENV=pc npx tailwindcss -i ./lib/main.css -o ./src/css/app.css --watch"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "autoprefixer": "^10.4.19",
    "gulp": "^5.0.0",
    "gulp-less": "^5.0.0",
    "gulp-postcss": "^10.0.0",
    "postcss": "^8.4.38",
    "postcss-px-to-viewport-8-plugin": "^1.2.5",
    "tailwindcss": "^3.4.4"
  }
}

```

文件目录

```base
- 项目
    - lib 
        main.css
    - src
        - css 
            app.css
    gulpfile.js
    package.json
    tailwind.config.js
    postcss.config.js
```

### 移动端使用

```js
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const config = require('postcss-px-to-viewport-8-plugin')({
    viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
    // viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定为1334，也可以不配置
    unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
    viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
    selectorBlackList: ['.ignore', '.hairlines'], // 指定不需要转换的类
    minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位
    mediaQuery: false, // 允许在媒体查询中转换`px`
    exclude: /(\/|\\)(node_modules)(\/|\\)/ // 排除指定的文件（目录）
})
const less = require('gulp-less');
const tailwind = require('tailwindcss');


gulp.task('css', function () {
    return gulp.src('./lib/mobile.css') // 指定要处理的 CSS 文件路径
        .pipe(postcss([tailwind]))
        // .pipe(less())
        .pipe(postcss([config])) // 使用 PostCSS 插件进行处理
        .pipe(gulp.dest('./src/mobile/css')); // 输出处理后的 CSS 文件到指定目录
});

gulp.task('watch', function () {
    gulp.watch('./lib/mobile.css', gulp.series('css')); // 监听 CSS 文件变化并执行 CSS 任务
    gulp.watch('./src/mobile/**.html', gulp.series('css')); // 监听页面class
});

gulp.task('default', gulp.series('css', 'watch')); // 默认任务，先执行 CSS 任务，再启动监听任务

```

tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: process.env.NODE_ENV === 'pc' ? ["./src/**/*.{html,js}"] : ['./src/mobile/**/*.{html,js}'],
    theme: {
        extend: {
            colors: {
                // 文字选中颜色
                'active-color': '#DF203D',
                '333': '#333',
                '666': '#666',
                '999': '#999',
            },
            width: {
                '1200': '1200px',
            },
            lineClamp: {
                1: '1',
                2: '2',
                3: '3',
                4: '4',
                5: '5',
                6: '6',
                7: '7',
                8: '8',
                9: '9',
                10: '10',
            },
        },
    },
    plugins: [],
}
```

postcss.config.js

```js
module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    }
}
```