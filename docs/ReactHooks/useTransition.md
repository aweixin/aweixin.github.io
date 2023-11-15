### 1. 问题引入

`useTransition` 可以将一个更新转为**低优先级**更新，使其可以**被打断**，**不阻塞 UI** 对用户操作的响应，能够提高用户的使用体验。它常用于优化**视图切换**时的用户体验。

例如有以下3个标签页组件，分别是 `Home`、`Movie`、`About`，其中 Movie 是一个渲染特别耗时的组件，在渲染 Movie 组件期间页面的 UI 会被阻塞，用户会感觉页面十分卡顿，示例代码如下：

```React JSX
import React, { useState } from 'react'

export const TabsContainer: React.FC = () => {

  // 被激活的标签页的名字

  const [activeTab, setActiveTab] = useState('home')

  // 点击按钮，切换激活的标签页

  const onClickHandler = (tabName: string) => {

    setActiveTab(tabName)

  }

  return (

    <div style={{ height: 500 }}>

      <TabButton isActive={activeTab === 'home'} onClick={() => onClickHandler('home')}>

        首页

      </TabButton>

      <TabButton isActive={activeTab === 'movie'} onClick={() => onClickHandler('movie')}>

        电影

      </TabButton>

      <TabButton isActive={activeTab === 'about'} onClick={() => onClickHandler('about')}>

        关于

      </TabButton>

      <hr />

      {/* 根据被激活的标签名，渲染对应的 tab 组件 */}

      {activeTab === 'home' && <HomeTab />}

      {activeTab === 'movie' && <MovieTab />}

      {activeTab === 'about' && <AboutTab />}

    </div>

  )

}

// Button 组件 props 的 TS 类型

type TabButtonType = React.PropsWithChildren & { isActive: boolean; onClick: () => void }

// Button 组件

const TabButton: React.FC<TabButtonType> = (props) => {

  const onButtonClick = () => {

    props.onClick()

  }

  return (

    <button className={['btn', props.isActive && 'active'].join(' ')} onClick={onButtonClick}>

      {props.children}

    </button>

  )

}

// Home 组件

const HomeTab: React.FC = () => {

  return <>HomeTab</>

}

// Movie 组件

const MovieTab: React.FC = () => {

  const items = Array(100000)

    .fill('MovieTab')

    .map((item, i) => <p key={i}>{item}</p>)

  return items

}

// About 组件

const AboutTab: React.FC = () => {

  return <>AboutTab</>

}
```

配套的 CSS 样式为：

```CSS
.btn {

  margin: 5px;

  background-color: rgb(8, 92, 238);

  color: #fff;

  transition: opacity 0.5s ease;

}

.btn:hover {

  opacity: 0.6;

  transition: opacity 0.5s ease;

}

.btn.active {

  background-color: rgb(3, 150, 0);

}
```

### 2. 语法格式

```React JSX
import { useTransition } from 'react';

function TabContainer() {

  const [isPending, startTransition] = useTransition();

  // ……

}
```

**参数**：

- 调用 `useTransition` 时不需要传递任何参数

**返回值**（数组）：

- `isPending` 布尔值：是否存在待处理的 transition，如果值为 true，说明页面上存在待渲染的部分，可以给用户展示一个加载的提示
- `startTransition` 函数：调用此函数，可以把**状态的更新**标记为**低优先级**的，不阻塞 UI 对用户操作的响应

### 3. 问题解决

修改 `TabsContainer` 组件，使用 `useTransition` 把点击按钮后为 `activeTab` 赋值的操作，标记为**低优先级**。此时 React 会优先响应用户对界面的其它操作，从而保证 UI 不被阻塞：

```React JSX
import React, { useState, useTransition } from 'react'

export const TabsContainer: React.FC = () => {

  // 被激活的标签页的名字

  const [activeTab, setActiveTab] = useState('home')

  const [, startTransition] = useTransition()

  // 点击按钮，切换激活的标签页

  const onClickHandler = (tabName: string) => {

    startTransition(() => {

      setActiveTab(tabName)

    })

  }

  // 省略其它代码...

}
```

> 此时，点击 Movie 按钮后，状态的更新被标记为**低优先级**，About 按钮的 **hover 效果**和**点击操作**都会被立即响应。

### 4. 使用 isPending 展示加载状态

为了能够使用 `isPending` 的状态为按钮添加 `loading` 效果，我们需要把 `useTransition` 的调用从 `TabsContainer` 组件中挪到 `TabButton` 组件中：

```React JSX
// Button 组件 props 的 TS 类型

type TabButtonType = React.PropsWithChildren & { isActive: boolean; onClick: () => void }

// Button 组件

const TabButton: React.FC<TabButtonType> = (props) => {

  const [isPending, startTransition] = useTransition()

  const onButtonClick = () => {

    startTransition(() => {

      props.onClick()

    })

  }

  return (

    <button className={['btn', props.isActive && 'active'].join(' ')} onClick={onButtonClick}>

      {props.children}

      {/* 如果处于更新状态，则在对应按钮中渲染一个 loading 图标 */}

      {isPending && '⏱️'}

    </button>

  )

}
```

### 5. 注意事项

1. 传递给 `startTransition` 的函数必须是同步的。React 会立即执行此函数，并将在其执行期间发生的所有状态更新标记为 transition。如果在其执行期间，尝试稍后执行状态更新（例如在一个定时器中执行状态更新），这些状态更新不会被标记为 transition。
2. **标记为 transition 的状态更新将被其他状态更新打断**。例如在 transition 中更新图表组件，并在图表组件仍在重新渲染时继续在输入框中输入，React 将首先处理输入框的更新，之后再重新启动对图表组件的渲染工作。
3. transition 更新不能用于控制文本输入。

