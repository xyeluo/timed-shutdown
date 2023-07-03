import { createPinia } from 'pinia'
import { cloneStore } from '@panel/utils'

const pinia = createPinia()

// rewrite $rest
pinia.use(({ store }) => {
  const initialState = cloneStore(store.$state)
  store.$reset = () => {
    store.$patch(initialState)
  }
})

export default pinia

export * from './task'
export * from './plans'
