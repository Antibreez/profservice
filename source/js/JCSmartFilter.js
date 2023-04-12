function JCSmartFilter(ajaxURL, viewMode, params, preloaderImage) {
  this.ajaxURL = ajaxURL
  this.form = null
  this.timer = null
  this.cacheKey = ''
  this.cache = []
  this.popups = []
  this.viewMode = viewMode
  this.preloaderImage = preloaderImage

  this.init()

  if (params && params.SEF_SET_FILTER_URL) {
    //this.bindUrlToButton('set_filter', params.SEF_SET_FILTER_URL);
    this.sef = true
  }
  if (params && params.SEF_DEL_FILTER_URL) {
    this.bindUrlToButton('del_filter', params.SEF_DEL_FILTER_URL)
  }
}

JCSmartFilter.prototype.init = function () {
  let that = this

  $('.js-catalog-section').on(
    'click',
    '.js-filter-selected__item',
    function (e) {
      e.preventDefault()
      that.resetBlock($(this))
    }
  )

  $(function () {
    that.initSearchScroll()

    $('.filter-section__title').on('click', function (e) {
      e.preventDefault()
      $(this).parent().toggleClass('filter-section_open')
      return false
    })

    $('.js-catalog-section').on(
      'click',
      '.js--mobile-filter-open',
      function (e) {
        e.preventDefault()

        $('.catalog-section__aside').toggleClass('catalog-section__aside_open')
        $('body').toggleClass('overlay')
        $('html').toggleClass('overlay')
        that.initSearchScroll()
        return false
      }
    )

    $('.js--filter-mobile-close').on('click', function () {
      that.filterMobileClose()
      return false
    })
  })
}

JCSmartFilter.prototype.filterMobileClose = function () {
  if (this.isMobile()) {
    $('.catalog-section__aside').toggleClass('catalog-section__aside_open')
    $('body').toggleClass('overlay')
    $('html').toggleClass('overlay')
  }

  return false
}

JCSmartFilter.prototype.isMobile = function () {
  if (typeof JCSmartFilter.isMobile !== 'undefined') {
    return JCSmartFilter.isMobile
  }

  if (window.screen.width <= 1024) {
    JCSmartFilter.isMobile = true
  } else {
    JCSmartFilter.isMobile = false
  }

  return JCSmartFilter.isMobile
}

JCSmartFilter.prototype.initSearchScroll = function () {
  $('.filter-section__scroll').each(function (i, el) {
    if ($(el).data('search-scroll-initialized') == 'Y') {
      return true
    }

    if ($(el).parent('.filter-section__body').height() > 190) {
      let searchScroll = new SimpleBar($(el)[0], {autoHide: false})
      searchScroll.getContentElement()
      $(el).data('search-scroll-initialized', 'Y')
    }
  })
}

JCSmartFilter.prototype.focus = function (input) {
  if ($(input).val() == $(input).data('default-value')) {
    $(input).val('')
  }
}
JCSmartFilter.prototype.blur = function (input) {
  if ($(input).val() == '') {
    $(input).val($(input).data('default-value'))
  }
}
JCSmartFilter.prototype.keyup = BX.debounce(function (input) {
  if (JCSmartFilter.reloasJsonXhr) {
    JCSmartFilter.reloasJsonXhr.abort()
  }

  if (JCSmartFilter.postHandlerXhr) {
    JCSmartFilter.postHandlerXhr.abort()
  }

  if (!!this.timer) {
    clearTimeout(this.timer)
  }

  this.timer = setTimeout(
    BX.delegate(function () {
      this.reload(input)
    }, this),
    500
  )
}, 300)

JCSmartFilter.prototype.click = function (checkbox, forcereload) {
  this.lastClickedBlock =
    $(checkbox).parents('.js--filter-resort').attr('id') || false

  //Р•СЃР»Рё true - С‚Рѕ РјС‹ РІ РјРѕР±РёР»СЊРЅРѕР№ РІРµСЂСЃРёРё, Р·РЅР°С‡РёС‚ РЅР°РґРѕ РѕР±РЅРѕРІР»СЏС‚СЊ С„РёР»СЊС‚СЂ РїРѕ РєР»РёРєСѓ РЅР° РєРЅРѕРїРєСѓ
  if (this.isMobile()) {
    if ($(checkbox).hasClass('apply-mob-filter')) {
      this.filterMobileClose()
      $('body').css({
        overflow: 'initial',
      })
    }
  }

  if (!!this.timer) {
    clearTimeout(this.timer)
  }

  this.timer = setTimeout(
    BX.delegate(function () {
      this.reload(checkbox, forcereload)
    }, this),
    500
  )
}

JCSmartFilter.prototype.linkClick = function (link) {
  let $checkbox = $(link).next()

  if ($checkbox.prop('disabled') == false) {
    $checkbox.trigger('click')
  }

  if ($checkbox.prop('checked') == true) {
    //filter-catalog__item-js filter-catalog__item_act
    $checkbox
      .closest('.filter-catalog__item-js')
      .addClass('filter-catalog__item_act')
  } else {
    $checkbox
      .closest('.filter-catalog__item-js')
      .removeClass('filter-catalog__item_act')
  }
}

JCSmartFilter.prototype.showAllFilters = function (button) {
  button = $(button)

  button
    .parents('.smartfilter')
    .find('.filter')
    .each(function () {
      var filter = $(this)

      if (!filter.hasClass('js-filter-select-block')) {
        filter.show()
      }
    })
  button.hide()
  $('.js-show-only-main-filters').show()
  $('input[name="filter_expanded"]').val('Y')
}

