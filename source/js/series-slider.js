import Swiper from 'swiper'

$(window).on('load', function () {
  const swiper = new Swiper('.review__img-preview-slider', {
    slidesPerView: 'auto',
    watchOverflow: true,
  })

  const $slider = $('.review__img-preview-slider')
  const $wrapper = $('.review__img-preview-wrapper')
  const $slide = $('.review__img-preview-slide')
  const $mainImg = $('.review__img-main-block img')

  if ($slider.length === 0) return

  $mainImg.attr('src', $slide.first().find('img').attr('src') || '')

  if (
    $slider.outerWidth() -
      ($slide.last().position().left + $slide.last().outerWidth()) <
    0
  ) {
    $slider.addClass('offset-right')
  }

  swiper.on('progress', function () {
    if (swiper.progress < 1) {
      $slider.addClass('offset-right')
    } else {
      $slider.removeClass('offset-right')
    }

    if (swiper.progress > 0) {
      $slider.addClass('offset-left')
    } else {
      $slider.removeClass('offset-left')
    }
  })

  $slide.on('click', function () {
    const currentSlide = $(this)

    if (currentSlide.hasClass('active')) {
      return
    }

    $slide.removeClass('active')
    currentSlide.addClass('active')

    // if (currentSlide.offset().left - $slider.offset().left <= 0) {
    //   if (currentSlide.index() > 0) {
    //     swiper.slideTo(currentSlide.index() - 1)
    //   } else {
    //     swiper.slideTo(currentSlide.index())
    //   }
    // }

    if (currentSlide.index() > 0) {
      if (
        $slide.eq(currentSlide.index() - 1).offset().left +
          currentSlide.outerWidth() -
          $slider.offset().left <
        currentSlide.outerWidth() / 2
      ) {
        swiper.slideTo(swiper.activeIndex - 1)
      }
    } else {
      swiper.slideTo(0)
    }

    // if (
    //   currentSlide.index() < $slide.length - 1 &&
    //   $slide.index(currentSlide.index() + 1).offset().left - $slider.offset().left - $slider.outerWidth() > -50
    // ) {
    //   if (currentSlide.index() < $slide.length - 1) {
    //     swiper.slideTo(swiper.activeIndex + 1)
    //   } else {
    //     swiper.slideTo($slide.length - 1)
    //   }
    // }

    if (currentSlide.index() < $slide.length - 1) {
      if (
        $slider.offset().left +
          $slider.outerWidth() -
          $slide.eq(currentSlide.index() + 1).offset().left <
        currentSlide.outerWidth() / 2
      ) {
        swiper.slideTo(swiper.activeIndex + 1)
      }
    } else {
      swiper.slideTo($slide.length - 1)
    }

    console.log(swiper.activeIndex)

    $mainImg.attr('src', currentSlide.find('img').attr('src') || '')
  })
})
