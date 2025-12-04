// src/plugins/index.js

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify()

export function registerPlugins(app) {
  app.use(vuetify)
}
