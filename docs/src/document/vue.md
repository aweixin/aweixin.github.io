# Vue

## vue3-select-component

[vue3-select-component](https://www.npmjs.com/package/vue3-select2-component)
> 一个基于 Vue3 的多选组件，支持单选、多选、远程搜索、分组、标签展示、自定义标签、自定义样式、自定义选项等。

通过 `patch-package` 适配  [下载 patch-package包](/docs/public/patches.zip)

## 单元测试

[Vitest](https://cn.vitest.dev/)
> Vitest 是一个 Vite 插件，它使用 Vite 的编译器来执行测试。

```bash
npm install -D vitest
```

`package.json` 执行测试命令

```bash
"scripts": {
    "test": "vitest"
}
```

`vitest.config.ts`

```javascript
import {fileURLToPath} from 'node:url'
import {mergeConfig, defineConfig, configDefaults} from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, 'e2e/**'],
            root: fileURLToPath(new URL('./', import.meta.url))
        }
    })
)

```

方法测试

```javascript
import {describe, it, expect} from 'vitest'
import {add} from '../src/utils/math'

describe('add', () => {
    it('adds 1 + 2 to equal 3', () => {
        expect(add(1, 2)).toBe(3)
        expect(add(2, 2)).toBe(4)
    }
}
```

组件测试

```bash
npm install -D @vue/test-utils
```

组件测试实例

```javascript
import {mount} from '@vue/test-utils'
import HelloWorld from './components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
    it('renders props.msg when passed', () => {
        const msg = 'new message'
        const wrapper = mount(HelloWorld, {
            props: {msg}
        }
        expect(wrapper.text()).toMatch(msg)
    }
}
```

## 全局组件安装

> components.ts 声明组件

```javascript
import type {App} from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'

const components = [
    HelloWorld,
    // ...
]

export function initComponents(app: App) {
    components.forEach(component => {
        app.component(component, component)
    }
}
```

```javascript
import initComponents from '@/core/helpers/components'

// main.ts 
import {createApp} from 'vue'

const app = createApp(App)
initComponents(app);
```

## pinia 状态管理

[pinia](https://pinia.vuejs.org/)
> Pinia 是一个轻量级的 Vue 状态管理库，它使用 Proxy 语法来创建响应式状态，并使用 TypeScript 的类型推断来提供类型安全。

```bash
npm install pinia
```

```javascript
// 初始化pinia
import initPinia from '@/core/helpers/pinia';

const app = createApp(App);
initPinia(app);
```

初始化pinia

```javascript
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

export function initPinia(app: App) {
    pinia.use(piniaPluginPersistedstate)
    app.use(pinia)
}
```

```javascript
import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useStore = defineStore('main', () => {
        const someState = ref('你好 pinia')
        return {someState}
    },
    {
        persist: true,
    },
)
```

## 地址智能识别

[smartParsePro](https://github.com/wzc570738205/smartParsePro)
> 智能识别收货地址（支持省市区县街道/姓名/电话/邮编识别）
> 安装使用

```bash
npm install address-smart-parse
```

```javascript
import smart from 'address-smart-parse'

smart("陕西省西安市雁塔区太白路西段1号 刘三娘 13590000018 211381000012096810")

```

返回格式：

```js
{
    province: 陕西省
    provinceCode: 61
    city: 西安市
    cityCode: 6101
    county: 雁塔区
    countyCode: 610113
    address: 太白路西段1号
    name: 刘三娘
    phone: 11381000012
}
```

