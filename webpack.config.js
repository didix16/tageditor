module.exports = {
  entry: './js/main.js',
  output: {
    path: 'C:\\xampp\\htdocs\\tageditor\\dist',
    filename: 'tageditor.js'
  },
  module: {
    loaders: [{ 
      test: /\.js$/, 
      exclude: /node_modules/, 
      loader: "babel-loader" 
    }]
  }
};