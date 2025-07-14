# API-First 設計：企業級 RESTful 架構

在現代軟體開發中，API-First 策略是構建可擴展、可維護企業級系統的核心理念。本章深入探討如何運用 RESTful 原則、HATEOAS 理念，以及 OpenAPI 規範來建構世界級的 API 系統。

## 🎯 API-First 的戰略價值

### 為什麼 API-First 是企業成功的關鍵

API-First 不僅是技術選擇，更是數位轉型的戰略決策：

#### 業務敏捷性優勢
- **快速市場響應** - 前後端並行開發，縮短產品上市時間
- **多平台策略** - 同一 API 支援 Web、行動、IoT 等多種平台
- **生態系統擴展** - 開放 API 創造合作夥伴和第三方整合機會
- **創新實驗空間** - 前端團隊可快速測試新功能和使用者體驗

#### 技術架構優勢
- **解耦設計** - 前後端技術棧獨立演進，降低技術風險
- **可擴展性** - 微服務化的基礎，支援業務快速成長
- **可測試性** - API 契約驅動的開發，提高系統品質
- **可維護性** - 清晰的介面邊界，降低維護複雜度

### OpenAPI 規格驅動開發

#### 文件先行的開發工作流程
```
業務需求分析 → OpenAPI 規格設計 → 規格審查 → Mock 開發 → 實作驗證 → 部署監控
     ↓              ↓              ↓          ↓         ↓         ↓
  需求清晰化     → API 契約確立  → 團隊共識  → 並行開發 → 品質保證 → 持續改進
```

#### OpenAPI 3.1 規格的企業價值
- **契約驅動開發** - 明確的介面定義避免開發誤解
- **工具生態豐富** - 自動產生文件、測試、SDK
- **版本管理友善** - 清晰的變更追蹤和相容性檢查
- **團隊協作標準** - 統一的 API 設計語言和流程

> **OpenAPI 規格範例請參考：** `docs/api/v1/openapi.yaml`

## 🏗️ RESTful 架構原則深度剖析

### REST 六大約束原則

#### 1. 統一介面 (Uniform Interface)
```http
# 好的設計 - 一致的資源命名和 HTTP 動詞
GET    /api/v1/users          # 獲取用戶列表
GET    /api/v1/users/{id}     # 獲取特定用戶
POST   /api/v1/users          # 創建新用戶
PUT    /api/v1/users/{id}     # 完全更新用戶
PATCH  /api/v1/users/{id}     # 部分更新用戶
DELETE /api/v1/users/{id}     # 刪除用戶

# 避免的設計 - 動詞導向的命名
POST   /api/v1/createUser     # ❌ 違反 RESTful 原則
GET    /api/v1/getUserById    # ❌ 不一致的命名方式
```

#### 2. 無狀態 (Stateless)
```php
// ✅ 正確的無狀態設計
class UserController extends Controller
{
    public function show(Request $request, int $id): JsonResponse
    {
        // 每個請求都包含完整的認證資訊
        $user = auth('sanctum')->user();
        
        // 不依賴 session 或其他狀態儲存
        if (!$user->hasPermission('user:view')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        return response()->json(['data' => $this->userService->find($id)]);
    }
}

// ❌ 避免狀態依賴的設計
class BadUserController extends Controller
{
    private $currentUser; // 不要在控制器中儲存狀態
    
    public function show(int $id): JsonResponse
    {
        // 依賴之前設定的狀態，違反無狀態原則
        if (!$this->currentUser) {
            return response()->json(['error' => 'No user context'], 400);
        }
    }
}
```

#### 3. 可快取性 (Cacheable)
```php
// API 回應的快取策略設計
class UserController extends Controller
{
    public function show(Request $request, int $id): JsonResponse
    {
        $user = Cache::tags(['users'])
            ->remember("user:{$id}", 3600, function () use ($id) {
                return $this->userService->find($id);
            });

        return response()
            ->json(['data' => UserResource::make($user)])
            ->header('Cache-Control', 'public, max-age=3600')
            ->header('ETag', md5(json_encode($user)))
            ->header('Last-Modified', $user->updated_at->toRfc7231String());
    }
}
```

### 進階 RESTful 設計模式