JCSmartFilter.prototype.toggleRestBrands = function () {
  $('.js-filter-brend').toggleClass('filter-brend-all')

  if (!$('.js-filter-brend').hasClass('filter-brend-all')) {
    $('html, body').animate(
      {
        scrollTop: $('.js-filter-brend').offset().top,
      },
      1000
    )
  }

  return false
}

JCSmartFilter.prototype.showOnlyMainFilters = function (button) {
  button = $(button)

  button
    .parents('.smartfilter')
    .find('.filter')
    .each(function (index, filter) {
      filter = $(filter)
      if (index > 7 && !filter.hasClass('force-show')) {
        filter.hide()
      }
    })
  button.hide()
  $('.js-show-all-filters').show()
  $('input[name="filter_expanded"]').val('N')
}

JCSmartFilter.prototype.showPreloader = function () {
  $('.js-catalog-section').addClass('catalog-loader')
}

/**
 * РЎРєСЂС‹С‚СЊ РїСЂРµР»РѕР°РґРµСЂ
 */
JCSmartFilter.prototype.hidePreloader = function () {
  $('.js-catalog-section').removeClass('catalog-loader')
}

JCSmartFilter.reloasJsonXhr = null
JCSmartFilter.prototype.reload = BX.debounce(function (input, forcereload) {
  if (!input) {
    this.resetFilter = false
    this.form = $('#frmCatalogFilters').get(0)
  } else {
    this.resetFilter =
      $(input).hasClass('reset-mob-filter') || $(input).hasClass('js-reset-all')
    this.updateOnlyFilterInMobile =
      !this.resetFilter &&
      this.isMobile() &&
      !$(input).hasClass('apply-mob-filter')
    this.form = $(input).closest('form').get(0)
  }

  if (
    this.isMobile() &&
    !$(input).hasClass('js-reset-all') &&
    !$(input).hasClass('apply-mob-filter') &&
    !forcereload
  ) {
    //РµСЃР»Рё РјРѕР±РёР»СЊРЅРёРє Рё РІСЃРµ РєСЂРѕРјРµ РєРЅРѕРїРѕРє, "РЎР±СЂРѕСЃРёС‚СЊ РІСЃРµ" Рё "РџСЂРёРјРµРЅРёС‚СЊ"
    return
  }

  if (this.form) {
    this.showPreloader()

    var values = []
    values[0] = {name: 'ajax', value: 'y'}
    values[1] = {name: 'product-ajax-filter', value: 'y'}

    if (this.resetFilter) {
      this.resetForm()
    }

    this.gatherInputsValues(
      values,
      BX.findChildren(
        this.form,
        {tag: new RegExp('^(input|select)$', 'i')},
        true
      )
    )

    $('.js-open-for').each(function () {
      values.push({name: $(this).attr('name'), value: $(this).val()})
    })
    values.push({
      name: 'filter_expanded',
      value: $('input[name="filter_expanded"]').val(),
    })

    if (this.isMobile()) {
      values.push({
        name: 'update_only_filter',
        value: this.updateOnlyFilterInMobile ? 'Y' : 'N',
      })
    }

    if (JCSmartFilter.postHandlerXhr) {
      JCSmartFilter.postHandlerXhr.abort('Р’С‹Р·РІР°РЅ РЅРѕРІС‹Р№ Р·Р°РїСЂРѕСЃ')
      JCSmartFilter.postHandlerXhr = null
    }

    let that = this

    $('.filter-push').remove()

    JCSmartFilter.postHandlerXhr = $.ajax({
      url: this.ajaxURL,
      method: 'POST',
      data: values,
      success: function (html, textStatus, jqXHR) {
        that.reloadSuccess(html, textStatus, jqXHR)
        window.history.pushState(values, '', that.jsonFilter.FILTER_URL)
      },
      complete: function () {
        if (JCSmartFilter.postHandlerXhr) {
          JCSmartFilter.postHandlerXhr.abort()
          JCSmartFilter.postHandlerXhr = null
        }

        that.hidePreloader()
      },
    }).fail(function () {
      if (JCSmartFilter.postHandlerXhr) {
        JCSmartFilter.postHandlerXhr.abort()
        JCSmartFilter.postHandlerXhr = null
      }
    })
  }
}, 300)

JCSmartFilter.prototype.reloadSuccess = function (html, textStatus, jqXHR) {
  let url = jqXHR.getResponseHeader('x-filter-url') //,
  let count = jqXHR.getResponseHeader('x-filter-element-count-message')
  BX && BX.onCustomEvent('catalog-filtered-count-update', [count])

  if (!this.isMobile() || !this.updateOnlyFilterInMobile) {
    //РѕР±РЅРѕРІР»СЏРµРј С„РёР»СЊС‚СЂ Рё РєРѕРЅС‚РµРЅС‚
    this.updateContent(html, true)
  } else {
    //РѕР±РЅРѕРІР»СЏРµРј С‚РѕР»СЊРєРѕ С„РёР»СЊС‚СЂ
    this.updateContent(html, true, {updateFilter: true, updateCatalog: false})
  }

  window.setTimeout(function () {
    $('.filter-push').remove()
  }, 2000)

  this.resortItems()
}

