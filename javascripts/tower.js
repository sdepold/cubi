(function() {
  Tower = function(type, cell) {
    this.type  = type
    this.level = 1
    this.cell  = cell
  }

  Tower.TYPES = {
    LASER: {
      name:         'Laser Tower',
      costs:        [100, 200, 1000],
      damages:      [2, 5, 10],
      ranges:       [3, 5, 7],
      frequencies:  [500, 450, 400]
    },

    ROCKET: {
      name:         'Rocket Tower',
      costs:        [300, 500, 1500],
      damages:      [10, 15, 25],
      ranges:       [7, 9, 12],
      frequencies:  [3000, 2700, 2200]
    },

    FREEZER: {
      name:         'Freezer',
      costs:        [200, 500, 750],
      damages:      [5, 7, 9],
      ranges:       [3, 4, 5],
      frequencies:  [5000, 4000, 3000]
    }
  }

  Tower.prototype.render = function() {
    this.cell.setType(GridCell.TOWER, toClassNames.call(this))
    return this
  }

  Tower.prototype.getPrice = function() {
    return Tower.TYPES[this.type].costs[this.level]
  }

  Tower.prototype.getRange = function() {
    return Tower.TYPES[this.type].ranges[this.level]
  }

  Tower.prototype.checkDistanceTo = function(monster) {
    var towerCoordinates   = this.cell.getCoordinates()
      , monsterCoordinates = monster.getPosition()

    if(monsterCoordinates) {
      var xDistance = Math.abs(towerCoordinates.x - monsterCoordinates.x)
        , yDistance = Math.abs(towerCoordinates.y - monsterCoordinates.y)
        , distance  = xDistance + yDistance

      if((xDistance !== 0) && (yDistance !== 0)) {
        distance = distance / 2
      }

      if(distance <= this.getRange()) {
        console.log('pew')
      }
    }
  }

  // private

  var toClassNames = function() {
    var towerName = this.type.toLowerCase().replace(/ /, '-')
      , levelName = 'level-' + this.level

    return [towerName, levelName]
  }
})()
