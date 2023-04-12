const checkInput = () => {
  const $inputs = $('.input input');

  $inputs.each((index, item) => {
    if ($(item).attr('placeholder')) return

    if ($(item).val().trim() === '') {
      $(item).prev().addClass('isEmpty');
    }
  })
}

$('.input input').on('focus', function() {
  $(this).prev().removeClass('isEmpty');
});

$('.input input').on('blur', function() {
  if ($(this).attr('placeholder')) return

  if ($(this).val().trim() === '') {
    $(this).val('');
    $(this).prev().addClass('isEmpty');
  }
});

$(window).on('load', function() {
  checkInput();
});

$("input.phone").inputmask("+7(999)999-99-99");
