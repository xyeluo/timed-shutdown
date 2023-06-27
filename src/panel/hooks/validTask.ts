import type { Task } from '@cmn/types'
import { getNowDate } from '@panel/utils'

// 除周期‘仅一次’外,date仅在点击‘确定’后获取
export const useCompleteDate = (task: Task) => {
  if (task.cycle.type === 'once') return
  task.cycle.date = getNowDate()
}

export const useCompleteName = (task: Task) => {
  task.name = task.name.trim()

  if (task.name.length === 0) {
    // todo:complete task name
  }
}
