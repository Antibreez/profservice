import Swiper, {FreeMode} from 'swiper'

$(window).on('load', () => {
  const swiper = new Swiper('.about-brand__tabs .tabs', {
    modules: [FreeMode],

    freeMode: {
      enabled: true,
    },

    slidesPerView: 'auto',
    watchOverflow: true,
  })

  const $tabs = $('.about-brand__tabs .tab')
  const $blocks = $('.about-brand__part')

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

const $tabs = $('.about-brand__tabs .tab')
const $blocks = $('.about-brand__part')

const params = new URLSearchParams(window.location.search)

if (params.has('tab')) {
  const name = params.get('tab')

  const $currentTab = $tabs.parent().find(`[data-tab="${name}"]`)

  if ($currentTab.length > 0) {
    $tabs.removeClass('active')
    $currentTab.addClass('active')
  }

  const $currentBlock = $blocks.parent().find(`[data-block="${name}"]`)

  if ($currentBlock.length > 0) {
    $blocks.hide()
    $currentBlock.show()
  }
}
