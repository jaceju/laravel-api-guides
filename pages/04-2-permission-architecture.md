# API 權限架構設計

## 🎯 RBAC 權限系統概述

本專案使用 `binary-cats/laravel-rbac` 擴展 `spatie/laravel-permission`，為 Laravel 12 API 專案提供 RBAC (Role-Based Access Control) 權限系統。

### 核心優勢
- **枚舉驅動** - 使用 PHP 8.1+ 枚舉定義權限，提供類型安全
- **自動同步** - 權限定義自動同步到資料庫
- **Guard 支援** - 支援 `sanctum` guard
- **快取最佳化** - 內建權限快取機制，提升效能

## 🏗️ 權限架構設計

### 整體架構概覽
```
API 權限架構
├── Abilities (權限定義) - PHP 枚舉
│   ├── UserAbility        # 用戶管理權限
│   ├── ProfileAbility     # 個人資料權限
│   └── SystemAbility      # 系統管理權限
├── Roles (角色定義) - 角色類別
│   ├── SuperAdminRole     # 超級管理員
│   ├── AdminRole          # 管理員
│   ├── EditorRole         # 編輯者
│   └── UserRole           # 一般用戶
├── Guards (守衛)
│   └── sanctum           # API Token 認證
├── Middlewares & Policies (中間件 & 政策)
│   ├── PermissionMiddleware  # 權限檢查中間件
│   ├── RoleMiddleware       # 角色檢查中間件
│   └── Policies            # 模型政策
├── Models Integration (模型整合)
│   └── User              # 使用者模型 (HasRoles trait)
└── Cache System (快取系統)
    ├── Permission Cache      # 提升查詢效能
    └── Role Cache            # 減少資料庫存取
```

> **完整的權限架構實作請參考：** `app/Abilities/` 和 `app/Roles/` 資料夾

## 📦 套件配置與整合

### 核心套件安裝
```bash
# 安裝權限管理套件
composer require spatie/laravel-permission
composer require binary-cats/laravel-rbac

# 發布配置檔案
php artisan vendor:publish --tag="rbac-config"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

# 執行資料庫遷移
php artisan migrate
```

### 整合配置策略

本專案的權限系統基於兩個核心配置檔案：

> **RBAC 角色與權限配置：** `config/rbac.php`
> - 角色類別註冊管理
> - 權限同步策略設定
> - 快取最佳化配置

> **Spatie Permission 配置：** `config/permission.php`  
> - 資料表命名設定
> - Guard 配置管理
> - 模型綁定設定

**設計優勢：**
- 枚舉驅動的型別安全權限定義
- 自動權限同步，減少手動維護
- 支援 Sanctum guard 的 API 認證
- 內建快取機制，提升查詢效能

## 🔧 權限系統實作

### 權限定義架構

本專案採用 PHP 枚舉實現強型別權限管理：

**設計原則：**
- `domain:action` 命名規則（如 `user:create`, `profile:viewOwn`）
- 實現 Ability 介面契約確保一致性
- 支援自有資料權限（Own）概念
- 權限標籤和描述便於管理

> **權限定義範例請參考：**
> - `app/Abilities/UserAbility.php` - 用戶管理權限
> - `app/Abilities/SystemAbility.php` - 系統權限
> - `modules/Profile/app/Abilities/ProfileAbility.php` - 個人資料權限

### 角色配置架構

角色是權限的集合，支援靈活的權限組合：

**角色特色：**
- 實現 Role 介面契約
- 支援多重防護（guards）
- 權限組合靈活配置
- 支援角色繼承和擴展

> **角色定義範例請參考：**
> - `app/Roles/SuperAdminRole.php` - 超級管理員
> - `app/Roles/AdminRole.php` - 管理員  
> - `app/Roles/UserRole.php` - 一般用戶

### User 模型整合

User 模型整合了 Laravel Sanctum 和 spatie/laravel-permission：

**整合特色：**
- HasApiTokens + HasRoles traits 組合
- API 權限檢查方法擴展
- Sanctum guard 權限驗證支援

> **完整模型實作請參考：** `app/Models/User.php`

## 🛡️ 權限檢查實作

### 控制器權限驗證

