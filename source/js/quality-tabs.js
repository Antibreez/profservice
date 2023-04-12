import Swiper, {FreeMode} from 'swiper'

$(window).on('load', () => {
  const swiper = new Swiper('.quality__tabs', {
    modules: [FreeMode],

    freeMode: {
      enabled: true,
    },

    slidesPerView: 'auto',
    watchOverflow: true,
  })

  const $tabs = $('.quality__tab')
  const $blocks = $('.quality__tab-desc')
  const $imgs = $('.quality__img-item')

  $tabs.on('click', function () {
    if ($(this).hasClass('active')) {
      return
    }

    const name = $(this).attr('data-tab')

    $tabs.removeClass('active')
    $(this).addClass('active')

    $blocks.hide()
    $blocks.parent().find(`[data-block='${name}']`).show()

    $imgs.hide()
    $imgs.parent().find(`[data-img='${name}']`).show()
  })
})
