import { defineConfig, Plugin } from 'vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import fs from 'fs-extra'

import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { PageProperties, PagePropertiesMarkdownSection } from '@nolebase/vitepress-plugin-page-properties/vite'
import { ThumbnailHashImages } from '@nolebase/vitepress-plugin-thumbnail-hash/vite'

import { githubRepoLink } from './metadata'

// 新增：创建错误日志文件（用于记录失败图片）
const errorLogPath = './thumbnail-error.log'
if (!fs.existsSync(errorLogPath)) {
  fs.writeFileSync(errorLogPath, `[${new Date().toISOString()}] 图片处理错误日志\n==================\n`, 'utf-8')
}

// 新增：自定义错误捕获插件，拦截 ThumbnailHashImages 的错误
function captureThumbnailError(): Plugin {
  return {
    name: 'capture-thumbnail-error',
    // 在所有插件执行后监听错误
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.on('error', (err) => {
          if (err.message.includes('Create skia surface failed')) {
            // 提取错误堆栈中的图片路径（从堆栈信息中匹配文件路径）
            const stackLines = err.stack?.split('\n') || []
            // 匹配类似 "/xxx/xxx.png" 或 "/xxx/xxx.jpg" 的图片路径
            const imagePathMatch = stackLines.find(line => /\.(png|jpg|jpeg|webp)/i.test(line))
            const imagePath = imagePathMatch ? imagePathMatch.match(/(\/[^ ]+\.(png|jpg|jpeg|webp))/i)?.[1] : '未知路径'

            // 打印错误到终端
            console.error('\n❌ 图片处理失败（Skia 错误）：')
            console.error(`   图片路径：${imagePath}`)
            console.error(`   错误详情：${err.message}\n`)

            // 写入错误日志
            const errorMsg = `[${new Date().toISOString()}] 图片路径：${imagePath}\n错误详情：${err.message}\n\n`
            fs.appendFileSync(errorLogPath, errorMsg, 'utf-8')
          }
          next(err)
        })
        next()
      })
    },
    // 构建阶段的错误捕获
    buildStart() {
      this.on('error', (err) => {
        if (err.message.includes('Create skia surface failed')) {
          const stackLines = err.stack?.split('\n') || []
          const imagePathMatch = stackLines.find(line => /\.(png|jpg|jpeg|webp)/i.test(line))
          const imagePath = imagePathMatch ? imagePathMatch.match(/(\/[^ ]+\.(png|jpg|jpeg|webp))/i)?.[1] : '未知路径'

          console.error('\n❌ 构建阶段图片处理失败（Skia 错误）：')
          console.error(`   图片路径：${imagePath}`)
          console.error(`   错误详情：${err.message}\n`)

          const errorMsg = `[${new Date().toISOString()}] 构建阶段 - 图片路径：${imagePath}\n错误详情：${err.message}\n\n`
          fs.appendFileSync(errorLogPath, errorMsg, 'utf-8')
        }
      })
    }
  }
}

export default defineConfig(async () => {
  return {
    assetsInclude: ['**/*.mov'],
    optimizeDeps: {
      exclude: ['vitepress'],
    },
    plugins: [
      Inspect(),
      // 1. 先加载自定义错误捕获插件
      captureThumbnailError(),
      // 2. 再加载其他插件（包括 ThumbnailHashImages）
      GitChangelog({ repoURL: () => githubRepoLink }),
      GitChangelogMarkdownSection({
        getChangelogTitle: () => '文件历史',
        getContributorsTitle: () => '贡献者',
        excludes: ['toc.md', 'index.md'],
      }),
      PageProperties(),
      PagePropertiesMarkdownSection({ excludes: ['toc.md', 'index.md'] }),
      ThumbnailHashImages(), // 保留插件，不移除
      Components({
        include: [/\.vue$/, /\.md$/],
        dirs: '.vitepress/theme/components',
        dts: '.vitepress/components.d.ts',
      }),
      UnoCSS(),
    ],
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-highlight-targeted-heading',
        '@nolebase/vitepress-plugin-inline-link-preview',
      ],
    },
  }
})