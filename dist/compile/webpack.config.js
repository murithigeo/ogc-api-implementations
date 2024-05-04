"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
module.exports = {
    entry: "./dist/compile/src/server.js",
    output: {
        filename: "full.js",
        path: path_1.default.resolve(__dirname, "dist/build"),
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
