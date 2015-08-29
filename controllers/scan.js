var exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    fs = require('fs'),
    imageMagick = require('imagemagick');
    imageMagick.convert.path = '/usr/local/bin/convert';

/**
 * GET /
 * Home page.
 */
exports.index = function (req, res) {
  res.render('scan', {
    title: 'Scanner\'s Manners'
  });
};

exports.convertImage = function(res,imageName) {
  imageMagick.convert([encodeURIComponent(imageName) + '.pnm', encodeURIComponent(imageName) + '.jpg'],
      function (err, stdout, stderr) {
    if (err) throw err;

    res.send(stderr);

  });

};

exports.scanImage = function (req, res, cb) {

  var fileName = req.body.fileName || 'testFileName';

  var filePath = encodeURIComponent(fileName) + '.pnm';

  var writeStream = fs.createWriteStream(filePath);

  var scan = spawn('scanimage', ['--mode=Color', '--resolution=300', '-p']);

  scan.stdout.on('data', function (data) {
    //console.log('stdout: ' + data);
    writeStream.write(data);
  });

  scan.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
    //res.send(data);
  });

  scan.on('close', function (code) {
    console.log('child process exited with code ' + code);
    res.send('child process exited with code ' + code);
    exports.convertImage(res,fileName);
  });

};
