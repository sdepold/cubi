## Cubi
This project is my entry for [js13kgames](http://js13kgames.com/). It's a tower defense game in less than 13kb (13,312 bytes). At the time of submitting it to the contest, it had 13 different types of monsters, 3 kind of towers and only one set of surface graphics. The major goal of that game is to kill all the monsters approaching you via choosing the right amount of towers.

## Play the game!

[Just click here :)](http://sdepold.github.com/cubi/index.html)

## "13" related details
- 13 monster types
- 13 health points
- 13 seconds wave delay
- 13 waves to defeat
- 13 supported browsers (maybe more ...)
  - OS X
    - Chrome 21
    - Firefox 14
    - Safari 6
    - Opera 12
  - iOS
    - Mobile Safari
    - Chrome
    - Dolphin
    - Mercury
  - Android
    - Dolphin (a bit slow and for some reason it's not correctly detecting touched fields)
  - Windows
    - IE9 (bullet animation broken because of missing css3 transition support)
    - IE10 (bullet animation broken because of missing css3 transition support)
    - Chrome 21
    - Firefox 14

## Future development

The submitted entry is tagged with `v1.0.0`. Everything that followed that tag is additional content, that might break the 13KB limit. However, I will try to stay below that limit :)

## Sources

- Graphics:
  - [Remastered Tyrian Graphics](http://www.lostgarden.com/2007/04/free-game-graphics-tyrian-ships-and.html)
  - [Hard Vacuum](http://www.lostgarden.com/2005/03/game-post-mortem-hard-vacuum.html)

## Build the dist:
```js
npm install
npm run build
```

## Build a ZIP file
```js
npm run build-zip
```

## Check dist size:

```js
npm run check
```

## Full featured game start

As this game uses `prefixfree` it is necessary to start the game via a webserver:

```js
npm run server
```

Afterwards just open the game via `http://localhost:8080`.
