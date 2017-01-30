# yunle-template-gulp [![Build Status](https://travis-ci.org/hexiao-o/yunle-template-gulp.svg?branch=master)](https://travis-ci.org/hexiao-o/yunle-template-gulp)

如使用该前端脚手架，可以先安装

1. `npm install -g yunle-cli`

2. `yunle init <project-name>`

3. `cd <project-name> && npm install`

4. `npm run dev`

## 开发流程

![开发流程图](docs/images/images.png)

## 相关命令

> 开发过程中，你用得最多的会是`npm run dev`，但是这里还有很多其它的处理：


|`npm run <script>`|用途|
|------------------|-----------|
|`dev/build`|开发/生产环境 --- 启动服务。|
|`html/build-html`|开发/生产环境 --- 编译html。|
|`less/build-less`|开发/生产环境 --- 编译less。|
|`css/build-css`|开发/生产环境 --- 编译css。|
|`images/build-images`|开发/生产环境 --- 编译images。|
|`script/build-script`|开发/生产环境 --- 编译script。|
|`libs/build-libs`|开发/生产环境 --- 编译libs。|

## 程序目录

```
.
├── .tmp                     # 开发临时文件
├── dist                     # 打包生产环境后文件
├── config                   # Server config
│   ├── server.config        # server
├── src                      # 应用源文件
│   ├── libs                 # 第三方库
│       ├── js               # 第三方js库
│       ├── css              # 第三方css库
│       ├── fonts            # 第三方fonts库
│       ├── ...              # 自定义
│   ├── styles               # 样式
│       ├── less             # less源文件
│   ├── images               # images源文件
│   ├── js                   # js源文件
│   ├── index.html           # html入口
├── test                     # 单元测试
```

## mockjs学习

[http://mockjs.com/](http://mockjs.com/)

## rap API文档工具学习

[http://rap.taobao.org/org/index.do](http://rap.taobao.org/org/index.do)
