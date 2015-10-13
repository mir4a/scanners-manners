$(document).ready(function() {

  // Place JavaScript code here...


  var $result = $('#result');

  var $title = $('html head title'),
      titleDefault = $title.text();

  $('#scan_form').submit(function(e) {
    e.preventDefault();

    var $form = $(this),
        patt = new RegExp('^[a-zA-Z0-9_-]*$','g'),
        $fileNameInput = $form.find('[name=fileName]'),
        $resolutionInput = $form.find('[name=scanResolution]'),
        resolution = $resolutionInput.val(),
        _csrf = $form.find('[name=_csrf]').val(),
        fileName = $fileNameInput.val(),
        validState = !!fileName.match(patt);
    
    toggleInputValidation.call($fileNameInput, validState);

    if (validState) {
      var postForm = $.post('/scanImage', {_csrf: _csrf, fileName: fileName, resolution: resolution });

      postForm.done(function(data) {
        if (data) {
          $result.prepend('<li class="list-group-item list-group-item-danger">' + data + '</li>');
        }
      });

    }

  });

  var socket = io.connect('http://localhost:3000');
  socket.on('news', function (data) {
    console.log(data);
    $result.prepend('<li class="list-group-item list-group-item-danger">' + data + '</li>');
    socket.emit('my other event', { my: 'data' });
  });

  $progress = $('.progress-bar-success');

  var scanStartDate,
    scanEndDate;

  socket.on('scan:start', function (data) {
    $title.text('Scanning: ' + $('[name=fileName]').val());
    scanStartDate = new Date();
    $result
      .prepend('<li class="list-group-item list-group-item-danger">' + data + ' at:' + scanStartDate + '</li>')
  });

  socket.on('scan', function (progress) {
    console.log(progress);
    $title.text(progress + ' of ' + $('[name=fileName]').val() + ' scanned…');
    $progress.css('width', progress);
  });

  socket.on('scan:end', function(data) {
    scanEndDate = new Date();
    var diff = scanEndDate - scanStartDate,
        sec = diff/1000,
        min = Math.floor(sec/60),
        minH,
        scanTime;

    if (sec > 60) {
      minH = min === 1 ? min + ' minute ' : min + ' minutes ';
      scanTime = minH + ' and ' + Math.ceil(sec - (min*60)) + ' seconds';
    } else {
      scanTime = sec + ' seconds';
    }


    $progress.css('width', '0');
    $title.text(titleDefault);
    $result
      .prepend('<li class="list-group-item list-group-item-danger">' + data + '</li>')
      .prepend('<li class="list-group-item list-group-item-danger">Scanning finished at: ' + scanEndDate + '</li>')
      .prepend('<li class="list-group-item list-group-item-danger">Scanning time is: ' + scanTime + '</li>');
  });

  function toggleInputValidation(valid) {
    this.closest('.form-group').toggleClass('has-error', !valid).find('.help-block').toggle(!valid);
  }

});
