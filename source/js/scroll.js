$('a').on('click', function(e) {
  const h = $(e.currentTarget).attr('href');

  if (h[0] === '#') {
    e.preventDefault();

    if (h.length > 1 && $(h).length > 0) {
      $('html, body').animate({
        scrollTop: $(h).offset().top
      }, 500);
    }
  }
})
