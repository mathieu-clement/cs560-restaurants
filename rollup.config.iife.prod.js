import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import strip from 'rollup-plugin-strip';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';


export default {
  entry: 'src/js/index.js',
  output: {
    file: 'dist/js/app-iife.js',
    format: 'iife',
    sourceMap: true
  },
  external: [ 'd3', 'jQuery' ],
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
    /*strip({
      // set this to `false` if you don't want to
      // remove debugger statements
      //debugger: true,

      // defaults to `[ 'console.*', 'assert.*' ]`
      //functions: [ 'console.log', 'assert.*', 'debug', 'alert' ],

      // set this to `false` if you're not using sourcemaps –
      // defaults to `true`
      sourceMap: false
    }),

    //Json plugin does not work and can not parse keys as strings
    json({
      // All JSON files will be parsed by default,
      // but you can also specifically include/exclude files
      //include: 'node_modules/**',
      //exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
      exclude: [ 'node_modules/**'],

      // for tree-shaking, properties will be declared as
      // variables, using either `var` or `const`
      preferConst: true, // Default: false

      // specify indentation for the generated default export —
      // defaults to '\t'
      indent: '  '
    }),*/
    babel({
      exclude: 'node_modules/**',
      include: ['node_modules/d3', 'node_modules/d3-sankey']
    }),
    uglify()
  ],
};
