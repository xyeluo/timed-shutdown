import { defineStore } from 'pinia'
import { useFirstCycle, useFirstType } from '@panel/hooks'

export default defineStore('task', {
  state() {
    return {
      name: '',
      type: useFirstType(),
      cycle: {
        type: useFirstCycle(),
        date: null,
        time: null
      }
    }
  },
  actions: {
    addTask() {
      console.log(this.$state)
    }
  }
})
