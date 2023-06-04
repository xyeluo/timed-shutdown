import type { SelectGroupOption } from 'naive-ui';
import { Page } from '@panel/components/Page';
import { Add12Filled, Settings28Filled } from '@vicons/fluent';
import { GithubFilled, QuestionCircleFilled } from '@vicons/antd';

const PlanPanel = defineAsyncComponent(() => import("@panel/views/PlanPanel"))
const PlanList = defineAsyncComponent(() => import("@panel/views/PlanList"))

import { openUrl } from '@panel/utils';

import "@panel/styles/index.scss"

const HomeUrl = 'https://github.com/xyeluo/'

const Github = defineComponent({
  setup() {
    return () => (
      <n-tooltip show-arrow={false} trigger="hover">
        {{
          default: () => <>Github</>,
          trigger: () => <n-icon size='20px' onClick={() => openUrl(
            `${HomeUrl}timed-shutdown/`
          )}><GithubFilled /></n-icon>
        }}
      </n-tooltip>

    )
  }
})

const Question = defineComponent({
  setup() {
    let options: Array<SelectGroupOption> = [
      {
        type: 'group',
        label: "问题反馈",
        children: [
          {
            label(options) {
              // console.log('Github', options, selected);
              return (<div onClick={() => openUrl(`${HomeUrl}/timed-shutdown/issues`)}>{options.value}</div>)
            },
            value: "Github",
          },
          {
            label(options) {
              return (<div onClick={() => openUrl('https://yuanliao.info/d/5810')}>{options.value}</div>)
            },
            value: 'Utools',
          },
        ]
      }
    ]
    return () => (
      <n-popselect options={options}>
        <n-icon size='20px'><QuestionCircleFilled /></n-icon>
      </n-popselect>
    )
  }
})

const Setting = defineComponent({
  setup() {
    return () => (
      <n-icon size='20px'><Settings28Filled /></n-icon>
    )
  }
})


const PanelHeader = defineComponent({
  setup() {
    let btnState = ref(false)
    const handleClick = () => {
      btnState.value = !btnState.value
      setTimeout(() => {
        btnState.value = !btnState.value
      }, 3000)
    }
    return () => (<>
      <h2>任务列表</h2>
      <n-button type="info" color="#409eff"
        loading={btnState.value} disabled={btnState.value} onClick={handleClick}
      >
        {{
          default: () => <div>添加任务</div>,
          icon: () => <n-icon><Add12Filled /></n-icon>
        }}
      </n-button></>)
  }
})


export default defineComponent({
  setup() {

    return () => (
      <Page>
        {{
          header: () => <PanelHeader />
          ,
          main: () => (<>
            <PlanList />
          </>)
          ,
          footer: () => (<>
            <Github />
            <Question />
            <Setting />
          </>)
        }}
      </Page>
    )
  }
})