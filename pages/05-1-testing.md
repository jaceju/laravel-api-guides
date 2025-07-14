# 測試框架配置與策略

## 🧪 Pest 測試框架優勢

Pest 為 Laravel API 專案提供現代化測試體驗：

### 核心優勢
- **簡潔語法** - 函數式寫法，減少樣板代碼
- **Laravel 深度整合** - 完美支援 Laravel 生態系統
- **並行測試** - 內建並行執行，大幅提升測試速度
- **豐富生態** - 完整的插件和擴展支援

### 語法對比示例


> **完整測試配置請參考：** `tests/Pest.php` 和 `tests/TestCase.php`

## ⚙️ 專案配置

### 2. 核心配置檔案
```php
```

### 3. 測試 Context 配置

Context 組織測試用例：

```php
```

## 🏗️ 測試架構設計

### 分層測試策略

本專案採用三層測試架構：

**1. 單元測試（Unit Tests）**
- 測試單一類別或方法的邏輯
- 使用 Mock 隔離依賴
- 快速執行，提供即時回饋

**2. 功能測試（Feature Tests）**  
- 測試完整的使用者流程
- 包含 HTTP 請求和資料庫互動
- 驗證業務邏輯的正確性

**3. API 規格測試（Spectator Tests）**
- 驗證 API 回應符合 OpenAPI 規格
- 確保文件與實作一致性
- 自動檢查資料結構和型別

### 測試目錄結構
```
tests/
├── Unit/                   # 單元測試
│   ├── Services/          # 服務層測試
│   ├── Repositories/      # 資料存取層測試
│   └── Data/              # Data Objects 測試
├── Feature/               # 功能測試
│   ├── API/V1/           # V1 API 測試
│   └── Modules/          # 模組整合測試
└── Traits/               # 測試輔助工具
```

### Context 組織策略

使用 Pest 的 Context 功能組織測試用例：

```php
```

> **完整測試配置和輔助函數請參考：** `tests/Pest.php`

## 🚀 Spectator API 規格驗證

### OpenAPI 驅動測試

Spectator 確保 API 實作與 OpenAPI 規格保持一致：

**核心價值：**
- 自動驗證請求和回應格式
- 確保 API 文件準確性
- 支援 Schema 和資料型別檢查
- 契約測試的最佳實踐

### 基本使用範例
```php
```

> **API 規格檔案請參考：** `docs/api/v1/openapi.yaml`

## 🎯 權限測試策略

### RBAC 權限驗證

針對 RBAC 系統的專門測試策略：

**測試重點：**
- 角色權限正確分配
- API 端點權限保護
- 資源擁有者權限檢查
- 權限繼承和組合邏輯

### 權限測試範例
```php
```

> **完整權限測試範例請參考：** `tests/Feature/API/V1/PermissionTest.php`

### OTP 認證測試

針對一次性密碼系統的專門測試策略：

**測試重點：**
- OTP 生成和消費邏輯
- 時效性和唯一性驗證
- 速率限制和安全防護
- 與認證系統的整合

## 🚀 API 測試最佳實踐

### 1. 資料工廠使用

### 2. 測試資料集 (Datasets)


### 3. API 回應測試

### 2. 資料庫最佳化


### 3. 快取測試結果

## 🎮 測試指令與工作流程

### 常用測試指令
```bash

```

---

**下一步：** 了解如何實現完整的開發流程 → [開發細節](05-development-details.md)
