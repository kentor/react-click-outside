const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');

const baseConfig = {
  input: './index.js',
  plugins: [babel(), nodeResolve(), commonjs()],
};

const commonjsConfig = Object.assign({}, baseConfig, {
  external: ['hoist-non-react-statics', 'react', 'react-dom'],
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs',
  },
});

const umdConfig = Object.assign({}, baseConfig, {
  external: ['react', 'react-dom'],
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

const umdMinConfig = Object.assign({}, baseConfig, {
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
  external: ['react', 'react-dom'],
  output: {
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    file: 'dist/index.umd.min.js',
    format: 'umd',
    name: 'ReactClickOutside',
  },
});

module.exports = [commonjsConfig, umdConfig, umdMinConfig];
