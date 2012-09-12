const staticServer = require('node-static')
    , Sequelize    = require('sequelize')
    , fs           = require("fs")
    , http         = require('http')
    , router       = require('router')
    , route        = router()
    , querystring  = require('querystring')



var file       = new staticServer.Server('./')
  , port       = process.env.PORT || 8080
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
      Highscore.findAll({ order: 'score desc', limit: 100 }).success(function(data) {
        response.writeHead(200)
        response.end(JSON.stringify(data))
      })
    })

    route.post('/highscore', function(request, response) {
      var body = ''

      request.on('data', function (data) {
        body += data
      })

      request.on('end', function () {
        var params = querystring.parse(body)

        Highscore.create({
          username: params.username,
          score:    params.score
        }).success(function() {
          response.writeHead(200)
          response.end(JSON.stringify(params))
        }).error(function() {
          response.writeHead(400)
          response.end()
        })
      })
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

