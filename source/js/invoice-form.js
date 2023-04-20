const $form = $('.invoice__form form');
// const $service = $('#service-form-service');
// const $equipment = $('#service-form-equipment');
const $name = $('#invoice-name');
const $phone = $('#invoice-phone');
const $email = $('#invoice-email');
const $submit = $('.invoice__form form .service-form__submit');
const emailValidation = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; // eslint-disable-line

if ($form.length > 0) {

  const isFormValid = () => {
    return $name.val().trim() !== '' &&
      $phone.val().trim() !== '' &&
      !$phone.val().includes('_') &&
      $email.val().length > 0 &&
      $email.val().match(emailValidation) !== null;
  }

  $submit.on('click', function(e) {
    e.preventDefault();

    console.log($email.val().match(emailValidation));

    if ($name.val().trim() === '') {
      $name.parent().addClass('invalid')
    }

    if ($phone.val().trim() === '' || $phone.val().includes('_')) {
      $phone.parent().addClass('invalid')
    }

    if ($email.val().trim() === '' || $email.val().match(emailValidation) === null) {
      $email.parent().addClass('invalid')
    }

    if (isFormValid()) {
      $form.submit();
    } else {
      $submit.attr('disabled', true);
    }
  })

  // $service.on('select2:select', function(e) {
  //   $service.parent().removeClass('invalid')
  //   $submit.removeAttr('disabled');
  // })

  // $equipment.on('select2:select', function(e) {
  //   $equipment.parent().removeClass('invalid')
  //   $submit.removeAttr('disabled');
  // })

  $name.on('input', function(e) {
    $name.parent().removeClass('invalid');
    $submit.removeAttr('disabled');
  })

  $phone.on('input', function(e) {
    $phone.parent().removeClass('invalid');
    $submit.removeAttr('disabled');
  })

  $email.on('input', function(e) {
    $email.parent().removeClass('invalid');
    $submit.removeAttr('disabled');
  })
}



