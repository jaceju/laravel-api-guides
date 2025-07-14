# 企業級部署策略與 DevOps 實踐

現代企業級 Laravel API 專案的部署成功關鍵在於自動化、可擴展且可靠的 DevOps 實踐。

## 🚀 持續整合與部署策略

### CI/CD 的企業價值主張

- **品質保證自動化** - 每次變更都經過完整的測試驗證
- **部署一致性** - 標準化的部署流程消除人為錯誤
- **快速反饋循環** - 縮短從開發到上線的週期時間
- **風險降低** - 小批量、頻繁部署減少風險

### GitHub Actions 企業級工作流程

```yaml
# .github/workflows/laravel-ci-cd.yml
name: Laravel API CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  PHP_VERSION: '8.2'

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: secret
          MYSQL_DATABASE: testing
        ports: ['3306:3306']
        options: --health-cmd="mysqladmin ping" --health-interval=10s

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup PHP with extensions
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ env.PHP_VERSION }}
          extensions: mbstring, xml, ctype, iconv, intl, pdo_mysql
          coverage: xdebug
          
      - name: Install dependencies
        run: composer install --no-interaction --prefer-dist --optimize-autoloader
        
      - name: Setup Laravel environment
        run: |
          cp .env.testing .env
          php artisan key:generate
          
      - name: Run quality checks
        run: |
          ./vendor/bin/pest --coverage --min=80
          ./vendor/bin/phpstan analyse --memory-limit=2G
```

> **完整 CI/CD 配置請參考：** `.github/workflows/` 資料夾
        run: composer install --prefer-dist --no-progress --no-suggest --optimize-autoloader

      - name: Setup environment
        run: |
          cp .env.ci .env
          php artisan key:generate
          php artisan config:clear

      - name: Run database migrations
        run: php artisan migrate --force

      - name: Execute PHP linting
        run: vendor/bin/pint --test

      - name: Execute PHPStan analysis
        run: vendor/bin/phpstan analyse

      - name: Execute tests with coverage
        run: |
          php artisan test --coverage --min=80
          vendor/bin/pest --coverage --coverage-clover=coverage.xml

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
          fail_ci_if_error: true

  security:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
## 🔒 安全性與品質保證

### 企業級安全掃描流程

在現代 DevOps 中，安全性必須內建於 CI/CD 流程中，而非事後檢查。

#### 多層安全驗證策略

```yaml
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Composer security audit
        run: composer audit
        
      - name: SAST code analysis
        uses: github/super-linter@v4
        env:
          DEFAULT_BRANCH: main
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### 部署安全最佳實踐

1. **秘密管理** - 使用 GitHub Secrets 或專用秘密管理服務
2. **映像掃描** - 容器映像的漏洞掃描
3. **存取控制** - 基於角色的部署權限管理
4. **稽核追蹤** - 完整的部署操作記錄

> **安全配置請參考：** `.github/workflows/security.yml`

## 🚀 企業級部署自動化

### Kubernetes 原生部署策略

現代企業級應用的部署標準是 Kubernetes，提供彈性、可擴展性和高可用性。

#### 核心部署組件

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: laravel-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: laravel-api
  template:
    metadata:
      labels:
        app: laravel-api
    spec:
      containers:
      - name: app
        image: ghcr.io/company/laravel-api:latest
        ports:
        - containerPort: 80
        env:
        - name: APP_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: host
```

#### 分階段部署策略

```
開發環境 → 整合測試 → 預發布環境 → 金絲雀部署 → 全量生產部署
```

**部署策略優勢：**
- **零停機部署** - 滾動更新確保服務不中斷
- **快速回滾** - 出現問題時可即時回到前一版本
- **資源彈性** - 根據負載自動調整資源配置

> **完整 Kubernetes 配置請參考：** `k8s/` 資料夾
```

## 📊 監控與維運策略

### 企業級監控架構

現代化的企業應用必須具備完整的可觀測性，包含監控、日誌和追蹤三大支柱。

#### 關鍵監控指標

**應用層監控**
- API 回應時間和吞吐量
- 錯誤率和異常追蹤
- 資料庫查詢效能
- 記憶體和 CPU 使用率

**業務層監控**
- 用戶活躍度指標
- 功能使用統計
- 商業邏輯異常監控

#### 監控工具整合

```yaml
# 監控服務配置範例
monitoring:
  prometheus:
    enabled: true
    metrics:
      - laravel_request_duration
      - laravel_request_total
      - database_query_duration
      
  grafana:
    dashboards:
      - laravel_performance
      - business_metrics
      
  alerting:
    channels:
      - slack
      - email
      - pagerduty
