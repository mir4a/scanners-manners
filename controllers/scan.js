var exec = require('child_process').exec,
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

exports.convertImage = function(imageName, imageFormat) {
  imageMagick.convert([encodeURIComponent(imageName) + '.' + imageFormat, encodeURIComponent(imageName) + '.jpg'], function (err, data) {
    if (err) throw err;

    res.send(data);

  });

};

exports.scanImage = function (req, res, cb) {

  var fileName = req.body.fileName || 'testFileName';

  var filePath = encodeURIComponent(fileName) + '.tiff';




  exec(
      'scanimage --mode=Color --resolution=300 -p --format=tiff > ' + filePath,
      function (error, stdout, stderr) {
        if (error) {
          console.log('!!!!!!error!!!!!');
          console.log(error);
        }
        if (stderr) {
          console.log('!!!!!stderr!!!!!!!');
          console.log(stderr);
        }
        if (stdout) {
          console.log('scan works!');
          console.log(stdout);
        }


        exports.convertImage(fileName, 'tiff');


      }
  );

};
