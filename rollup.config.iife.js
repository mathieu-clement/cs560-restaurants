import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import strip from 'rollup-plugin-strip';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import globals from 'rollup-plugin-node-globals';

///https://github.com/rollup/rollup-plugin-commonjs /// for es6 imports


export default {
  input: 'src/js/index.js',
  output: {
    file: 'dist/js/app-iife.js',
    format: 'iife',
    sourceMap: true
  },
  external: ['d3','jQuery'],
  //globals: { 'd3': 'd3' },

  plugins: [
    resolve({
      // use "module" field for ES6 module if possible
      module: true, // Default: true

      // use "jsnext:main" if possible
      // – see https://github.com/rollup/rollup/wiki/jsnext:main
      jsnext: true, // Default: false
    }),
    //commonjs(),
    babel({
      exclude: 'node_modules/**',
      include: ['node_modules/d3', 'node_modules/d3-sankey']
    }),
    //globals()
  ],
};
