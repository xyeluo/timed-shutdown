import type { SelectGroupOption } from 'naive-ui'
import { Page } from '@cmn/Page'
import { GithubIcon, QuestionIcon, AddIcon, SettingIcon } from '@panel/icons'
import { openUrl } from '@cmn/utils'
import '@cmn/styles/index.scss'
import { showModal } from '@panel/view/PlanPanel'
import { useRegisteMsg, useRegisteDlg } from '@cmn/hooks'
import SettingView from '@panel/components/SettingView'
import { usePlansStore, useTaskStore } from '@cmn/stores'
import type { Task } from '@cmn/types'

const HomeUrl = 'https://github.com/xyeluo/'
declare global {
  interface Window {
    createTask(task: Task): void
    stopPlan(task: Task): void
  }
}
const PanelHeader = defineComponent({
  setup() {
    let btnState = ref(false)
    const handleClick = () => {
      showModal()
    }
    return () => (
      <>
        <h3>任务列表</h3>
        <n-button
          type="primary"
          color="#69b2fe"
          loading={btnState.value}
          onClick={handleClick}
        >
          {{
            default: () => <div>添加任务</div>,
            icon: () => (
              <n-icon>
                <AddIcon />
              </n-icon>
            )
          }}
        </n-button>
      </>
    )
  }
})

const Github = defineComponent({
  setup() {
    const openGithub = () => {
      openUrl(`${HomeUrl}timed-shutdown/`)
    }
    return () => (
      <n-popover trigger="hover">
        {{
          default: () => <>Github</>,
          trigger: () => (
            <n-icon size="20px" onClick={openGithub}>
              <GithubIcon />
            </n-icon>
          )
        }}
      </n-popover>
    )
  }
})

const Question = defineComponent({
  setup() {
    let options: Array<SelectGroupOption> = [
      {
        type: 'group',
        label: '问题反馈',
        children: [
          {
            label(options) {
              // console.log('Github', options, selected);
              return (
                <div
                  onClick={() => openUrl(`${HomeUrl}/timed-shutdown/issues`)}
                >
                  {options.value}
                </div>
              )
            },
            value: 'Github'
          },
          {
            label(options) {
              return (
                <div onClick={() => openUrl('https://yuanliao.info/d/5810')}>
                  {options.value}
                </div>
              )
            },
            value: 'Utools'
          }
        ]
      }
    ]
    return () => (
      <n-popselect options={options}>
        <n-icon size="20px">
          <QuestionIcon />
        </n-icon>
      </n-popselect>
    )
  }
})

const Setting = defineComponent({
  setup() {
    let active = ref(false)

    return () => (
      <>
        <n-popover>
          {{
            default: () => <>设置</>,
            trigger: () => (
              <n-icon size="20px" onClick={() => (active.value = true)}>
                <SettingIcon />
              </n-icon>
            )
          }}
        </n-popover>
        <SettingView v-model:active={active.value} />
      </>
    )
  }
})

export default defineComponent({
  setup() {
    // 给通知视图暴露的api
    const taskStore = useTaskStore()
    const { switchState } = usePlansStore()
    window.createTask = (task) => {
      taskStore.task = task
      taskStore.createTask()
    }
    window.stopPlan = (plan) => {
      switchState(plan)
    }

    const Main = () => {
      // 注册全局信息弹窗
      useRegisteMsg()
      useRegisteDlg()
      const PlanList = defineAsyncComponent(
        () => import('@panel/view/PlanList')
      )
      const PlanPanel = defineAsyncComponent(
        () => import('@panel/view/PlanPanel')
      )
      return (
        <>
          <PlanList />
          <PlanPanel />
        </>
      )
    }
    return () => (
      <Page>
        {{
          header: () => <PanelHeader />,
          default: () => <Main />,
          footer: () => (
            <>
              <Github />
              <Question />
              <Setting />
            </>
          )
        }}
      </Page>
    )
  }
})
