import { legacyPlugin } from '@web/dev-server-legacy';
import { fromRollup } from '@web/dev-server-rollup';
import replace from '@rollup/plugin-replace';

export default {
    rootDir: './',
    files: './src/components/**/*.test.js',
    nodeResolve: true,
    testFramework: '@web/test-runner-mocha',
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
        legacyPlugin({
        polyfills: {
            webcomponents: true,
            custom: [
            {
                name: 'lit-polyfill-support',
                path: 'node_modules/lit/polyfill-support.js',
                test: "!('attachShadow' in Element.prototype)",
                module: false,
            },
            ],
        },
        }),
    ],
};