import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'

// 注释插件导入（避免未使用的导入警告）
// import { ThumbnailHashImages } from '@nolebase/vitepress-plugin-thumbnail-hash/vite'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { PageProperties, PagePropertiesMarkdownSection } from '@nolebase/vitepress-plugin-page-properties/vite'

import { githubRepoLink } from './metadata'

export default defineConfig(async () => {
  return {
    assetsInclude: ['**/*.mov'],
    optimizeDeps: {
      exclude: ['vitepress'],
    },
    plugins: [
      Inspect(),
      GitChangelog({
        repoURL: () => githubRepoLink,
      }),
      GitChangelogMarkdownSection({
        getChangelogTitle: (): string => '文件历史',
        getContributorsTitle: (): string => '贡献者',
        excludes: ['toc.md', 'index.md'],
      }),
      PageProperties(),
      PagePropertiesMarkdownSection({
        excludes: ['toc.md', 'index.md'],
      }),
      // 注释掉 ThumbnailHashImages 插件，彻底绕开 Skia 错误
      // ThumbnailHashImages(),
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