import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/aura-light-green/theme.css'
// import VueParticles from '@tsparticles/vue3'

createApp(App).use(PrimeVue).mount('#app')
