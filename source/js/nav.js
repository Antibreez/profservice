const $header = $('.header')
const $navBtn = $header.find('.header__nav-button').first()

$navBtn.on('click', function () {
  $header.toggleClass('opened')
  $('body').toggleClass('js-no-scroll')
})

$(window).on('resize', function () {
  if ($(this).outerWidth() > 1279 && $header.hasClass('opened')) {
    $header.removeClass('opened')
    $('body').removeClass('js-no-scroll')
  }
})
