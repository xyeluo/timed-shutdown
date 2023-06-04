import { darkTheme, type GlobalTheme } from 'naive-ui';

import '@panel/styles/Page.scss';

type naiveThemeType = GlobalTheme | null

const themes = { dark: darkTheme, light: null }
let theme = ref<naiveThemeType>(null)


export type themeType = keyof typeof themes
export const changeTheme = (currentTheme: themeType): void => {
  theme.value = themes[currentTheme]
}

export const Page = defineComponent({
  name: "Page",
  setup(_, { slots }) {
    return () => (
      <n-config-provider theme={theme.value}>
        <n-global-style />
        <header>{slots.header?.()}</header>
        <main>{slots.main?.()}</main>
        <footer>{slots.footer?.()}</footer>
      </n-config-provider>
    )
  }
})

