import baseConf from './rollup.config.prod'
import server from 'rollup-plugin-serve'

baseConf.watch = {
  chokidar: true,
  clearScreen: false,
  include: 'src/**'
}
baseConf.plugins.unshift(server({
  open: false,
  openPage: '/',
  verbose: true,
  contentBase: ['dist', 'examples'],
  host: '0.0.0.0',
  port: 3480
}))


export default baseConf