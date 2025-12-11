import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.esm.js',
                format: 'es',
                sourcemap: true,
            },
            {
                file: 'dist/index.cjs.js',
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
            },
        ],
        plugins: [resolve({ extensions: ['.js', '.ts'] }), commonjs(), typescript({ tsconfig: './tsconfig.json' })],
    },
    {
        input: 'src/index.ts',
        output: [{ file: 'dist/index.d.ts', format: 'es' }],
        plugins: [dts()],
    },
];