JCSmartFilter.prototype.resortItems = function () {
  $('#frmCatalogFilters .js--filter-resort').each(function () {
    let obFilterItem = $(this),
      obItemsContainer = obFilterItem.find('label.check:first-child').parent(),
      obItems = obItemsContainer.find('label')

    if (obFilterItem.attr('id') != this.lastClickedBlock) {
      obItems.sort(function (a, b) {
        let intWeightA =
            parseInt($(a).data('cnt')) +
            ($(a).hasClass('disabled') ? 10000 : 0),
          intWeightB =
            parseInt($(b).data('cnt')) + ($(b).hasClass('disabled') ? 10000 : 0)

        return intWeightA < intWeightB ? -1 : 1
      })

      obItems.appendTo(obItemsContainer)
    }
  })
}

JCSmartFilter.prototype.resetForm = function () {
  if (!this.form) {
    return
  }

  this.form.reset()
  $('input[type="checkbox"]', this.form).prop('checked', false)

  for (let i = 0; i < this.form.elements.length; i++) {
    let el = this.form.elements[i],
      jEl = $(el)

    if (jEl.hasClass('range-field')) {
      if (jEl.hasClass('modfrom')) {
        let min = jEl.data('min')
        jEl.val(min)
      }

      if (jEl.hasClass('modto')) {
        let max = jEl.data('max')
        jEl.val(max)
      }
    }
  }
}

JCSmartFilter.prototype.updateItem = function (PID, arItem) {
  if (
    (arItem.PROPERTY_TYPE === 'N' &&
      arItem.DISPLAY_TYPE !== 'SH' &&
      arItem.DISPLAY_TYPE !== 'CL' &&
      arItem.DISPLAY_TYPE !== 'checkbox' &&
      arItem.DISPLAY_TYPE !== 'checkbox_scroll') ||
    arItem.PRICE
  ) {
    if (arItem.VALUES) {
      let $control = $('#' + arItem.VALUES.MIN.CONTROL_ID)
      if (arItem.SET_FILTER_VALUE_FROM) {
        $control.val(arItem.SET_FILTER_VALUE_FROM)
      } else if (arItem.VALUES.MIN) {
        $control.val(arItem.VALUES.MIN.HTML_VALUE)
      }

      $control = $('#' + arItem.VALUES.MAX.CONTROL_ID)
      if (arItem.SET_FILTER_VALUE_TO) {
        $control.val(arItem.SET_FILTER_VALUE_TO)
      } else if (arItem.VALUES.MAX) {
        $control.val(arItem.VALUES.MAX.HTML_VALUE)
      }
    }
  } else if (arItem.VALUES) {
    for (var i in arItem.VALUES) {
      if (arItem.VALUES.hasOwnProperty(i)) {
        var value = arItem.VALUES[i]

        var control = BX(value.CONTROL_ID)

        if (!!control) {
          var label = document.querySelector(
            '[data-role="label_' + value.CONTROL_ID + '"]'
          )

          if (value.DISABLED) {
            if (label) BX.addClass(label, 'disabled')
            else BX.addClass(control.parentNode, 'disabled')

            control.disabled = 'disabled'
          } else {
            if (label) BX.removeClass(label, 'disabled')
            else BX.removeClass(control.parentNode, 'disabled')

            control.disabled = ''
          }

          if (value.hasOwnProperty('ELEMENT_COUNT')) {
            label = document.querySelector(
              '[data-role="count_' + value.CONTROL_ID + '"]'
            )
            if (label) label.innerHTML = value.ELEMENT_COUNT

            if (value.ELEMENT_COUNT) {
              $(label).show()
            } else {
              $(label).hide()
            }
          }

          //for popstate
          if (value.CHECKED) {
            control.checked = true
            if ($(control).data('type') == 'link-input-js') {
              $(control)
                .closest('.filter-catalog__item-js')
                .addClass('filter-catalog__item_act')
            }
          } else {
            control.checked = false
            if ($(control).data('type') == 'link-input-js') {
              $(control)
                .closest('.filter-catalog__item-js')
                .removeClass('filter-catalog__item_act')
            }
          }
        }
      }
    }
  }

  //reset buttons
  if (arItem['SET_FILTER'] == true) {
    $('#filter-item-reset_' + arItem['ID']).show()
  } else {
    $('#filter-item-reset_' + arItem['ID']).hide()
  }
}

JCSmartFilter.postHandlerXhr = null

JCSmartFilter.prototype.updateContent = function (
  html,
  isAjax = false,
  params = {}
) {
  var options = $.extend(
    {
      updateFilter: true,
      updateCatalog: true,
    },
    params
  )

  html = $('<div/>').append(html)

  if (options.updateFilter) {
    jsonFilter = undefined
    eval(html.find('.js-filter-json').html())
    if (jsonFilter) {
      this.jsonFilter = jsonFilter

      for (var PID in this.jsonFilter.ITEMS) {
        if (this.jsonFilter.ITEMS.hasOwnProperty(PID)) {
          this.updateItem(PID, this.jsonFilter.ITEMS[PID])
        }
      }
    }

    this.initFilters(isAjax)
  }

  if (options.updateCatalog) {
    $('.js-page-catalog__content').replaceWith(
      html.find('.js-page-catalog__content')
    )

    $('#js-catalog-list [data-qnt-selector]').each(function () {
      new CQntSelector($(this))
    })

    //СЃРєСЂРѕР»Р» РІ С‚Р°Р±Р»РёС‡РЅРѕРј РІРёРґРµ
    typeof CatalogTableSlider !== 'undefined' && new CatalogTableSlider().init()
    typeof CSeriesTable !== 'undefined' && CSeriesTable.init()
  }
}