控制器層實作細緻的權限檢查，支援一般權限和資源擁有者驗證：

**檢查機制特色：**
- 路由層級權限驗證
- 資源擁有者權限驗證
- 複合權限邏輯處理
- 統一錯誤處理機制

> **實作範例請參考：**
> - `app/Http/Controllers/API/V1/UserController.php` - 用戶控制器權限
> - `modules/Profile/app/Http/Controllers/ProfileController.php` - 個人資料權限

### 中間件統一驗證

中間件提供統一的權限檢查機制：

**中間件特色：**
- 統一權限檢查邏輯  
- 支援多權限組合驗證
- 自動錯誤處理
- 可重用設計

> **完整實作請參考：** `app/Http/Middleware/PermissionMiddleware.php`

### 路由權限保護

路由層級權限保護確保只有授權用戶能存取特定資源：

**保護特色：**
- 中間件組合使用
- 權限枚舉值綁定  
- 自有資料路由區分
- RESTful 權限對應

> **路由配置請參考：** `routes/api.php`

## 🎯 進階權限控制

### 1. 條件式權限檢查

條件式權限檢查允許根據業務邏輯動態決定權限驗證。

**應用場景：**
- 資源擁有者檢查
- 時間條件權限
- 狀態依賴權限
- 複合條件驗證

> **完整實作請參考：** `app/Services/ProfileService.php`

### 2. 資源政策 (Policy)

Laravel Policy 提供更優雅的資源權限管理方式，將權限邏輯集中管理。

**Policy 特色：**
- 資源導向設計
- 自動解析機制
- 權限邏輯集中
- 測試友善

> **完整實作請參考：** `app/Policies/ProfilePolicy.php`
### 3. 控制器政策使用

在控制器中使用 Laravel Policy 進行權限檢查，提供更優雅的權限驗證方式。

**使用特色：**
- 自動依賴注入
- 語意化方法名稱
- 統一錯誤處理
- 易於測試

> **使用範例請參考：** `modules/Profile/app/Http/Controllers/ProfileController.php`

## 🔗 HATEOAS 與 RBAC 整合架構

### 設計理念

將 HATEOAS (Hypermedia as the Engine of Application State) 與 RBAC 權限系統整合，讓 API 響應能夠動態地根據用戶權限提供相關的操作連結，實現真正的自驅動 API。

### 整合優勢

### 設計理念

將 HATEOAS (Hypermedia as the Engine of Application State) 與 RBAC 權限系統整合，讓 API 響應能夠動態地根據用戶權限提供相關的操作連結，實現真正的自驅動 API。

### 整合優勢

- **動態導航** - 客戶端可以根據響應中的連結動態發現可用操作
- **權限感知** - 只顯示用戶有權限執行的操作  
- **型別安全** - 使用 `spatie/laravel-data` 確保資料結構一致性
- **標準化** - 遵循 OpenAPI 規範的 HATEOAS 連結格式

### 核心組件架構

HATEOAS 與 RBAC 整合架構包含以下核心組件：

**Data 層組件：**
- HateoasData - 核心 HATEOAS 數據結構
- HateoasLink - 連結物件定義
- BuildsHateoas Trait - HATEOAS 構建器

**權限整合：**
- PermissionContext Middleware - 權限上下文中間件
- 動態權限檢查機制
- 條件式連結生成

> **完整架構實作請參考：**
> - `app/Shared/Data/HateoasData.php` - 核心數據結構
> - `app/Shared/Traits/BuildsHateoas.php` - HATEOAS 構建器
> - `app/Http/Middleware/PermissionContext.php` - 權限上下文

### 實作範例

#### 1. 權限上下文中間件

權限上下文中間件負責預載權限資訊並設定 HATEOAS 相關的響應標頭。

**中間件功能：**
- 預載用戶權限優化效能
- 設定權限上下文資訊
- 添加 HATEOAS 響應標頭
- API 版本標識

> **完整實作請參考：** `app/Http/Middleware/HateoasPermissionContext.php`

#### 2. HATEOAS 構建器 Trait

HATEOAS 構建器提供統一的連結構建邏輯，根據權限動態生成可用操作。

