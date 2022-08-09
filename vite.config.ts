import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import packageInfo from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'lib',
    minify: false,
    lib: {
      entry: resolve(__dirname, './scroller/index.ts'),
      name: packageInfo.name,
      formats: ['es', 'umd', 'cjs'],
      fileName: 'scroller'
    }
  },
  plugins: [
    vue(),
    dts({
      entryRoot: resolve(__dirname, './scroller')
    })
  ],
  server: {
    port: 5556
  }
})
