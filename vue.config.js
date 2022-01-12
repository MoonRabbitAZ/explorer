const UnusedWebpackPlugin = require('unused-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const fs = require('fs')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const root = path.resolve(__dirname, resolveApp('src'))
const { ArgumentParser } = require('argparse')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const parser = new ArgumentParser({
  addHelp: true,
})

if (process.env.NODE_ENV === 'production' && !process.env.VUE_APP_BUNDLE_ANALYZER) {
  parser.addArgument('build')
  parser.addArgument(['--set-build-version'], {
    metavar: 'VALUE',
    help: 'Set build version env key. Equivalent to --env-arg BUILD_VERSION [VALUE]',
    type: 'string',
    dest: 'setBuildVersion',
  })
  const args = parser.parseArgs()

  if (args.setBuildVersion) {
    process.env.VUE_APP_BUILD_VERSION = args.setBuildVersion
  }
}

const optionalPlugins = []

if (process.env.NODE_ENV !== 'test') {
  optionalPlugins.push(
    new UnusedWebpackPlugin({
      directories: [path.join(__dirname, 'src')],
      failOnUnused: process.env.NODE_ENV === 'production',
      exclude: ['*.spec.js', '*.e2e.js', '*.md', 'test/*'],
    }),
  )
}

if (process.env.VUE_APP_BUNDLE_ANALYZER === 'true') {
  optionalPlugins.push(new BundleAnalyzerPlugin())
}

module.exports = {
  devServer: {
    port: 8095,
  },
  runtimeCompiler: true,
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? 'false' : 'source-map',
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, resolveApp('static')),
            to: 'static',
          },
        ],
      }),
      ...optionalPlugins,
    ],
    resolve: {
      symlinks: false,
      alias: {
        '@': `${root}/`,
        '@static': path.resolve(__dirname, resolveApp('static')),
        '@scss': `${root}/scss`,
        '@locales': `${root}/i18n`,
        '@/vuex': `${root}/vuex`,
        '@/vue-router': `${root}/vue-router`,
        '@api': `${root}/api.js`,
        '@explorer-page': `${root}/vue/pages/explorer`,
        '@event-calendar-page': `${root}/vue/pages/event-calendar`,
        '@wallet-page': `${root}/vue/pages/wallet`,
        '@parachains-page': `${root}/vue/pages/parachains`,
        '@settings-page': `${root}/vue/pages/settings`,
        '@gilt-page': `${root}/vue/pages/gilt`,
        '@society-page': `${root}/vue/pages/society`,
        '@democracy-page': `${root}/vue/pages/democracy`,
        '@council-page': `${root}/vue/pages/council`,
        '@treasury-page': `${root}/vue/pages/treasury`,
        '@bounties-page': `${root}/vue/pages/bounties`,
        '@tech-comm-page': `${root}/vue/pages/tech-comm`,
        '@bridge-page': `${root}/vue/pages/bridge`,
        '@evm-explorer-page': `${root}/vue/pages/evm-explorer`,
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        sourceMap: true,
      },
    },
  },

  chainWebpack: config => {
    // Pre-fetching ALL the chunks harms the app performance
    config.plugins.delete('prefetch')

    // Fix issue with url(...) imports in SASS
    const moduleTypes = ['vue-modules', 'vue', 'normal-modules', 'normal']
    moduleTypes.forEach(rule => {
      config.module.rule('scss')
        .oneOf(rule)
        .use('resolve-url-loader')
        .loader('resolve-url-loader')
        .before('sass-loader')
        .end()
        .use('sass-loader')
        .loader('sass-loader')
        .tap(options => ({
          ...options,
          sourceMap: true,
        }))
    })

    config.module
      .rule('images')
      .test(/^((?!\/node_modules).)*(\.png|\.jpg|\.jpeg)$/)
      .use('url-loader')
      .loader('url-loader')
  },
}
