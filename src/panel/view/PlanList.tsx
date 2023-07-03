import type { DataTableColumns } from 'naive-ui'
import { usePlansStore } from '@cmn/stores'
import type { Plan } from '@/common/types'
import StateBtn from '@panel/components/PlanList/StateBtn'
import Actions from '@panel/components/PlanList/Actions'

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
        align: 'center',
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
        render: (row) => <StateBtn row={row} />
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
        render: (row) => <Actions row={row} />
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
