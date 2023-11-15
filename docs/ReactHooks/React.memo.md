当父组件被重新渲染的时候，也会触发子组件的重新渲染，这样就多出了无意义的性能开销。如果子组件的状态没有发生变化，则子组件是不需要被重新渲染的。

在 React Hooks 中，我们可以使用 `React.memo` 来解决上述的问题，从而达到提高性能的目的。

`React.memo` 的语法格式如下：

```javaScript
const 组件 = React.memo(函数式组件)
```

例如，在下面的代码中，父组件声明了 `count` 和 `flag` 两个状态，子组件依赖于父组件通过 props 传递的 `num`。当父组件修改 flag 的值时，会导致子组件的重新渲染：

```javaScript
import React, { useEffect, useState } from 'react'

// 父组件

export const Father: React.FC = () => {

  // 定义 count 和 flag 两个状态

  const [count, setCount] = useState(0)

  const [flag, setFlag] = useState(false)

  return (

    <>

      <h1>父组件</h1>

      <p>count 的值是：{count}</p>

      <p>flag 的值是：{String(flag)}</p>

      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>

      <button onClick={() => setFlag((prev) => !prev)}>Toggle</button>

      <hr />

      <Son num={count} />

    </>

  )

}

// 子组件：依赖于父组件通过 props 传递进来的 num

export const Son: React.FC<{ num: number }> = ({ num }) => {

  useEffect(() => {

    console.log('触发了子组件的渲染')

  })

  return (

    <>

      <h3>子组件 {num}</h3>

    </>

  )

}
```

我们使用 `React.memo(函数式组件)` 将子组件包裹起来，只有子组件依赖的 props 发生变化的时候，才会触发子组件的重新渲染。示例代码如下：

```javaScript
// 子组件：依赖于父组件通过 props 传递进来的 num

export const Son: React.FC<{ num: number }> = React.memo(({ num }) => {

  useEffect(() => {

    console.log('触发了子组件的渲染')

  })

  return (

    <>

      <h3>子组件 --- {num}</h3>

    </>

  )

})
```

