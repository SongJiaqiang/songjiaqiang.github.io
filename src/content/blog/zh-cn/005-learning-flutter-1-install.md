---
title: Flutter学习笔记1 - 安装Flutter
description: 在 macOS 上安装 Flutter SDK、配置环境变量并用 flutter doctor 检查。
pubDate: 2020-02-03 19:54:25
lang: zh-cn
tags:
  - flutter
cover: https://tva1.sinaimg.cn/large/006tNbRwgy1gbjk29ezokj30yo0euaak.jpg
---



## 获取Flutter源代码 

安装Flutter其实就是下载flutter的源代码到本地，有git和zip两种方式。

### 下载zip包

从[Realese目录](https://flutter.dev/docs/development/tools/sdk/releases)中下载最新版本的zip包，并解压到自己指定的安装目录。



### 克隆源代码（推荐）

从github中克隆flutter的源代码到自己指定的安装目录。

```shell
git clone https://github.com/flutter/flutter.git
```



## 配置Flutter命令行工具

使用export命令配置flutter工具，这个命令只在当前系统周期有效，重启电脑需要重新配置。

```shell
export PATH="$PATH:`pwd`/flutter/bin"
```

如果不想每次重启电脑都配置一遍，可以在系统环境配置文件追加上述命令，一般情况下配置文件是`.bash_profile`，如果安装了zsh，配置到文件`.zshrc`，修改配置文件后再Terminal执行`source filePath`更新环境变量。



另外，flutter使用期间需要访问网络获取一些资源，在国内访问加速可以更换掉flutter的存储地址，如下，

```shell
export PUB_HOSTED_URL=https://pub.flutter-io.cn 
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
```



## 环境测试

配置完成后使用`doctor`指令测试flutter环境是否配置成功。

``` shell
flutter doctor
```



如果还没有安装过Android SDK，会提示你先安装[Android SDK](https://goo.gl/XxQghQ)，这里建议直接安装[Android Studio](https://developer.android.com/studio)，然后通过Android Studio安装SDK。



同样的，还需要安装一下Xcode的命令行工具。

``` shell
 sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
 sudo xcodebuild -runFirstLaunch
```



## 参考链接

* https://flutter.dev/docs/get-started/install/macos