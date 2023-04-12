$('.header__nav-button').on('click', function() {
  $('.header__menu').addClass('opened');
  $('body').addClass('js-no-scroll');
});

$('.header__menu-close-btn').on('click', function() {
  $('.header__menu').removeClass('opened');
  $('body').removeClass('js-no-scroll');
});

$('.header__menu-overlay').on('click', function() {
  $('.header__menu').removeClass('opened');
  $('body').removeClass('js-no-scroll');
});

$('.header__button').on('click', function() {
  $('.header__menu').removeClass('opened');
  $('body').removeClass('js-no-scroll');
})