**構建器特色：**
- 權限感知連結生成
- 統一的 API 路由參考
- 條件式操作展示
- 資源關係映射

> **完整實作請參考：** `app/Shared/Traits/BuildsHateoas.php`

### API 響應格式

#### HATEOAS 響應結構

API 響應遵循 OpenAPI 規範，包含以下核心元素：

**響應格式特色：**
- 標準化 HATEOAS 連結結構
- 權限感知的操作顯示
- 資源關係映射
- OpenAPI 相容格式

**響應組成：**
- `data` - 資源數據
- `links.self` - 資源自身連結
- `links.related` - 相關資源連結
- `links.actions` - 可執行操作（根據權限動態顯示）

> **完整響應範例請參考 API 文件或實際 API 回應**
## 🚀 效能最佳化策略

### 權限快取機制

大規模應用中，權限檢查的效能至關重要。實作多層級快取策略優化查詢效能。

**快取策略：**
- 用戶權限快取
- 角色權限快取  
- HATEOAS 連結快取
- 條件式快取更新

> **完整實作請參考：** `app/Services/PermissionCacheService.php`

### Controller 實作範例

控制器實作整合 HATEOAS 和權限檢查，提供完整的 API 功能。

**控制器特色：**
- 自動權限檢查
- HATEOAS 中間件整合
- 統一錯誤處理
- 型別安全響應

> **完整實作請參考：** `app/Http/Controllers/API/V1/UserController.php`

### 使用配置

#### 1. 中間件註冊

HATEOAS 權限上下文中間件需要在應用程式中註冊。

> **中間件註冊請參考：** `bootstrap/app.php`

#### 2. 路由配置

API 路由需要整合認證和 HATEOAS 中間件。

> **路由配置請參考：** `routes/api.php`

這個整合方案讓 API 響應能夠智能地根據用戶權限提供相關操作連結，實現了真正的 HATEOAS 原則，同時確保了安全性和一致性。

## ⚡ 效能最佳化

### 快取最佳化實作

#### 1. 權限快取策略

權限快取服務提供多層級快取機制，大幅提升權限檢查效能。

**快取特色：**
- 分層快取結構
- 自動失效機制
- 批量權限載入
- 標籤式快取管理

> **完整實作請參考：** `app/Services/PermissionCacheService.php`

#### 2. 批量權限檢查

批量權限檢查服務優化大量資源的權限驗證效能。

**批量檢查特色：**
- 一次性權限載入
- 批量資源篩選
- 記憶體使用優化
- 快速失敗機制

> **完整實作請參考：** `app/Services/BulkPermissionService.php`

## 🎛️ 管理指令

### 權限管理指令

提供豐富的 Artisan 指令來管理權限系統，簡化日常維護工作。

**可用指令：**
- `rbac:reset` - 重置所有權限和角色
- `rbac:check-user {user_id}` - 檢查用戶權限
- `rbac:list` - 列出所有權限
- `permission:cache-reset` - 清除權限快取

### 自訂管理指令

自訂 Artisan 指令提供更多權限管理功能。

**自訂指令特色：**
- 批量角色分配
- 權限報告生成
- 用戶權限匯出
- 系統健康檢查

> **完整指令實作請參考：** `app/Console/Commands/` 目錄

## 📋 總結

RBAC 權限架構與 HATEOAS 的整合為 API 提供了強大的功能：

### 🎯 核心優勢

1. **權限感知 API** - 根據用戶權限動態顯示可用操作
2. **強型別安全** - 使用 Enum 和 Data Objects 確保一致性
3. **多層安全驗證** - 整合 OTP 系統提供額外安全保護
4. **效能最佳化** - 多層級快取和批量處理機制
5. **開發友善** - 豐富的管理指令和開發工具

### 🔗 架構特色

- **模組化設計** - 清晰的關注點分離
- **可擴展性** - 支援複雜的權限需求和認證機制
- **標準相容** - 遵循 OpenAPI 和 HATEOAS 標準
- **安全強化** - OTP、RBAC 多重安全機制
- **維護性** - 統一的權限管理和快取策略

---

**下一步：** 了解如何實作開發細節 → [測試框架配置](05-1-testing.md)

