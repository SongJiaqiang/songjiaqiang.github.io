---
name: IconCraft
tagline: macOS 上的像素级 iOS 图标生成与替换工具
summary: 把 1024×1024 主图标拖进项目，自动生成全套 AppIcon 规格，并在替换前对比像素差异。处理全程在本机完成。
status: active
order: 1
lang: zh-cn
hero: https://raw.githubusercontent.com/SongJiaqiang/IconCraft/main/assets/preview-demo.png
icon: https://raw.githubusercontent.com/SongJiaqiang/IconCraft/main/assets/app-icon.png
screenshots:
  - https://raw.githubusercontent.com/SongJiaqiang/IconCraft/main/assets/app-icon.png
docs: /docs/iconcraft/
links:
  github: https://github.com/SongJiaqiang/IconCraft
---

[IconCraft（图标匠）](https://github.com/SongJiaqiang/IconCraft) 是一款 macOS 应用，用来生成并替换 iOS 项目里的 App Icon。在 Xcode 里换图标通常要导出几十张 PNG、再一张张拖进 Asset Catalog；在线工具还要把未发布的素材传到别人的服务器。

IconCraft 把这件事收成几步，全部在本地完成：

1. 拖入 1024×1024 的主图标
2. 选择 iOS 工程目录，自动找到 `AppIcon.appiconset`
3. 用像素级 diff 对照当前版本
4. 一键写入全部规格，并生成校验过的 `Contents.json`

## 特点

- 覆盖 iPhone、iPad 和 App Store 营销图（1024×1024）
- 自动扫描工程里的 `.appiconset`
- 基于 CoreGraphics 的像素对比：黑色是改动，白色是未变
- 无网络请求、无遥测，图像处理在本机完成

需要 macOS 14.6+。安装包在 [GitHub Releases](https://github.com/SongJiaqiang/IconCraft/releases)。上手说明见[文档](/docs/iconcraft/)。
