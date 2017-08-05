import path from 'path';
import { sprintf as printf } from 'sprintf-js';

function load(folder, locale) {
  var file = path.join(folder, locale);
  return require(file);
}

class I18n {
  constructor(opts) {
    if (typeof(opts.dict) == 'object') {
      this.dict = opts.dict;
    } else if (opts.locale) {
      this.dict = load(opts.path, opts.locale);
    }

    // Support colors?
    this.colors_enable = typeof(opts.colors) != 'undefined' ? opts.colors : true;
    let supportsColor  = opts.supportsColor || function() {
      return require('supports-color');
    };

    if (typeof(supportsColor) === 'function') {
      this.__defineGetter__('supportsColor', supportsColor);
    } else {
      this.supportsColor = supportsColor;
    }

    // Cache gets
    this.cache = {};
    this.template_cache = {};

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
          case 'string':
            return this._format(result, ...args);
          case 'object':
            return result.value;
          default:
            return key;
        }
      } catch (err) {
        var match, label = this.formatColors('${red}Translate error${reset}');
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
    var keys   = (typeof(key) == 'string') ? key.split('.') : key;
    var value = this._find(keys);

    // Search again, now ancestors is *
    if (!value) {
      var again_keys = new Array(...keys);
      again_keys[again_keys.length - 2] = '*';
      value = this._find(again_keys);
    }

    // Key to show in a error
    key = this.formatColors('${yellow}%s${yellow.close}', typeof(key) == 'string' ? key : key.join('.'));

    return { key, value };
  }

  _format(entry, ...args) {
    if (this.colors_enable) {
      if (!entry.builded) {
        entry.builded = this._build(entry.value);
      }
      entry = entry.builded(this.colors);
    } else {
      entry = entry.value;
    }
    return printf(entry, ...args);
  }

  formatColors(entry, ...args) {
    return printf(this._build(entry)(this.colors), ...args);
  }

  _build(value) {
    let builded = this.template_cache[value];

    if (!builded) {
      if (!this._template) {
        this._template = require('lodash.template');
      }

      builded = this.template_cache[value] = this._template(value);
    }

    return builded;
  }

  get colors() {
    return require(this.supportsColor ? './colors' : './no-colors');
  }
}

// Support es6 and es5
I18n.I18n      = I18n;
I18n.default   = I18n;
module.exports = I18n;
