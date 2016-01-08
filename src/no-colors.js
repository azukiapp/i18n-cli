import ansi from 'ansi-styles';
import clone from 'lodash.clone';

let no_colors = clone(ansi);

Object.keys(no_colors).forEach((key) => {
  no_colors[key].open  = '';
  no_colors[key].close = '';
  no_colors[key].toString = () => no_colors[key].open;
});

module.exports = no_colors;
