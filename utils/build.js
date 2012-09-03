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

var targetFolder = __dirname + '/../dist'

exec('rm -rf ' + targetFolder)

exec('mkdir -p ' + targetFolder)

exec('cp -rf ' + __dirname + '/../images ' + targetFolder + '/images')
exec('cp -rf ' + __dirname + '/../stylesheets ' + targetFolder + '/stylesheets')
exec('cp -rf ' + __dirname + '/../index.html ' + targetFolder + '/index.html')

var indexHTML = exec('cat ' + targetFolder + '/index.html')
  , scripts   = []

indexHTML = indexHTML.split('\n').filter(function(row) {
  if(row.indexOf('<script') === -1) {
    return true
  } else {
    if(process.env.SKIP_PREFIXFREE && (row.indexOf('prefixfree') !== -1)) {
      return false
    }
    scripts.push(row.match(/src="(.*)"/)[1])
    return false
  }
}).join('\n').replace('</head>', '  <script src="cubi.js"></script>\n  </head>')

fs.writeFileSync(targetFolder + '/index.html', indexHTML)

var paths    = scripts.map(function(file) { return __dirname + '/../' + file })
  , contents = paths.map(function(path) { return exec('cat ' + path) + ';' })
  , code     = contents.join('')
  , source   = targetFolder + '/cubi.js'

var ast = jsp.parse(code)
ast = jsu.ast_mangle(ast)
ast = jsu.ast_squeeze(ast)

var finalCode = jsu.gen_code(ast); // compressed code here

fs.writeFileSync(source, finalCode);

exec('ls -l ' + targetFolder + '/stylesheets/*').split(/\n/).forEach(function(row) {
  var path = __dirname + '/../' + row.match(/(dist.*)/)[1]
    , cmd    = 'node ' + __dirname + '/../node_modules/yuicompressor/nodejs/cli.js --type css -o ' + path + ' ' + path

  exec(cmd)
})
