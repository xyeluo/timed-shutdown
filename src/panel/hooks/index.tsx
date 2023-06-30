import type { Plan } from '@cmn/types'
import { useErrorDlg, useRegisteDlg, useWarningDlg } from './dialog'
import { usePlansStore } from '@panel/stores'

export const useforceDelete = (e: string, row: Plan) => {
  const { deletePlanFromTaskDb } = usePlansStore()
  useErrorDlg({
    title: e,
    text: (
      <>
        是否强制从<b> 插件计划列表中 </b>
      </>
    ),
    okFn() {
      deletePlanFromTaskDb(row)
    }
  })
}

export { useErrorDlg, useRegisteDlg, useWarningDlg }
export * from './optionsData'
export * from './message'
export * from './validTask'
export * from './taskToPlan'
