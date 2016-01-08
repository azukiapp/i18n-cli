var path = require('path');

require('source-map-support').install();

var Helpers = {
  expect : require('azk-dev/lib/chai').expect,

  fixture_path(...fixture) {
    return path.resolve(__dirname, 'fixtures', ...fixture);
  },
};

export default Helpers;
