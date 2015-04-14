var azk_gulp = require('azk-dev/gulp')({
  cwd  : __dirname,
  babel: {},
  src: { src: "./src", dest: "./lib" },
  default: ['watch:test:lint'],
});
