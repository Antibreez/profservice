import Swiper, {FreeMode} from 'swiper'

$(window).on('load', () => {
  const swiper = new Swiper('.series__tabs .tabs', {
    modules: [FreeMode],

    freeMode: {
      enabled: true,
    },

    slidesPerView: 'auto',
    watchOverflow: true,
  })

  const $tabs = $('.series__tabs .tab')
  const $blocks = $('.series__part')

  $tabs.on('click', function () {
    if ($(this).hasClass('active')) {
      return
    }

    const name = $(this).attr('data-tab')

    $tabs.removeClass('active')
    $(this).addClass('active')

    $blocks.hide()
    $blocks.parent().find(`[data-block='${name}']`).show()
  })
})
