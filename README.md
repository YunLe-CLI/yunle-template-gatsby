# yunle-template-gulp

如使用该前端脚手架，可以先安装

1. `npm install -g yunle-cli`

2. `yunle install gulp [项目目录名]`

开发过程中，你用得最多的会是`npm run dev`，但是这里还有很多其它的处理：


|`npm run <script>`|用途|
|------------------|-----------|
|`dev`|开发环境服务。|
|`build`|生产环境服务打包服务。|

## 程序目录

```
.
├── .tmp                     # 开发临时文件
├── dist                     # 打包后文件
├── app                      # gulp Server
│   ├── config               # 配置
│       ├── server.config    # server
│   ├── router               # 路由
│       ├── API.mock.js      # mock接口数据路由
├── src                      # 应用源文件
│   ├── less                 # less源文件
│   ├── images               # images源文件
│   ├── js                   # js源文件
├── test                     # 单元测试
```

## mockjs学习

```
http://mockjs.com/
```
