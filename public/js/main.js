$(document).ready(function() {

  // Place JavaScript code here...


  $('#scan_form').submit(function(e) {
    e.preventDefault();

    var $form = $(this),
        patt = new RegExp('^[a-zA-Z0-9_-]*$','g'),
        $fileNameInput = $form.find('[name=fileName]'),
        _csrf = $form.find('[name=_csrf]').val(),
        fileName = $fileNameInput.val(),
        validState = !!fileName.match(patt);
    
    toggleInputValidation.call($fileNameInput, validState);

    if (validState) {
      var postForm = $.post('/scanImage', {_csrf: _csrf, fileName: fileName});

      postForm.done(function(data) {
        if (data) {
          $('#result').prepend('<li class="list-group-item list-group-item-danger">' + data + '</li>');
        }
      });

    }

  });

  var socket = io.connect('http://localhost:3000');
  socket.on('news', function (data) {
    console.log(data);
    $('#result').prepend('<li class="list-group-item list-group-item-danger">' + data + '</li>');
    socket.emit('my other event', { my: 'data' });
  });

  $progress = $('.progress-bar-success');

  var scanStartDate,
    scanEndDate;

  socket.on('scan:start', function (data) {
    scanStartDate = new Date();
    $('#result')
      .prepend('<li class="list-group-item list-group-item-danger">' + data + ' at:' + scanStartDate + '</li>')
  });

  socket.on('scan', function (progress) {
    console.log(progress);
    $progress.css('width', progress);
  });

  socket.on('scan:end', function(data) {
    scanEndDate = new Date();
    var scanSeconds = (scanEndDate - scanStartDate)/(1000),
      scanTime,
      scanMin;
    if (scanSeconds > 60) {
      scanMin = scanSeconds/60;
      scanTime = scanMin.toFixed() + ' minutes and ' + (scanMin - Math.floor(scanMin)) + ' seconds';
    } else {
      scanTime = scanSeconds + ' seconds';
    }


    $progress.css('width', '0');
    $('#result')
      .prepend('<li class="list-group-item list-group-item-danger">' + data + '</li>')
      .prepend('<li class="list-group-item list-group-item-danger">Scanning finished at: ' + scanEndDate + '</li>')
      .prepend('<li class="list-group-item list-group-item-danger">Scanning time is: ' + scanTime + '</li>');
  });

  function toggleInputValidation(valid) {
    this.closest('.form-group').toggleClass('has-error', !valid).find('.help-block').toggle(!valid);
  }

});
