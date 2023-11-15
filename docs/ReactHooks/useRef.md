useRef 函数返回一个可变的 ref 对象，该对象只有一个 **current** 属性。可以在调用 useRef 函数时为其指定初始值。并且这个返回的 ref 对象在组件的整个生命周期内保持不变。语法格式如下：

```javaScript
// 1. 导入 useRef

import { useRef } from 'react'

// 2. 调用 useRef 创建 ref 对象

const refObj = useRef(初始值)

// 3. 通过 ref.current 访问 ref 中存储的值

console.log(refObj.current)
```

useRef 函数用来解决以下两个问题：

1. 获取 **DOM 元素**或**子组件**的实例对象；
2. 存储渲染周期之间**共享的数据**；

### 获取 DOM元素的实例

下面的代码演示了如何获取 Input 元素的实例，并调用其 DOM API。

```javaScript
import React, { useRef } from 'react'

export const InputFocus: React.FC = () => {

  // 1. 创建 ref 引用

  const iptRef = useRef<HTMLInputElement>(null)

  const getFocus = () => {

    // 3. 调用 focus API，让文本框获取焦点

    iptRef.current?.focus()

  }

  return (

    <>

      {/* 2. 绑定 ref 引用 */}

      <input type="text" ref={iptRef} />

      <button onClick={getFocus}>点击获取焦点</button>

    </>

  )

}
```

### 存储渲染周期之间的共享数据

基于 useRef 创建名为 `prevCountRef` 的数据对象，用来存储上一次的旧 count 值。每当点击按钮触发 count 自增时，都把最新的旧值赋值给 `prevCountRef.current` 即可：

```javaScript
export const Counter: React.FC = () => {

  // 默认值为 0

  const [count, setCount] = useState(0)

  // 默认值为 undefined

  const prevCountRef = useRef<number>()

  const add = () => {

    // 点击按钮时，让 count 值异步 +1

    setCount((c) => c + 1)

    // 同时，把 count 所代表的旧值记录到 prevCountRef 中

    prevCountRef.current = count

  }

  return (

    <>

      <h1>

        新值是：{count}，旧值是：{prevCountRef.current}

      </h1>

      <button onClick={add}>+1</button>

    </>

  )

}
```

### 注意事项

#### 1. 组件 rerender 时 useRef 不会被重复初始化

在 **RefTimer** 组件中，点击 **+1 按钮**，会让 count 值自增，**从而触发 RefTimer 组件的 rerender**。但是，我们发现 RefTimer 组件中的时间戳保持不变，这说明组件每次渲染，**不会重复调用 useRef 函数进行初始化**。示例代码如下：

```javaScript
export const RefTimer: React.FC = () => {

  const [count, setCount] = useState(0)

  const time = useRef(Date.now())

  console.log('组件被渲染了')

  return (

    <>

      <h3>

        count值是：{count}, 时间戳是：{time.current}

      </h3>

      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>

    </>

  )

}
```

#### 2. ref.current 变化时不会造成组件的 rerender

点击**给 ref 赋新值**的按钮时，为 `time.current` 赋新值，执行的结果是：

1. 终端中输出了最新的 `time.current` 的值
2. 没有触发 **RefTimer** 组件的 rerender

这证明了 ref.current 变化时不会造成组件的 rerender，示例代码如下：

```javaScript
export const RefTimer: React.FC = () => {

  const [count, setCount] = useState(0)

  const time = useRef(Date.now())

  const updateTime = () => {

    time.current = Date.now()

    console.log(time.current)

  }

  console.log('组件被渲染了')

  return (

    <>

      <h3>

        count值是：{count}, 时间戳是：{time.current}

      </h3>

      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>

      <button onClick={updateTime}>给ref赋新值</button>

    </>

  )

}
```

#### 3. ref.current 不能作为其它 Hooks 的依赖项

由于 ref.current 值的变化不会造成组件的 rerender，而且 React 也不会跟踪 ref.current 的变化，因此 ref.current 不可以作为其它 hooks（useMemo、useCallback、useEffect 等） 的依赖项。

```javaScript
export const RefTimer: React.FC = () => {

  const [count, setCount] = useState(0)

  const time = useRef(Date.now())

  const updateTime = () => {

    time.current = Date.now()

    console.log(time.current)

  }

  console.log('组件被渲染了')

  useEffect(() => {

    console.log('time 的值发生了变化：' + time.current)

  }, [time.current])

  return (

    <>

      <h3>

        count值是：{count}, 时间戳是：{time.current}

      </h3>

      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>

      <button onClick={updateTime}>给ref赋新值</button>

    </>

  )

}
```

在上面的代码中，组件首次渲染完成后，必然会触发一次 useEffect 的执行。但是，当 time.current 发生变化时，并不会触发 useEffect 的重新执行。因此，不能把 ref.current 作为其它 hooks 的依赖项。

