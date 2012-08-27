var execSync = require('exec-sync')

var exec = function(cmd, showStdOut) {
  console.log(cmd)

  var result = execSync(cmd)

  if(showStdOut) {
    console.log(result)
  }

  return result
}

exec('rm -rf ' + __dirname + '/dist')

exec('mkdir -p ' + __dirname + '/dist')

exec('cp -rf ' + __dirname + '/../images ' + __dirname + '/dist/images')
exec('cp -rf ' + __dirname + '/../javascripts ' + __dirname + '/dist/javascripts')
exec('cp -rf ' + __dirname + '/../stylesheets ' + __dirname + '/dist/stylesheets')
exec('cp -rf ' + __dirname + '/../index.html ' + __dirname + '/dist/index.html')

exec('ls -l ' + __dirname + '/dist/javascripts/*').split(/\n/).forEach(function(row) {
  var path = __dirname + '/' + row.match(/(dist.*)/)[1]
    , cmd    = __dirname + '/node_modules/.bin/uglifyjs -mt --unsafe -o ' + path + ' ' + path

  exec(cmd)
})

exec('ls -l ' + __dirname + '/dist/stylesheets/*').split(/\n/).forEach(function(row) {
  var path = __dirname + '/' + row.match(/(dist.*)/)[1]
    , cmd    = 'node ' + __dirname + '/node_modules/yuicompressor/nodejs/cli.js --type css -o ' + path + ' ' + path

  exec(cmd)
})