```

> **監控配置請參考：** `monitoring/` 資料夾
>
> **Grafana Dashboard 定義請參考：** `monitoring/grafana/dashboards/`

## � 備份與災難復原

### 企業級資料保護策略

資料是企業的生命線，完善的備份和災難復原計畫是企業級應用的必要元素。

#### 備份策略設計

**多層備份方案**
- **即時備份** - 資料庫主從複製，即時同步
- **定期備份** - 每日全量備份，每小時增量備份
- **異地備份** - 跨區域備份儲存，防範地區性災難
- **版本控制** - 備份版本管理，支援時間點復原

#### 自動化備份實作

```bash
#!/bin/bash
# scripts/backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="laravel_api"

# 資料庫備份
mysqldump --single-transaction \
  --routines \
  --triggers \
  $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# 檔案系統備份
tar -czf $BACKUP_DIR/storage_$DATE.tar.gz storage/

# 上傳至雲端儲存
aws s3 cp $BACKUP_DIR/ s3://backup-bucket/ --recursive
```

#### 災難復原計畫（DRP）

**復原時間目標（RTO）**: 4 小時
**復原點目標（RPO）**: 1 小時
**備用系統啟動**: 自動化故障轉移

> **完整備份腳本請參考：** `scripts/backup/`
>
> **災難復原手冊請參考：** `docs/operations/disaster-recovery.md`

## 🎯 總結：現代化部署的成功要素

### DevOps 文化的建立

成功的企業級部署不僅是技術實作，更是組織文化的轉變：

1. **自動化優先** - 減少人為錯誤，提高部署效率
2. **持續反饋** - 快速發現問題並持續改進
3. **安全內建** - 安全性融入整個 DevOps 流程
4. **可觀測性** - 完整的監控、日誌和追蹤系統
5. **災難準備** - 主動的備份和復原策略

### 關鍵技術整合

- **CI/CD Pipeline** - GitHub Actions 的企業級工作流程
- **容器化部署** - Docker 和 Kubernetes 的現代化部署
- **安全掃描** - 內建於 CI/CD 的多層安全驗證
- **監控系統** - Prometheus + Grafana 的可觀測性平台
- **備份策略** - 多層次的資料保護方案

這些實踐確保了企業級 Laravel API 專案能夠安全、穩定且可擴展地運行在生產環境中。

> **部署實作請參考專案的 DevOps 配置檔案**
>
> **運維手冊請參考：** [維運指南](docs/operations/)

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name _;
        root /var/www/public;
        index index.php;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # API rate limiting
        limit_req_zone $binary_remote_addr zone=api:10m rate=60r/m;
        limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ ^/api/v\d+/auth {
            limit_req zone=auth burst=10 nodelay;
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ ^/api/ {
            limit_req zone=api burst=20 nodelay;
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php$ {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
            include fastcgi_params;
            fastcgi_read_timeout 300;
        }

        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## ☸️ Kubernetes 部署架構

### 應用程式部署配置

#### Deployment 與 Service 設定
```yaml
# k8s/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: laravel-api
  labels:
    app: laravel-api
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: laravel-api
  template:
    metadata:
      labels:
        app: laravel-api
    spec:
      containers:
      - name: laravel-api
        image: ghcr.io/company/laravel-api:latest
        ports:
        - containerPort: 80
        env:
        - name: APP_ENV
          value: "production"
        - name: APP_KEY
          valueFrom:
            secretKeyRef:
              name: laravel-secrets
              key: app-key
        - name: DB_CONNECTION
          value: "mysql"
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: laravel-config
              key: db-host
        - name: DB_DATABASE
          valueFrom:
            configMapKeyRef:
              name: laravel-config
              key: db-database
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: laravel-secrets
              key: db-username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: laravel-secrets
              key: db-password
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: storage
          mountPath: /var/www/storage
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: laravel-storage-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: laravel-api-service
spec:
  selector:
    app: laravel-api
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: laravel-api-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "60"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - api.example.com
    secretName: laravel-api-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: laravel-api-service
            port:
              number: 80
```

### 水平自動擴展配置

#### HPA 設定
```yaml
# k8s/hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: laravel-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: laravel-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

## 🔄 ArgoCD GitOps 工作流程

### GitOps 部署策略

