import { PlayIcon, StopIcon } from '@panel/icons'
import PListScss from '@panel/styles/PlanList.module.scss'
import { usePlansStore } from '@panel/stores'
import type { Plan } from '@/common/types'
import { useSuccessMsg, useforceDelete } from '@panel/hooks'
import { rowProps } from '@panel/components/common'

export default defineComponent({
  props: rowProps,
  setup(props) {
    const { switchState } = usePlansStore()
    const switchStateClick = (row: Plan) => {
      switchState(row)
        .then((stdout) => {
          useSuccessMsg(stdout)
        })
        .catch((error) => {
          const e = error?.stack || error
          useforceDelete(e, row)
        })
    }
    return () => (
      <div
        class={[
          PListScss.stateBtn,
          props.row.state ? PListScss.play : PListScss.stop
        ]}
        onClick={() => switchStateClick(props.row)}
      >
        {props.row.state ? (
          <>
            运行中
            <n-icon size="18px">
              <PlayIcon />
            </n-icon>
          </>
        ) : (
          <>
            已暂停
            <n-icon size="18px">
              <StopIcon />
            </n-icon>
          </>
        )}
      </div>
    )
  }
})
