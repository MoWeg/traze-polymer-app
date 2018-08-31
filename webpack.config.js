const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const path = require('path');

const BUILD_PATH = path.resolve(__dirname, 'build');
const SRC_PATH = path.resolve(__dirname, 'src');

const copyStatics = {
    copyWebcomponents: {
      from:path.resolve('./node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'),
      to: BUILD_PATH +'/vendor',
      flatten: true
    }
};

module.exports = {
    entry: SRC_PATH + '/index.js',
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    plugins: [
        new CopyWebpackPlugin(
            [
                copyStatics.copyWebcomponents
            ]
        ),
        new HtmlWebpackPlugin({
            filename: BUILD_PATH + '/index.html',
            template: SRC_PATH + '/index.html',
            inject: 'body', //'body' == true | 'head'
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ['vendor/webcomponents-loader.js'],
            append: false
        })
    ],
    devServer: {
        contentBase: BUILD_PATH,
        compress: true,
        overlay: {
          errors: true
        },
        port: 3000,
        host: '0.0.0.0',
        disableHostCheck: true
      }
}