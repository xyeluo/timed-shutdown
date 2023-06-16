import {
  darkTheme,
  zhCN,
  dateZhCN,
  type GlobalTheme,
  type GlobalThemeOverrides
} from 'naive-ui'
import PageScss from '@panel/styles/Page.module.scss'

type naiveThemeType = GlobalTheme | null

const themes = { dark: darkTheme, light: null }
let theme = ref<naiveThemeType>(null)

const primaryColor = '#69b2feFF'
const common = {
  primaryColor,
  primaryColorHover: primaryColor,
  successColorPressed: primaryColor
}
const button = {
  borderHover: '1px solid #69b2fe'
}

const themeOverrides: GlobalThemeOverrides = {
  Input: {
    colorFocus: '#69B2FE1A'
  },
  Dropdown: {
    optionTextColorActive: primaryColor,
    optionTextColorChildActive: primaryColor,
    optionColorActive: '#69B2FE33'
  },
  Switch: {
    railColorActive: primaryColor
  },
  Alert: {
    padding: '8px 13px',
    iconMargin: '8px 8px 0 12px',
    closeMargin: '9px 8px 0 12px'
  }
}

const lightThemeOverrides: GlobalThemeOverrides = {
  ...themeOverrides,
  common,
  Button: { ...button, textColorHover: '#000' }
}
const darkThemeOverrides: GlobalThemeOverrides = {
  ...themeOverrides,
  common: { ...common, bodyColor: '#303133' },
  Button: { ...button, textColorHover: '#fffFF' }
}

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
        theme-overrides={
          theme.value === null ? lightThemeOverrides : darkThemeOverrides
        }
      >
        <n-global-style />
        <n-message-provider max="5">
          <header>{slots.header?.()}</header>
          <main>{slots.main?.()}</main>
          <footer>{slots.footer?.()}</footer>
        </n-message-provider>
      </n-config-provider>
    )
  }
})
