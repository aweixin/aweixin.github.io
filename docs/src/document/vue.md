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