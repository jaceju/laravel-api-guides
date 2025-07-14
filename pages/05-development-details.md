# 企業級開發實作核心策略

在企業級 Laravel API 專案中，開發實作是將架構設計轉化為高品質、可維護程式碼的關鍵過程。本章聚焦於核心實作策略和最佳實踐。

## 🎯 API 文件先行開發流程

### OpenAPI 驅動開發的企業價值

API-First 策略的核心是 OpenAPI 規格驅動開發：

#### 開發流程優化
```
需求分析 → OpenAPI 規格設計 → 規格審查 → Mock Server → 並行實作 → 自動驗證
```

#### 企業協作優勢
- **前後端解耦** - 團隊可以並行開發，提高交付速度
- **契約驅動** - 明確的介面定義避免溝通誤解
- **品質保證** - 自動化規格驗證確保實作一致性
- **文檔同步** - 規格即文檔，避免文檔過時問題

### Spectator 規格驗證實作

使用 hotmeteor/spectator 確保 API 實作符合 OpenAPI 規格：

```php
// 規格驗證測試範例
use Spectator\Spectator;

Spectator::using('v1/openapi.yaml');

it('API 回應符合 OpenAPI 規格', function () {
    actingAsUser('Admin');
    
    $response = $this->postJson('/api/v1/users', [
        'name' => 'John Doe',
        'email' => 'john@example.com'
    ]);

    $response->assertValidRequest()    // 驗證請求格式
            ->assertValidResponse();   // 驗證回應格式
});
```

> **OpenAPI 規格定義請參考：** `docs/api/v1/openapi.yaml`
> 
> **Spectator 測試實作請參考：** [測試框架配置](05-1-testing.md)

## 🛡️ 企業級權限驗證模式

### HATEOAS 與 RBAC 深度整合

在企業環境中，權限不僅僅是存取控制，更是業務邏輯的體現。HATEOAS（Hypermedia as the Engine of Application State）結合 RBAC 提供了動態權限感知的 API 體驗。

#### 動態資源連結策略
```php
// 權限感知的 HATEOAS 回應
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'status' => $this->status,
        '_links' => $this->buildHateoasLinks($request->user())
    ];
}

private function buildHateoasLinks(?User $user): array
{
    $links = ['self' => ['href' => route('api.users.show', $this)]];
    
    if ($user?->can('update', $this)) {
        $links['edit'] = ['href' => route('api.users.update', $this)];
    }
    
    if ($user?->can('delete', $this)) {
        $links['delete'] = ['href' => route('api.users.destroy', $this)];
    }
    
    return $links;
}
```

#### 角色驅動的 API 體驗
不同角色的使用者會收到不同的可操作連結，前端無需硬編碼權限邏輯：

- **SuperAdmin** - 完整的 CRUD 連結
- **Admin** - 受限的管理連結  
- **Editor** - 內容編輯連結
- **User** - 僅檢視連結

> **權限類別定義請參考：** `app/Abilities/` 資料夾
>
> **角色實作請參考：** `app/Roles/` 資料夾
>
> **RBAC 配置請參考：** `config/rbac.php`

### OTP 驗證整合

#### 一次性密碼增強安全性

整合 `spatie/laravel-one-time-passwords` 為 API 提供額外的安全驗證層：

```php
// 雙因素認證控制器實作
class TwoFactorAuthController extends Controller
{
    public function requestVerificationCode(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user();
        
        // 生成 OTP 並發送通知
        $otp = OneTimePassword::createFor($user)
            ->expiresInMinutes(2)
            ->generate();
            
        $user->notify(new TwoFactorCodeNotification($otp->password));
        
        return response()->json([
            'message' => 'Verification code sent',
            'expires_at' => $otp->expires_at
        ]);
    }
    
    public function verifyCode(VerifyOtpRequest $request): JsonResponse
    {
        $user = auth('sanctum')->user();
        
        if (OneTimePassword::consumeForUser($user, $request->code)) {
            // 設定驗證狀態
            Cache::put("2fa_verified:{$user->id}", true, 1800); // 30 分鐘
            
            return response()->json(['message' => 'Verification successful']);
        }
        
        return response()->json(['message' => 'Invalid or expired code'], 422);
    }
}

// OTP 請求驗證
class VerifyOtpRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'size:6']
        ];
    }
}
```

