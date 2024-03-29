import type { Plan } from '@cmn/types'
import { RowItem } from '@cmn/components/Other'
import StateBtn from './StateBtn'
import Actions from './Actions'

const LabelText = defineComponent({
  props: {
    text: String
  },
  setup(props) {
    return () => <n-text depth="3">{props.text}</n-text>
  }
})
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
                  label={() => <LabelText text="任务类型：" />}
                  style={{ marginTop: 0 }}
                  labelStyle={{ width: 'auto' }}
                >
                  {props.plan?.plan}
                </RowItem>
                <RowItem
                  label={() => <LabelText text="执行周期：" />}
                  labelStyle={{ width: 'auto' }}
                >
                  {props.plan?.cycle.type}
                </RowItem>
                <RowItem
                  label={() => <LabelText text="状态：" />}
                  labelStyle={{ width: '70px' }}
                >
                  <StateBtn row={props.plan} />
                </RowItem>
                <RowItem
                  label={() => <LabelText text="执行日期：" />}
                  labelStyle={{ width: 'auto' }}
                >
                  {date ? <>&emsp;{date}&emsp;</> : ''}
                  <u>{time}</u>
                </RowItem>
                {props.plan?.state ? (
                  <RowItem
                    label={() => <LabelText text="下次通知时间：" />}
                    labelStyle={{ width: '100px' }}
                  >
                    &emsp;{props.plan?.nextRun}
                  </RowItem>
                ) : null}
              </>
            ),
            action: () => <Actions row={props.plan} />
          }}
        </n-card>
      </div>
    )
  }
})
