import { darkTheme, zhCN, dateZhCN, type GlobalTheme } from 'naive-ui'

import PageScss from '@panel/styles/Page.module.scss'

import { Suspense } from 'vue'

type naiveThemeType = GlobalTheme | null

const themes = { dark: darkTheme, light: null }
let theme = ref<naiveThemeType>(null)

export type themeType = keyof typeof themes
export const changeTheme = (currentTheme: themeType): void => {
  theme.value = themes[currentTheme]
}

export const Page = defineComponent({
  name: 'Page',
  setup(_, { slots }) {
    return () => (
      <n-config-provider
        locale={zhCN}
        date-locale={dateZhCN}
        theme={theme.value}
        class={PageScss.container}
      >
        <n-global-style />
        <header>{slots.header?.()}</header>
        <main>{slots.main?.()}</main>
        <footer>{slots.footer?.()}</footer>
      </n-config-provider>
    )
  }
})
