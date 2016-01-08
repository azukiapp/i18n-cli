import ansi from 'ansi-styles';

Object.keys(ansi).forEach((key) => {
  ansi[key].toString = () => ansi[key].open;
});

module.exports = ansi;
