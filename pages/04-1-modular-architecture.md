# 模組化架構設計

## 🎯 模組化架構的核心價值

### 企業級挑戰與解決方案

大型 Laravel API 專案面臨的關鍵挑戰：

**架構挑戰：**
- **單體架構限制** - 所有功能集中難以獨立開發和部署
- **循環依賴問題** - 模組間互相引用造成緊耦合
- **擴展性瓶頸** - 功能增長導致維護複雜度指數級增長
- **團隊協作障礙** - 多團隊並行開發容易產生衝突

**模組化解決方案：**
- **獨立邊界** - 清晰的業務領域分離
- **低耦合通訊** - 事件驅動的模組間協作
- **可重用設計** - 共用服務和介面契約
- **並行開發** - 團隊可獨立開發不同模組

### 解決目標
- 實現模組間的低耦合、高內聚
- 建立清晰的模組邊界和通訊機制  
- 提供可重用的共用服務架構
- 確保系統的可擴展性和可維護性

## 🏗️ 核心設計原則

### 1. 單一職責原則 (SRP)
每個模組只負責一個特定的業務領域，避免功能重疊。

```php
// ✅ 好的設計 - 單一職責
modules/
├── User/           # 只處理用戶相關功能
├── Profile/        # 只處理個人資料相關功能
├── Authentication/ # 只處理認證相關功能
└── Notification/   # 只處理通知相關功能
```

### 2. 依賴反轉原則 (DIP)
模組應該依賴抽象介面，而不是具體實現。

```php
// ✅ 使用介面契約
interface UserRepositoryInterface
{
    public function findById(int $id): ?User;
    public function create(array $data): User;
}

// 模組內部實現
class EloquentUserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?User
    {
        return User::find($id);
    }
}
```

### 3. 介面隔離原則 (ISP)
設計細粒度的介面，讓模組只依賴它們需要的方法。

```php
// ✅ 細粒度介面
interface UserFinderInterface
{
    public function findById(int $id): ?User;
}

interface UserCreatorInterface
{
    public function create(array $data): User;
}

// 而不是一個大型介面
interface UserRepositoryInterface extends UserFinderInterface, UserCreatorInterface
{
    // 組合多個小介面
}
```

## 🔧 模組架構設計

### 標準模組結構
```
modules/Profile/
├── app/
│   ├── Http/Controllers/    # 控制器
│   ├── Services/           # 服務層
│   ├── Repositories/       # 資料存取層
│   ├── Data/              # Data Objects (DTO)
│   ├── Events/            # 事件
│   ├── Models/            # Eloquent 模型
│   └── Contracts/         # 介面契約
├── config/config.php      # 模組配置
├── database/migrations/   # 資料庫遷移
├── routes/api.php        # API 路由
├── tests/                # 測試檔案
└── composer.json         # 模組依賴
```

> **完整的模組目錄結構可參考 nwidart/laravel-modules 官方文件**

### 層級架構設計
```
應用層 (Application Layer)
├── Controllers    # HTTP 控制器
├── Requests      # 請求驗證
└── Resources     # API 資源轉換

領域層 (Domain Layer)
├── Services      # 業務邏輯服務
├── Data         # 資料傳輸物件
├── Events       # 領域事件
└── Contracts    # 介面契約

基礎設施層 (Infrastructure Layer)
├── Repositories  # 資料存取
├── Models       # 資料模型
├── Jobs         # 背景工作
└── Listeners    # 事件處理
```

## 🔄 模組間通訊的最佳實踐

### 事件驅動架構

事件驅動架構是實現模組解耦的核心機制：

**設計原則：**
- 發布者不需知道監聽者的存在
- 監聽者可以獨立處理業務邏輯
- 支援多個監聽者同時處理同一事件
- 事件失敗不影響原始業務流程

**實作範例：**
```php
// 發布事件 - 用戶創建
event(new UserCreated(
    userId: $user->id,
    email: $user->email,
    userData: $data->toArray()
));

// 監聽事件 - 自動創建個人資料
class CreateUserProfile
{
    public function handle(UserCreated $event): void
    {
        $this->profileService->createDefaultProfile($event->userId);
    }
}
```

> **完整事件定義請參考：** `app/Events/` 和模組內的 `Events/` 目錄

### 服務介面契約

介面契約確保模組間的穩定通訊：

**契約設計原則：**
- 定義清晰的介面邊界
- 使用依賴注入降低耦合
- 支援多種實作方式
- 便於單元測試和 Mock

**實作策略：**
```php
// 定義服務介面
interface UserServiceInterface
{
    public function findUser(int $id): ?UserData;
    public function createUser(CreateUserData $data): UserData;
}

// 在其他模組中使用
class ProfileService
{
    public function __construct(private UserServiceInterface $userService) {}
    
    public function getProfileWithUser(int $profileId): ProfileWithUserData
    {
        $profile = $this->profileRepository->findById($profileId);
        $user = $this->userService->findUser($profile->user_id);
        
        return ProfileWithUserData::from([
            'profile' => $profile, 
            'user' => $user
        ]);
    }
}
```

> **介面契約定義請參考：** `app/Shared/Contracts/` 目錄

### 共用資料層設計

spatie/laravel-data 提供強型別的跨模組資料傳輸：

**Data Objects 優勢：**
- 強型別確保資料一致性
- 內建驗證和轉換功能
- 支援 Lazy Loading 最佳化效能
- 跨模組安全的資料傳遞

