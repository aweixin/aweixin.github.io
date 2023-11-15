直接使用 ref 获取 DOM 实例，会全面暴露 DOM 实例上的 API，从而导致外部使用 ref 时有更大的自由度。在实际开发中，我们应该严格控制 ref 的暴露颗粒度，控制它能调用的方法，只向外暴露主要的功能函数，其它功能函数不暴露。

React 官方提供 useImperativeHandle 的目的，就是让你在使用 ref 时可以自定义暴露给外部组件哪些功能函数或属性。

它的语法结构如下：

```javaScript
useImperativeHandle(通过forwardRef接收到的父组件的ref对象, () => 自定义ref对象, [依赖项数组])
```

其中，第三个参数（依赖项数组）是可选的。

### useImperativeHandle 的基本使用

在被 `React.forwardRef()` 包裹的组件中，需要结合 `useImperativeHandle` 这个 hooks API，向外按需暴露子组件内的成员：

```javaScript
import React, { useRef, useState, useImperativeHandle } from 'react'

// 子组件

const Child = React.forwardRef((_, ref) => {

  const [count, setCount] = useState(0)

  const add = (step: number) => {

    setCount((prev) => (prev += step))

  }

  // 1. 向外暴露一个空对象

  // 2. useImperativeHandle(ref, () => ({}))

  // 向外暴露一个对象，其中包含了 name 和 age 两个属性

  useImperativeHandle(ref, () => ({

    name: 'liulongbin',

    age: 22

  }))

  return (

    <>

      <h3>Child 子组件 {count}</h3>

      <button onClick={() => add(-1)}>-1</button>

      <button onClick={() => add(1)}>+1</button>

    </>

  )

})
```

### 基于 useImperativeHandle 按需向外暴露成员

在子组件中，向外暴露 count 和 setCount 这两个成员：

```javaScript
// 子组件

const Child = React.forwardRef((_, ref) => {

  const [count, setCount] = useState(0)

  const add = (step: number) => {

    setCount((prev) => (prev += step))

  }

  // 向外暴露 count 的值和 setCount 函数

  useImperativeHandle(ref, () => ({

    count,

    setCount

  }))

  return (

    <>

      <h3>Child 子组件 {count}</h3>

      <button onClick={() => add(-1)}>-1</button>

      <button onClick={() => add(1)}>+1</button>

    </>

  )

})
```

在父组件中，添加一个重置按钮，当点击重置按钮时，调用 ref 向外暴露的 setCount 函数，把子组件内部的 count 重置为 0。示例代码如下：

```javaScript
// 父组件

export const Father: React.FC = () => {

  const childRef = useRef<{ count: number; setCount: (value: number) => void }>(null)

  // 按钮的点击事件处理函数

  const onShowRef = () => {

    console.log(childRef.current)

  }

  // 重置按钮的点击事件处理函数

  const onReset = () => {

    childRef.current?.setCount(0)

  }

  return (

    <>

      <h1>Father 父组件</h1>

      {/* 点击按钮，打印 ref 的值 */}

      <button onClick={onShowRef}>show Ref</button>

      {/* 点击按钮，重置数据为 0 */}

      <button onClick={onReset}>重置</button>

      <hr />

      <Child ref={childRef} />

    </>

  )

}
```

### 控制成员暴露的粒度

在 Child 子组件中，我们希望对外暴露一个重置 `count` 为 0 的函数，而不希望直接把 `setCount()` 暴露出去，因为父组件调用 `setCount()` 时可以传任何数值。因此，我们可以基于 useImperativeHandle，向外提供一个 `reset()` 函数而非直接把 `setCount()` 暴露出去：

```javaScript
// 子组件

const Child = React.forwardRef((_, ref) => {

  const [count, setCount] = useState(0)

  const add = (step: number) => {

    setCount((prev) => (prev += step))

  }

  // 向外暴露 count 的值和 reset 函数

  useImperativeHandle(ref, () => ({

    count,

    // 在组件内部封装一个重置为 0 的函数，API 的粒度更小

    reset: () => setCount(0)

  }))

  return (

    <>

      <h3>Child 子组件 {count}</h3>

      <button onClick={() => add(-1)}>-1</button>

      <button onClick={() => add(1)}>+1</button>

    </>

  )

})
```

在父组件中，调用 ref.current.reset() 即可把数据重置为 0：

```javaScript
// 父组件

export const Father: React.FC = () => {

  const childRef = useRef<{ count: number; reset: () => void }>(null)

  // 按钮的点击事件处理函数

  const onShowRef = () => {

    console.log(childRef.current)

  }

  // 重置按钮的点击事件处理函数

  const onReset = () => {

    childRef.current?.reset()

  }

  return (

    <>

      <h1>Father 父组件</h1>

      {/* 点击按钮，打印 ref 的值 */}

      <button onClick={onShowRef}>show Ref</button>

      {/* 点击按钮，重置数据为 0 */}

      <button onClick={onReset}>重置</button>

      <hr />

      <Child ref={childRef} />

    </>

  )

}
```

