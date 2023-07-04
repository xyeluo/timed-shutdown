import { PlayIcon, TrashIcon } from '@panel/icons'
import { usePlansStore } from '@cmn/stores'
import type { Plan } from '@cmn/types'
import { useWarningDlg, useSuccessMsg, useforceDelete } from '@panel/hooks'
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
        {/* 立即运行 */}
        <n-button
          size="tiny"
          tertiary
          circle
          type="info"
          onClick={() => runPlanClick(props.row)}
        >
          {{
            icon: () => (
              <n-icon>
                <PlayIcon />
              </n-icon>
            )
          }}
        </n-button>
        {/* 删除任务 */}
        <n-button
          size="tiny"
          tertiary
          circle
          type="error"
          color="#f56c6c"
          onClick={() => deletePlanClick(props.row)}
        >
          {{
            icon: () => (
              <n-icon>
                <TrashIcon />
              </n-icon>
            )
          }}
        </n-button>
      </n-space>
    )
  }
})
