import { join as joinPath, resolve as resolvePath } from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import postcssPresevEnv from 'postcss-preset-env'

const isProduction = process.env.NODE_ENV === 'production'
const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : 'style-loader'

const config = {
  entry: './src/index.ts',
  output: {
    path: resolvePath('dist'),
    filename: '[name].[hash].js',
    assetModuleFilename: joinPath('assets', '[name][ext]'),
    clean: true,
  },
  devServer: {
    static: './dist',
    open: true,
    host: 'localhost',
    port: 5000,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath('src', 'index.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/i,
        use: [
          stylesHandler,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [postcssPresevEnv],
              },
            },
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|ico)$/i,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
}

export default () => {
  if (isProduction) {
    config.mode = 'production'
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
      }),
    )
    config.module.rules.push({
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    })
  } else {
    config.mode = 'development'
    config.devtool = 'inline-source-map'
  }
  return config
}
