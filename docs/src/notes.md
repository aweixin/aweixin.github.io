# 随心笔记

## php artisan migrate指令报错

```php
Laravel 
.env 需要添加
DB_SOCKET=/Applications/MAMP/tmp/mysql/mysql.sock
```

## laravel 关闭 csrf 验证 TokenMismatchException

```php
\App\Http\Middleware\VerifyCsrfToken::class,
```

## npm 安装依赖包版本问题

1、 这将忽略依赖冲突，但可能导致潜在的问题。你可以运行以下命令：

```bash
npm install--legacy - peer - deps
```

2、复制代理终端命令，然后运行它。

```base
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
```