### useImperativeHandle 的第三个参数

再来回顾一下 useImperativeHandle 的参数项：

```javaScript
useImperativeHandle(ref, createHandle, [deps])
```

- 第一个参数为父组件传递的 ref。
- 第二个参数是一个函数，返回的对象会自动绑定到 ref 上。 即子组件可以将自己内部的方法或者值通过 useImperativeHandle 添加到父组件中 useRef 定义的对象中。
- 第三个参数是**函数依赖的值**（可选）。若 createHandle 函数中**使用到了子组件内部定义的变量**，则还需要将该变量作为**依赖变量**成为 useImperativeHandle 的第3个参数。

其中，第三个参数有3种用法：

1. **空数组**：只在子组件首次被渲染时，执行 `useImperativeHandle` 中的 fn 回调，从而把 return 的对象作为父组件接收到的 ref。例如：

```javaScript
import React, { useState, useImperativeHandle } from 'react'

// 子组件

const Child = React.forwardRef((_, ref) => {

  const [count, setCount] = useState(0)

  const add = (step: number) => {

    setCount((prev) => (prev += step))

  }

  // 向外暴露 count 的值和 reset 函数

  useImperativeHandle(

    ref,

    () => {

      // 这个 console 只执行1次，哪怕 count 值更新了，也不会重新执行

      // 导致的结果是：外界拿到的 count 值，永远是组件首次渲染时的初始值 0

      console.log('执行了 useImperativeHandle 的回调')

      return {

        count,

        reset: () => setCount(0)

      }

    },

    []

  )

  return (

    <>

      <h3>Child 子组件 {count}</h3>

      <button onClick={() => add(-1)}>-1</button>

      <button onClick={() => add(1)}>+1</button>

    </>

  )

})
```
2. **依赖项数组**：子组件首次被渲染时，会依赖项改变时，会执行 `useImperativeHandle` 中的 fn 回调，从而让父组件通过 ref 能拿到依赖项的新值。例如：

```javaScript
import React, { useState, useImperativeHandle } from 'react'

// 子组件

const Child = React.forwardRef((_, ref) => {

  const [count, setCount] = useState(0)

  const [flag, setFlag] = useState(false)

  const add = (step: number) => {

    setCount((prev) => (prev += step))

  }

  // 向外暴露 count 的值和 reset 函数

  useImperativeHandle(

    ref,

    () => {

      // 每当依赖项 count 值变化，都会触发这个回调函数的重新执行

      // 因此，父组件能拿到变化后的最新的 count 值

      console.log('执行了 useImperativeHandle 的回调')

      return {

        count,

        reset: () => setCount(0)

      }

    },

    // 注意：只有 count 值变化，才会触发回调函数的重新执行

    // flag 值的变化，不会导致回调函数的重新执行，因为 flag 没有被声明为依赖项

    [count]

  )

  return (

    <>

      <h3>Child 子组件 {count}</h3>

      <p>flag 的值是：{String(flag)}</p>

      <button onClick={() => add(-1)}>-1</button>

      <button onClick={() => add(1)}>+1</button>

      {/* 点击按钮，切换布尔值 */}

      <button onClick={() => setFlag((boo) => !boo)}>Toggle</button>

    </>

  )

})
```
3. **省略依赖项数组**（省略第三个参数）：此时，组件内任何 state 的变化，都会导致 `useImperativeHandle` 中的回调的重新执行。示例代码如下：

```javaScript
import React, { useState, useImperativeHandle } from 'react'

// 子组件

const Child = React.forwardRef((_, ref) => {

  const [count, setCount] = useState(0)

  const [flag, setFlag] = useState(false)

  const add = (step: number) => {

    setCount((prev) => (prev += step))

  }

  // 向外暴露 count 的值和 reset 函数

  useImperativeHandle(ref, () => {

    // 只要组件内的任何 state 发生变化，都会触发回调函数的重新执行

    console.log('执行了 useImperativeHandle 的回调')

    return {

      count,

      reset: () => setCount(0)

    }

  })

  return (

    <>

      <h3>Child 子组件 {count}</h3>

      <p>flag 的值是：{String(flag)}</p>

      <button onClick={() => add(-1)}>-1</button>

      <button onClick={() => add(1)}>+1</button>

      {/* 点击按钮，切换布尔值 */}

      <button onClick={() => setFlag((boo) => !boo)}>Toggle</button>

    </>

  )

})
```

陷阱1：**不要滥用 ref。** 你应当仅在你没法通过 prop 来表达 *命令式* 行为的时候才使用 ref：例如，滚动到指定节点、聚焦某个节点、触发一次动画，以及选择文本等等。



陷阱2：**如果可以通过 prop 实现，那就不应该使用 ref**。

例如，你不应该从一个 `Model` 组件暴露出 `{open, close}` 这样的命令式句柄，最好是像 `<Modal isOpen={isOpen} />` 这样，将 `isOpen` 作为一个 prop。[副作用](https://zh-hans.react.dev/learn/synchronizing-with-effects) 可以帮你通过 prop 来暴露一些命令式的行为。

