import { createPinia } from 'pinia'

const pinia = createPinia()

// rewrite $rest
pinia.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(store.$state))
  store.$reset = () => {
    store.$patch(initialState)
  }
})

export default pinia

export * from '@/panel/stores/task'
export * from '@/panel/stores/plans'
