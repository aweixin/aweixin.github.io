### 1. 问题引入

在搜索框案例中，SearchResult 组件会根据用户输入的**关键字**，循环生成大量的 p 标签，因此它是一个渲染比较耗时的组件。代码如下：

```React JSX
import React, { useState } from 'react'

// 父组件

export const SearchBox: React.FC = () => {

  const [kw, setKw] = useState('')

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setKw(e.currentTarget.value)

  }

  return (

    <div style={{ height: 500 }}>

      <input type="text" value={kw} onChange={onInputChange} />

      <hr />

      <SearchResult query={kw} />

    </div>

  )

}

// 子组件，渲染列表项

const SearchResult: React.FC<{ query: string }> = (props) => {

  if (!props.query) return

  const items = Array(40000)

    .fill(props.query)

    .map((item, i) => <p key={i}>{item}</p>)

  return items

}
```

注意，此案例不能使用 `useTransition` 进行性能优化，因为 `useTransition` 会把状态更新标记为**低优先级**，**被标记为 transition 的状态更新将被其他状态更新打断**。因此在高频率输入时，会导致**中间的输入状态丢失**的问题。例如：

```React JSX
import React, { useState, useTransition } from 'react'

// 父组件

export const SearchBox: React.FC = () => {

  const [kw, setKw] = useState('')

  // 1. 调用 useTransition 函数

  const [, startTransition] = useTransition()

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    // 2. 将文本框状态更新标记为“低优先级”，会导致中间的输入状态丢失

    startTransition(() => {

      setKw(e.currentTarget.value)

    })

  }

  return (

    <div style={{ height: 500 }}>

      <input type="text" value={kw} onChange={onInputChange} />

      <hr />

      <SearchResult query={kw} />

    </div>

  )

}

// 子组件，渲染列表项

const SearchResult: React.FC<{ query: string }> = (props) => {

  if (!props.query) return

  const items = Array(40000)

    .fill(props.query)

    .map((item, i) => <p key={i}>{item}</p>)

  return items

}
```

### 2. 语法格式

`useDeferredValue` 提供一个 state 的延迟版本，根据其返回的**延迟的 state** 能够**推迟更新 UI 中的某一部分**，从而达到性能优化的目的。语法格式如下：

```React JSX
import { useState, useDeferredValue } from 'react';

function SearchPage() {

  const [kw, setKw] = useState('');

  // 根据 kw 得到延迟的 kw

  const deferredKw = useDeferredValue(kw);

  // ...

}
```

`useDeferredValue` 的返回值为一个**延迟版的状态**：

1. 在组件首次渲染期间，返回值将与传入的值相同
2. 在组件更新期间，React 将**首先使用旧值**重新渲染 UI 结构，这能够**跳过**某些复杂组件的 rerender，从而**提高渲染效率**。随后，React 将使用新值更新 deferredValue，并在后台使用新值重新渲染是一个**低优先级的更新**。这也意味着，如果在后台使用新值更新时 value 再次改变，它将打断那次更新。

### 3. 问题解决

按需导入 `useDeferredValue` 这个 hooks API，并基于它进行搜索功能的性能优化：

```React JSX
// 1. 按需导入 useDeferredValue 这个 Hooks API

import React, { useState, useDeferredValue } from 'react'

// 父组件

export const SearchBox: React.FC = () => {

  const [kw, setKw] = useState('')

  // 2. 基于 kw 的值，为其创建出一个延迟版的 kw 值，命名为 deferredKw

  const deferredKw = useDeferredValue(kw)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setKw(e.currentTarget.value)

  }

  return (

    <div style={{ height: 500 }}>

      <input type="text" value={kw} onChange={onInputChange} />

      <hr />

      {/* 3. 将延迟版的 kw 值，传递给子组件使用 */}

      <SearchResult query={deferredKw} />

    </div>

  )

}

// 子组件，渲染列表项

// 4. 子组件必须使用 React.memo() 进行包裹，这样当 props 没有变化时，会跳过子组件的 rerender

const SearchResult: React.FC<{ query: string }> = React.memo((props) => {

  if (!props.query) return

  const items = Array(40000)

    .fill(props.query)

    .map((item, i) => <p key={i}>{item}</p>)

  return items

})
```

### 4. 表明内容已过时

当 `kw` 的值频繁更新时，`deferredKw` 的值会明显滞后，此时用户在页面上看到的列表数据并不是最新的，为了防止用户感到困惑，我们可以给内容添加 opacity 透明度，**表明当前看到的内容已过时**。示例代码如下：

```React JSX
// 1. 按需导入 useDeferredValue 这个 Hooks API

import React, { useState, useDeferredValue } from 'react'

// 父组件

export const SearchBox: React.FC = () => {

  const [kw, setKw] = useState('')

  // 2. 基于 kw 的值，为其创建出一个延迟版的 kw 值

  const deferredValue = useDeferredValue(kw)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setKw(e.currentTarget.value)

  }

  return (

    <div style={{ height: 500 }}>

      <input type="text" value={kw} onChange={onInputChange} />

      <hr />

      {/* 3. 将延迟版的 kw 值，传递给子组件使用 */}

      <div style={{ opacity: kw !== deferredValue ? 0.3 : 1, transition: 'opacity 0.5s ease' }}>

        <SearchResult query={deferredValue} />

      </div>

    </div>

  )

}
```

