import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// UI
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// analyze
import { visualizer } from 'rollup-plugin-visualizer'

// Vue DevTools
import VueDevTools from 'vite-plugin-vue-devtools'

const enableVisualizer = process.env.ANALYZE?.trim() === 'true'

const getPagePath = (page: 'notice' | 'panel') =>
  resolve(__dirname, `src/${page}/index.html`)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    enableVisualizer &&
      visualizer({
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
        filename: './dist/build.html', //分析图生成的文件名
        open: true //如果存在本地服务端口，将在打包后自动展示
      }),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ],
      dts: resolve(__dirname, './src/auto-imports.d.ts')
    }),
    Components({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/ // .vue
      ],
      extensions: ['vue', 'tsx'],
      resolvers: [NaiveUiResolver()],
      dts: resolve(__dirname, './src/components.d.ts')
    }),
    vue(),
    vueJsx(),
    VueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@panel': fileURLToPath(new URL('./src/panel', import.meta.url)),
      '@notice': fileURLToPath(new URL('./src/notice', import.meta.url)),
      '@cmn': fileURLToPath(new URL('./src/common', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      input: {
        panel: getPagePath('panel'),
        notice: getPagePath('notice')
      },
      output: {
        chunkFileNames: 'view-src/js/[name]-[hash].js',
        entryFileNames: 'view-src/js/[name]-[hash].js',
        assetFileNames: 'view-src/[ext]/[name]-[hash].[ext]'
      }
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@cmn/styles/globalVariables.scss";'
      }
    }
  },
  root: 'src/',
  publicDir: resolve(__dirname, './src/utools'),
  base: './'
})
