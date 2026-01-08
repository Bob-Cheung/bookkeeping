### 说明

- 这是一个用于记账的 React 项目，基于 Cordova 框架开发，支持在移动设备上运行。

### 📋 目录

- [说明](#说明)
- [📋 目录](#-目录)
- [🚀 快速开始](#-快速开始)
- [本地运行步骤](#本地运行步骤)
- [📦 部署指南](#-部署指南)
- [更新部署](#更新部署)
- [❓ 常见问题](#-常见问题)


### 🚀 快速开始

环境要求

- Node.js v20.16.0

- npm ≥ 10.8.1
### 本地运行步骤

- 需要下载 Android Studio 并配置好环境

1. 克隆仓库到本地
```bash
git clone https://github.com/Bob-Cheung/bookkeeping.git
```

2. 安装项目依赖
```bash
npm install
```

3. 访问本地服务：打开浏览器输入 http://localhost:3000（端口号以实际终端输出为准）

### 📦 部署指南

1. 确保本地已完成项目配置，且代码已提交

2. 安装部署依赖,检查是否下载了Cordova，如果没下载则运行：
```bash
   npm install -g cordova
```

3. 在项目的根目录运行 ``cordova create App 名称 `` 创建一个文件，文件中会有 config.xml 和 www 文件 

4. 将 config.xml 和 WWW 文件移动到根目录下，可以删除创建的文件，也就App名称文件

5. 创建一个名叫 ``.env.production`` 的文件，文件内容为 ``BUILD_PATH=www``，作用是编译时将输出文件改成www文件

6. 运行 ``npm run build``，看看编译后的数据是否放入到 www 文件中

7. 在项目的根目录上运行 ``cordova platform add android``

8. 在 ``index.html``文件中要引入 ``cordova.js ``

9. 在移动设备上打开开发者模式，并且允许USB调试，连接设备

10. 运行 ``cordova run android`` 打包到设备上


### 更新部署

后续代码更新后，重复以下命令即可重新部署：
```bash
  npm run build
  cordova run android
```


### ❓ 常见问题

- ``cordova -v``执行报错「因为在此系统上禁止运行脚本的报错」以管理员身份打开 Windows PowerShell运行``Set-ExecutionPolicy RemoteSigned``再输入 y 既可，再到项目跟目录中运行 ``cordova -v`` 检查

📄 许可证

啦啦啦啦啦啦啦啦啦啦