window.addEventListener(
  'popstate',
  function (event) {
    event.preventDefault()

    if (typeof smartFilter == 'undefined') {
      return
    }

    smartFilter.updateOnlyFilterInMobile = false
    smartFilter.showPreloader()
    JCSmartFilter.postHandlerXhr = $.ajax({
      url: this.ajaxURL,
      method: 'POST',
      data: event.state || {ajax: 'y'},
      success: function (html, textStatus, jqXHR) {
        smartFilter.reloadSuccess(html, textStatus, jqXHR)
      },
      complete: function () {
        if (JCSmartFilter.postHandlerXhr) {
          JCSmartFilter.postHandlerXhr.abort()
          JCSmartFilter.postHandlerXhr = null
        }

        smartFilter.hidePreloader()
      },
    }).fail(function () {
      if (JCSmartFilter.postHandlerXhr) {
        JCSmartFilter.postHandlerXhr.abort()
        JCSmartFilter.postHandlerXhr = null
      }
    })
  },
  false
)

JCSmartFilter.prototype.getScrollBarWidth = function () {
  var inner = document.createElement('p')
  inner.style.width = '100%'
  inner.style.height = '200px'

  var outer = document.createElement('div')
  outer.style.position = 'absolute'
  outer.style.top = '0px'
  outer.style.left = '0px'
  outer.style.visibility = 'hidden'
  outer.style.width = '200px'
  outer.style.height = '150px'
  outer.style.overflow = 'hidden'
  outer.appendChild(inner)

  document.body.appendChild(outer)
  var w1 = inner.offsetWidth
  outer.style.overflow = 'scroll'
  var w2 = inner.offsetWidth
  if (w1 == w2) w2 = outer.clientWidth

  document.body.removeChild(outer)

  return w1 - w2
}

JCSmartFilter.prototype.initFilters = function (isAjax) {
  var filter = $('.filter')
  var that = this
  filter.each(function () {
    var $this = $(this)
    if ($this.hasClass('is-open')) {
      $this.find('.filter-content').show()
      $this.find('.js-open-for').val('Y')
    } else {
      $this.find('.filter-content').hide()
      $this.find('.js-open-for').val('N')
    }

    if ($this.data('initialized') == true) {
      return
    }

    $this.data('initialized', true)
  })

  $('.filters .filters-close').on('click', function () {
    $('.filters').removeClass('is-shown')
    $('body').css({
      overflow: 'initial',
    })
  })
}

JCSmartFilter.prototype.resetBlock = function ($dom) {
  let target = $dom.data('reset-block-target')

  if (!target) {
    return
  }

  let $input = $('#' + target)

  if ($input.length) {
    if ($input.attr('type') == 'checkbox') {
      let $closestField = $input.closest('.field')

      if ($closestField.length && $closestField.hasClass('hidden')) {
        $closestField.removeClass('hidden')
      }

      $input.data('skip-filter', 'Y')
      this.click.apply(this, [$input.get(0), true])
    } else if ($input.hasClass('modto')) {
      $input.val($input.data('max'))
      $input.trigger('keyup')
    } else if ($input.hasClass('modfrom')) {
      $input.val($input.data('min'))
      $input.trigger('keyup')
    }
  }
}

JCSmartFilter.prototype.resetItem = function (intID) {
  intID = intID || 0

  if (intID == 'CATALOG_PRICE') {
    var block = $('#CATALOG_PRICE'),
      that = this,
      modFrom = block.find('.modfrom'),
      modTo = block.find('.modto'),
      range = block.find('.range-slider')

    modFrom.val(range.data('min'))
    modTo.val(range.data('max'))
    range[0].noUiSlider.set([range.data('min'), range.data('max')])
    this.keyup(modFrom[0])
    this.keyup(modTo[0])
  } else {
    if (intID.length > 0) {
      $('#filter-item-reset_' + intID).click()
    }
  }
  return false
}

JCSmartFilter.prototype.resetAll = function (button) {
  if (JCSmartFilter.reloasJsonXhr) {
    JCSmartFilter.reloasJsonXhr.abort()
  }

  if (JCSmartFilter.postHandlerXhr) {
    JCSmartFilter.postHandlerXhr.abort()
  }

  if (!!this.timer) {
    clearTimeout(this.timer)
  }

  this.timer = setTimeout(
    BX.delegate(function () {
      this.reload(button)
      this.filterMobileClose()
    }, this),
    500
  )
}

JCSmartFilter.prototype.updateSectionItem = function (sections) {
  for (var sectionId in sections) {
    if (!sections.hasOwnProperty(sectionId)) {
      continue
    }

    var item = $('.js-filter-section-item[data-id="' + sectionId + '"]'),
      link = item.children('a'),
      count = link.children('.js-count')

    if (sections[sectionId]['DISABLED']) {
      link.addClass('disabled')
      count.hide()
    } else {
      link.removeClass('disabled')

      if (sections[sectionId]['COUNT'] > 0) {
        count.text(' ' + sections[sectionId]['COUNT'])
        count.show()
      }
    }

    if (!!sections[sectionId]['CHILD']) {
      this.updateSectionItem(sections[sectionId]['CHILD'])
    }
  }
}

JCSmartFilter.prototype.bindUrlToButton = function (buttonId, url) {
  var button = BX(buttonId)
  if (button) {
    var proxy = function (j, func) {
      return function () {
        return func(j)
      }
    }

    if (button.type == 'submit') button.type = 'button'

    BX.bind(
      button,
      'click',
      proxy(url, function (url) {
        window.location.href = url
        return false
      })
    )
  }
}

