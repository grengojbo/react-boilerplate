/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const nodeModulesPath = path.join(process.cwd(), 'node_modules');

const isDebug = true;

module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    // preLoaders: [
    //   {
    //     test: /\.tsx?$/,
    //     loader: 'tslint',
    //     include: path.resolve(process.cwd(), 'app'),
    //   },
    // ],
    loaders: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      loader: 'babel',
      exclude: /node_modules/,
      query: options.babelQuery,
    }, {
      test: /\.(tsx|ts)?$/,
      loader: `babel-loader?cacheDirectory,plugins[]=${require.resolve(path.join(nodeModulesPath, 'babel-plugin-external-helpers'))}!awesome-typescript-loader?tsconfig=${path.join(process.cwd(), 'tsconfig.webpack.json')}`,
      // loader: `babel-loader?cacheDirectory,plugins[]=${require.resolve(path.join(nodeModulesPath, 'babel-plugin-external-helpers'))},presets[]=${require.resolve(path.join(nodeModulesPath, 'babel-preset-es2015-webpack'))}!awesome-typescript-loader?tsconfig=${path.join(process.cwd(), 'tsconfig.webpack.json')}`,
      //   loader: 'babel?cacheDirectory,plugins[]=' + require.resolve(path.join(nodeModulesPath, 'babel-plugin-external-helpers-2')) +
      //   ',presets[]=' + require.resolve(path.join(nodeModulesPath, 'babel-preset-es2015-loose')) +
      //   '!ts-loader?configFileName=tsconfig.webpack.json',
      include: path.resolve(process.cwd(), 'app'),
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: [
          'css-loader?modules&minimize&sourceMap&importLoaders=2',
          'postcss-loader',
          'sass-loader?outputStyle=expanded&sourceMap&sourceMapContents',
        ],
      }),
    }, {
      // }, {
      //   test: /\.less$/, exclude: /\.module\.less$/, loader: 'style-loader!css-loader?minimize!less-loader?compress', include: path.resolve(process.cwd(), 'app'),
      // }, {
      //   test: /\.module\.less$/,
      //   loader: 'style-loader!css-loader?minimize&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less-loader?-compress',
      //   include: path.resolve(process.cwd(), 'app'),
      // }, {
      // Do not transform vendor's CSS with CSS-modules
      // The point is that they remain in global scope.
      // Since we require these CSS files in our JS or CSS files,
      // they will be a part of our compilation either way.
      // So, no need for ExtractTextPlugin here.
      //  test: /\.css$/,  loader: "style-loader!css-loader?minimize", include: path.resolve(process.cwd(), "app"),
      test: /\.css$/,
      include: /node_modules/,
      loaders: ['style-loader', 'css-loader', 'postcss-loader'],
      // loaders: [
      //   'style-loader',
      //   'css-loader?' + JSON.stringify({ // eslint-disable-line prefer-template
      //     sourceMap: isDebug,
      //     modules: true,
      //     // CSS Modules https://github.com/css-modules/css-modules
      //     localIdentName: isDebug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
      //     // CSS Nano http://cssnano.co/options/
      //     minimize: !isDebug,
      //   }),
      //   'postcss-loader',
      // ],
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader',
    }, {
      test: /\.(jpg|png|gif)$/,
      loaders: [
        'file-loader',
        'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
      ],
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url-loader?limit=10000',
    }],
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports?self.fetch!whatwg-fetch',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.NamedModulesPlugin(),
    new TsConfigPathsPlugin({ tsconfig: JSON.stringify(path.join(process.cwd(), 'tsconfig.webpack.json')) }),
    new webpack.LoaderOptionsPlugin({
      minimize: !isDebug,
      debug: isDebug,
      options: {
        postcss: function (bundler) { // eslint-disable-line object-shorthand, func-names
          return [
            // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
            // https://github.com/postcss/postcss-import
            require('postcss-import')({ addDependencyTo: bundler }),  // eslint-disable-line global-require
            // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
            // https://github.com/postcss/postcss-custom-properties
            require('postcss-custom-properties')(), // eslint-disable-line global-require
            // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
            // https://github.com/postcss/postcss-custom-media
            require('postcss-custom-media')(), // eslint-disable-line global-require
            // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
            // https://github.com/postcss/postcss-media-minmax
            require('postcss-media-minmax')(), // eslint-disable-line global-require
            // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
            // https://github.com/postcss/postcss-custom-selectors
            require('postcss-custom-selectors')(), // eslint-disable-line global-require
            // W3C calc() function, e.g. div { height: calc(100px - 2em); }
            // https://github.com/postcss/postcss-calc
            require('postcss-calc')(), // eslint-disable-line global-require
            // Allows you to nest one style rule inside another
            // https://github.com/jonathantneal/postcss-nesting
            require('postcss-nesting')(), // eslint-disable-line global-require
            // W3C color() function, e.g. div { background: color(red alpha(90%)); }
            // https://github.com/postcss/postcss-color-function
            require('postcss-color-function')(), // eslint-disable-line global-require, import/no-unresolved
            // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
            // https://github.com/iamvdo/pleeease-filters
            require('pleeease-filters')(), // eslint-disable-line global-require, import/no-unresolved
            // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
            // https://github.com/robwierzbowski/node-pixrem
            require('pixrem')(), // eslint-disable-line global-require, import/no-unresolved
            // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
            // https://github.com/postcss/postcss-selector-matches
            require('postcss-selector-matches')(), // eslint-disable-line global-require
            // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
            // https://github.com/postcss/postcss-selector-not
            require('postcss-selector-not')(), // eslint-disable-line global-require
            // Postcss flexbox bug fixer
            // https://github.com/luisrudge/postcss-flexbugs-fixes
            require('postcss-flexbugs-fixes')(), // eslint-disable-line global-require
            // Add vendor prefixes to CSS rules using values from caniuse.com
            // https://github.com/postcss/autoprefixer
            require('autoprefixer')(), // eslint-disable-line global-require
          ];
        },
      },
    }),
  ]),
  // resolveLoader: {
  //   root: nodeModulesPath,
  // },
  // tslint: {
  //   // Rules are in tslint.json
  //   emitErrors: true, // false = WARNING for webpack, true = ERROR for webpack
  //   formattersDirectory: path.join(nodeModulesPath, 'tslint-loader', 'formatters'),
  // },
  resolve: {
    modules: ['app', 'node_modules'],
    // modulesDirectories: ['node_modules', 'resources'],
    // alias: {
    //    'react$': path.join(nodeModulesPath, 'react', 'react.js'),
    //    'react-dom': path.join(nodeModulesPath, 'react-dom', 'index.js'),
    //    'flux': path.join(nodeModulesPath, 'flux', 'index.js'),
    //    'babel-polyfill': path.join(nodeModulesPath, 'babel-polyfill', 'lib', 'index.js'),
    // },
    extensions: [
      '.tsx',
      '.ts',
      '.scss',
      '.css',
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
});
