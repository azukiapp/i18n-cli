var path   = require('path');
var printf = require('printf');
var chalk  = require('chalk');

function load(folder, locale) { // jshint ignore:line
  var file = path.join(folder, locale);
  return require(file);
}

class I18n {
  constructor(opts) {
    if (typeof(opts.dict) == "object") {
      this.dict = opts.dict;
    } else if (opts.locale) {
      this.dict = load(opts.path, opts.locale);
    }

    // Cache gets
    this.cache = {};

    // Alias to translate
    this.t = (...args) => {
      return this.translate(...args);
    };
  }

  _find(keys) {
    var buffer = this.dict || {};

    for (var i = 0; i < keys.length; i++) {
      buffer = buffer[keys[i]];
      if (!buffer) {
        break;
      }
    }

    return buffer;
  }

  translate(key, ...args) {
    var result = this.cache[key];

    if (typeof(result) === 'undefined') {
      this.cache[key] = result = this._resolveKey(key);
    }

    if (result.value) {
      try {
        switch (typeof(result.value)) {
          case "string":
            return printf(result.value, ...args);
          case "object":
            return result.value;
          default:
            return key;
        }
      } catch (err) {
        var match, label = chalk.red("Translate error");
        match = err.toString().match(/Error: missing key (.*)/);
        if (match) {
          return label + `: '${key}', missing: ${match[1]}`;
        }

        match = err.toString().match(/Error: format requires a mapping/);
        if (match) {
          return label + `: '${key}', missing a mappping`;
        }

        throw err;
      }
    } else {
      return result.key;
    }
  }

  _resolveKey(key) {
    var keys   = (typeof(key) == "string") ? key.split('.') : key;
    var value = this._find(keys);

    // Search again, now ancestors is *
    if (!value) {
      var again_keys = new Array(...keys);
      again_keys[again_keys.length - 2] = '*';
      value = this._find(again_keys);
    }

    // Key to show in a error
    key = chalk.yellow(typeof(key) == "string" ? key : key.join("."));

    return { key, value };
  }
}

// Support es6 and es5
I18n.I18n       = I18n;
I18n.default    = I18n;
I18n.__esModule = true;
module.exports  = I18n;
