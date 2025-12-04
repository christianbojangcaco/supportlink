// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Create and export Vuetify instance
export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // Make sure this matches the icon set used in your component
  },
  theme: {
    defaultTheme: 'light',
  },
})
