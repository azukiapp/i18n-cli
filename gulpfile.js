var azk_gulp = require('azk-dev/lib/gulp')({
  cwd  : __dirname,
  src: { src: "./src", dest: "./lib" },
  default: ['watch:test:lint'],
});