> **共用 Data Objects 請參考：** `app/Shared/Data/` 目錄

## 🛠️ 實作策略

### 1. 共用服務層設計
```php
// 註冊共用介面
class SharedServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->bind(ProfileServiceInterface::class, ProfileService::class);
    }
}
```

### 2. 模組註冊機制
```php
// 模組服務提供者
class ProfileServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // 註冊事件監聽器
        Event::listen(UserCreated::class, CreateUserProfile::class);
    }
}
```

### 3. 依賴注入設定
```php
// AppServiceProvider 中的服務綁定
public function register(): void
{
    $this->app->bind(UserServiceInterface::class, UserService::class);
    $this->app->singleton(CacheService::class, function ($app) {
        return new CacheService($app->make('cache'));
    });
}
```

> **詳細的服務容器配置請參考：** [依賴注入最佳實踐](https://laravel.com/docs/container)

## 📋 模組開發規範

### 1. 命名規範
```php
// 模組組件命名範例
modules/Profile/app/Http/Controllers/ProfileController.php
modules/Profile/app/Services/ProfileService.php
modules/Profile/app/Repositories/EloquentProfileRepository.php
modules/Profile/app/Data/ProfileData.php
modules/Profile/app/Contracts/ProfileServiceInterface.php
```

### 2. API 設計規範
```php
// RESTful API 路由設計
Route::prefix('profiles')->group(function () {
    Route::get('/', [ProfileController::class, 'index']);
    Route::post('/', [ProfileController::class, 'store']);
    Route::get('/{id}', [ProfileController::class, 'show']);
    Route::put('/{id}', [ProfileController::class, 'update']);
    Route::delete('/{id}', [ProfileController::class, 'destroy']);
});

// 統一的 API 回應格式
return response()->json([
    'message' => 'Profile retrieved successfully',
    'data' => ProfileResource::make($profile),
    'meta' => ['timestamp' => now()->toISOString()]
]);
```

> **完整的 API 設計規範請參考：** [API 設計](../03-api-design.md)

## 🧪 測試策略

### 1. 單元測試設計
```php
// 模組服務測試範例
class ProfileServiceTest extends TestCase
{
    public function test_can_create_profile(): void
    {
        // Arrange
        $repository = Mockery::mock(ProfileRepositoryInterface::class);
        $service = new ProfileService($repository);
        $userData = CreateProfileData::from(['user_id' => 1, 'bio' => 'Test bio']);

        // Act & Assert
        $repository->shouldReceive('create')->once()->andReturn($expectedProfile);
        $result = $service->createProfile($userData);
        $this->assertEquals($expectedProfile, $result);
    }
}
```

### 2. 整合測試設計
```php
// API 整合測試範例
class ProfileApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_profile_via_api(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;
        
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson('/api/v1/profiles', ['bio' => 'Test bio']);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'data' => ['id', 'user_id', 'bio']]);
    }
}
```

> **完整的測試策略請參考：** [測試框架配置](../05-1-testing.md)

## 🔄 模組生命週期管理

### 1. 模組創建
```bash
# 創建新模組
php artisan module:make Profile

# 創建模組組件
php artisan module:make-controller ProfileController Profile
php artisan module:make-model Profile Profile
php artisan module:make-service ProfileService Profile
php artisan module:make-repository ProfileRepository Profile
```

### 2. 模組啟用/停用
```bash
# 啟用模組
php artisan module:enable Profile

# 停用模組
php artisan module:disable Profile

# 查看模組狀態
php artisan module:list
```

### 3. 模組遷移
```bash
# 執行模組遷移
php artisan module:migrate Profile

# 回滾模組遷移
php artisan module:migrate-rollback Profile

# 重置模組遷移
php artisan module:migrate-reset Profile
```

## 📊 效能最佳化

### 1. 模組自動載入最佳化

`modules/Profile/composer.json`

```json
{
    "name": "nwidart/profile",
    "autoload": {
        "psr-4": {
            "Modules\\Profile\\": ""
        }
    },
    "extra": {
        "laravel": {
            "providers": [
                "Modules\\Profile\\Providers\\ProfileServiceProvider"
            ]
        }
    }
}
```

### 2. 服務快取策略
```php
// 快取服務結果
class ProfileService
{
    public function findProfile(int $id): ?ProfileData
    {
        return Cache::tags(['profiles'])
            ->remember("profile:{$id}", 3600, function () use ($id) {
                $profile = $this->profileRepository->findById($id);
                return $profile ? ProfileData::from($profile) : null;
            });
    }

    public function updateProfile(int $id, UpdateProfileData $data): ProfileData
    {
        $profile = $this->profileRepository->update($id, $data->toArray());
        
        // 清除相關快取
        Cache::tags(['profiles'])->forget("profile:{$id}");
        
        return ProfileData::from($profile);
    }
}
```

### 3. 資料庫查詢最佳化
```php
// 使用 Eager Loading 避免 N+1 問題
class ProfileRepository
{
    public function findWithUser(int $id): ?Profile
    {
        return Profile::with('user')->find($id);
    }

    public function getPaginatedProfiles(int $perPage = 15): LengthAwarePaginator
    {
        return Profile::with('user')
            ->select(['id', 'user_id', 'bio', 'avatar', 'created_at', 'updated_at'])
            ->paginate($perPage);
    }
}
```

---

**下一步：** 了解如何設計權限架構 → [權限架構設計](04-2-permission-architecture.md)
