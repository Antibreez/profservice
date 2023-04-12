import Swiper, {FreeMode} from 'swiper'

$(window).on('load', () => {
  const swiper = new Swiper('.buy__tabs .tabs', {
    modules: [FreeMode],

    freeMode: {
      enabled: true,
    },

    slidesPerView: 'auto',
    watchOverflow: true,
  })

  const $tabs = $('.buy__tabs .tab')
  const $blocks = $('.buy__part')

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

  const $filterTabs = $('.buy__filter-tabs .filter-tab')
  const $items = $('.buy__item')

  let tags = []

  const filterSwiper = new Swiper('.buy__filter-tabs .filter-tabs', {
    modules: [FreeMode],

    freeMode: {
      enabled: true,
    },

    slidesPerView: 'auto',
    watchOverflow: true,
  })

  $filterTabs.on('click', function () {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active')
      tags = tags.filter(val => val !== $(this).text())
    } else {
      $(this).addClass('active')
      tags.push($(this).text())
    }

    $items.show()

    if (tags.length === 0) return

    $items.each((idx, item) => {
      const $itemTags = $(item).find('.buy__item-tag')
      let contains = false

      $itemTags.each((id, itemtag) => {
        if (tags.includes($(itemtag).text())) contains = true
      })

      !contains && $(item).hide()
    })
  })
})
