import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from "pinia"
import "./assets/css/app.scss"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'leaflet/dist/leaflet.css';



createApp(App).use(createPinia()).mount('#app')
