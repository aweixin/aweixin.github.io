进一步改造前面的案例：我们希望在 `Father` 组件中添加一个“计算属性”，根据 flag 值的真假，动态返回一段文本内容，并把计算的结果显示到页面上。示例代码如下：

```React JSX
// 父组件

export const Father: React.FC = () => {

  // 定义 count 和 flag 两个状态

  const [count, setCount] = useState(0)

  const [flag, setFlag] = useState(false)

  // 根据布尔值进行计算，动态返回内容

  const tips = () => {

    console.log('触发了 tips 的重新计算')

    return flag ? <p>哪里贵了，不要睁着眼瞎说好不好</p> : <p>这些年有没有努力工作，工资涨没涨</p>

  }

  return (

    <>

      <h1>父组件</h1>

      <p>count 的值是：{count}</p>

      <p>flag 的值是：{String(flag)}</p>

      {tips()}

      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>

      <button onClick={() => setFlag((prev) => !prev)}>Toggle</button>

      <hr />

      <Son num={count} />

    </>

  )

}
```

代码编写完毕后，我们点击父组件中的 **+1 按钮**，发现 count 在自增，而 flag 的值不会发生变化。此时也会触发 `tips` 函数的重新执行，这就造成了性能的浪费。我们希望如果 `flag` 没有发生变化，则避免 `tips` 函数的重新计算，从而优化性能。此时需要用到 React Hooks 提供的 **useMemo** API。

### 2. useMemo 的语法格式

useMemo 的语法格式如下：

```React JSX
const memorizedValue = useMemo(cb, array)

const memoValue = useMemo(() => {

  return 计算得到的值

}, [value]) // 表示监听 value 的变化
```

其中：

1. cb：这是一个函数，用于处理计算的逻辑，必须使用 return 返回计算的结果
2. array：这个数组中存储的是依赖项，只要依赖项发生变化，都会触发 cb 的重新执行。使用 array 需要注意以下几点
    - 不传数组，每次更新都会重新计算
    - 空数组，只会计算一次
    - 依赖对应的值，对应的值发生变化时会重新执行 cb

### 3. 使用 useMemo 解决刚才的问题

1. 导入 useMemo：

```React JSX
import React, { useEffect, useState, useMemo } from 'react'
```
2. 在 Father 组件中，使用 `useMemo` 对 `tips` 进行改造：

```React JSX
// 根据布尔值进行计算，动态返回内容

const tips = useMemo(() => {

  console.log('触发了 tips 的重新计算')

  return flag ? 哪里贵了，不要睁着眼瞎说好不好 : 这些年有没有努力工作，工资涨没涨

}, [flag])
```
3. 此时，点击 Father 中的 +1 按钮，并不会触发 `tips` 的重新计算，而是会使用上一次缓存的值进行渲染。只有依赖项 `flag` 变化时，才会触发 `tips` 的重新计算。

