$(window).on('load', function() {
  console.log($('.select[name="service"]').val());
})

const $form = $('.service-form form');
const $service = $('#service-form-service');
const $equipment = $('#service-form-equipment');
const $name = $('#service-form-name');
const $phone = $('#service-form-phone');
const $submit = $('.service-form__submit');

if ($('.payment__service-request-form').length > 0) {

  const isFormValid = () => {
    return $name.val().trim() !== '' &&
      $phone.val().trim() !== '' &&
      !$phone.val().includes('_') &&
      $service.val() &&
      $equipment.val();
  }

  $submit.on('click', function(e) {
    e.preventDefault();

    if ($name.val().trim() === '') {
      $name.parent().addClass('invalid')
    }

    if ($phone.val().trim() === '' || $phone.val().includes('_')) {
      $phone.parent().addClass('invalid')
    }

    if (!$service.val()) {
      $service.parent().addClass('invalid')
    }

    if (!$equipment.val()) {
      $equipment.parent().addClass('invalid')
    }

    if (isFormValid()) {
      $form.submit();
    } else {
      $submit.attr('disabled', true);
    }
  })

  $service.on('select2:select', function(e) {
    $service.parent().removeClass('invalid')
    $submit.removeAttr('disabled');
  })

  $equipment.on('select2:select', function(e) {
    $equipment.parent().removeClass('invalid')
    $submit.removeAttr('disabled');
  })

  $name.on('input', function(e) {
    $name.parent().removeClass('invalid');
    $submit.removeAttr('disabled');
  })

  $phone.on('input', function(e) {
    $phone.parent().removeClass('invalid');
    $submit.removeAttr('disabled');
  })
}



