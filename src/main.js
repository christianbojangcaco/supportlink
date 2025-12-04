import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify' // Ensure the correct path
import router from './router/index' // Ensure the correct path

import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)

app.use(vuetify)
app.use(router)

app.mount('#app')
