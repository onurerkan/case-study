import url from 'rollup-plugin-url';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/app.js',
  output: {
    file: 'dist/app.js',
    format: 'esm',
  },
  plugins: [
    resolve(), terser(),
    url({
      include: ['**/*.png', '**/*.jpg', '**/*.svg', '**/*.css'],
      limit: 0,
      fileName: '[dirname][name][extname]',
    }),
    copy({
      targets: [
        { src: 'src/assets/images', dest: 'dist/assets/images' },
        { src: 'src/assets/styles', dest: 'dist/assets/styles' },
        { src: 'src/assets/fonts', dest: 'dist/assets/fonts' },
      ],
    }),
  ],
};
