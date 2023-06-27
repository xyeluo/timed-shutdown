import type { DataTableColumns } from 'naive-ui'
import { PlayIcon, StopIcon, TrashIcon } from '@panel/icons'
import PListScss from '@panel/styles/PlanList.module.scss'
import { usePlansStore } from '@panel/stores'
import type { Plan } from '@/common/types'

const StateBtn = defineComponent({
  props: {
    state: Boolean
  },
  emits: ['update:state'],
  setup(props, { emit }) {
    const handleClick = () => {
      emit('update:state', !props.state)
    }
    return () => (
      <div
        class={[
          PListScss.stateBtn,
          props.state ? PListScss.play : PListScss.stop
        ]}
        onClick={handleClick}
      >
        {props.state ? (
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

export default defineComponent({
  name: 'PlanList',
  setup() {
    const plansStore = usePlansStore()

    const columns: DataTableColumns<Plan> = [
      {
        title: '任务名称',
        key: 'name',
        width: 100,
        fixed: 'left',
        resizable: true,
        ellipsis: {
          tooltip: true
        }
      },
      {
        title: '任务类型',
        key: 'plan',
        width: 90,
        align: 'center'
      },
      {
        title: '执行周期',
        key: 'cycle.type',
        width: 90,
        align: 'center'
      },
      {
        title: '状态',
        key: 'state',
        width: 120,
        align: 'center',
        render(row) {
          return <StateBtn v-model:state={row.state} />
        }
      },
      {
        title: '执行日期',
        key: 'dateTime',
        render(row) {
          const [date, time] = row.dateTime.split(' ')
          return (
            <>
              {date}&emsp;<u>{time}</u>
            </>
          )
        }
      },
      {
        title: '操作',
        key: 'actions',
        width: 90,
        fixed: 'right',
        align: 'center',
        render(row) {
          return (
            <n-space justify="space-around">
              {/* 立即运行 */}
              <n-button size="tiny" tertiary circle type="info">
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
                onClick={() => {
                  plansStore.deletePlan(row)
                }}
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
      }
    ]
    return () => (
      <n-data-table
        columns={columns}
        data={plansStore.plans}
        paginate-single-page={false}
        scroll-x="800"
      />
    )
  }
})
