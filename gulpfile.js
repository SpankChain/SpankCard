'use strict';

const gulp = require('gulp'),
  gutil = require('gulp-util'),
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  VYNOS_BACKGROUND = require('./webpack').VYNOS_BACKGROUND,
  VYNOS_SDK = require('./webpack').VYNOS_SDK,
  HARNESS = require('./webpack').HARNESS;


require('dotenv').config({path: '.env'});

const devserverPort = process.env.FRAME_PORT || '9090';

gulp.task('build', callback => {
  webpack([VYNOS_BACKGROUND, VYNOS_SDK]).run(function (err, stats) {
    if (err) {
      throw new gutil.PluginError('build', err);
    }

    gutil.log('build', stats.toString({
      colors: true
    }));

    callback();
  });
});

gulp.task('build:harness', ['build'], callback => {
  webpack(HARNESS).run(function (err, stats) {
    if (err) {
      throw new gutil.PluginError('build', err);
    }

    gutil.log('build:harness', stats.toString({
      colors: true
    }));

    callback();
  });
});

// Serve Vynos, Frame at http://localhost:9999/webpack-dev-server
gulp.task('serve', () => {
  new WebpackDevServer(webpack([ VYNOS_BACKGROUND, VYNOS_SDK ]), {
    contentBase: 'vynos/',
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    },
    compress: true
  }).listen(devserverPort, 'localhost', function (err) {
    if (err) {
      throw new gutil.PluginError('build:serve', err);
    }

    gutil.log('webpack-dev-server', `http://localhost:${devserverPort}/`);
  });
});

gulp.task('serve:harness', ['serve'], () => {
  new WebpackDevServer(webpack(HARNESS), {
    stats: {
      colors: true
    },
    contentBase: 'harness/',
    compress: true
  }).listen(process.env.HARNESS_PORT, 'localhost', function (err) {
    if (err) {
      throw new gutil.PluginError('serve:harness', err);
    }

    gutil.log('webpack-dev-server', `http://localhost:${process.env.HARNESS_PORT}/`);
  });
});

