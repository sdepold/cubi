const staticServer = require('node-static')
    , Sequelize    = require('Sequelize')
    , fs           = require("fs")
    , http         = require('http')
    , router       = require('router')
    , route        = router()
    , port         = process.env.PORT || 8080


var file       = new staticServer.Server('./')
  , configFile = __dirname + "/" + (process.env.CONFIG_PATH || "config/config.json")
  , config     = JSON.parse(process.env.CONFIG || fs.readFileSync(configFile))
  , sequelize  = new Sequelize(config.database, config.username, config.password, {
      host:     config.host,
      port:     config.port,
      dialect:  config.dialect,
      protocol: config.protocol
    })

var Highscore = sequelize.define('highscore', {
  username: Sequelize.STRING,
  score:    Sequelize.INTEGER
})

sequelize
  .sync({ force: true })
  .success(function() {
    console.log('Successfully synced database scheme.')

    route.get('/highscore', function(request, response) {
      response.writeHead(200)
      response.end('hello index page')
    })

    route.get("/*", function(request, response) {
      request.addListener('end', function () {
        file.serve(request, response)
      })
    })


    http.createServer(route).listen(8080);

    console.log('Started server under http://127.0.0.1:' + port)
  })
  .error(function(err) {
    console.log(err)
  })