JCSmartFilter.prototype.gatherInputsValues = function (values, elements) {
  if (elements) {
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i],
        jEl = $(el)

      if (!el.type || jEl.hasClass('excludeFromFilter')) continue

      if (jEl.data('skip-filter') == 'Y') {
        jEl.data('skip-filter', '')
        continue
      }

      if (jEl.hasClass('range-field')) {
        if (jEl.hasClass('modfrom')) {
          if (jEl.val() == jEl.data('min')) {
            continue
          }
        }

        if (jEl.hasClass('modto')) {
          if (jEl.val() == jEl.data('max')) {
            continue
          }
        }
      }

      switch (el.type.toLowerCase()) {
        case 'text':
        case 'number':
        case 'textarea':
        case 'password':
        case 'hidden':
        case 'select-one':
          if (el.value.length) {
            values[values.length] = {name: el.name, value: el.value}
          }
          break
        case 'radio':
        case 'checkbox':
          if ($(el).prop('checked')) {
            values[values.length] = {name: el.name, value: el.value}
          }
          break
        case 'select-multiple':
          for (var j = 0; j < el.options.length; j++) {
            if (el.options[j].selected)
              values[values.length] = {
                name: el.name,
                value: el.options[j].value,
              }
          }
          break
        default:
          break
      }
    }
  }
}

JCSmartFilter.prototype.values2post = function (values) {
  var post = []
  var current = post
  var i = 0

  while (i < values.length) {
    var p = values[i].name.indexOf('[')
    if (p == -1) {
      current[values[i].name] = values[i].value
      current = post
      i++
    } else {
      var name = values[i].name.substring(0, p)
      var rest = values[i].name.substring(p + 1)
      if (!current[name]) current[name] = []

      var pp = rest.indexOf(']')
      if (pp == -1) {
        //Error - not balanced brackets
        current = post
        i++
      } else if (pp == 0) {
        //No index specified - so take the next integer
        current = current[name]
        values[i].name = '' + current.length
      } else {
        //Now index name becomes and name and we go deeper into the array
        current = current[name]
        values[i].name = rest.substring(0, pp) + rest.substring(pp + 1)
      }
    }
  }
  return post
}

JCSmartFilter.prototype.hideFilterProps = function (element) {
  var obj = element.parentNode,
    filterBlock = obj.querySelector("[data-role='bx_filter_block']"),
    propAngle = obj.querySelector("[data-role='prop_angle']")

  if (BX.hasClass(obj, 'bx-active')) {
    new BX.easing({
      duration: 300,
      start: {opacity: 1, height: filterBlock.offsetHeight},
      finish: {opacity: 0, height: 0},
      transition: BX.easing.transitions.quart,
      step: function (state) {
        filterBlock.style.opacity = state.opacity
        filterBlock.style.height = state.height + 'px'
      },
      complete: function () {
        filterBlock.setAttribute('style', '')
        BX.removeClass(obj, 'bx-active')
      },
    }).animate()

    BX.addClass(propAngle, 'fa-angle-down')
    BX.removeClass(propAngle, 'fa-angle-up')
  } else {
    filterBlock.style.display = 'block'
    filterBlock.style.opacity = 0
    filterBlock.style.height = 'auto'

    var obj_children_height = filterBlock.offsetHeight
    filterBlock.style.height = 0

    new BX.easing({
      duration: 300,
      start: {opacity: 0, height: 0},
      finish: {opacity: 1, height: obj_children_height},
      transition: BX.easing.transitions.quart,
      step: function (state) {
        filterBlock.style.opacity = state.opacity
        filterBlock.style.height = state.height + 'px'
      },
      complete: function () {},
    }).animate()

    BX.addClass(obj, 'bx-active')
    BX.removeClass(propAngle, 'fa-angle-down')
    BX.addClass(propAngle, 'fa-angle-up')
  }
}

JCSmartFilter.prototype.showDropDownPopup = function (element, popupId) {
  var contentNode = element.querySelector('[data-role="dropdownContent"]')
  this.popups['smartFilterDropDown' + popupId] = BX.PopupWindowManager.create(
    'smartFilterDropDown' + popupId,
    element,
    {
      autoHide: true,
      offsetLeft: 0,
      offsetTop: 3,
      overlay: false,
      draggable: {restrict: true},
      closeByEsc: true,
      content: BX.clone(contentNode),
    }
  )
  this.popups['smartFilterDropDown' + popupId].show()
}

JCSmartFilter.prototype.selectDropDownItem = function (element, controlId) {
  this.keyup(BX(controlId))

  var wrapContainer = BX.findParent(
    BX(controlId),
    {className: 'bx-filter-select-container'},
    false
  )

  var currentOption = wrapContainer.querySelector('[data-role="currentOption"]')
  currentOption.innerHTML = element.innerHTML
  BX.PopupWindowManager.getCurrentPopup().close()
}

JCSmartFilter.prototype.searchValueParam = function (params) {
  let limit = 10
  let count = 0
  let $target = $('#' + params.target)
  let $inpSearch = $(params.self)

  let searchStr = $inpSearch.val()

  //РµСЃР»Рё РЅРёС‡РµРіРѕ РЅРµ РЅР°Р№РґРµРЅРѕ РїРѕРєР°Р·С‹РІР°РµРј РїРµСЂРІС‹Рµ limit РІР°СЂРёР°РЅС‚РѕРІ
  if (searchStr == '') {
    $target.find('[data-value]').each(function (i) {
      if (i < limit) {
        $(this).removeClass('hidden')
      } else {
        $(this).addClass('hidden')
      }
    })
    return
  }

  $target.find('[data-value]').each(function () {
    if (count > limit) {
      $(this).addClass('hidden')
      return true
    }

    let val = $(this).data('value')

    if (
      val &&
      typeof val == 'string' &&
      typeof searchStr == 'string' &&
      searchStr !== ''
    ) {
      if (val.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1) {
        count++
        $(this).removeClass('hidden')
      } else {
        $(this).addClass('hidden')
      }
    }
  })
}