#### 資源關聯設計
```http
# 一對多關聯 - 用戶的個人資料
GET /api/v1/users/{userId}/profile

# 多對多關聯 - 用戶的角色
GET /api/v1/users/{userId}/roles
POST /api/v1/users/{userId}/roles    # 分配角色
DELETE /api/v1/users/{userId}/roles/{roleId}  # 移除角色

# 巢狀資源的最佳實踐
GET /api/v1/users/{userId}/posts/{postId}/comments
```

#### 查詢參數設計策略
```http
# 分頁參數
GET /api/v1/users?page=2&per_page=15

# 排序參數
GET /api/v1/users?sort=created_at&order=desc

# 篩選參數
GET /api/v1/users?filter[status]=active&filter[role]=admin

# 搜尋參數
GET /api/v1/users?search=john&search_fields=name,email

# 欄位選擇（稀疏字段集）
GET /api/v1/users?fields=id,name,email

# 關聯載入
GET /api/v1/users?include=profile,roles
```

## 🔗 HATEOAS：自驅動 API 的核心

### 超媒體驅動的 API 設計

HATEOAS (Hypermedia as the Engine of Application State) 讓 API 成為自描述的智慧介面：

#### HATEOAS 的企業價值
- **降低客戶端複雜度** - 客戶端無需硬編碼業務流程
- **動態功能發現** - 根據當前狀態提供可用操作
- **版本演進友善** - 新功能可以透過連結動態暴露
- **權限整合** - 連結可以根據使用者權限動態顯示

#### HATEOAS 與 RBAC 整合設計

本專案的 HATEOAS 實作深度整合 RBAC 權限系統：

**整合優勢：**
- **權限感知連結** - 只顯示使用者有權限執行的操作
- **動態操作導航** - 根據資源狀態和使用者權限提供相關連結
- **型別安全保證** - 使用 spatie/laravel-data 確保連結結構一致性
- **OpenAPI 相容** - 遵循標準的 HATEOAS 連結格式

**實作架構：**
```php
// 權限感知的 HATEOAS 實作範例
class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            
            // 動態權限連結
            'links' => [
                'self' => route('api.v1.users.show', $this->id),
                'update' => $this->when(
                    $request->user()?->can('update', $this->resource),
                    route('api.v1.users.update', $this->id)
                ),
                'delete' => $this->when(
                    $request->user()?->can('delete', $this->resource),
                    route('api.v1.users.destroy', $this->id)
                ),
            ],
        ];
    }
}
```

> **完整 HATEOAS 實作請參考：**
> - `app/Shared/Data/HateoasData.php` - 核心數據結構
> - `app/Shared/Traits/BuildsHateoas.php` - HATEOAS 構建器
> - `app/Http/Middleware/HateoasPermissionContext.php` - 權限上下文中間件

## 📋 API 版本管理策略

### 版本化的設計考量

#### 版本化策略比較
```php
// 1. URI 版本化 (推薦)
Route::prefix('v1')->group(function () {
    Route::apiResource('users', V1\UserController::class);
});

Route::prefix('v2')->group(function () {
    Route::apiResource('users', V2\UserController::class);
});

// 2. Header 版本化
Route::middleware(['api.version:v1'])->group(function () {
    Route::apiResource('users', UserController::class);
});

// 3. 查詢參數版本化（不建議）
// GET /api/users?version=v1
```

#### 向後相容性策略
```php
// app/Http/Controllers/API/BaseController.php
abstract class BaseController extends Controller
{
    protected function getApiVersion(): string
    {
        return request()->segment(2) ?? 'v1'; // 預設為 v1
    }
    
    protected function transformResource($resource, $resourceClass = null)
    {
        $version = $this->getApiVersion();
        $resourceClass = $resourceClass ?? $this->getResourceClass($version);
        
        return $resourceClass::make($resource);
    }
    
    private function getResourceClass(string $version): string
    {
        $baseClass = class_basename(static::class);
        $resourceName = str_replace('Controller', 'Resource', $baseClass);
        
        return "App\\Http\\Resources\\{$version}\\{$resourceName}";
    }
}
```

### 版本遷移策略
```php
// app/Http/Middleware/ApiVersionDeprecation.php
class ApiVersionDeprecation
{
    private const DEPRECATED_VERSIONS = [
        'v1' => '2024-12-31', // v1 將在 2024 年底棄用
    ];
    
    public function handle(Request $request, Closure $next)
    {
        $version = $request->segment(2);
        
        if (isset(self::DEPRECATED_VERSIONS[$version])) {
            $deprecationDate = self::DEPRECATED_VERSIONS[$version];
            
            return $next($request)->withHeaders([
                'X-API-Deprecation-Date' => $deprecationDate,
                'X-API-Deprecation-Info' => 'https://docs.api.com/migration-guide',
                'Warning' => "299 - \"API version {$version} is deprecated. Please migrate to v2.\""
            ]);
        }
        
        return $next($request);
    }
}
```

