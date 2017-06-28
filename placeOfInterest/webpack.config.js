var path = require('path');
var webpack = require('webpack');

const componentName = "PlaceOfInterestComponent";

module.exports = env => {
    console.log(env);
    const config = {
        entry: './components/index.ts',
        output: {
            path: __dirname + "/dist",
            filename: componentName + ".js",
            library: componentName,
            libraryTarget: 'commonjs',
            publicPath: '/components/'
        },
        // Enable sourcemaps for debugging webpack's output.
        devtool: "source-map",
        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
        },

        module: {
            // Important: The Loader Pipeline processing order is reverse of this list.  The first loader to process an input file is the last loader in this list.
            loaders: [
                // // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                // {
                //     enforce: "pre",
                //     test: /\.js$/,
                //     loader: "source-map-loader"
                // },
                {
                    test: /.[tj]sx?$/,
                    loader: 'babel-loader',
                    include: path.join(__dirname, 'components'),
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015', 'react']
                    }
                },
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                {
                    test: /\.tsx?$/,
                    loader: "awesome-typescript-loader"
                },
            ]
        },
        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        // See https://unpkg.com/#/ for React CDN hosting.
        externals: {
            // "react": "React",
            // "react-dom": "ReactDOM"
        }
    };
    return config;
};
