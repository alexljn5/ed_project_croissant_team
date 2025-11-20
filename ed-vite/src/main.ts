import { createApp, ref } from 'vue'
//import App from 'App.vue'

// Leaflet CSS
import 'leaflet/dist/leaflet.css'

createApp({
    setup()
{
    const test = ref("h")
    return{
        test
    }
}}).mount('#app')
