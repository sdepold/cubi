var execSync = require('exec-sync')

var exec = function(cmd, showStdOut) {
  console.log(cmd)

  var result = execSync(cmd, true)

  if(showStdOut) {
    console.log(result)
  }

  return result.stdout
}

exec('cd ' + __dirname + '/..; SKIP_PREFIXFREE=true npm run build-zip')

var size = exec('cd ' + __dirname + '/..; ls -ila dist.zip').split(/ /g).filter(function(i) {
  return i !== ''
})[5]

exec('cd ' + __dirname + '/..; rm dist.zip')

console.log('Size of zipfile: ', size)
console.log('Left: ', 13312 - size)
