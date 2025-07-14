# 可擴展的 Laravel 框架設置

在企業級 API 專案中，框架的初始設置決定了整個專案的發展潛力。本章將探討如何建立一個既穩固又具有高度擴展性的 Laravel 基礎架構。

## 🎯 設計可擴展架構的核心考量

### 為什麼傳統設置不足以應對大型專案

傳統的 Laravel 安裝雖然適合快速原型開發，但在面對大型專案時會遇到以下挑戰：

#### 功能耦合問題
- **單體架構限制** - 所有功能集中在單一應用中，難以獨立開發和部署
- **依賴關係複雜** - 缺乏清晰的模組邊界，導致功能間過度耦合
- **測試困難** - 功能交錯使得單元測試和整合測試變得複雜

#### 擴展性瓶頸
- **效能限制** - 單一應用承載所有業務邏輯，難以針對特定功能進行效能調優
- **團隊協作障礙** - 多個開發團隊難以並行開發不同功能模組
- **部署風險** - 單一變更可能影響整個系統的穩定性

### 可擴展架構的設計原則

#### 1. 模組化優先設計
```
專案結構設計理念
├── 核心應用層 (app/)
│   ├── Http/                  # HTTP 相關 (Controllers, Middleware, Requests)
│   ├── Models/                # Eloquent 模型
│   ├── Services/              # 核心業務服務
│   └── Shared/                # 共用組件 (Traits, Data Objects)
├── 業務模組層 (modules/)
│   ├── User/                  # 用戶管理模組
│   ├── Profile/               # 個人資料模組
│   └── [其他業務模組]/
├── 配置層 (config/)
│   ├── 應用配置檔案
│   └── 套件配置檔案
└── 基礎設施層
    ├── routes/                # 路由定義
    ├── database/              # 資料庫相關 (遷移、種子)
    └── tests/                 # 測試檔案
```

#### 2. API 為中心的設計
- **API First 理念** - 所有功能都透過 API 提供，確保前後端完全解耦
- **版本化架構** - 從一開始就考慮 API 版本管理和向後相容性
- **RESTful 標準** - 遵循 REST 原則，提供一致的 API 體驗

#### 3. 容器化就緒
- **環境一致性** - 確保開發、測試、生產環境的一致性
- **微服務準備** - 為未來可能的微服務化奠定基礎
- **DevOps 友善** - 支援現代化的 CI/CD 流程

## 🔧 核心套件選擇策略

### 核心套件架構

本專案精選的套件組合專為可擴展的企業級 API 設計：

**認證與權限層**
- `laravel/sanctum` - 輕量級 API Token 認證
- `binary-cats/laravel-rbac` - 企業級 RBAC 權限管理（使用 PHP 枚舉）
- `spatie/laravel-one-time-passwords` - 一次性密碼 (OTP) 認證系統

**架構設計層**
- `nwidart/laravel-modules` - 模組化架構管理
- `spatie/laravel-data` - 強型別 DTO 和資料驗證

**開發品質層**
- `pestphp/pest` - 現代化測試框架
- `hotmeteor/spectator` - OpenAPI 規格驗證

> **套件選擇理念：** 每個套件都解決特定的架構問題，且彼此相容性良好，支援大型專案的長期維護需求。OTP 系統為 API 提供額外的安全層，特別適用於敏感操作和二因素認證場景。

## ⚙️ 專案初始化最佳實踐

### 1. 環境配置策略

#### 多環境配置管理
```bash
# 環境檔案結構
.env                    # 本地開發環境
.env.testing           # 測試環境
.env.staging           # 預發布環境
.env.production        # 生產環境
.env.example           # 環境範本
```

#### 關鍵配置項目
```bash
# 專案環境設定
APP_ENV=production
APP_URL=https://api.yourproject.com

# API 效能設定
CACHE_STORE=redis
QUEUE_CONNECTION=redis
```

> **環境配置策略：** 完整的多環境配置範本請參考專案根目錄的 `.env.example` 檔案。

> **進階配置說明：** 
> - Sanctum 認證配置請參考：`config/sanctum.php`
> - 模組化設定請參考：`config/modules.php` 
> - RBAC 權限配置請參考：`config/rbac.php`

### 2. 套件安裝順序

#### 第一階段：核心架構
```bash
# 1. 安裝 API 認證
composer require laravel/sanctum

# 2. 安裝一次性密碼系統
composer require spatie/laravel-one-time-passwords

# 3. 安裝模組化套件
composer require nwidart/laravel-modules

# 4. 安裝權限管理
composer require spatie/laravel-permission
composer require binary-cats/laravel-rbac
```

#### 第二階段：開發工具
```bash
# 5. 安裝資料處理套件
composer require spatie/laravel-data

# 6. 安裝測試框架
composer require --dev pestphp/pest
composer require --dev pestphp/pest-plugin-laravel
composer require --dev hotmeteor/spectator
```

### 3. 設定發布與初始化

