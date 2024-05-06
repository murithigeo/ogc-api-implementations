import path from "path";

module.exports = {
  entry: "./src/server.ts",
  output: {
    //filename: `${new Date()}_server.js`,
    filename: `server.js`,
    path: path.resolve(__dirname, "build"),
  },
  //mode: "production",
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
