ref 的作用是获取实例，但由于函数组件不存在实例，因此无法通过 ref 获取函数组件的实例引用。而 `React.forwardRef` 就是用来解决这个问题的。

`React.forwardRef` 会创建一个 React 组件，这个组件能够将其接收到的 ref 属性转发到自己的组件树。

### 无法直接使用 ref 引用函数式组件

在下面的例子中，父组件 **Father** 想通过 ref 引用子组件 **Child**，此时代码会报错，因为函数式组件没有实例对象，无法被直接引用：

```javaScript
// 父组件

export const Father: React.FC = () => {

  const childRef = useRef()

  return (

    <>

      <h1>Father 父组件</h1>

      <hr />

      <!-- 下面这行代码中的 ref 使用不正确，因为 Child 组件是函数式组件，无法被直接引用 -->

      <Child ref={childRef} />

    </>

  )

}
```

Child 组件的定义如下：

```javaScript
// 子组件（实现点击按钮，数值加减的操作）

const Child: React.FC = () => {

  const [count, setCount] = useState(0)

  const add = (step: number) => {

    setCount((prev) => (prev += step))

  }

  return (

    <>

      <h3>Child 子组件 {count}</h3>

      <button onClick={() => add(-1)}>-1</button>

      <button onClick={() => add(1)}>+1</button>

    </>

  )

}
```

注意：上面的代码无法正常运行，会在终端提示如下的 Warning 警告：

  Warning: 

  Function components cannot be given refs. Attempts to access this ref will fail. 

  Did you mean to use React.forwardRef()?

> 错误提示中有解决此问题的关键提示：Did you mean to use **React.forwardRef()**?

### forwardRef 的基本使用

在使用函数组件时，我们无法直接使用 ref 引用函数式组件，下面的代码会产生报错：

```javaScript
const childRef = useRef(null)

return <Child ref={inputRef} />
```

因为默认情况下，你自己的组件不会暴露它们内部 DOM 节点的 ref。

正确的方法是使用 `React.forwardRef()` 把函数式组件包装起来，例如 Child 子组件的代码如下：

```javaScript
// 被包装的函数式组件，第一个参数是 props，第二个参数是转发过来的 ref

const Child = React.forwardRef((props, ref) => {

  // 省略子组件内部的具体实现

})
```

然后，在父组件 Father 中，就可以给子组件 Child 绑定 ref 了：

```javaScript
// 父组件

export const Father: React.FC = () => {

  const childRef = useRef()

  // 按钮的点击事件处理函数

  const onShowRef = () => {

    console.log(childRef.current)

  }

  return (

    <>

      <h1>Father 父组件</h1>

      {/* 点击按钮，打印 ref 的值 */}

      <button onClick={onShowRef}>show Ref</button>

      <hr />

      <Child ref={childRef} />

    </>

  )

}
```

> 注意：此时父组件 Father 中获取到的 ref.current 是 null，因为子组件 Child 没有向外暴露任何自己内部的东西。

