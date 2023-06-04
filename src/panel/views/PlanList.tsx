import type { DataTableColumns } from 'naive-ui'
import { Play28Filled, RecordStop28Filled } from '@vicons/fluent';

type RowData = {
  key: number
  name: string
  type: string
  state: boolean
  action: any
}

export default defineComponent({
  name: "PlanList",
  setup() {
    const columns: DataTableColumns<RowData> = [
      {
        title: '任务名称',
        key: 'name',
        width: 80,
        fixed: 'left',
        align: 'center',
        resizable: true,
        ellipsis: {
          tooltip: true
        }
      },
      {
        title: '任务类型',
        key: 'type',
        width: 80,
        align: 'center',
      },
      {
        title: '执行周期',
        key: 'cycle',
        width: 80,
        align: 'center',
        render(row, index) {
          return <span>row {index}</span>
        }
      },
      {
        title: '状态',
        key: 'state',
        minWidth: 100,
        width: 100,
        align: 'center',
        render(row, index) {
          return <n-space>
            {row.state ? "运行中" : "已暂停"}
            <n-icon>{row.state ? <Play28Filled /> : <RecordStop28Filled />}</n-icon>
          </n-space>
        },
      },
      {
        title: '执行日期',
        key: 'time',
        ellipsis: {
          tooltip: true
        }
      },
      {
        title: '操作',
        key: 'actions',
        width: 180,
        fixed: 'right',
        align: "center",
        render(row, index) {
          return <n-space justify="center">
            <n-button size="small" type="primary" color="#67c23a">
              立即执行
            </n-button>
            <n-button size="small" type="error" color="#f56c6c">
              删除
            </n-button>
          </n-space>
        },
      }
    ]
    const data = Array.from({ length: 2 }).map((_, index) => ({
      key: index,
      name: `TD ${index}`,
      type: 32,
      time: `2023/1/28${index}`,
      state: true
    }))

    const pagination = data.length <= 10 ? false : { pageSize: 10 }

    return () => (
      <n-data-table columns={columns} data={data}
        pagination={pagination}
        max-height="300px"
        scroll-x="800" />
    )
  }
})