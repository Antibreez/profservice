import select2 from 'select2'
import niceScroll from 'jquery.nicescroll'

$(window).on('load', function () {
  $('.select').each(function (idx, item) {
    const name = $(this).attr('aria-placeholder')

    $(this).select2({
      minimumResultsForSearch: Infinity,
      dropdownCssClass: 'select-dropdown',
      placeholder: name,
      width: '100%'
    })
  })

  $('.select2-selection__placeholder').each(function(idx, item) {
    const text = $(item).text();

    if (text.includes('*')) {
      $(item).html(text.split('*').join('<span>*</span>'))
    }
  })

  // $('.select').select2({
  //   minimumResultsForSearch: Infinity,
  //   dropdownCssClass: 'select-dropdown',
  //   placeholder: $(this),
  // })

  $('.select').on('select2:open', function () {
    $('.select2-results__options').niceScroll({
      autohidemode: false,
      cursorborder: 'none',
      cursorcolor: '#ADB0B4',
    })
  })
})
