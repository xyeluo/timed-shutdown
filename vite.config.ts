import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import { visualizer } from 'rollup-plugin-visualizer'

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
      ]
    }),
    Components({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/ // .vue
      ],
      resolvers: [NaiveUiResolver()]
    }),
    vue(),
    vueJsx()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@panel': fileURLToPath(new URL('./src/panel', import.meta.url)),
      '@notice': fileURLToPath(new URL('./src/notice', import.meta.url)),
    }
  },
  build: {
    rollupOptions: {
      input: {
        panel: getPagePath('panel'),
        notice: getPagePath('notice')
      },
      output: {
        chunkFileNames: 'src/js/[name]-[hash].js',
        entryFileNames: 'src/js/[name]-[hash].js',
        assetFileNames: 'src/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    open: '/src/panel/'
  }
})
