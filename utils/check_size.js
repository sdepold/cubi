var execSync = require('exec-sync')

var exec = function(cmd, showStdOut) {
  console.log(cmd)

  var result = execSync(cmd)

  if(showStdOut) {
    console.log(result)
  }

  return result
}

exec('rm -rf ' + __dirname + '/tmp')
exec('rm -rf ' + __dirname + '/tmp.zip')

exec('mkdir -p ' + __dirname + '/tmp')
exec('cp -rf ' + __dirname + '/../images ' + __dirname + '/tmp/images')
exec('cp -rf ' + __dirname + '/../javascripts ' + __dirname + '/tmp/javascripts')
exec('cp -rf ' + __dirname + '/../stylesheets ' + __dirname + '/tmp/stylesheets')
exec('cp -rf ' + __dirname + '/../index.html ' + __dirname + '/tmp/index.html')

exec('ls -l ' + __dirname + '/tmp/javascripts/*').split(/\n/).forEach(function(row) {
  var source = __dirname + '/' + row.match(/(tmp.*)/)[1]
    , target = source + '.2'
    , cmd    = __dirname + '/node_modules/.bin/uglifyjs -mt --unsafe -o ' + source + ' ' + source

  exec(cmd)
})

exec('zip -r -9 ' + __dirname + '/tmp.zip ' + __dirname + '/tmp')

var size = exec('ls -ila ' + __dirname + '/tmp.zip').split(/ /g).filter(function(i) {
  return i !== ''
})[5]

exec('rm -rf ' + __dirname + '/tmp')
exec('rm -rf ' + __dirname + '/tmp.zip')

console.log('Size of zipfile: ', size)
