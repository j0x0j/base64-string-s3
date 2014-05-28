Base64 string (stream) to s3
============================

Stream a base64 encoded string directly to aws s3

Features
--------

- No big buffers
- `progress`, `response`, `error` and `close` events
- Optional `chunkSize`, defaults to 1024 bytes
- Uses [knox](https://github.com/LearnBoost/knox) s3 client

Example
--------

```js
var Putter = require('base64-string-s3');

var options = {
    key: '<aws-key>',
    secret: '<aws-secret>',
    bucket: '<bucket>',
    chunkSize: 512 // [optional] defaults to 1024
}

var putter = new Putter(options);

// put arguments: base64 string, object key, mime type, permissions
putter.put(base64data, 'images/success.jpg', 'image/jpeg', 'public-read');

putter.on('progress', function (data) {
    console.log('progress', data);
    // progress { percent: 20, written: 768, total: 3728 }
});

putter.on('response', function (data) {
    console.log('response', data);
    // response { path: 'https://<bucket>.s3.amazonaws.com/images/success.jpg' }
});

putter.on('error', function (err) {
    console.error(err);
});

putter.on('close', function () {
    console.log('closed connection');
});
```

You could also pass an instance of knox client

```js
var options = {
    client: yourKnoxClientInstance
}

var putter = new Putter(options);
```

Installation
------------

You can install using [npm](http://npmjs.org)

`npm install base64-string-s3`

License
-------

ISC
