# terminal-stocks
This is a demo that you can view stocks in terminal.
We use Sina Stock API.

## How to use

First copy the repo into your disk.

```bash
$ git clone git@github.com:ForeverPx/terminal-stocks.git
```

then

```bash
$ npm install

$ node app.js
```

## Add your stocks

Edit app.js, you can find the array named 'stockIdList', you can add your stock code in it.

example

```js
var stockIdList = ['sh601118','sh600684'];
```

![example](http://i1.tietuku.com/0362468b91cfde2f.png)

## Useful links

- [Sina's Stock API](http://blog.csdn.net/simon803/article/details/7784682)

## License

MIT licensed