import { createApp } from 'vue'
import pinia from '@panel/stores'

import App from './App'

createApp(App).use(pinia).mount('#app')
