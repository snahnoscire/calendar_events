const mix = require('laravel-mix');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.ts('resources/assets/js/index.ts', 'public/js').vue()
    .sass('resources/assets/sass/app.scss', 'public/css')
    .webpackConfig({
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader',
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {cacheDirectory: true}
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                appendTsSuffixTo: [/\.vue$/],
                                transpileOnly: true
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: ["*", ".js", ".jsx", ".vue", ".ts", ".tsx"],
            alias: {
                'bootstrap-vue$': 'bootstrap-vue/src/index.js'
            }
        }
    });
