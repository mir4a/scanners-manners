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




  exec(
      'scanimage --mode=Color --resolution=300 -p  > ' + filePath,
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


        exports.convertImage(res,fileName);


      }
  );

};
