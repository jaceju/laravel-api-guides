# 準備工作

在建置大型 Laravel API 專案之前，我們需要準備適當的開發工具和技術棧。本章將介紹推薦的技術選擇、開發環境設置，以及核心套件的配置。

## 🛠️ 開發工具選擇

### PHP 版本需求
**推薦：PHP 8.2 - 8.4**

Laravel 12 需要 PHP 8.2 作為最低要求，建議使用 PHP 8.4 以獲得最佳效能和最新語言特性：

```bash
# 檢查 PHP 版本
php -v

# 安裝 PHP 8.4 (Ubuntu/Debian)
sudo apt update
sudo apt install php8.4-fpm php8.4-mysql php8.4-redis php8.4-curl php8.4-json php8.4-mbstring php8.4-xml php8.4-zip
```

### Laravel 框架版本
**使用：Laravel 12+ (基於 Laravel 11 架構)**

Laravel 12 提供了簡化的專案結構和更好的開發體驗。

> **詳細框架設置和配置說明請參考：** [Laravel 框架設置](02-1-framework-setup.md)

### 整合開發環境 (IDE)

#### PHPStorm (推薦)
- 完整的 Laravel 框架支援和智能提示
- 優秀的除錯和測試整合

#### Visual Studio Code
- 輕量級但功能強大
- 豐富的 Laravel 擴展生態

#### AI 輔助工具
- **GitHub Copilot** - 智能程式碼補全
- **Cursor** - 整合 AI 的新世代編輯器

### 資料庫選擇

#### MySQL 8.0+ (推薦)
- 成熟穩定，廣泛使用的關聯式資料庫

#### PostgreSQL 13+ (企業級)
- 更先進的 SQL 功能，適合複雜查詢需求

#### Redis (快取)
- 高效能記憶體資料庫，用於快取和會話存儲

> **資料庫配置詳細說明請參考：** [框架設置](02-1-framework-setup.md#資料庫連線最佳化)

### API 測試工具

#### Postman (功能豐富)
- 完整的 API 測試和文檔功能
- 團隊協作支援
- 自動化測試腳本

#### Bruno (開源替代)
- 開源免費
- 離線工作
- Git 友好的檔案格式

#### HTTPie (命令列)
```bash
# 安裝 HTTPie
pip install httpie

# 測試 API
http GET localhost:8000/api/v1/users Authorization:"Bearer your-token"
```

## 🔧 開發環境策略

### 本地開發環境選擇

#### Laravel Sail（推薦）
Docker 化的完整開發環境：

**優勢：**
- 環境一致性保證
- 依賴管理簡化
- 團隊成員快速上手
- 生產環境相容性

```bash
# 建立新專案（如果從頭開始）
curl -s https://laravel.build/my-api-project | bash
cd my-api-project && ./vendor/bin/sail up -d
```

#### 本地原生環境
適合有經驗的開發者：

**要求：**
- PHP 8.2+ 及相關擴展
- Composer 最新版本
- MySQL 8.0+ 或 PostgreSQL 13+
- Redis 7.0+

```bash
# 檢查環境相容性
php -v && composer --version
```

> **完整開發環境配置請參考：** [Laravel 框架設置](02-1-framework-setup.md#專案初始化最佳實踐)

## 📦 技術棧選擇策略

### 核心技術決策

本專案精心選擇的技術棧專為企業級 API 開發優化：

| 技術類別 | 選擇 | 版本要求 | 企業價值 |
|---------|-----|---------|----------|
| **核心框架** | Laravel | 12.x | 成熟穩定，企業級支援 |
| **PHP 版本** | PHP | 8.2-8.4 | 現代語言特性，效能最佳化 |
| **API 認證** | Laravel Sanctum | 4.x | 輕量級，適合 SPA 和行動應用 |
| **模組化** | nwidart/laravel-modules | 12.x | 大型專案模組化管理 |
| **資料處理** | spatie/laravel-data | 4.17+ | 強型別 DTO，提高開發效率 |
| **權限管理** | binary-cats/laravel-rbac | 1.5+ | 企業級 RBAC 實現 |
| **測試框架** | Pest | 3.x | 現代化測試體驗 |

### 技術選擇理念

**可擴展性優先**
- 所有選擇都考慮大型專案的長期維護需求
- 支援團隊協作和並行開發
- 為微服務化奠定基礎

**開發效率導向**
- 減少樣板代碼，提高開發速度
- 強型別系統，降低錯誤率
- 現代化工具鏈，提升開發體驗

> **完整技術棧設置和配置請參考：** [Laravel 框架設置](02-1-framework-setup.md)

## 🎯 版本控制與協作策略

### Git 工作流程最佳實踐

#### 分支策略
```bash
# 基本分支結構
git checkout -b develop        # 開發主分支
git checkout -b feature/user-module  # 功能開發分支
git checkout -b hotfix/security-patch  # 緊急修復分支
```

#### 提交訊息規範
遵循 Conventional Commits 標準：

```bash
# 提交類型：描述
feat: 新增用戶權限管理功能
fix: 修復 API 認證問題
docs: 更新 API 文檔
test: 增加用戶服務測試
```

#### 程式碼審查流程
- **最少兩人審查** - 確保程式碼品質
- **自動化檢查** - 通過 CI/CD 品質檢查
- **文檔同步更新** - 包含相關文檔變更

> **完整專案初始化和版本控制策略請參考：** [Laravel 框架設置](02-1-framework-setup.md)

---

**下一步：** 了解如何設計 API 結構 → [設計 API](03-api-design.md)

**深入學習：** [Laravel 框架設置](02-1-framework-setup.md)
