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
          $('#result').append('<li class="list-group-item list-group-item-danger">' + data + '</li>');
        }
      });

    }

  });

  function toggleInputValidation(valid) {
    this.closest('.form-group').toggleClass('has-error', !valid).find('.help-block').toggle(!valid);
  }

});
