import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Amplify from 'aws-amplify'
import '@aws-amplify/ui-vue'
import VueQuagga from 'vue-quaggajs'
import Toasted from 'vue-toasted'
import VueSimpleSpinner from 'vue-simple-spinner'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import config from './config'

library.add(faBarcode)

Vue.use(VueQuagga)
Vue.use(Toasted)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('v-spinner', VueSimpleSpinner)
Vue.config.productionTip = false

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    cookieStorage: {
      domain: config.cognito.DOMAIN,
      secure: config.cognito.SECURE,
    },
  },
  API: {
    endpoints: [
      {
        name: 'instrument-inventory',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
