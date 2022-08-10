import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'lib',
    minify: false,
    lib: {
      entry: resolve(__dirname, './scroller/index.ts'),
      name: 'Scroller',
      formats: ['es', 'umd', 'iife'],
      fileName: 'scroller'
    },
    rollupOptions: {
      external: ['resize-observer-polyfill']
    }
  },
  plugins: [
    vue(),
    dts({
      entryRoot: resolve(__dirname, './scroller'),
      outputDir: resolve(__dirname, './lib')
    })
  ],
  server: {
    port: 5556
  }
})
