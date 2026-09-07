---
name: IconCraft
tagline: Pixel-perfect iOS app icon generator and replacer for macOS
summary: Drop in a 1024×1024 master icon, generate the full AppIcon set, and inspect pixel diffs before replacing assets. Everything runs on-device.
status: active
order: 1
lang: en
hero: https://raw.githubusercontent.com/SongJiaqiang/IconCraft/main/assets/preview-demo.png
icon: https://raw.githubusercontent.com/SongJiaqiang/IconCraft/main/assets/app-icon.png
screenshots:
  - https://raw.githubusercontent.com/SongJiaqiang/IconCraft/main/assets/app-icon.png
docs: /docs/iconcraft/
links:
  github: https://github.com/SongJiaqiang/IconCraft
---

[IconCraft](https://github.com/SongJiaqiang/IconCraft) is a macOS app for generating and replacing iOS app icons. Swapping icons in Xcode usually means exporting dozens of PNGs and dragging them into an Asset Catalog. Online tools also mean uploading unreleased artwork to someone else’s server.

IconCraft keeps the work local:

1. Drop in a 1024×1024 master icon
2. Point it at your iOS project — it finds `AppIcon.appiconset`
3. Inspect pixel-level diffs against the current set
4. Replace every required size and write a validated `Contents.json`

## What it does

- Full iPhone, iPad, and App Store marketing (1024×1024) sizes
- Walks the project to locate `.appiconset` catalogs
- CoreGraphics pixel diff: black means changed, white means unchanged
- No network, no telemetry — processing stays on-device

Requires macOS 14.6+. Download the installer from [GitHub Releases](https://github.com/SongJiaqiang/IconCraft/releases). Getting started is in the [docs](/en/docs/iconcraft/).
