import type { Plan } from '@cmn/types'
import { RowItem } from '@panel/components/common'
import StateBtn from './StateBtn'
import Actions from './Actions'

export default defineComponent({
  props: {
    plan: Object as PropType<Plan>
  },
  setup(props) {
    const [date, time] = props.plan!.dateTime.split(' ')
    return () => (
      <div>
        <n-card size="small" hoverable>
          {{
            header: () => <h3>{props.plan?.name}</h3>,
            default: () => (
              <>
                <RowItem
                  label="任务类型："
                  style={{ marginTop: 0 }}
                  labelStyle={{ width: 'auto' }}
                >
                  {props.plan?.plan}
                </RowItem>
                <RowItem label="执行周期：" labelStyle={{ width: 'auto' }}>
                  {props.plan?.cycle.type}
                </RowItem>
                <RowItem
                  label={() => <p>状态：</p>}
                  labelStyle={{ width: '70px' }}
                >
                  <StateBtn row={props.plan} />
                </RowItem>
                <RowItem label="执行日期：" labelStyle={{ width: 'auto' }}>
                  {date ? <>&emsp;{date}&emsp;</> : ''}
                  <u>{time}</u>
                </RowItem>
              </>
            ),
            action: () => <Actions row={props.plan} />
          }}
        </n-card>
      </div>
    )
  }
})
