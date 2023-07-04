import {
  darkTheme,
  zhCN,
  dateZhCN,
  type GlobalTheme,
  type GlobalThemeOverrides
} from 'naive-ui'
import PageScss from '@cmn/styles/Page.module.scss'
import { useAlertTheme } from '@panel/hooks'
import { isDarkMode } from '@panel/utils'

type naiveThemeType = GlobalTheme | null

const themes = { dark: darkTheme, light: null, auto: 'auto' }
export type themeType = keyof typeof themes

let theme = ref<naiveThemeType>(null)
let currentTheme = ref<themeType>('auto')

export const changeTheme = (crtTheme: themeType): void => {
  currentTheme.value = crtTheme
  if (crtTheme === 'auto') {
    theme.value = isDarkMode() ? themes.dark : themes.light
    return
  }
  theme.value = themes[crtTheme]
}
export const getCurrentTheme = () => currentTheme.value

export const Page = defineComponent({
  name: 'Page',
  props: {
    bodyColor: String
  },
  setup(props, { slots }) {
    const primaryColor = '#69b2feFF'
    const common: GlobalThemeOverrides['common'] = {
      primaryColor,
      primaryColorHover: primaryColor,
      successColorPressed: primaryColor,
      borderRadius: '6px',
      borderRadiusSmall: '5px'
    }
    const button: GlobalThemeOverrides['Button'] = {
      borderHover: '1px solid #69b2fe',
      textColorHover: '#69b2feFF',
      textColorPressed: '#69b2feFF',
      textColorFocus: '#69b2feFF',
      borderPressed: '1px solid #69b2fe',
      borderFocus: '1px solid #69b2fe'
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
      Alert: useAlertTheme()
    }

    if (props.bodyColor) {
      common.bodyColor = props.bodyColor
    }
    const lightThemeOverrides: GlobalThemeOverrides = {
      ...themeOverrides,
      common,
      Button: button
    }
    const darkThemeOverrides: GlobalThemeOverrides = {
      ...themeOverrides,
      common: { ...common, bodyColor: props.bodyColor || '#303133' },
      Button: { ...button, textColorHover: '#fffFF' }
    }

    changeTheme(currentTheme.value)

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
        <n-message-provider max="5" container-style={{ bordeRadius: '10px' }}>
          <n-notification-provider>
            <header>{slots.header?.()}</header>
            <n-dialog-provider>
              <main>{slots.default?.()}</main>
            </n-dialog-provider>
            <footer>{slots.footer?.()}</footer>
          </n-notification-provider>
        </n-message-provider>
      </n-config-provider>
    )
  }
})
