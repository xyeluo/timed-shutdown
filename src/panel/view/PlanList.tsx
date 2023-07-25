import { usePlansStore, useSettingsStore } from '@panel/stores'
import { pluginEnter } from '@cmn/utils'
import PlanCard from '@panel/components/PlanList/PlanCard'
import PListScss from '@panel/styles/PlanList.module.scss'
import { TransitionGroup } from 'vue'

export default defineComponent({
  name: 'PlanList',
  setup() {
    const plansStore = usePlansStore()
    const settingsStore = useSettingsStore()

    // 删除过期任务(任务周期为仅一次且开启自动删除选项的任务)
    const deleteExpiredPlan = () => {
      for (const p of plansStore.plans) {
        if (p.cycle.type !== '仅一次') continue
        const dateTime = p.dateTime
          .slice(0, p.dateTime.length - 1)
          .replace(/时/, ':')

        if (p.cycle.autoDelete && new Date(dateTime) < new Date()) {
          plansStore
            .deletePlan(p)
            .catch(() => plansStore.deletePlanFromTaskDb(p))
        }
      }
    }
    pluginEnter(() => {
      settingsStore.changeTheme(settingsStore.settings.currentTheme)
      deleteExpiredPlan()
    })

    return () => {
      if (plansStore.plans.length === 0)
        return <n-empty description="任务为空" size="huge" />
      return (
        <div class={PListScss.list}>
          <TransitionGroup
            enterFromClass={PListScss.listTrFrom}
            enterToClass={PListScss.listTrTo}
            leaveFromClass={PListScss.listTrTo}
            leaveToClass={PListScss.listTrFrom}
            enterActiveClass={PListScss.listTransition}
            leaveActiveClass={PListScss.listTransitionLeave}
            moveClass={PListScss.listTransition}
          >
            {plansStore.plans.map((p) => (
              <PlanCard plan={p} key={p.name} />
            ))}
          </TransitionGroup>
        </div>
      )
    }
  }
})
