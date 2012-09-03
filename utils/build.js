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
  , scripts      = []

var createTargetFolder = function() {
  exec('rm -rf ' + targetFolder)
  exec('mkdir -p ' + targetFolder)
}

var copySources = function() {
  exec('cp ' + __dirname + '/../stylesheets/screen.css ' + targetFolder + '/cubi.css')
  exec('cp -rf ' + __dirname + '/../index.html ' + targetFolder + '/index.html')
}

var modifyIndexHtml = function() {
  var indexHTML = exec('cat ' + targetFolder + '/index.html')

  indexHTML = indexHTML.split('\n').map(function(row) {
    if(row.indexOf('<link') !== -1) {
      return row.replace('stylesheets/screen.css', 'cubi.css')
    } else if(row.indexOf('<script') === -1) {
      return row
    } else {
      if(process.env.SKIP_PREFIXFREE && (row.indexOf('prefixfree') !== -1)) {
        return null
      } else {
        scripts.push(row.match(/src="(.*)"/)[1])
        return null
      }
    }
  }).filter(function(row) {
    return row !== null
  }).join('\n').replace('</head>', '  <script src="cubi.js"></script>\n  </head>')

  fs.writeFileSync(targetFolder + '/index.html', indexHTML)
}

var compressJsFiles = function() {
  var paths    = scripts.map(function(file) { return __dirname + '/../' + file })
    , contents = paths.map(function(path) { return exec('cat ' + path) + ';' })
    , code     = contents.join('')
    , source   = targetFolder + '/cubi.js'

  var ast = jsp.parse(code)
  ast = jsu.ast_mangle(ast)
  ast = jsu.ast_squeeze(ast)

  var finalCode = jsu.gen_code(ast); // compressed code here

  fs.writeFileSync(source, finalCode);
}

var base64EncodeImages = function() {
  var path = targetFolder + '/cubi.css'
    , css  = exec('cat ' + path)

  css = css.split('\n').map(function(row) {
    if(row.indexOf('url(') === -1) {
      return row
    } else {
      return row.replace(/url\(['"](.*?)['"]\)/, function(match, path) {
        var imageData = fs.readFileSync(__dirname + '/' + path)
          , prefix    = 'data:image/gif;base64,'
          , base64    = new Buffer(imageData, 'binary').toString('base64')
          , data      = prefix + base64

        return "url('" + data + "')"
      })
    }
  }).join('\n')

  fs.writeFileSync(path, css);
}

var compresCssFiles = function() {
  var yuiCall = 'node ' + __dirname + '/../node_modules/yuicompressor/nodejs/cli.js'
    , cssPath = targetFolder + '/cubi.css'

  exec(yuiCall + ' --type css -o ' + cssPath + ' ' + cssPath)
}

createTargetFolder()
copySources()
modifyIndexHtml()
compressJsFiles()
base64EncodeImages()
compresCssFiles()