#### 核心設定發布
```bash
# 發布 Sanctum 設定
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# 發布 OTP 設定
php artisan vendor:publish --provider="Spatie\OneTimePasswords\OneTimePasswordsServiceProvider"

# 發布模組設定
php artisan vendor:publish --provider="Nwidart\Modules\LaravelModulesServiceProvider"

# 發布權限設定
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan vendor:publish --tag="rbac-config"

# 執行資料庫遷移
php artisan migrate
```

#### API 路由初始化
```bash
# Laravel 11+ 安裝 API 路由
php artisan install:api

# 清理不需要的 Web 資源
rm -rf resources/views
rm -rf resources/js
rm -rf resources/css
```

## 🏗️ 專案結構設計

### 可擴展的目錄架構
```
laravel-api-project/
├── app/
│   ├── Http/
│   │   ├── Controllers/API/    # API 控制器 (按版本分組)
│   │   ├── Middleware/         # 自訂中間件
│   │   ├── Requests/           # 表單驗證請求
│   │   └── Resources/          # API 資源轉換
│   ├── Services/               # 業務邏輯服務
│   ├── Repositories/           # 資料存取層
│   ├── Data/                   # 資料傳輸物件
│   ├── Models/                 # Eloquent 模型
│   ├── Abilities/              # 權限定義 (Enums)
│   ├── Roles/                  # 角色定義
│   ├── Events/                 # 事件定義
│   ├── Listeners/              # 事件監聽器
│   ├── Jobs/                   # 佇列任務
│   ├── Exceptions/             # 自訂例外
│   └── Shared/                 # 共用組件
│       ├── Contracts/          # 介面契約
│       ├── Services/           # 共用服務
│       ├── Traits/             # 重用特徵
│       └── Enums/              # 列舉定義
├── modules/                    # 功能模組
│   ├── User/                   # 用戶管理模組
│   ├── Profile/                # 個人資料模組
│   ├── Authentication/         # 認證模組
│   └── Notification/           # 通知模組
├── config/
│   ├── modules.php             # 模組設定
│   ├── rbac.php               # 權限設定
│   └── sanctum.php            # API 認證設定
├── database/
│   ├── migrations/             # 資料庫遷移
│   ├── seeders/               # 資料填充
│   └── factories/             # 模型工廠
├── routes/
│   ├── api.php                # 主要 API 路由
│   ├── v1.php                 # V1 版本路由
│   └── v2.php                 # V2 版本路由
├── tests/
│   ├── Feature/               # 功能測試
│   │   ├── API/               # API 測試
│   │   └── Modules/           # 模組測試
│   ├── Unit/                  # 單元測試
│   └── Traits/                # 測試輔助
└── docs/                      # 專案文件
    ├── api/                   # API 文件
    └── guides/                # 開發指南
```

## 🔧 進階配置最佳化

### 1. API 專用設定

#### Sanctum 認證架構
Laravel Sanctum 為 API 提供輕量級但強大的認證機制：

**核心特色：**
- SPA 和行動應用的無狀態認證
- Token 作用域管理，支援細粒度權限控制
- 多 Guard 支援，Web 和 API 認證並存

> **Sanctum 完整配置請參考：** `config/sanctum.php`

#### API 路由架構設計
```bash
# Laravel 11+ API 路由設置
php artisan install:api

# 移除 Web UI 相關資源（純 API 專案）
rm -rf resources/views resources/js resources/css
```

**設計重點：**
- Token 過期時間策略
- 路由限流配置
- CORS 跨域政策

> **API 路由配置請參考：** `routes/api.php` 和相關路由檔案

### 2. 效能最佳化配置

#### 快取架構策略
為大型 API 專案設計的多層快取策略：

**快取分層設計：**
- **應用快取** - Redis 作為主要快取驅動
- **查詢快取** - Eloquent 查詢結果快取
- **權限快取** - RBAC 權限檢查結果快取

> **完整快取配置請參考：** `config/cache.php`

#### 資料庫連線最佳化
針對高併發 API 的資料庫配置策略：

**關鍵最佳化項目：**
- 連線池配置
- 查詢最佳化設定
- 讀寫分離準備

> **完整資料庫配置請參考：** `config/database.php`

## 📊 設置驗證清單

### 環境驗證
```bash
# 檢查 PHP 版本和擴展
php -v
php -m | grep -E "(pdo|mysql|redis|curl|json|mbstring|xml|zip)"

# 檢查 Composer 套件
composer show --platform

# 驗證 Laravel 安裝
php artisan --version
php artisan route:list | grep api

# 測試資料庫連線
php artisan tinker --execute="DB::connection()->getPdo();"

# 測試快取連線
php artisan tinker --execute="Cache::put('test', 'ok'); echo Cache::get('test');"
```

### 功能驗證
```bash
# 測試 API 健康檢查端點
curl -X GET http://localhost:8000/api/health \
  -H "Accept: application/json"

# 測試權限系統
php artisan rbac:list

# 測試模組功能
php artisan module:list
```

正確的框架設置是整個專案成功的基石。透過遵循這些原則和最佳實踐，我們建立了一個既強大又靈活的 API 基礎架構，為後續的開發工作奠定了穩固的基礎。

---

**下一步：** 了解如何設計清晰的 API 架構 → [API 設計](03-api-design.md)
