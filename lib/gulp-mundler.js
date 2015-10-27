'use strict';

var gutil = require('gulp-util');
var through2 = require('through2');
var Mundler = require('mundler');
var bundles = [];

module.exports = function (opts) {
  var files = [];
	opts = opts || {};

  var onData = function (file, encoding, cb) {
    if (file.path) {
      files.push(file.path);
    }

    cb();
  };

  var onEnd = function(cb) {
    var _this = this;
    opts.options.streams = true;
    opts.options.logger = gutil;
    opts.bundles = bundles;

    var instance = new Mundler(opts);
    instance.bundle();

    instance.on('update', function(stream) {
      _this.emit('update', stream);
    });

    cb();
  };

  return through2.obj(onData, onEnd);
};

module.exports.addBundle = function (opts) {
  opts = opts || {};
  bundles[opts.name] = {};
  bundles[opts.name].src = [];

  var onData = function (file, encoding, cb) {
    if (file.path) {
      bundles[opts.name].src.push(file.path);
    }

    cb();
  };

  var onEnd = function(cb) {
    cb();
  };

  return through2.obj(onData, onEnd);
};
