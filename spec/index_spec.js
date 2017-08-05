import h from './spec_helper';

// The same result expected
import I18n from '../src';
import { I18n as I18nNotDefault } from '../src';
var I18nOldStyle = require('../src');

describe('Azk I18n class', function() {
  it('should support import es6 and es5 styles', function() {
    h.expect(I18n).to.equal(I18nNotDefault);
    // h.expect(I18n).to.equal(I18nOldStyle);
  });

  describe('initialized with directory', function() {
    var i = new I18nOldStyle({
      path   : h.fixture_path('locales'),
      locale : 'en-US'
    });

    it('should load dictionary from the file', function() {
      h.expect(i.t('test.i18n_test')).to.equal(
        'test i18n module'
      );
    });
  });

  describe('constructed with colors options', function() {
    it('should support force supportsColor', function() {
      var i18n = new I18n({
        path   : h.fixture_path('locales'),
        locale : 'en-US',
        colors : true,
        supportsColor: true,
      });

      var key = 'test.with_colors';
      var formated = i18n.formatColors('${red}is red text${red.close}');
      h.expect(i18n.t(key)).to.equal(formated);
      h.expect(i18n.t(key)).to.not.equal('is red text');
    });

    it('should support a function for validate if supportsColor', function() {
      var i18n = new I18n({
        path   : h.fixture_path('locales'),
        locale : 'en-US',
        colors : true,
        supportsColor: () => false,
      });

      var key = 'test.with_colors';
      h.expect(i18n.t(key)).to.equal('is red text');
    });

    it('should disable colors anyway', function() {
      var i18n = new I18n({
        path   : h.fixture_path('locales'),
        locale : 'en-US',
        colors : false,
      });

      var key = 'test.with_colors';
      h.expect(i18n.t(key)).to.equal('${red}is red text${red.close}');
    });
  });

  describe('initialized with dictionary', function() {
    var i18n = new I18n({ dict: {
      key: { found: 'foobar' },
      formated: 'formated %s',
      array_value: ['item1', 'item2'],
      wildkey: {
        '*': { 'subkey': 'value default' },
        'linux': { 'subkey': 'value linux' },
      }
    }});
    var t = i18n.t;

    it('should return a key if not found value', function() {
      var key = 'key.not.found';
      var formated = i18n.formatColors('${yellow}%s${yellow.close}', key);
      h.expect(t(key)).to.equal(formated);
    });

    it('should return a value for key', function() {
      h.expect(t('key.found')).to.equal('foobar');
    });

    it('should support a array as key', function() {
      h.expect(t(['key', 'found'])).to.equal('foobar');
    });

    it('should support a array as value', function() {
      var result = ['item1', 'item2'];
      h.expect(t('array_value')).to.eql(result);
    });

    it('should support a wild key', function() {
      h.expect(t(['wildkey', 'linux', 'subkey'])).to.equal('value linux');
      h.expect(t(['wildkey', 'macosx', 'subkey'])).to.equal('value default');
    });

    it('should support get from the cache', function() {
      h.expect(t('key.found')).to.equal('foobar');
      h.expect(t('key.found')).to.equal('foobar');
    });

    it('should support formated', function() {
      h.expect(t('formated', 'foobar')).to.equal(
        'formated foobar'
      );
    });
  });
});
