const path = require('path');

const config = {
    entry: path.resolve(__dirname, 'src', 'index.ts'),

    mode: process.env.NODE_ENV,

    output: {
        filename: 'BEFV.min.js',
        path: path.resolve(__dirname, 'lib')
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
}

module.exports = config;
