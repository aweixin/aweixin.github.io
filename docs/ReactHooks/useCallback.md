### 语法格式

之前我们所学的 `useMemo` 能够达到缓存某个变量值的效果，而当前要学习的 `useCallback` 用来对组件内的函数进行缓存，它返回的是缓存的函数。它的语法格式如下：

```javaScript
const memoCallback = useCallback(cb, array)
```

useCallback 会返回一个 memorized 回调函数供组件使用，从而防止组件每次 rerender 时反复创建相同的函数，能够节省内存开销，提高性能。其中：

1. cb 是一个函数，用于处理业务逻辑，这个 cb 就是需要被缓存的函数
2. array 是依赖项列表，当 array 中的依赖项变化时才会重新执行 useCallback。
    - 如果省略 array，则每次更新都会重新计算
    - 如果 array 为空数组，则只会在组件第一次初始化的时候计算一次
    - 如果 array 不为空数组，则只有当依赖项的值变化时，才会重新计算

### 基本示例

接下来，我们通过下面的例子演示使用 useCallback 的必要性：当输入框触发 onChange 事件时，会给 kw 重新赋值。kw 值的改变会导致组件的 rerender，而组件的 rerender 会导致反复创建 **onKwChange** 函数并添加到 Set 集合中，造成了不必要的内存浪费。代码如下：

```javaScript
import React, { useState, useCallback } from 'react'

// 用来存储函数的 set 集合

const set = new Set()

export const Search: React.FC = () => {

  const [kw, setKw] = useState('')

  const onKwChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setKw(e.currentTarget.value)

  }

  // 把 onKwChange 函数的引用，存储到 set 集合中

  set.add(onKwChange)

  // 打印 set 集合中元素的数量

  console.log('set 中函数的数量为：' + set.size)

  return (

    <>

      <input type="text" value={kw} onChange={onKwChange} />

      <hr />

      <p>{kw}</p>

      <p></p>

    </>

  )

}
```

运行上面的代码，我们发现每次文本框的值发生变化，都会打印 `set.size` 的值，而且这个值一直在自增 +1，因为每次组件 rerender 都会创建一个新的 onKwChange 函数添加到 set 集合中。

为了防止 `Search` 组件 rerender 时每次都会重新创建 `onKwChange` 函数，我们可以使用 useCallback 对这个函数进行缓存。改造后的代码如下：

```javaScript
import React, { useState, useCallback } from 'react'

// 用来存储函数的 set 集合

const set = new Set()

export const Search: React.FC = () => {

  const [kw, setKw] = useState('')

  const onKwChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

    setKw(e.currentTarget.value)

  }, [])

  // 把 onKwChange 函数的引用，存储到 set 集合中

  set.add(onKwChange)

  // 打印 set 集合中元素的数量

  console.log('set 中函数的数量为：' + set.size)

  return (

    <>

      <input type="text" value={kw} onChange={onKwChange} />

      <hr />

      <p>{kw}</p>

      <p></p>

    </>

  )

}
```

运行改造后的代码，我们发现无论 input 的值如何发生变化，每次打印的 `set.size` 的值都是 1。证明我们使用 useCallback 实现了对函数的缓存。

### useCallback 的案例

#### 1. 问题引入

1. 导入需要的 hooks 函数，并定义需要的 TS 类型：

```javaScript
import React, { useEffect, useState, useCallback } from 'react'

// 文本框组件的 props 类型

type SearchInputType = { onChange: (e: React.ChangeEvent) => void }

// 单词对象的 TS 类型

type WordType = { id: number; word: string }
```
2. 定义 **SearchInput** 搜索框子组件，接收父组件传递进来的 **onChange** 处理函数，每当 input 触发 onChange 事件时，调用 `props.onChange` 进行处理：

```javaScript
// 子组件

const SearchInput: React.FC = (props) => {

  useEffect(() => {

    console.log('触发了 SearchInput 的 rerender')

  })

  return }
```
3. 定义 **SearchResult** 搜索结果子组件，接收父组件传递进来的 **query** 搜索关键字，在 useEffect 中监听 `props.query` 的变化，从而请求搜索的结果：

```javaScript
// 子组件：搜索结果

const SearchResult: React.FC<{ query: string }> = (props) => {

  const [list, setList] = useState([])

  useEffect(() => {

    // 如果 query 为空字符串，则清空当前的列表

    if (!props.query) return setList([])

    // 查询数据

    fetch('[https://api.liulongbin.top/v1/words?kw=](https://api.liulongbin.top/v1/words?kw=)' + props.query)

      .then((res) => res.json())

      .then((res) => {

        // 为列表赋值

        setList(res.data)

      })

  }, [props.query])

  // 渲染列表数据

  return list.map((item) => {item.word})

}
```
4. 定义父组件 **SearchBox** 并渲染 **SearchInput** 组件和 **SearchResult** 组件。在父组件中监听 **SearchInput** 的 `onChange` 事件，并把父组件中定义的处理函数 `onKwChange` 传递进去。同时，把父组件中定义的搜索关键字 `kw` 传递给 **SearchResult** 组件。示例代码如下：

```javaScript
// 父组件

export const SearchBox: React.FC = () => {

  const [kw, setKw] = useState('')

  const onKwChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setKw(e.currentTarget.value)

  }

  return (

    <div style={{ height: 500 }}>

      <SearchInput onChange={onKwChange} />

      <hr />

      <SearchResult query={kw} />

    </div>

  )

}
```
5. 经过测试后，我们发现：
    1. 每当子组件的文本框内容发生变化，都会调用 `props.onChange` 把数据发送给父组件。
    2. 相应的，父组件通过 **onKwChange** 函数可以获取到子组件的值，并把值更新到 `kw` 中。当 kw 发生变化，会触发父组件的 rerender。
    3. 而父组件的 rerender 又会重新生成 **onKwChange** 函数并把函数的引用作为 props 传递给子组件。
    4. 这样，子组件就监听到了 `props` 的变化，最终导致子组件的 rerender。

    其实，子组件根本不需要被重新渲染，因为 `props.onChange` 函数的处理逻辑没有发生变化，只是它的引用每次都在变。为了解决这个问题，我们需要用到 **useCallback** 和 **React.memo**。

#### 2. 问题解决

1. 首先，我们需要让子组件 **SearchInput** 被缓存，所以我们需要使用 `React.memo` 对其进行改造：

```javaScript
// 子组件：搜索框

const SearchInput: React.FC<SearchInputType> = React.memo((props) => {

  useEffect(() => {

    console.log('触发了 SearchInput 的 rerender')

  })

  return <input onChange={props.onChange} placeholder="请输入搜索关键字" />

})
```
2. 使用 `React.memo` 对组件进行缓存后，如果子组件的 props 在两次更新前后没有任何变化，则被 memo 的组件不会 rerender。

    所以为了实现 SearchInput 的缓存，还需要基于 `useCallback` 把父组件传递进来的 **onChange** 进行缓存。

    在父组件中针对 **onKwChange** 调用 useCallback，示例代码如下：

```javaScript
const onKwChange = useCallback((e: React.ChangeEvent) => {

  setKw(e.currentTarget.value)

}, [])
```
3. 经过测试，我们发现每当文本框内容发生变化，不会导致 SearchInput 组件的 rerender。

