var execSync = require('exec-sync')
  , fs       = require('fs')
  , jsp      = require("uglify-js").parser
  , jsu      = require("uglify-js").uglify

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
exec('cp -rf ' + __dirname + '/../stylesheets ' + __dirname + '/dist/stylesheets')
exec('cp -rf ' + __dirname + '/../index.html ' + __dirname + '/dist/index.html')

var indexHTML = exec('cat ' + __dirname + '/dist/index.html')

indexHTML = indexHTML.split('\n').filter(function(row) {
  return row.indexOf('<script') === -1
}).join('\n').replace('</head>', '  <script src="cubi.js"></script>\n  </head>')

fs.writeFileSync(__dirname + '/dist/index.html', indexHTML)

var files    = ['utils', 'grid', 'grid-cell', 'monster', 'player', 'tower', 'tower-menu', 'tower-meta-menu', 'game', 'boot']
  , paths    = files.map(function(file) { return __dirname + '/../javascripts/' + file + '.js' })
  , contents = paths.map(function(path) { return exec('cat ' + path) + ';' })
  , code     = contents.join('')
  , source   = __dirname + '/dist/cubi.js'

var ast = jsp.parse(code)
ast = jsu.ast_mangle(ast)
ast = jsu.ast_squeeze(ast)

var finalCode = jsu.gen_code(ast); // compressed code here

fs.writeFileSync(source, finalCode);

exec('ls -l ' + __dirname + '/dist/stylesheets/*').split(/\n/).forEach(function(row) {
  var path = __dirname + '/' + row.match(/(dist.*)/)[1]
    , cmd    = 'node ' + __dirname + '/node_modules/yuicompressor/nodejs/cli.js --type css -o ' + path + ' ' + path

  exec(cmd)
})
