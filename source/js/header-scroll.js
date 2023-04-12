const onScroll = () => {
  const top = $(window).scrollTop();

  if (top > 300) {
    $('.header').addClass('anime');
    $('.page__main').addClass('fixed-header');
    setTimeout(function() {
      $('.header').addClass('animated');
    }, 300);
  } else {
    $('.header').removeClass('anime');
    $('.page__main').removeClass('fixed-header');
    $('.header').removeClass('animated');
  }
}

$(window).on('scroll', onScroll);

onScroll();


