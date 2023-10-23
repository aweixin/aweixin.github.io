### window 指定链接WiFi



```c
// 禁用所有WiFi
netsh>nul 2>nul wlan add filter permission=denyall networktype=infrastructure
// 指定链接的WiFi 
netsh>nul 2>nul wlan add filter permission=allow ssid="WiFi名称" networktype=infrastructure
// 查看用户配置文件
netsh wlan show profile
// 列出配置文件信息
netsh wlan export profile key=clear
// 删除配置文件
netsh wlan delete profile name=""
```



# Homebrew国内如何自动安装（国内地址）（Mac & Linux）

### 自动脚本(全部国内地址)（复制下面一句脚本到终端中粘贴回车)

**苹果电脑 常规安装脚本（推荐 完全体 几分钟安装完成）：**

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

**苹果电脑 极速安装脚本（精简版 几秒钟安装完成）：**

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)" 
```

 [Mac电脑如何打开终端：command+空格 在聚焦搜索中输入terminal回车](https://link.zhihu.com/?target=https%3A//support.apple.com/zh-cn/guide/terminal/apd5265185d-f365-44cb-8b09-71a064a42125/mac)*。*

**苹果电脑 卸载脚本：**

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/HomebrewUninstall.sh)"
```
