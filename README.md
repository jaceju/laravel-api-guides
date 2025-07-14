# 📚 Laravel API 專案開發指南

> 🚀 **建置大型的 Laravel API 專案** - 從框架設置到生產部署的完整文檔

## 🎯 關於本指南

這是一套完整的 Laravel API 專案開發指南，基於 VitePress 建構的現代化文檔系統。涵蓋從專案初始化到生產部署的每個階段，特別針對大型 API 專案的需求進行設計。

## 📖 文檔結構

### 🏗️ 主要章節

1. **[📖 前言](pages/01-introduction.md)** - 專案概述與目標
2. **[🛠️ 準備工作](pages/02-preparation.md)** - 開發環境與工具配置
3. **[🎯 設計 API](pages/03-api-design.md)** - API 設計原則與實作
4. **[🏗️ 設計專案架構](pages/04-project-architecture.md)** - 架構設計與模式
5. **[🧑‍💻 開發細節](pages/05-development-details.md)** - 實作技巧與最佳實踐
6. **[🚀 佈署](pages/06-deployment.md)** - 部署策略與 CI/CD
7. **[🎊 總結](pages/07-conclusion.md)** - 總結與進階學習

### 🔍 專業子指南

#### Laravel 框架設置
- **[⚙️ Laravel 框架設置](pages/02-1-framework-setup.md)**
  - 現代 Laravel 環境配置
  - 系統需求與安裝配置
  - 核心套件整合

#### 架構設計深度指南
- **[🧩 模組化架構設計](pages/04-1-modular-architecture.md)**
  - 模組化設計原則
  - 模組間通訊機制
  - 生命週期管理

- **[🔐 API 權限架構設計](pages/04-2-permission-architecture.md)**
  - RBAC 權限系統設計
  - 二進位權限最佳化
  - 效能調優策略

#### 現代化開發實踐
- **[🧪 測試框架配置與策略](pages/05-1-testing.md)**
  - Pest 測試框架配置
  - 測試策略與最佳實踐
  - 模組化測試設計

## 🛠️ 使用方式

### 📱 本地開發

```bash
# 進入文檔目錄
cd docs/guides

# 安裝依賴
npm install

# 啟動開發服務器
npm run docs:dev

# 建置靜態文件
npm run docs:build

# 預覽建置結果
npm run docs:preview
```

### 🌐 瀏覽指南

- **開發服務器**: `http://localhost:5173`
- **建置輸出**: `docs/guides/.vitepress/dist/`

## 🎨 技術特色

### 🔧 技術棧
- **VitePress 1.6.3** - 現代化靜態文檔生成器
- **Vue.js** - 互動式文檔組件
- **Markdown** - 易於編寫和維護的文檔格式
- **TypeScript** - 類型安全的配置

### ✨ 功能特點
- 🚀 **快速載入** - 基於 Vite 的極速建置
- 📱 **響應式設計** - 完美支援各種裝置
- 🔍 **全文搜尋** - 內建搜尋功能
- 🌙 **深色模式** - 護眼的閱讀體驗
- 📖 **目錄導航** - 階層式導航選單
- 🔗 **內部連結** - 智能的交叉引用

## 📋 內容特色

### 🎯 適用對象
- **後端開發者** - Laravel API 開發
- **架構師** - 大型專案架構設計
- **DevOps 工程師** - 部署與維運
- **專案經理** - 技術決策參考

### 💡 學習路徑
1. **入門路徑** - 01 → 02 → 03 → 05
2. **架構路徑** - 04 → 04-1 → 04-2
3. **深度路徑** - 02-1 → 05-1 → 06
4. **完整路徑** - 按順序閱讀所有章節

## 🔄 維護與更新

### 📝 內容更新
- 定期更新 Laravel 最新特性
- 增加實作範例和最佳實踐
- 根據社群回饋改進內容

### 🤝 貢獻方式
1. 在 GitHub 建立 Issue 報告問題
2. 提交 Pull Request 改進文檔
3. 分享使用經驗和建議

## 🏷️ 版本資訊

- **文檔版本**: v1.0.0
- **Laravel 版本**: 12+ (建議使用最新版本)
- **最後更新**: 2025年7月
- **維護狀態**: 積極維護中

## 📞 支援與聯絡

- 📧 **問題回報**: 透過 GitHub Issues
- 💬 **討論交流**: GitHub Discussions
- 📖 **文檔首頁**: [查看完整指南](index.md)

---

> 💡 **提示**: 建議從 [📖 前言](pages/01-introduction.md) 開始閱讀，以獲得完整的學習體驗。

**開始您的 Laravel 12 API 開發之旅** → [立即開始](pages/01-introduction.md)
