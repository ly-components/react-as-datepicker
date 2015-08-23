var webpack = require('webpack');
var path = require('path');
var pkg = require('./package.json');
var hots = [path.join(__dirname, 'src'), path.join(__dirname, 'demo')];
if (pkg.dependencies)
  for (var pack in pkg.dependencies) {
    /^react-/.test(pack) && hots.push(path.join(__dirname, 'node_modules', pack));
  }
module.exports = {
  entry: {
    demo: [
      './demo/demo'
    ]
  },
  output: {
    path: path.join(__dirname, '/'),
    filename: '[name].entry.js',
    publicPath: '/react-as-datepicker/'
  },
  resolve: {
    modulesDirectories: ['node_modules', './src'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      include: hots
    }, {
      test: /\.less$/,
      loader: 'style!css!autoprefixer!less'
    }, {
      test: /\.css$/,
      loader: 'style!css!autoprefixer'
    }, {
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      loader: 'file'
    }]
  },
  plugins: []
};
