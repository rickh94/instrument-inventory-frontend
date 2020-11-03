import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Amplify from 'aws-amplify'
import '@aws-amplify/ui-vue'
import config from './config'

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
