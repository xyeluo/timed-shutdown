import type { SelectGroupOption } from 'naive-ui';
import { Page, changeTheme, type themeType } from '@panel/components/Page';

import { GithubIcon, QuestionIcon, SettingIcon, AddIcon } from '@panel/icons';

const PlanPanel = defineAsyncComponent(() => import("@panel/views/PlanPanel"))
const PlanList = defineAsyncComponent(() => import("@panel/views/PlanList"))

import { openUrl } from '@panel/utils';

import "@panel/styles/index.scss"

const HomeUrl = 'https://github.com/xyeluo/'

const Github = defineComponent({
  setup() {
    const openGithub = () => {
      openUrl(`${HomeUrl}timed-shutdown/`)
    }
    return () => (
      <n-popover show-arrow={false} trigger="hover">
        {{
          default: () => <>Github</>,
          trigger: () => <n-icon size='20px' onClick={openGithub}><GithubIcon /></n-icon>
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
        <n-icon size='20px'><QuestionIcon /></n-icon>
      </n-popselect>
    )
  }
})

const Setting = defineComponent({
  setup() {
    let active = ref(false)
    let selectedTheme = ref<themeType>('light')
    const themesData = [
      { txt: '白天', value: 'light' },
      { txt: '黑夜', value: 'dark' },
    ]
    const activate = () => {
      active.value = true
    }
    watch<themeType>(selectedTheme, (nValue) => {
      changeTheme(nValue)
    })
    return () => (<>
      <n-popover>
        {{
          default: () => <>设置</>,
          trigger: () => <n-icon size='20px' onClick={activate}><SettingIcon /></n-icon>,
        }}
      </n-popover>

      <n-drawer v-model:show={active.value} width="300">
        <n-drawer-content closable>
          {{
            header: () => <div>header</div>,
            default: () => (
              themesData.map((theme) => {
                return (
                  <label for={theme.value}>
                    <input type="radio" v-model={selectedTheme.value} name="theme" value={theme.value} id={theme.value} />
                    {theme.txt}
                  </label>
                )
              }))
            ,
          }}
        </n-drawer-content>
      </n-drawer>
    </>
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
      <n-button type="primary" color="#67c23a"
        loading={btnState.value} disabled={btnState.value} onClick={handleClick}
      >
        {{
          default: () => <div>添加任务</div>,
          icon: () => <n-icon><AddIcon /></n-icon>
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
            {/* <PlanPanel /> */}
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