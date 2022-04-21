## 打包之后缺少模块

```py
    D:\Python>pyinstaller 3.py -F -p C:/python/lib/site-packages
```

## pip安装

- 一次使用
> 比如安装numpy
> 
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple 库名

- 长期使用
> 修改用户文件夹下面的pip/pip.ini文件
>
内容：

```py
    [global]
    index-url = http://pypi.douban.com/simple
    [install]
    trusted-host = pypi.douban.com
```

## BeautifulSoup4

> 环境安装：

```py
    pip install lxml bs4用到lxml库，如果没有安装过lxml库的时候，需要安装一下
```

> 使用方式：

```py
    from bs4 import BeautifulSoup # 导入BeautifulSoup
    BeautifulSoup('网络请求到的页面数据','lxml')
```

> 属性和方法：
	
```py
    1.根据标签名查找
        soup.a 只能找到第一个符合要求的标签
    2.获取属性
        soup.a.attrs 获取a所有的属性和属性值，返回一个字典
        soup.a.attrs[‘href’] 获取href属性
        soup.a[‘href’] 也可简写为这种形式
    3.获取内容
        soup.a.string /text()
        soup.a.text //text()
        soup.a.get_text() //text()
        如果标签还是标签，那么string获取到的结果为none,而其他两个，可以获取文本内容
    4.find:找到第一个符合要求的标签
        soup.find(‘a’) 找到第一个符合要求的
        soup.find(‘a’,title=‘xxx’)
        soup.find(‘a’,alt=‘xxx’)
        soup.find(‘a’,class=‘xxx’)
        soup.find(‘a’,id=‘xxx’)
    5.find_All:找到所有符合要求的标签
        soup.find_All(‘a’)
        soup.find_All([‘a’,‘b’]) 找到所有的a和b标签
        soup.find_All(‘a’,limit=2) 限制前两个
    6.根据选择器选择指定的内容
        select:soup.select(’#feng’)
```

> 常见的选择器：

```py
    标签选择器（a）、类选择器（.）、id选择器（#）、层级选择器
    层级选择器：
    div .dudu #lala .name .xixi 下面好多级 div//img
    div > p > a > .lala 只能是下面一级 div/img
    select选择器返回永远是列表，需要通过下标提取指定对象
```



## 具体切换系统默认python的步骤：
>> 终端运行如下命令
```py
vi ~/.bash_profile

alias python2='/system/Library/Frameworks/Python.framework/Versions/2.7/bin/python2.7'  // python2 的地址
alias python3='/usr/local/Frameworks/Python.framework/Versions/3.7/bin/python3.7'  // python3 的地址
alias python=python3  // 切换版本

// 保存后运行如下命令使修改生效
source ~/.bash_profile
// 查看切换后的系统默认python版本
python --version

```




