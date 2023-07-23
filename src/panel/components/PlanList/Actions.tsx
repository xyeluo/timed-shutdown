import { usePlansStore } from '@panel/stores'
import type { Plan } from '@cmn/types'
import { useWarningDlg, useSuccessMsg, useforceDelete } from '@cmn/hooks'
import { rowProps } from '@panel/components/common'

export default defineComponent({
  props: rowProps,
  setup(props) {
    const { runPlan, deletePlan } = usePlansStore()

    // 运行按钮的loading
    const runPlanClick = (row: Plan) => {
      useWarningDlg({
        text: (
          <>
            确定立即执行<b> {props.row.name} </b>计划吗？
          </>
        ),
        okFn() {
          runPlan(row)
            .then((stdout) => {
              useSuccessMsg(stdout)
            })
            .catch((error) => {
              const e: string = error?.stack || error
              useforceDelete(e, row)
            })
        }
      })
    }

    const deletePlanClick = (row: Plan) => {
      useWarningDlg({
        text: (
          <>
            确定删除<b> {props.row.name} </b>计划吗？
          </>
        ),
        okFn() {
          deletePlan(row)
            .then((stdout) => {
              useSuccessMsg(stdout)
            })
            .catch((error) => {
              const e: string = error?.stack || error
              useforceDelete(e, row)
            })
        }
      })
    }

    return () => (
      <n-space justify="space-around">
        <n-button
          size="small"
          secondary
          type="info"
          onClick={() => runPlanClick(props.row)}
        >
          立即运行
        </n-button>

        <n-button
          size="small"
          secondary
          type="error"
          color="#f56c6c"
          onClick={() => deletePlanClick(props.row)}
        >
          {props.row.cycle.type === '仅一次' && props.row.cycle.autoDelete
            ? '自动删除'
            : '删除'}
        </n-button>
      </n-space>
    )
  }
})
