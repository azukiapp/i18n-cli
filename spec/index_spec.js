import h from './spec_helper';
import { I18n } from '../src';

var chalk = require('chalk');

describe("Azk I18n class", function() {
  describe("initialized with directory", function() {
    var i = new I18n({
      path   : h.fixture_path('locales'),
      locale : 'en-US'
    });

    it("should load dictionary from the file", function() {
      h.expect(i.t("test.i18n_test")).to.equal(
        "test i18n module"
      );
    });
  });

  describe("initialized with dictionary", function() {
    var t = new I18n({ dict: {
      key: { found: "foobar" },
      formated: "formated %s",
      array_value: ["item1", "item2"],
      wildkey: {
        '*': { 'subkey': 'value default' },
        'linux': { 'subkey': 'value linux' },
      }
    }}).t;

    it("should return a key if not found value", function() {
      var key = "key.not.found";
      h.expect(t(key)).to.equal(chalk.yellow(key));
    });

    it("should return a value for key", function() {
      h.expect(t("key.found")).to.equal("foobar");
    });

    it("should support a array as key", function() {
      h.expect(t(["key", "found"])).to.equal("foobar");
    });

    it("should support a array as value", function() {
      var result = ["item1", "item2"];
      h.expect(t("array_value")).to.eql(result);
    });

    it("should support a wild key", function() {
      h.expect(t(["wildkey", "linux", "subkey"])).to.equal("value linux");
      h.expect(t(["wildkey", "macosx", "subkey"])).to.equal("value default");
    });

    it("should support get from the cache", function() {
      h.expect(t("key.found")).to.equal("foobar");
      h.expect(t("key.found")).to.equal("foobar");
    });

    it("should support formated", function() {
      h.expect(t("formated", "foobar")).to.equal(
        "formated foobar"
      );
    });
  });
});
