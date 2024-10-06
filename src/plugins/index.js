
import vuetify from './vuetify'
import router from '@/router'
import store from '@/store/store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(store)
}
