import path from "path";

module.exports = {
  entry: "./compile/src/server.js",
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "build"),
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
