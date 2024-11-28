import url from 'rollup-plugin-url';
import { fromRollup } from '@web/dev-server-rollup';
import replace from '@rollup/plugin-replace';

export default {
    nodeResolve: true,
    watch: true,
    open: true,
    appIndex: './src/index.html',
    rootDir: './src',
    input: './src/index.js',
    output: {
      dir: './dist',
      format: 'esm',
    },
    middleware: [
      async (ctx, next) => {
        if (!ctx.url.includes('.') && ctx.url !== '/') {
          ctx.url = '/';
        }
        await next();
      },
    ],
    plugins: [
      fromRollup(replace)({
        'process.env.NODE_ENV': JSON.stringify('development'),
        preventAssignment: true,
      }),
      url({
        include: ['**/*.png', '**/*.jpg', '**/*.svg', '**/*.css'],
        limit: 0,
        fileName: 'assets/[name][extname]',
      }),
    ],
  };
  