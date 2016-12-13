/**
 * preprocessor.js
 *
 * Препроцесор для TypeScript Jest testing
 * http://stackoverflow.com/questions/40069865/jest-testing-with-react-typescript-and-es6
 *
 */

const tsc = require('typescript');
const babelJest = require('babel-jest');

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      return tsc.transpile(
        src,
        {
          module: tsc.ModuleKind.CommonJS,
          jsx: tsc.JsxEmit.React,
        },
        path,
        []
      );
    }
    if (path.endsWith('.js') || path.endsWith('.jsx')) {
        return babelJest.process(src, path);
    }
    return src;
  },
};