#### OTP 中間件整合

結合權限系統實現敏感操作的多層驗證：

```php
class RequireOtpMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth('sanctum')->user();
        
        // 檢查是否需要 OTP 驗證
        if ($this->requiresOtpVerification($request) && !$this->hasValidOtpSession($user)) {
            return response()->json([
                'message' => 'OTP verification required',
                'require_otp' => true
            ], 423);
        }
        
        return $next($request);
    }
    
    private function requiresOtpVerification(Request $request): bool
    {
        // 定義需要 OTP 的敏感操作
        $sensitiveRoutes = [
            'api/v1/users/*/delete',
            'api/v1/admin/*',
            'api/v1/security/*'
        ];
        
        return collect($sensitiveRoutes)->some(fn($pattern) => 
            $request->is($pattern)
        );
    }
}
```

> **OTP 整合完整實作請參考：**
> - `app/Http/Controllers/API/V1/TwoFactorAuthController.php`
> - `app/Http/Middleware/RequireOtpMiddleware.php`
> - `app/Notifications/TwoFactorCodeNotification.php`

## 🏗️ 服務層架構模式

### 服務導向的業務邏輯分層

在企業級應用中，服務層是業務邏輯的核心載體，負責協調模型、事件和外部服務的互動。

#### 服務層設計原則

```php
// 服務接口定義
interface UserServiceInterface
{
    public function createUser(CreateUserData $userData): User;
    public function updateUserProfile(User $user, UpdateProfileData $data): User;
    public function getPaginatedUsers(array $filters, PaginationData $pagination): LengthAwarePaginator;
}

// 服務實作
class UserService implements UserServiceInterface
{
    public function __construct(
        private UserRepository $userRepository,
        private EventDispatcher $eventDispatcher,
        private NotificationService $notificationService
    ) {}
    
    public function createUser(CreateUserData $userData): User
    {
        DB::transaction(function () use ($userData) {
            // 1. 業務邏輯驗證
            $this->validateBusinessRules($userData);
            
            // 2. 創建用戶
            $user = $this->userRepository->create($userData->toArray());
            
            // 3. 觸發事件
            $this->eventDispatcher->dispatch(new UserCreated($user));
            
            return $user;
        });
    }
}
```

> **服務接口定義請參考：** `app/Shared/Contracts/` 資料夾
>
> **業務邏輯實作請參考：** 各模組的 `Services/` 資料夾

### Repository 層的企業設計模式

Repository 模式在企業級應用中扮演關鍵角色，提供資料存取的抽象層。

#### Repository 模式的企業價值
- **技術無關性** - 業務邏輯不依賴特定的資料存取技術
- **可測試性增強** - 輕易進行單元測試和 Mock 物件替換
- **查詢最佳化** - 集中化的查詢邏輯，便於效能調優

#### 企業級 Repository 實作

```php
// 統一的 Repository 接口
interface UserRepositoryInterface
{
    public function find(int $id): ?User;
    public function findByEmail(string $email): ?User;
    public function create(array $data): User;
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;
}

// Eloquent 實作
class EloquentUserRepository implements UserRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = User::query()->with(['roles']);
        
        // 動態篩選邏輯
        $this->applyBusinessFilters($query, $filters);
        
        return $query->paginate($perPage);
    }
}
```

> **Repository 接口定義請參考：** `app/Contracts/` 資料夾
>
> **Eloquent 實作請參考：** 各模組的 `Repositories/` 資料夾

## 📊 企業級資料傳輸物件設計

### Spatie Laravel Data 的企業應用策略

在企業級應用中，資料傳輸物件（DTO）不僅是資料的載體，更是確保系統穩定性和類型安全的關鍵元件。

#### DTO 設計的企業價值

1. **類型安全保障** - 編譯期錯誤檢測，減少運行時問題
2. **API 契約明確化** - 清楚定義輸入輸出格式，避免溝通誤解
3. **驗證邏輯集中化** - 統一資料驗證規則，確保一致性
4. **重構友善性** - 類型約束讓重構更安全

#### 企業級 DTO 實作模式

