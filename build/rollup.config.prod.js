import  progress from 'rollup-plugin-progress'
import sass from 'rollup-plugin-sass'
import { eslint } from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'docs/scroller.js',
      format: 'umd',
      name: 'Scroller'
    }
  ],
  plugins: [
    progress({
      clearLine: false
    }),
    sass({
      output: false,
      insert: true,
      processor: css => postcss([autoprefixer])
        .process(css)
        .then(result => result.css)
    }),
    eslint({
      include: 'src/**.js'
    }),
    babel({
      include: 'src/**'
    })
  ]
}