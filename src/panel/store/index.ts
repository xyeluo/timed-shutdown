import { createPinia } from 'pinia'
import useTaskStore from '@panel/store/task'

const pinia = createPinia()
const taskStore = useTaskStore(pinia)

export { pinia, taskStore }
