import path from "path";
import { Configuration, ProvidePlugin } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import Path from "path";

const mode
  = (process.env.NODE_ENV as 'production' | 'development' | undefined)
  ?? 'development';

const config: Configuration = {
  mode: 'production',
  entry: {
    popup: "./src/popup.tsx",
    pageContent: "./src/pageContent.tsx",
    background: "./src/background.tsx"
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.sc?ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true
            },
          },
          "sass-loader"
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    fallback: {
      'stream': require.resolve('stream-browserify'),
      'buffer': require.resolve('buffer')
    },
    alias: {
      Core: Path.join(__dirname, 'src/core'),
      Popup: Path.join(__dirname, 'src/popup'),
      Background: Path.join(__dirname, 'src/background'),
      Style: Path.join(__dirname, 'src/style')
    }
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, './dist/js'),
    publicPath: '/js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "../css/[name].css"
    }),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  stats: {
    children: false,
    chunks: false
  },
  optimization: {
    minimize: mode === 'production'
  }
};

export default config;
