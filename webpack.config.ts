import path from "path";

module.exports={
    entry: "./src/server.ts",
    output:{
        filename: "app.js",
        path: path.resolve(__dirname,'dist')
    },
    mode:"production",
    devtool:"inline-source-map",
    module: {
        rules: [
            {
                test:/\.ts(x)?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [".tsx",".ts",".js"]
    }
}