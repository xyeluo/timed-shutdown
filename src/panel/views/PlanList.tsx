import type { DataTableColumns } from 'naive-ui'
import { PlayIcon, StopIcon, TrashIcon } from '@panel/icons';
import PListScss from '@panel/styles/PlanList.module.scss';
import type { PropType } from 'vue';

type RowData = {
  key: number
  name: string
  type: string
  state: boolean
  action: any
}

const StateBtn = defineComponent({
  props: {
    row: Object as () => RowData,
  },
  emits: ['update:row'],
  setup(props, { emit }) {

    const handleClick = () => {
      props!.row!.state = props!.row!.state
      emit('update:row', props.row)
    }
    return () => (<div class={[PListScss.stateBtn,
    props.row?.state ? PListScss.play : PListScss.stop]}
      onClick={handleClick}
    >
      {props.row?.state ?
        <>运行中<n-icon size="18px"><PlayIcon /></n-icon></> :
        <>已暂停<n-icon size="18px"><StopIcon /></n-icon></>
      }
    </div>)
  }
})

export default defineComponent({
  name: "PlanList",
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
        }
      },
      {
        title: '任务类型',
        key: 'type',
        width: 90,
        align: 'center',
      },
      {
        title: '执行周期',
        key: 'cycle',
        width: 90,
        align: 'center',
        render(row, index) {
          return <span>row {index}</span>
        }
      },
      {
        title: '状态',
        key: 'state',
        width: 120,
        align: 'center',
        render(row, index) {
          watch(row, (nValue) => {
            console.log(nValue);

          }, { deep: true })
          return <StateBtn v-model:row={row} />
        },
      },
      {
        title: '执行日期',
        key: 'time',
      },
      {
        title: '操作',
        key: 'actions',
        width: 90,
        fixed: 'right',
        align: "center",
        render(row, index) {
          return <n-space justify="space-around">
            <n-button size="tiny" secondary circle type="primary">
              {{ icon: () => <n-icon><PlayIcon /></n-icon> }}
            </n-button>
            <n-button size="tiny" type="error" secondary circle color="#f56c6c">
              {{ icon: () => <n-icon><TrashIcon /></n-icon> }}
            </n-button>
          </n-space>
        },
      }
    ]
    let data = Array.from({ length: 2 }).map((_, index) => ({
      key: index,
      name: `200748 01-15-23`,
      type: 32,
      time: `2023/1/28${index}巴拉巴拉巴拉巴拉巴拉吧Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit iusto consectetur, est inventore sequi quasi ab facilis, quia ut omnis incidunt quod minima quo, illum modi in. Rerum, fugiat nesciunt.`,
      state: ref(true)
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