// @ts-nocheck

import './assets/main.css'

import { createAuth0 } from '@auth0/auth0-vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { createVuetify } from 'vuetify'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import 'vuetify/styles' // Import Vuetify styles
import '@mdi/font/css/materialdesignicons.css' // Material Design Icons
import '@fontsource/roboto' // Roboto font

import App from './App.vue'
import NovaUI from '@rigelsystems/novaui'
import router from './router'

const vuetify = createVuetify({
  components: {
    VTimePicker,
  },
}) // Create Vuetify instance
const app = createApp(App)

app.use(createPinia())
app.use(NovaUI, { theme: '#000', borderRadius: '5px' });
app.use(router)
app.use(vuetify)
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
    },
  }),
)

app.mount('#app')