## 🛡️ API 安全性設計

### 認證策略設計
```php
// 多層次認證中間件
class ApiAuthMiddleware
{
    public function handle(Request $request, Closure $next, string $guard = 'sanctum')
    {
        // 1. 檢查 API Token
        if (!auth($guard)->check()) {
            return response()->json([
                'error' => 'Unauthenticated',
                'message' => 'Valid API token required'
            ], 401);
        }
        
        // 2. 檢查 Token 作用域
        $user = auth($guard)->user();
        $requiredScopes = $this->getRequiredScopes($request);
        
        if (!$user->tokenCan($requiredScopes)) {
            return response()->json([
                'error' => 'Insufficient token scope',
                'required_scopes' => $requiredScopes
            ], 403);
        }
        
        // 3. 記錄 API 使用情況
        $this->logApiUsage($request, $user);
        
        return $next($request);
    }
}
```

### 速率限制設計
```php
// config/api.php
return [
    'rate_limits' => [
        'general' => [
            'max_attempts' => 60,
            'decay_minutes' => 1,
        ],
        'auth' => [
            'max_attempts' => 5,
            'decay_minutes' => 1,
        ],
        'premium' => [
            'max_attempts' => 300,
            'decay_minutes' => 1,
        ],
    ],
];

// 動態速率限制
class DynamicRateLimiter
{
    public function resolve(Request $request): string
    {
        $user = $request->user();
        
        if (!$user) {
            return '30,1'; // 未認證用戶：每分鐘 30 次
        }
        
        if ($user->hasRole('premium')) {
            return '300,1'; // 付費用戶：每分鐘 300 次
        }
        
        return '60,1'; // 一般用戶：每分鐘 60 次
    }
}
```

## 📊 回應格式標準化

### 統一回應結構設計
```php
// app/Http/Resources/ApiResource.php
abstract class ApiResource extends JsonResource
{
    public function with($request): array
    {
        return [
            'meta' => [
                'version' => $this->getApiVersion(),
                'timestamp' => now()->toISOString(),
                'request_id' => $request->header('X-Request-ID', Str::uuid()),
            ]
        ];
    }
    
    protected function getApiVersion(): string
    {
        return request()->segment(2) ?? 'v1';
    }
}

// app/Http/Resources/ApiCollection.php
abstract class ApiCollection extends ResourceCollection
{
    public function toArray($request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'pagination' => [
                    'current_page' => $this->currentPage(),
                    'per_page' => $this->perPage(),
                    'total' => $this->total(),
                    'last_page' => $this->lastPage(),
                ],
                'version' => request()->segment(2) ?? 'v1',
                'timestamp' => now()->toISOString(),
            ],
            'links' => [
                'first' => $this->url(1),
                'last' => $this->url($this->lastPage()),
                'prev' => $this->previousPageUrl(),
                'next' => $this->nextPageUrl(),
            ]
        ];
    }
}
```

### 錯誤處理標準化
```php
// app/Exceptions/ApiException.php
class ApiException extends Exception
{
    protected string $errorType;
    protected array $errorDetails;
    
    public function __construct(
        string $message,
        string $errorType = 'general_error',
        array $errorDetails = [],
        int $code = 500,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        $this->errorType = $errorType;
        $this->errorDetails = $errorDetails;
    }
    
    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'error' => [
                'type' => $this->errorType,
                'message' => $this->getMessage(),
                'details' => $this->errorDetails,
            ],
            'meta' => [
                'version' => $request->segment(2) ?? 'v1',
                'timestamp' => now()->toISOString(),
                'request_id' => $request->header('X-Request-ID'),
            ]
        ], $this->getCode());
    }
}
```

良好的 API 設計不僅是技術實現，更是產品成功的關鍵因素。透過遵循 RESTful 原則、實作 HATEOAS、建立版本管理策略，我們為專案奠定了堅實的 API 基礎。

---

**下一步：** 了解如何實作多層架構設計 → [專案架構](04-project-architecture.md)
