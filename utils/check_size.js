const fs   = require('fs')
    , file = require('file')

var sizeMap = {}
  , ignore  = ['..', '.git', 'node_modules', 'utils']

var ignoreFolder = function(path) {
  var result = false

  ignore.forEach(function(pattern) {
    result = result || (path.indexOf(pattern) !== -1)
  })

  return result
}


file.walkSync(__dirname + '/..', function(path) {

  if(!ignoreFolder(path)) {
    fs.readdirSync(path).forEach(function(file) {
      var _path = path + '/' + file
      sizeMap[_path] = fs.statSync(_path).size
    })
  }
})

var groupedSizeMap = {}

for(var path in sizeMap) {
  var type = path.match(/\/cubi\/([^\/]*)/)[1]

  groupedSizeMap[type] = groupedSizeMap[type] || 0
  groupedSizeMap[type] += sizeMap[path]
}

console.log(groupedSizeMap)
