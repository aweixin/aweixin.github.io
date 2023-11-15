### 结合 useEffect 监听状态的变化

为了能够监听到状态的变化，react 提供了 **useEffect** 函数。**它能够监听依赖项状态的变化，并执行对应的回调函数**。基本语法格式如下：

```React JSX
useEffect(() => { /* 依赖项变化时，要触发的回调函数 */ }, [依赖项])
```

例如：

```React JSX
export const Count: React.FC = () => {

  const [count, setCount] = useState(() => 0)

  const add = () => {

    setCount(count + 1)

  }

  // 当 count 变化后，会触发 useEffect 指定的回调函数

  useEffect(() => {

    console.log(count)

  }, [count])

  return (

    <>

      <h1>当前的 count 值为：{count}</h1>

      <button onClick={add}>+1</button>

    </>

  )

}
```

> 注意：useEffect 也是 React 提供的 Hooks API，后面的课程中会对它进行详细的介绍。

### 注意事项

#### 1. 更新对象类型的值

如果要更新对象类型的值，并触发组件的重新渲染，则必须使用**展开运算符**或**Object.assign()**生成一个新对象，用新对象覆盖旧对象，才能正常触发组件的重新渲染。示例代码如下：

```React JSX
export const UserInfo: React.FC = () => {

  const [user, setUser] = useState({

    name: 'zs',

    age: 12,

    gender: '男'

  })

  const updateUserInfo = () => {

    [user.name](http://user.name) = 'Jesse Pinkman'

    // 下面的写法是错误的，因为 set 函数内部，会对更新前后的值进行对比；

    // 由于更新前后的 user，原值的引用和新值的引用相同，

    // 所以 react 认为值没有发生变化，不会触发组件的重新渲染。

    // setUser(user)

    // 解决方案：用新对象的引用替换旧对象的引用，即可正常触发组件的重新渲染。

    setUser({ ...user })

    // setUser(Object.assign({}, user))

  }

  return (

    <>

      <h1>用户信息：</h1>

      <p>姓名：{[user.name](http://user.name)}</p>

      <p>年龄：{user.age}</p>

      <p>性别：{user.gender}</p>

      <button onClick={updateUserInfo}>更新用户信息</button>

    </>

  )

}
```

#### 2. 解决值更新不及时的 Bug

当连续多次**以相同的操作**更新状态值时，React 内部会对传递过来的新值进行比较，如果值相同，则会屏蔽后续的更新行为，从而防止组件频繁渲染的问题。这虽然提高了性能，但也带来了一个使用误区，例如：

```React JSX
export const Count: React.FC = () => {

  const [count, setCount] = useState(() => 0)

  const add = () => {

    // 1. 希望让 count 值从 0 自增到 1

    setCount(count + 1)

    // 2. 希望让 count 值从 1 自增到 2

    setCount(count + 1)

  }

  return (

    <>

      <h1>当前的 count 值为：{count}</h1>

      <button onClick={add}>+1</button>

    </>

  )

}
```

经过测试，我们发现上述代码执行的结果，只是让 count 从 0 变成了 1，最终的 count 值并不是 2。Why？

因为 `setCount` 是异步地更新状态值的，所以前后两次调用 `setCount` 传递进去的新值都是 1。React 内部如果遇到两次相同的状态，则会默认阻止组件再次更新。

为了解决上述的问题，我们可以使用**函数的方式**给状态赋新值。当函数执行时才通过函数的形参，拿到当前的状态值，并基于它返回新的状态值。示例代码如下：

```React JSX
export const Count: React.FC = () => {

  const [count, setCount] = useState(() => 0)

  const add = () => {

    // 传递了更新状态的函数进去

    setCount((c) => c + 1)

    setCount((c) => c + 1)

  }

  return (

    <>

      <h1>当前的 count 值为：{count}</h1>

      <button onClick={add}>+1</button>

    </>

  )

}
```

#### 3. 使用 setState 模拟组件的强制刷新

在函数组件中，我们可以通过 useState 来**模拟 forceUpdate 的强制刷新操作**。因为只要 useState 的状态发生了变化，就会触发函数组件的重新渲染，从而达到强制刷新的目的。具体的代码示例如下：

```React JSX
export const FUpdate: React.FC = () => {

  const [, forceUpdate] = useState({})

  // 每次调用 onRefresh 函数，都会给 forceUpdate 传递一个新对象

  // 从而触发组件的重新渲染

  const onRefresh = () => forceUpdate({})

  return (

    <>

      <button onClick={onRefresh}>点击强制刷新 --- {Date.now()}</button>

    </>

  )

}
```

> 注意：因为每次传入的对象的地址不同，所以一定会使组件刷新。

