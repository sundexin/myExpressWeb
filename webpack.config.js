/**
 * @Author: sundexin <sundx>
 * @Date:   2016-09-15T16:43:55+08:00
 * @Email:  20108847@qq.com
 * @Project: my Projece
 * @Last modified by:   sundx
 * @Last modified time: 2016-09-15T22:14:27+08:00
 */



var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const debug = process.env.NODE_ENV !== 'production';

var entries = getEntry('src/scripts/page/**/*.js', 'src/scripts/page/');
var chunks = Object.keys(entries);
console.log(chunks);

var config = {
  entry: entries,
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/static/',
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/[id].chunk.js?[chunkhash]'
  },

	resolve: {
    extensions: ['', '.js', '.css', '.scss', '.jade', '.png', '.jpg'], //当requrie的模块找不到时，添加这些后缀
    node_modules: ['web_modules', 'node_modules'], //排除目录
    alias: {
      AppStore : 'js/stores/AppStores.js',//后续直接 require('AppStore') 即可
      ActionType : 'js/actions/ActionType.js',
      AppAction : 'js/actions/AppAction.js'
    }
  },

	// externals: _externals,

	node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
		fs: "empty"
  },

  module: {
    loaders: [ //加载器
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules!postcss'),
				exclude: /node_modules/ //忽略目录
          //  test: /\.css$/, loader: 'style!css?modules!postcss'
      }, {
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract("stylus", "css-loader!postcss!stylus-loader"),
      }, {
        test: /\.html$/,
        loader: "html?-minimize" //避免压缩html,https://github.com/webpack/html-loader/issues/50
      }, {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }, {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader?limit=8192&name=imgs/[name]-[hash].[ext]',
				query: {
					limit: 8192
				}
      }, {
        test: /\.jade$/,
        loader: ['jade-loader'],
        query: {
          self: true
        }
      }
    ]
  },

  devtool: 'eval-source-map', // 配置生成Source Maps，选择合适的选项

  postcss: [
    require('autoprefixer') // 调用autoprefixer插件
  ],

  devServer: {
    contentBase: "./public", // 本地服务器所加载的页面所在的目录
    colors: true, // 终端中输出结果为彩色
    historyApiFallback: true, // 不跳转
    inline: true, // 实时刷新
		host: 'localhost',
		port: 9090  //默认8080
  },

  plugins: [
    new webpack.BannerPlugin("Copyright Flying Unicorns inc."), // 在这个数组中new一个就可以了

    new webpack.ProvidePlugin({ // 加载jq
      $: 'jquery'
    }),

    new webpack.HotModuleReplacementPlugin(), // 热加载插件

    new CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
      chunks: chunks,  // 提取哪些模块共有的部分
			// chunks: ['index','list','about'], //提取哪些模块共有的部分
      minChunks: chunks.length // 提取所有entry共同依赖的模块
    }),

    new ExtractTextPlugin('styles/[name].css', {
			allChunks: true
		}), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    debug ? function() {} : new UglifyJsPlugin({ //压缩代码
      compress: {
        warnings: false
      },
      except: ['$super', '$', 'exports', 'require'] //排除关键字
    }),
  ]
};


var pages = Object.keys(getEntry('src/views/**/*.html', 'src/views/'));
pages.forEach(function(pathname) {
  var conf = {
    filename: './views/' + pathname + '.html', //生成的html存放路径，相对于path
    template: './src/views/' + pathname + '.html', //html模板路径
    inject: false, //js插入的位置，true/'head'/ 'body'/false

    /*
     * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
     * 如在html标签属性上使用{{...}}表达式，很多情况下并不需要在此配置压缩项，
     * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
     * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
     */
    // minify: { //压缩HTML文件
    // 	removeComments: true, //移除HTML中的注释
    // 	collapseWhitespace: false //删除空白符与换行符
    // }
  };
  if (pathname in config.entry) {
    conf.favicon = path.resolve(__dirname, './src/imgs/favicon.ico'); //favicon路径，通过webpack引入同时可以生成hash值
    conf.inject = 'body';
    conf.chunks = ['vendors', pathname]; //需要引入的chunk，不配置就会引入所有页面的资源
    conf.hash = true;
  }
  config.plugins.push(new HtmlWebpackPlugin(conf));
});


module.exports = config;

function getEntry(globPath, pathDir) {
  var files = glob.sync(globPath);
  var entries = {},
    entry, dirname, basename, pathname, extname;

  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    pathname = path.normalize(path.join(dirname, basename));
    pathDir = path.normalize(pathDir);
    if (pathname.startsWith(pathDir)) {
      pathname = pathname.substring(pathDir.length)
    }
    entries[pathname] = ['./' + entry];
  }
  return entries;
}

function _externals() {
    let manifest = require('./package.json');
    let dependencies = manifest.dependencies;
    let externals = {};
    for (let p in dependencies) {
        externals[p] = 'commonjs ' + p;
    }
    return externals;
}
