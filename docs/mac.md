# oh-my-zsh 终端



```bash
brew install zsh
```

### 安装 oh-my-zsh

> shell的类型有很多种，linux下默认的是bash，虽然bash的功能已经很强大，但对于以懒惰为美德的程序员来说，bash的提示功能不够强大，界面也不够炫，并非理想工具。而zsh的功能极其强大，只是配置过于复杂，起初只有极客才在用。后来，有个穷极无聊的程序员可能是实在看不下去广大猿友一直只能使用单调的bash, 于是他创建了一个名为`oh-my-zsh`的开源项目...

```bash
wget https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh
```



```bash
ZSH_THEME="ys"
```

```bash
plugins=(git zsh-syntax-highlighting zsh-autosuggestions)
```

```bash
source ~/.bash_profile
source .zshrc
```

### 1. 安装`zsh-syntax-highlighting`

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

### 2. 安装`zsh-autosuggestions`

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

重新更新配置

```bash
source .zshrc
```

