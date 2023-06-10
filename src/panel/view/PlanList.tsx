import type { DataTableColumns } from 'naive-ui'
import { PlayIcon, StopIcon, TrashIcon } from '@panel/icons'
import PListScss from '@panel/styles/PlanList.module.scss'
import type { PropType, Ref } from 'vue'

type RowData = {
  autoDelete: boolean
  cycle: string
  datetime: string
  day: string
  daysOfMonth: never[]
  name: string
  state: boolean
  tempName: string
  type: string
  weekly: never[]
}

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
    const columns: DataTableColumns<RowData> = [
      {
        title: '任务名称',
        key: 'name',
        width: 140,
        fixed: 'left',
        resizable: true,
        ellipsis: {
          tooltip: true
        },
        render(rowData, rowIndex) {
          let name = rowData.name
          if (name.startsWith('TS_')) {
            name = name.slice(3) //'23-05-08 222634'
            const [datePart, timePart] = name.split(' ') // ['23-05-08', '222634']
            const [year, month, day] = datePart.split('-') // [23,05,08]
            name = `${timePart} ${month}/${day}/${year}` // '222634 05/08/23'
          }
          return name
        }
      },
      {
        title: '任务类型',
        key: 'type',
        width: 90,
        align: 'center'
      },
      {
        title: '执行周期',
        key: 'cycle',
        width: 90,
        align: 'center'
      },
      {
        title: '状态',
        key: 'state',
        width: 120,
        align: 'center',
        render(row, index) {
          let rowRef = ref(row)
          return <StateBtn v-model:state={rowRef.value.state} />
        }
      },
      {
        title: '执行日期',
        key: 'time'
      },
      {
        title: '操作',
        key: 'actions',
        width: 90,
        fixed: 'right',
        align: 'center',
        render(row, index) {
          return (
            <n-space justify="space-around">
              <n-button size="tiny" tertiary circle type="info">
                {{
                  icon: () => (
                    <n-icon>
                      <PlayIcon />
                    </n-icon>
                  )
                }}
              </n-button>
              <n-button
                size="tiny"
                tertiary
                circle
                type="error"
                color="#f56c6c"
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
    let data = [
      {
        autoDelete: true,
        cycle: '仅一次',
        time: '2023-05-10 22时26分',
        day: '2023-05-10',
        daysOfMonth: [],
        name: 'TS_23-05-08 222634',
        state: true,
        tempName: 'TS_23-05-08 222634',
        type: '关机',
        weekly: []
      },
      {
        type: '休眠',
        name: 'TS_23-01-15 200748',
        cycle: '每天',
        day: '',
        daysOfMonth: [],
        weekly: [],
        time: '00时20分',
        autoDelete: false,
        tempName: 'TS_23-01-15 200748',
        status: true
      },
      {
        type: '重启',
        name: 'TS_23-01-15 200724',
        cycle: '每周',
        day: '',
        daysOfMonth: [],
        weekly: ['tue', 'fri'],
        time: '星期二、星期五 \n00时10分',
        autoDelete: false,
        tempName: 'TS_23-01-15 200724',
        status: true
      }
    ]
    const pagination = data.length <= 10 ? false : { pageSize: 10 }

    return () => (
      <n-data-table
        columns={columns}
        data={data}
        paginate-single-page={false}
        scroll-x="800"
      />
    )
  }
})
