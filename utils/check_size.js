var execSync = require('exec-sync')

var exec = function(cmd, showStdOut) {
  console.log(cmd)

  var result = execSync(cmd, true)

  if(showStdOut) {
    console.log(result)
  }

  return result.stdout
}

exec('rm -rf ' + __dirname + '/tmp')
exec('rm -rf ' + __dirname + '/tmp.zip')

exec('node ' + __dirname + '/build.js')

exec('cd ' + __dirname + '; zip -r -9 tmp.zip dist')

var size = exec('ls -ila ' + __dirname + '/tmp.zip').split(/ /g).filter(function(i) {
  return i !== ''
})[5]

exec('rm -rf ' + __dirname + '/dist')
exec('rm -rf ' + __dirname + '/tmp.zip')

console.log('Size of zipfile: ', size)
console.log('Left: ', 13312 - size)
