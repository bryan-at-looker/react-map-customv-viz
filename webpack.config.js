var path = require('path')

var webpackConfig = {
  devServer: {
    disableHostCheck: true
  },
  mode: 'production',
  entry: {
    react_map_turtle: './src/examples/react_map_turtle/react_map_turtle.js',
    // advanced_table: './src/examples/advanced_table/advanced_table.js',
    // v1_common: './src/common/common-entry.js',
    // hello_world: './src/examples/hello_world/hello_world.js',
    // hello_world_react: './src/examples/hello_world_react/hello_world_react.js',
    // sankey: './src/examples/sankey/sankey.ts',
    // liquid_fill_gauge: './src/examples/liquid_fill_gauge/liquid_fill_gauge.ts',
    // sunburst: './src/examples/sunburst/sunburst.ts',
    // collapsible_tree: './src/examples/collapsible_tree/collapsible_tree.ts',
    // chord: './src/examples/chord/chord.ts',
    // treemap: './src/examples/treemap/treemap.ts',
    // subtotal: './src/examples/subtotal/subtotal.ts',
    // image_carousel: './src/examples/image_carousel/image_carousel.js'
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
    library: "[name]",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      { test: /\.js$/, loader: "babel-loader" },
      { test: /\.css$/, loader: [ 'to-string-loader', 'css-loader' ] }
    ]
  }
}

module.exports = webpackConfig