#### ArgoCD 應用程式配置
```yaml
# argocd/laravel-api-app.yml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: laravel-api
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: https://github.com/company/laravel-api-k8s
    targetRevision: HEAD
    path: overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: laravel-api
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - CreateNamespace=true
    - PrunePropagationPolicy=foreground
    - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
  revisionHistoryLimit: 3
```

### Kustomize 配置管理

#### 多環境配置組織
```
k8s/
├── base/                    # 基礎配置
│   ├── deployment.yml
│   ├── service.yml
│   ├── configmap.yml
│   └── kustomization.yml
├── overlays/               # 環境特定配置
│   ├── staging/
│   │   ├── kustomization.yml
│   │   ├── replica-patch.yml
│   │   └── env-patch.yml
│   └── production/
│       ├── kustomization.yml
│       ├── replica-patch.yml
│       ├── env-patch.yml
│       └── resource-patch.yml
```

#### 生產環境覆蓋配置
```yaml
# k8s/overlays/production/kustomization.yml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../../base

patches:
- replica-patch.yml
- resource-patch.yml
- env-patch.yml

configMapGenerator:
- name: laravel-config
  literals:
  - APP_ENV=production
  - LOG_LEVEL=error
  - CACHE_DRIVER=redis
  - QUEUE_CONNECTION=redis

secretGenerator:
- name: laravel-secrets
  files:
  - app-key=secrets/app-key.txt
  - db-password=secrets/db-password.txt
  - jwt-secret=secrets/jwt-secret.txt

images:
- name: ghcr.io/company/laravel-api
  newTag: latest
```

## 📊 監控與可觀測性

### 應用程式監控策略

#### Prometheus 監控配置
```yaml
# k8s/monitoring/servicemonitor.yml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: laravel-api-metrics
  labels:
    app: laravel-api
spec:
  selector:
    matchLabels:
      app: laravel-api
  endpoints:
  - port: metrics
    interval: 30s
    path: /metrics
```

#### Laravel 應用程式指標
```php
// app/Http/Middleware/PrometheusMetrics.php
class PrometheusMetrics
{
    private CollectorRegistry $registry;
    private Counter $requestTotal;
    private Histogram $requestDuration;

    public function __construct(CollectorRegistry $registry)
    {
        $this->registry = $registry;
        
        $this->requestTotal = $registry->getOrRegisterCounter(
            'laravel_api',
            'http_requests_total',
            'Total number of HTTP requests',
            ['method', 'route', 'status_code']
        );
        
        $this->requestDuration = $registry->getOrRegisterHistogram(
            'laravel_api',
            'http_request_duration_seconds',
            'HTTP request duration in seconds',
            ['method', 'route']
        );
    }

    public function handle(Request $request, Closure $next)
    {
        $start = microtime(true);
        
        $response = $next($request);
        
        $duration = microtime(true) - $start;
        $route = $request->route()?->getName() ?? 'unknown';
        
        $this->requestTotal->inc([
            $request->method(),
            $route,
            $response->status()
        ]);
        
        $this->requestDuration->observe($duration, [
            $request->method(),
            $route
        ]);
        
        return $response;
    }
}
```

### 日誌管理策略

#### 結構化日誌配置
```php
// config/logging.php
return [
    'default' => env('LOG_CHANNEL', 'structured'),
    
    'channels' => [
        'structured' => [
            'driver' => 'custom',
            'via' => App\Logging\StructuredLogger::class,
            'level' => env('LOG_LEVEL', 'info'),
        ],
        
        'audit' => [
            'driver' => 'daily',
            'path' => storage_path('logs/audit.log'),
            'level' => 'info',
            'days' => 30,
        ],
        
        'performance' => [
            'driver' => 'daily',
            'path' => storage_path('logs/performance.log'),
            'level' => 'info',
            'days' => 7,
        ],
    ],
];

// app/Logging/StructuredLogger.php
class StructuredLogger
{
    public function __invoke(array $config)
    {
        $formatter = new JsonFormatter();
        
        $handler = new StreamHandler(
            $config['path'] ?? 'php://stdout',
            $config['level'] ?? Logger::INFO
        );
        
        $handler->setFormatter($formatter);
        
        $logger = new Logger('laravel-api');
        $logger->pushHandler($handler);
        
        return $logger;
    }
}
```

透過這些現代化的部署策略和 DevOps 實踐，我們能夠建立一個可靠、可擴展且易於維護的生產環境，確保 Laravel API 專案的穩定運行和持續交付。

---

**下一步：** 了解專案總結和未來發展 → [總結](07-conclusion.md)
