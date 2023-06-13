import { createApp } from 'vue'
import { pinia } from '@panel/store'
import App from './App'

createApp(App).use(pinia).mount('#app')
