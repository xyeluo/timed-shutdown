import { darkTheme, type GlobalTheme } from 'naive-ui';

const themes = { dark: darkTheme, light: null }
type changeThemeType = (currentTheme: keyof typeof themes) => void

export const Page = defineComponent({
  setup(_, { slots, expose }) {
    interface PageProps {
      theme: GlobalTheme | null
    }
    let theme = ref<PageProps[keyof PageProps]>(null)

    const changeTheme: changeThemeType = (currentTheme) => {
      theme.value = themes[currentTheme]
    }
    expose({ changeTheme })
    return () => (
      <n-config-provider theme={theme.value}>
        <n-global-style />
        {slots.default?.()}
      </n-config-provider>
    )
  }
})

type PageType = typeof Page
export interface PageInstance extends PageType {
  changeTheme: changeThemeType
}
