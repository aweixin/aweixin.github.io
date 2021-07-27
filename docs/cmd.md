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

