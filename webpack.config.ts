import path from "path";

module.exports = {
  entry: "./dist/compile/src/server.js",
  output: {
    filename: "full.js",
    path: path.resolve(__dirname, "dist/build"),
  },
  mode: "production",
  optimization: {
    minimize: false,
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
