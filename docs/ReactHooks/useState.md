**useState**，能让函数组件拥有自己的状态，因此，它是一个管理状态的 hooks API。通过 useState 可以实现状态的初始化、读取、更新。基本语法格式如下：

```React JSX
const [状态名, set函数] = useState(初始值)
```

其中：状态名所代表的数据，可以被函数组件使用；如果要修改状态名所代表的数据，需要调用 **set 函数** 进行修改。例如：

```React JSX
import { useState } from 'react'

export function Count() {

  // 定义状态 count，其初始值为 0

  // 如果要修改 count 的值，需要调用 setCount(新值) 函数

  const [count, setCount] = useState(0)

  return (

    <>

      <!-- 在函数组件内，使用名为 count 的状态 -->

      <h1>当前的 count 值为：{count}</h1>

      <!-- 点击按钮时，调用 setCount() 函数，为 count 赋新值 -->

      <button onClick={() => setCount(count + 1)}>+1</button>

    </>

  )

}
```

### 状态变化时，会触发函数组件的重新执行

在函数组件中使用 setState 定义状态之后，每当状态发生变化，都会触发函数组件的重新执行，**从而根据最新的数据更新渲染 DOM 结构**。例如：

```React JSX
import { useState } from 'react'

export function Count() {

  // 定义状态 count，其初始值为 0

  // 如果要修改 count 的值，需要调用 setCount(新值) 函数

  const [count, setCount] = useState(0)

  // 每次 count 值发生变化，都会打印下面的这句话：

  console.log('组件被重新渲染了')

  const add = () => {

    setCount(count + 1)

  }

  return (

    <>

      <!-- 在函数组件内，使用名为 count 的状态 -->

      <h1>当前的 count 值为：{count}</h1>

      <!-- 点击按钮时，在 add 处理函数中，调用 setCount() 函数，为 count 赋新值 -->

      <button onClick={add}>+1</button>

    </>

  )

}
```

> 注意：当函数式组件被重新执行时，不会重复调用 useState() 给数据赋初值，而是会复用上次的 state 值。

### 以函数的形式为状态赋初始值

在使用 useState 定义状态时，除了可以**直接给定初始值**，还可以通过**函数返回值**的形式，为状态赋初始值，语法格式如下：

```React JSX
const [value, setValue] = useState(() => 初始值)
```

例如：

```React JSX
export const DateCom: React.FC = () => {

  // const [date] = useState({ year: 2023, month: 9, day: 11 })

  const [date, setDate] = useState(() => {

    const dt = new Date()

    return { year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate() }

  })

  return (

    <>

      <h1>今日信息：</h1>

      <p>年份：{date.year}年</p>

      <p>月份：{date.month}月</p>

      <p>日期：{date.day}日</p>

    </>

  )

}
```

> 注意：以函数的形式为状态赋初始值时，只有组件首次被渲染才会执行 fn 函数；当组件被更新时，会以更新前的值作为状态的初始值，赋初始值的函数不会执行。

### useState 是异步变更状态的

调用 useState() 会返回一个**变更状态的函数**，这个函数内部是以**异步的形式**修改状态的，所以修改状态后**无法立即拿到最新的状态**，例如：

```React JSX
export const Count: React.FC = () => {

  const [count, setCount] = useState(() => 0)

  const add = () => {

    // 1. 让数值自增+1

    setCount(count + 1)

    // 2. 打印 count 的值

    console.log(count)

  }

  return (

    <>

      <h1>当前的 count 值为：{count}</h1>

      <button onClick={add}>+1</button>

    </>

  )

}
```

在上述代码的第8行，打印出来的 count 值是更新前的旧值，而非更新后的新值。证明 **useState** 是异步变更状态的。

