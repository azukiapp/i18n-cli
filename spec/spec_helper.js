import { resolve } from 'path';
import chai from 'chai';

require('source-map-support').install();

// Chai extensions
chai.use(require('chai-subset'));
chai.use(require('chai-as-promised'));
chai.use(require('chai-things'));
chai.config.includeStack = true;

var Helpers = {
  expect : chai.expect,

  fixture_path(...fixture) {
    return resolve(__dirname, 'fixtures', ...fixture);
  },
};

export default Helpers;
export { chai };