```php
// 核心用戶資料 DTO
class CreateUserData extends Data
{
    public function __construct(
        #[Required, Max(255)]
        public readonly string $name,
        
        #[Required, Email, Unique('users')]
        public readonly string $email,
        
        #[Required, Min(8)]
        public readonly string $password,
        
        #[Sometimes, In(['SuperAdmin', 'Admin', 'Editor', 'User'])]
        public readonly ?string $role = 'User',
    ) {}
    
    // 業務邏輯驗證
    public static function rules(): array
    {
        return [
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'min:8', 'confirmed'],
        ];
    }
}
```

> **完整 DTO 定義請參考：** `app/Shared/Data/` 資料夾
>
> **模組專用 DTO 請參考：** 各模組的 `Data/` 資料夾
>
> **完整 DTO 定義請參考：** `app/Shared/Data/` 資料夾
>
> **模組專用 DTO 請參考：** 各模組的 `Data/` 資料夾

## 🔧 實作品質保證機制

### 程式碼品質的企業標準

在企業環境中，程式碼品質直接影響系統的可維護性、穩定性和團隊協作效率。

#### 靜態分析工具整合

**PHPStan** - 靜態程式碼分析，確保類型安全
**PHP CS Fixer** - 程式碼風格統一，提高可讀性
**Pest** - 現代化測試框架，提升測試體驗

#### 企業級開發工作流程

```
程式碼撰寫 → 靜態分析 → 單元測試 → 整合測試 → 規格驗證 → 部署
```

#### 品質門檻設定
- **程式碼覆蓋率** - 最低 80% 測試覆蓋率
- **靜態分析** - PHPStan Level 8，無警告
- **規格符合** - 100% API 規格驗證通過
- **效能基準** - API 回應時間低於 100ms

> **品質工具配置請參考：** `phpunit.xml`, `phpstan.neon`, `.php-cs-fixer.php`
>
> **測試實作詳情請參考：** [測試框架配置](05-1-testing.md)

## 🎯 總結：企業級開發的核心理念

### 可持續發展的架構思維

企業級 Laravel API 開發的成功關鍵在於：

1. **架構先行** - 以 OpenAPI 規格驅動開發，確保 API 設計的一致性
2. **權限深度整合** - HATEOAS 與 RBAC 結合，提供動態權限感知體驗
3. **服務層抽象** - 清晰的職責分離，提高程式碼的可測試性和可維護性
4. **類型安全保障** - 透過 DTO 和靜態分析，確保系統的穩定性
5. **品質持續監控** - 自動化測試和品質門檻，保證交付品質

這些實作策略不僅確保了當前系統的穩定運行，更為未來的擴展和維護奠定了堅實的基礎。

> **完整實作範例請參考專案程式碼結構**
>
> **進階架構模式請參考：** [專案架構設計](04-project-architecture.md)

### 服務容器的進階使用

#### 介面綁定與依賴注入
```php
// app/Providers/AppServiceProvider.php
class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // 基本介面綁定
        $this->app->bind(
            UserRepositoryInterface::class,
            EloquentUserRepository::class
        );

        // 單例綁定
        $this->app->singleton(
            CacheServiceInterface::class,
            RedisCacheService::class
        );

        // 條件式綁定
        $this->app->when(UserService::class)
            ->needs(CacheServiceInterface::class)
            ->give(function ($app) {
                return new RedisCacheService(
                    $app->make('redis'),
                    config('cache.user_ttl', 3600)
                );
            });

        // 標籤綁定
        $this->app->tag([
            EloquentUserRepository::class,
            EloquentProfileRepository::class,
        ], 'repositories');
    }

    public function boot(): void
    {
        // 啟動時解析標籤服務
        $repositories = $this->app->tagged('repositories');
        
        foreach ($repositories as $repository) {
            // 初始化 repository 設定
        }
    }
}
```

## 🧪 測試驅動開發的實作

### 測試策略概覽
- **單元測試** - 測試單一類別或方法
- **功能測試** - 測試完整功能流程
- **API 測試** - 測試 API 端點和規格符合性

> **完整的測試框架配置和策略請參考：** [測試框架配置](05-1-testing.md)

透過這些架構考量和最佳實踐，我們能夠建立一個既強健又靈活的企業級 API 系統，確保程式碼品質、開發效率和系統可維護性。

---

**下一步：** 了解如何建立完整的測試策略 → [測試框架配置](05-1-testing.md)