/*BX.namespace("BX.Iblock.SmartFilter");
BX.Iblock.SmartFilter = (function()
{
	/** @param {{
			leftSlider: string,
			rightSlider: string,
			tracker: string,
			trackerWrap: string,
			minInputId: string,
			maxInputId: string,
			minPrice: float|int|string,
			maxPrice: float|int|string,
			curMinPrice: float|int|string,
			curMaxPrice: float|int|string,
			fltMinPrice: float|int|string|null,
			fltMaxPrice: float|int|string|null,
			precision: int|null,
			colorUnavailableActive: string,
			colorAvailableActive: string,
			colorAvailableInactive: string
		}} arParams
	 * /
	var SmartFilter = function(arParams)
	{
		this.lastClickedBlock = null;

		if (typeof arParams === 'object')
		{
			this.leftSlider = BX(arParams.leftSlider);
			this.rightSlider = BX(arParams.rightSlider);
			this.tracker = BX(arParams.tracker);
			this.trackerWrap = BX(arParams.trackerWrap);

			this.minInput = BX(arParams.minInputId);
			this.maxInput = BX(arParams.maxInputId);

			this.minPrice = parseFloat(arParams.minPrice);
			this.maxPrice = parseFloat(arParams.maxPrice);

			this.curMinPrice = parseFloat(arParams.curMinPrice);
			this.curMaxPrice = parseFloat(arParams.curMaxPrice);

			this.fltMinPrice = arParams.fltMinPrice ? parseFloat(arParams.fltMinPrice) : parseFloat(arParams.curMinPrice);
			this.fltMaxPrice = arParams.fltMaxPrice ? parseFloat(arParams.fltMaxPrice) : parseFloat(arParams.curMaxPrice);

			this.precision = arParams.precision || 0;

			this.priceDiff = this.maxPrice - this.minPrice;

			this.leftPercent = 0;
			this.rightPercent = 0;

			this.fltMinPercent = 0;
			this.fltMaxPercent = 0;

			this.colorUnavailableActive = BX(arParams.colorUnavailableActive);//gray
			this.colorAvailableActive = BX(arParams.colorAvailableActive);//blue
			this.colorAvailableInactive = BX(arParams.colorAvailableInactive);//light blue

			this.isTouch = false;

			this.init();

			if ('ontouchstart' in document.documentElement)
			{
				this.isTouch = true;

				BX.bind(this.leftSlider, "touchstart", BX.proxy(function(event){
					this.onMoveLeftSlider(event)
				}, this));

				BX.bind(this.rightSlider, "touchstart", BX.proxy(function(event){
					this.onMoveRightSlider(event)
				}, this));
			}
			else
			{
				BX.bind(this.leftSlider, "mousedown", BX.proxy(function(event){
					this.onMoveLeftSlider(event)
				}, this));

				BX.bind(this.rightSlider, "mousedown", BX.proxy(function(event){
					this.onMoveRightSlider(event)
				}, this));
			}

			BX.bind(this.minInput, "keyup", BX.proxy(function(event){
				this.onInputChange();
			}, this));

			BX.bind(this.maxInput, "keyup", BX.proxy(function(event){
				this.onInputChange();
			}, this));

		}
	};

	SmartFilter.prototype.init = function()
	{
		var priceDiff;
		let that = this;

		if (this.curMinPrice > this.minPrice)
		{
			priceDiff = this.curMinPrice - this.minPrice;
			this.leftPercent = (priceDiff*100)/this.priceDiff;

			this.leftSlider.style.left = this.leftPercent + "%";
			this.colorUnavailableActive.style.left = this.leftPercent + "%";
		}

		this.setMinFilteredValue(this.fltMinPrice);

		if (this.curMaxPrice < this.maxPrice)
		{
			priceDiff = this.maxPrice - this.curMaxPrice;
			this.rightPercent = (priceDiff*100)/this.priceDiff;

			this.rightSlider.style.right = this.rightPercent + "%";
			this.colorUnavailableActive.style.right = this.rightPercent + "%";
		}

		this.setMaxFilteredValue(this.fltMaxPrice);

		$('body').on('click', '.js-filter-selected__item', function(){

			that.resetBlock.call($(this));
		})


	};

	SmartFilter.prototype.setMinFilteredValue = function (fltMinPrice)
	{
		this.fltMinPrice = parseFloat(fltMinPrice);
		if (this.fltMinPrice >= this.minPrice)
		{
			var priceDiff = this.fltMinPrice - this.minPrice;
			this.fltMinPercent = (priceDiff*100)/this.priceDiff;

			if (this.leftPercent > this.fltMinPercent)
				this.colorAvailableActive.style.left = this.leftPercent + "%";
			else
				this.colorAvailableActive.style.left = this.fltMinPercent + "%";

			this.colorAvailableInactive.style.left = this.fltMinPercent + "%";
		}
		else
		{
			this.colorAvailableActive.style.left = "0%";
			this.colorAvailableInactive.style.left = "0%";
		}
	};

	SmartFilter.prototype.setMaxFilteredValue = function (fltMaxPrice)
	{
		this.fltMaxPrice = parseFloat(fltMaxPrice);
		if (this.fltMaxPrice <= this.maxPrice)
		{
			var priceDiff = this.maxPrice - this.fltMaxPrice;
			this.fltMaxPercent = (priceDiff*100)/this.priceDiff;

			if (this.rightPercent > this.fltMaxPercent)
				this.colorAvailableActive.style.right = this.rightPercent + "%";
			else
				this.colorAvailableActive.style.right = this.fltMaxPercent + "%";

			this.colorAvailableInactive.style.right = this.fltMaxPercent + "%";
		}
		else
		{
			this.colorAvailableActive.style.right = "0%";
			this.colorAvailableInactive.style.right = "0%";
		}
	};

	SmartFilter.prototype.getXCoord = function(elem)
	{
		var box = elem.getBoundingClientRect();
		var body = document.body;
		var docElem = document.documentElement;

		var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
		var clientLeft = docElem.clientLeft || body.clientLeft || 0;
		var left = box.left + scrollLeft - clientLeft;

		return Math.round(left);
	};

	SmartFilter.prototype.getPageX = function(e)
	{
		e = e || window.event;
		var pageX = null;

		if (this.isTouch && event.targetTouches[0] != null)
		{
			pageX = e.targetTouches[0].pageX;
		}
		else if (e.pageX != null)
		{
			pageX = e.pageX;
		}
		else if (e.clientX != null)
		{
			var html = document.documentElement;
			var body = document.body;

			pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
			pageX -= html.clientLeft || 0;
		}

		return pageX;
	};

	SmartFilter.prototype.recountMinPrice = function()
	{
		var newMinPrice = (this.priceDiff*this.leftPercent)/100;
		newMinPrice = (this.minPrice + newMinPrice).toFixed(this.precision);

		if (newMinPrice != this.minPrice)
			this.minInput.value = newMinPrice;
		else
			this.minInput.value = "";
		/** @global JCSmartFilter smartFilter * /
		smartFilter.keyup(this.minInput);
	};

	SmartFilter.prototype.recountMaxPrice = function()
	{
		var newMaxPrice = (this.priceDiff*this.rightPercent)/100;
		newMaxPrice = (this.maxPrice - newMaxPrice).toFixed(this.precision);

		if (newMaxPrice != this.maxPrice)
			this.maxInput.value = newMaxPrice;
		else
			this.maxInput.value = "";
		/** @global JCSmartFilter smartFilter * /
		smartFilter.keyup(this.maxInput);
	};

	SmartFilter.prototype.onInputChange = function ()
	{
		var priceDiff;
		if (this.minInput.value)
		{
			var leftInputValue = this.minInput.value;
			if (leftInputValue < this.minPrice)
				leftInputValue = this.minPrice;

			if (leftInputValue > this.maxPrice)
				leftInputValue = this.maxPrice;

			priceDiff = leftInputValue - this.minPrice;
			this.leftPercent = (priceDiff*100)/this.priceDiff;

			this.makeLeftSliderMove(false);
		}

		if (this.maxInput.value)
		{
			var rightInputValue = this.maxInput.value;
			if (rightInputValue < this.minPrice)
				rightInputValue = this.minPrice;

			if (rightInputValue > this.maxPrice)
				rightInputValue = this.maxPrice;

			priceDiff = this.maxPrice - rightInputValue;
			this.rightPercent = (priceDiff*100)/this.priceDiff;

			this.makeRightSliderMove(false);
		}
	};

	SmartFilter.prototype.makeLeftSliderMove = function(recountPrice)
	{
		recountPrice = (recountPrice !== false);

		this.leftSlider.style.left = this.leftPercent + "%";
		this.colorUnavailableActive.style.left = this.leftPercent + "%";

		var areBothSlidersMoving = false;
		if (this.leftPercent + this.rightPercent >= 100)
		{
			areBothSlidersMoving = true;
			this.rightPercent = 100 - this.leftPercent;
			this.rightSlider.style.right = this.rightPercent + "%";
			this.colorUnavailableActive.style.right = this.rightPercent + "%";
		}

		if (this.leftPercent >= this.fltMinPercent && this.leftPercent <= (100-this.fltMaxPercent))
		{
			this.colorAvailableActive.style.left = this.leftPercent + "%";
			if (areBothSlidersMoving)
			{
				this.colorAvailableActive.style.right = 100 - this.leftPercent + "%";
			}
		}
		else if(this.leftPercent <= this.fltMinPercent)
		{
			this.colorAvailableActive.style.left = this.fltMinPercent + "%";
			if (areBothSlidersMoving)
			{
				this.colorAvailableActive.style.right = 100 - this.fltMinPercent + "%";
			}
		}
		else if(this.leftPercent >= this.fltMaxPercent)
		{
			this.colorAvailableActive.style.left = 100-this.fltMaxPercent + "%";
			if (areBothSlidersMoving)
			{
				this.colorAvailableActive.style.right = this.fltMaxPercent + "%";
			}
		}

		if (recountPrice)
		{
			this.recountMinPrice();
			if (areBothSlidersMoving)
				this.recountMaxPrice();
		}
	};

	SmartFilter.prototype.countNewLeft = function(event)
	{
		var pageX = this.getPageX(event);

		var trackerXCoord = this.getXCoord(this.trackerWrap);
		var rightEdge = this.trackerWrap.offsetWidth;

		var newLeft = pageX - trackerXCoord;

		if (newLeft < 0)
			newLeft = 0;
		else if (newLeft > rightEdge)
			newLeft = rightEdge;

		return newLeft;
	};

	SmartFilter.prototype.onMoveLeftSlider = function(e)
	{
		if (!this.isTouch)
		{
			this.leftSlider.ondragstart = function() {
				return false;
			};
		}

		if (!this.isTouch)
		{
			document.onmousemove = BX.proxy(function(event) {
				this.leftPercent = ((this.countNewLeft(event)*100)/this.trackerWrap.offsetWidth);
				this.makeLeftSliderMove();
			}, this);

			document.onmouseup = function() {
				document.onmousemove = document.onmouseup = null;
			};
		}
		else
		{
			document.ontouchmove = BX.proxy(function(event) {
				this.leftPercent = ((this.countNewLeft(event)*100)/this.trackerWrap.offsetWidth);
				this.makeLeftSliderMove();
			}, this);

			document.ontouchend = function() {
				document.ontouchmove = document.touchend = null;
			};
		}

		return false;
	};

	SmartFilter.prototype.makeRightSliderMove = function(recountPrice)
	{
		recountPrice = (recountPrice !== false);

		this.rightSlider.style.right = this.rightPercent + "%";
		this.colorUnavailableActive.style.right = this.rightPercent + "%";

		var areBothSlidersMoving = false;
		if (this.leftPercent + this.rightPercent >= 100)
		{
			areBothSlidersMoving = true;
			this.leftPercent = 100 - this.rightPercent;
			this.leftSlider.style.left = this.leftPercent + "%";
			this.colorUnavailableActive.style.left = this.leftPercent + "%";
		}

		if ((100-this.rightPercent) >= this.fltMinPercent && this.rightPercent >= this.fltMaxPercent)
		{
			this.colorAvailableActive.style.right = this.rightPercent + "%";
			if (areBothSlidersMoving)
			{
				this.colorAvailableActive.style.left = 100 - this.rightPercent + "%";
			}
		}
		else if(this.rightPercent <= this.fltMaxPercent)
		{
			this.colorAvailableActive.style.right = this.fltMaxPercent + "%";
			if (areBothSlidersMoving)
			{
				this.colorAvailableActive.style.left = 100 - this.fltMaxPercent + "%";
			}
		}
		else if((100-this.rightPercent) <= this.fltMinPercent)
		{
			this.colorAvailableActive.style.right = 100-this.fltMinPercent + "%";
			if (areBothSlidersMoving)
			{
				this.colorAvailableActive.style.left = this.fltMinPercent + "%";
			}
		}

		if (recountPrice)
		{
			this.recountMaxPrice();
			if (areBothSlidersMoving)
				this.recountMinPrice();
		}
	};

	SmartFilter.prototype.onMoveRightSlider = function(e)
	{
		if (!this.isTouch)
		{
			this.rightSlider.ondragstart = function() {
				return false;
			};
		}

		if (!this.isTouch)
		{
			document.onmousemove = BX.proxy(function(event) {
				this.rightPercent = 100-(((this.countNewLeft(event))*100)/(this.trackerWrap.offsetWidth));
				this.makeRightSliderMove();
			}, this);

			document.onmouseup = function() {
				document.onmousemove = document.onmouseup = null;
			};
		}
		else
		{
			document.ontouchmove = BX.proxy(function(event) {
				this.rightPercent = 100-(((this.countNewLeft(event))*100)/(this.trackerWrap.offsetWidth));
				this.makeRightSliderMove();
			}, this);

			document.ontouchend = function() {
				document.ontouchmove = document.ontouchend = null;
			};
		}

		return false;
	};

	return SmartFilter;
})();*/

