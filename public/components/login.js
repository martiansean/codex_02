$(document).ready(function() {
  $('.alert').hide();
  $('#progress').hide();
})
//
function warn(el) {
    $(el).addClass('warning')
}

function unwarn(el) {
    $(el).removeClass('warning')
}

function Login(){
  let Email = $('#email').val();
  let Password = $('#password').val();

  $('#progress').show();
  var posting = $.post("/users/login", { email: Email, password: Password })
  $('#progress').show()
  posting.done(function (data) {
    // console.log(data.error)
    $('#progress').hide()
    if(data.text == "correct") {
      window.location.replace('/auth')
    } else {
      $('.alert').text(data.text)
      if (data.error == true) {
        // console.log(data.error)
        warn('#alert')
      }
      $('.alert').show()
      $('.alert').fadeOut(2000, function () {
        unwarn('#alert')
      })
    }

  })
}