## 🔐 一次性密碼 (OTP) 認證系統

### Spatie OTP 套件整合

本專案整合了 `spatie/laravel-one-time-passwords` 套件，提供安全的一次性密碼認證機制，強化 API 安全性。

#### OTP 系統核心特色
- **時效性控制** - 可設定密碼過期時間，預設 2 分鐘
- **唯一性保證** - 每個用戶同時只能有一個有效的 OTP
- **來源驗證** - 可強制要求同一平台消費（防止跨設備攻擊）
- **速率限制** - 內建防暴力破解機制
- **靈活配置** - 支援多種密碼生成器和驗證策略

### OTP 系統配置架構

```php
// config/one-time-passwords.php 核心配置
return [
    // OTP 有效期限（分鐘）
    'default_expires_in_minutes' => 2,
    
    // 每個用戶同時只能有一個有效 OTP
    'only_one_active_one_time_password_per_user' => true,
    
    // 強制同源消費（防止跨平台攻擊）
    'enforce_same_origin' => true,
    
    // 密碼生成器配置
    'password_generator' => \Spatie\OneTimePasswords\Support\PasswordGenerators\NumericOneTimePasswordGenerator::class,
    'password_length' => 6,
    
    // 防暴力破解設定
    'rate_limit_attempts' => [
        'max_attempts_per_user' => 5,
        'time_window_in_seconds' => 60,
    ],
];
```

> **完整 OTP 配置請參考：** `config/one-time-passwords.php`

### OTP 使用場景與實作

#### 1. 二因素認證 (2FA)
在敏感操作前要求 OTP 驗證：

```php
// 生成 OTP
use Spatie\OneTimePasswords\OneTimePassword;

class AuthController extends Controller
{
    public function requestTwoFactorCode(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user();
        
        // 生成 OTP
        $otp = OneTimePassword::createFor($user)
            ->expiresInMinutes(2)
            ->generate();
            
        // 發送通知（SMS 或 Email）
        $user->notify(new TwoFactorCodeNotification($otp->password));
        
        return response()->json([
            'message' => '驗證碼已發送',
            'expires_at' => $otp->expires_at
        ]);
    }
    
    public function verifyTwoFactorCode(Request $request): JsonResponse
    {
        $request->validate(['code' => 'required|string']);
        
        $user = auth('sanctum')->user();
        
        // 驗證 OTP
        if (OneTimePassword::consumeForUser($user, $request->code)) {
            return response()->json(['message' => '驗證成功']);
        }
        
        return response()->json(['message' => '驗證碼無效或已過期'], 422);
    }
}
```

#### 2. 無密碼登入
使用 OTP 實現安全的無密碼登入體驗：

```php
class PasswordlessAuthController extends Controller
{
    public function sendLoginCode(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email|exists:users']);
        
        $user = User::where('email', $request->email)->first();
        
        // 生成登入 OTP
        $otp = OneTimePassword::createFor($user)
            ->expiresInMinutes(5)
            ->generate();
            
        // 發送登入連結或驗證碼
        $user->notify(new PasswordlessLoginNotification($otp->password));
        
        return response()->json(['message' => '登入驗證碼已發送至您的信箱']);
    }
    
    public function loginWithCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string'
        ]);
        
        $user = User::where('email', $request->email)->first();
        
        if (OneTimePassword::consumeForUser($user, $request->code)) {
            $token = $user->createToken('passwordless-login')->plainTextToken;
            
            return response()->json([
                'message' => '登入成功',
                'token' => $token,
                'user' => $user
            ]);
        }
        
        return response()->json(['message' => '驗證碼無效'], 422);
    }
}
```

#### 3. 敏感操作確認
在執行敏感操作前要求 OTP 確認：

```php
class SecurityController extends Controller
{
    public function deleteAccount(Request $request): JsonResponse
    {
        $request->validate(['otp_code' => 'required|string']);
        
        $user = auth('sanctum')->user();
        
        // 驗證 OTP 後執行敏感操作
        if (OneTimePassword::consumeForUser($user, $request->otp_code)) {
            // 執行帳戶刪除
            $user->delete();
            
            return response()->json(['message' => '帳戶已成功刪除']);
        }
        
        return response()->json(['message' => 'OTP 驗證失敗'], 422);
    }
}
```

