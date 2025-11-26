import { createApp } from 'vue'
import App from './App.vue'
import TestConnection from './components/BackendGlue.vue'

createApp(App)
  .component('TestConnection', TestConnection)
  .mount('#app')
