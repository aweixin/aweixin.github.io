# Vue

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

vitest.config.ts

```javascript
import type {UserConfig as VitestUserConfigInterface} from "vitest/config";

const vitestConfig: VitestUserConfigInterface = {
    test: {
        globals: true,
        environment: "jsdom"
    }
};

export default defineConfig({
    ...vitestConfig,
    // ...
});
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