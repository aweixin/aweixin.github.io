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

> 这将忽略依赖冲突，但可能导致潜在的问题。你可以运行以下命令：

```bash
npm install--legacy - peer - deps
```