$(function () {
  $('.filter-section-search__input')
    .each(function () {
      let obInput = $(this),
        obListContainer = obInput
          .parents('.filter')
          .find('.js--filter-search label:first')
          .parent()

      obListContainer.find('.field-not-fond').hide()
      obListContainer.find('.check').each(function () {
        let obThis = $(this)

        if (obThis.find('.js-visible-value').length > 0) {
          obThis.data(
            'value',
            obThis.find('.js-visible-value').html().toLowerCase()
          )
        }
      })
    })
    .keyup(function () {
      let obInput = $(this),
        strText = obInput.val().toLowerCase(),
        obListContainer = obInput
          .parents('.filter')
          .find('.js--filter-search label:first')
          .parent()

      let bRefreshShowMore = false
      if (strText.length > 0) {
        obListContainer
          .find('.check')
          .not('.field-not-fond')
          .each(function () {
            let strVal = $(this).data('value').toLowerCase().toString()

            if (strVal.indexOf(strText) != -1) {
              $(this).removeClass('hidden')
            } else {
              $(this).addClass('hidden')
            }
          })

        if (
          obListContainer.find('.check:visible').not('.field-not-fond').length >
          0
        ) {
          obListContainer.find('.field-not-fond').hide()
        } else {
          obListContainer.find('.field-not-fond').show()
        }

        bRefreshShowMore = true
      } else {
        obListContainer.find('.check').removeClass('hidden')
        obListContainer.find('.field-not-fond').hide()

        bRefreshShowMore = true
      }

      if (bRefreshShowMore) {
        $('.js-show-more-cnt', obInput.parents('.filter')).each(function () {
          let obT = $(this),
            obItemsContainer = obT
              .parents('.filter-content')
              .find('label.check:first-child')
              .parent(),
            intShowMoreCnt =
              obItemsContainer
                .find('.check')
                .not('.field-not-fond')
                .not('.hidden').length - 12

          if (intShowMoreCnt > 0) {
            obT.show()
          } else {
            obT.hide()
          }
        })
      }
    })
    .trigger('keyup')
})

window.JCSmartFilter = JCSmartFilter
