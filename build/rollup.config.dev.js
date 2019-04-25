import  progress from 'rollup-plugin-progress'
import server from 'rollup-plugin-serve'
import sass from 'rollup-plugin-sass'
import { eslint } from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/scroller.js',
      format: 'umd',
      name: 'Scroller'
    }
    // {
    //   file: 'dist/scroller.min.js',
    //   format: 'umd'
    // },
    // {
    //   file: 'dist/scroller.common.js',
    //   format: 'cjs'
    // },
    // {
    //   file: 'dist/scroller.esm.js',
    //   format: 'esm'
    // },
  ],
  watch: {
    chokidar: true,
    clearScreen: false,
    include: 'src/**'
  },
  plugins: [
    server({
      open: false,
      openPage: '/',
      verbose: true,
      contentBase: ['dist', 'examples'],
      host: '0.0.0.0',
      port: 3480
    }),
    progress({
      clearLine: false
    }),
    sass({
      output: false,
      insert: true
    }),
    eslint({
      include: 'src/**.js'
    }),
    babel({
      include: 'src/**'
    })
  ]
}