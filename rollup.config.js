import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript2 from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';

export default [
  // ES Module build
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/esm/index.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/esm/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    plugins: [
      resolve(),
      commonjs(),
      typescript2({tsconfig: './tsconfig.json'}),
    ],
  },
  // CommonJS build
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    plugins: [
      resolve(),
      commonjs(),
      typescript2({tsconfig: './tsconfig.json'}),
      terser(),
    ],
  },
];
