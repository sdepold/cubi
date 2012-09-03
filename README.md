## Build the dist:
```js
npm install
node utils/build.js
```

## Check dist size:

```js
node utils/check_size.js
```

## Full featured game start

As this game uses `prefixfree` it is necessary to start the game via a webserver:

```js
npm run server
```

Afterwards just open the game via `http://localhost:8080`.
