var path = require('path');


var webpackPath = path.resolve("./node_modules","webpack","bin","webpack.js");
console.log(webpackPath)
require(webpackPath);