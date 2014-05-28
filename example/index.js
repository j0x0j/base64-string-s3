var Putter = require('../index');
var base64data = require('../test/helper').base64string;

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
