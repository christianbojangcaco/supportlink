<script setup>
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3">
        <v-spacer>
          <h1>CLIENT INFORMATION</h1>
        </v-spacer>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card class="mx-auto" prepend-icon="$vuetify" subtitle="The #1 Vue UI Library">
                <template v-slot:title>
                  <span class="font-weight-black">Welcome to Vuetify</span>
                </template>

                <v-card-text class="bg-surface-light pt-4">
                  <v-sheet class="mx-auto" width="300">
                    <v-form fast-fail @submit.prevent>
                      <v-text-field label="Email"></v-text-field>

                      <v-text-field label="Password"></v-text-field>

                      <v-btn class="mt-2" type="submit" block>Submit</v-btn>
                    </v-form>
                  </v-sheet>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <v-footer border app>Copyright</v-footer>
    </v-app>
  </v-responsive>
</template>
