const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');

const baseConfig = {
  input: './index.js',
  external: ['react', 'react-dom'],
};

const cjsAndEsConfig = Object.assign({}, baseConfig, {
  plugins: [babel(), nodeResolve(), commonjs()],
  external: baseConfig.external.concat('hoist-non-react-statics'),
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
    },
  ],
});

const umdConfig = Object.assign({}, baseConfig, {
  plugins: [babel(), nodeResolve(), commonjs()],
  output: {
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    file: 'dist/index.umd.js',
    format: 'umd',
    name: 'ReactClickOutside',
  },
});

const umdMinConfig = Object.assign({}, umdConfig, {
  plugins: [
    babel(),
    nodeResolve(),
    commonjs(),
    uglify.uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    }),
  ],
  output: Object.assign({}, umdConfig.output, {
    file: 'dist/index.umd.min.js',
  }),
});

module.exports = [cjsAndEsConfig, umdConfig, umdMinConfig];
