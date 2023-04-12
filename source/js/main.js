//Импорт библиотек
import 'jquery-ui-bundle'
import 'inputmask/dist/jquery.inputmask'
import './modal'
import './phone-input'

requireAll(require.context('../components/', true, /\.js$/))

//Импорт блоков
// import './nav'
// import './quality-tabs'
// import './about-brand-tabs'
// import './modal-partnership'
// import './series-slider'
// import './series-tabs'
// import './buy-tabs'
// import './select-region'
// import './perfect-scrollbar'
import './scroll'
import './service-form'
import './header-scroll'
import './header-menu'

//Импорт скриптов компонентов
function requireAll(r) {
  r.keys().forEach(r)
}
