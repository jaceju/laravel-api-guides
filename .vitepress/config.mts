import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid(
defineConfig({
  title: "Laravel API 專案開發指南",
  description: "建置大型的 Laravel 純 API 專案 - 從框架設置到生產部署的完整指南",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '🏠 首頁', link: '/' },
      { text: '📚 開始學習', link: '/pages/01-introduction' },
      { text: '⚙️ 框架設置', link: '/pages/02-1-framework-setup' },
      { text: '🏗️ 專案架構', link: '/pages/04-project-architecture' }
    ],

    sidebar: [
      {
        text: '🚀 Laravel API 專案開發指南',
        items: [
          { text: '📖 前言', link: '/pages/01-introduction' },
          { 
            text: '🛠️ 準備工作', 
            link: '/pages/02-preparation',
            items: [
              { text: '⚙️ Laravel 框架設置', link: '/pages/02-1-framework-setup' }
            ]
          },
          { text: '🎯 設計 API', link: '/pages/03-api-design' },
          { 
            text: '🏗️ 設計專案架構', 
            link: '/pages/04-project-architecture',
            items: [
              { text: '🧩 模組化架構設計', link: '/pages/04-1-modular-architecture' },
              { text: '🔐 API 權限架構設計', link: '/pages/04-2-permission-architecture' }
            ]
          },
          { 
            text: '💻 開發細節', 
            link: '/pages/05-development-details',
            items: [
              { text: '🧪 測試框架配置與策略', link: '/pages/05-1-testing' }
            ]
          },
          { text: '🚀 佈署', link: '/pages/06-deployment' },
          { text: '🎊 總結', link: '/pages/07-conclusion' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
)
