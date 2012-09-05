## Cubi
Game for [js13kgames](http://js13kgames.com/).

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
    - Chrome
  - Windows
    - IE9 (bullet animation broken because of missing css3 transition support)
    - IE10 (bullet animation broken because of missing css3 transition support)
    - Chrome 21
    - Firefox 14

## Build the dist:
```js
npm install
npm run build
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