### OTP 與 RBAC 權限整合

#### 權限驗證增強
結合 OTP 與 RBAC 系統，實現多層次安全驗證：

```php
class EnhancedPermissionMiddleware
{
    public function handle(Request $request, Closure $next, string $permission, bool $requireOtp = false): Response
    {
        $user = auth('sanctum')->user();
        
        // 基本權限檢查
        if (!$user || !$user->can($permission)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // 敏感操作需要 OTP 驗證
        if ($requireOtp && !$this->hasValidOtpSession($request, $user)) {
            return response()->json([
                'message' => 'OTP verification required',
                'require_otp' => true
            ], 423); // 423 Locked
        }
        
        return $next($request);
    }
    
    private function hasValidOtpSession(Request $request, User $user): bool
    {
        // 檢查是否有有效的 OTP session
        return Cache::has("otp_verified:{$user->id}:" . session()->getId());
    }
}
```

### OTP 安全性最佳實踐

#### 1. 防暴力破解機制
```php
// 自訂 OTP 消費邏輯，加強安全性
class SecureOtpConsumer
{
    public function consume(User $user, string $code): bool
    {
        $attemptsKey = "otp_attempts:{$user->id}";
        $attempts = Cache::get($attemptsKey, 0);
        
        // 檢查是否超過嘗試次數限制
        if ($attempts >= 5) {
            throw new TooManyAttemptsException('Too many OTP attempts');
        }
        
        // 嘗試消費 OTP
        if (OneTimePassword::consumeForUser($user, $code)) {
            Cache::forget($attemptsKey);
            return true;
        }
        
        // 增加失敗次數
        Cache::put($attemptsKey, $attempts + 1, 300); // 5 分鐘
        
        return false;
    }
}
```

#### 2. 審計日誌記錄
```php
class OtpAuditLogger
{
    public function logOtpGeneration(User $user, string $purpose): void
    {
        Log::info('OTP generated', [
            'user_id' => $user->id,
            'purpose' => $purpose,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'timestamp' => now()
        ]);
    }
    
    public function logOtpConsumption(User $user, bool $success, string $purpose): void
    {
        Log::info('OTP consumption attempt', [
            'user_id' => $user->id,
            'success' => $success,
            'purpose' => $purpose,
            'ip' => request()->ip(),
            'timestamp' => now()
        ]);
    }
}
```

### 測試策略

#### OTP 功能測試
```php
// tests/Feature/OtpAuthenticationTest.php
describe('OTP Authentication', function () {
    it('can generate and consume OTP for 2FA', function () {
        $user = User::factory()->create();
        
        // 生成 OTP
        $otp = OneTimePassword::createFor($user)->generate();
        
        expect($otp->password)->toBeString()
            ->and($otp->expires_at)->toBeInstanceOf(Carbon::class);
        
        // 驗證 OTP
        $consumed = OneTimePassword::consumeForUser($user, $otp->password);
        
        expect($consumed)->toBeTrue();
        
        // 確保 OTP 只能使用一次
        $secondConsume = OneTimePassword::consumeForUser($user, $otp->password);
        expect($secondConsume)->toBeFalse();
    });
    
    it('enforces rate limiting for OTP attempts', function () {
        $user = User::factory()->create();
        $otp = OneTimePassword::createFor($user)->generate();
        
        // 嘗試多次錯誤驗證
        for ($i = 0; $i < 6; $i++) {
            OneTimePassword::consumeForUser($user, 'wrong-code');
        }
        
        // 應該觸發速率限制
        expect(function () use ($user, $otp) {
            OneTimePassword::consumeForUser($user, $otp->password);
        })->toThrow(TooManyAttemptsException::class);
    });
});
```

> **完整 OTP 測試範例請參考：** `tests/Feature/OtpAuthenticationTest.php`

OTP 系統的整合為 API 提供了額外的安全層，特別適用於敏感操作、無密碼認證和二因素驗證場景。透過與 RBAC 系統的深度整合，我們可以實現更細緻的安全控制策略。
