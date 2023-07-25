import {
  darkTheme,
  zhCN,
  dateZhCN,
  type GlobalTheme,
  type GlobalThemeOverrides
} from 'naive-ui'
import PageScss from '@cmn/styles/Page.module.scss'
import { useAlertTheme } from '@cmn/hooks'
import { isDarkMode } from '@cmn/utils'

type naiveThemeType = GlobalTheme | null

type CustomeStyleOptionsCmn = {
  footerBg: string
}
type CustomeStyleOptions = {
  light: CustomeStyleOptionsCmn
  dark: CustomeStyleOptionsCmn
}
const customeStyleOptions: CustomeStyleOptions = {
  light: {
    footerBg: '#f5f5f7'
  },
  dark: {
    footerBg: '#303133'
  }
}
let customeStyleNow = ref<CustomeStyleOptionsCmn>()

const themes = { dark: darkTheme, light: null, auto: 'auto' }
export type themeType = keyof typeof themes

let theme = ref<naiveThemeType>(null)
let currentTheme = ref<themeType>('auto')

export const changeTheme = (crtTheme: themeType): void => {
  currentTheme.value = crtTheme
  if (crtTheme === 'auto') crtTheme = isDarkMode() ? 'dark' : 'light'
  customeStyleNow.value = customeStyleOptions[crtTheme]
  theme.value = themes[crtTheme]
}
export const getCurrentTheme = () => currentTheme.value

export const Page = defineComponent({
  name: 'Page',
  props: {
    bodyColor: String
  },
  setup(props, { slots }) {
    const color = {
      infoColor: '#409eff',
      primaryColor: '#69b2feFF'
    }
    const common: GlobalThemeOverrides['common'] = {
      primaryColor: color.primaryColor,
      primaryColorHover: color.primaryColor,
      primaryColorPressed: color.primaryColor,
      successColorPressed: color.primaryColor,
      borderRadius: '6px',
      borderRadiusSmall: '5px'
    }
    const button: GlobalThemeOverrides['Button'] = {
      borderHover: `1px solid ${color.primaryColor}`,
      textColorHover: color.primaryColor,
      textColorPressed: color.primaryColor,
      textColorFocus: color.primaryColor,
      borderPressed: `1px solid ${color.primaryColor}`,
      borderFocus: `1px solid ${color.primaryColor}`,
      colorInfo: color.infoColor,
      borderInfo: `1px solid ${color.infoColor}`
    }

    const themeOverrides: GlobalThemeOverrides = {
      Input: {
        colorFocus: '#69B2FE1A'
      },
      Dropdown: {
        optionTextColorActive: color.primaryColor,
        optionTextColorChildActive: color.primaryColor,
        optionColorActive: '#69B2FE33'
      },
      Switch: {
        railColorActive: color.primaryColor
      },
      Alert: useAlertTheme(),
      Notification: {
        boxShadow:
          '0 2px 3px -2px rgba(0, 0, 0, .12), 0 4px 8px 0 rgba(0, 0, 0, .08), 0 5px 14px 4px rgba(0, 0, 0, .05)'
      }
    }

    const lightThemeOverrides: GlobalThemeOverrides = {
      ...themeOverrides,
      common: {
        ...common,
        bodyColor: props.bodyColor ?? customeStyleOptions.light.footerBg
      },
      Button: button
    }
    const darkThemeOverrides: GlobalThemeOverrides = {
      ...themeOverrides,
      common: {
        ...common,
        bodyColor: props.bodyColor ?? customeStyleOptions.dark.footerBg
      },
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
          <n-notification-provider to="main">
            <header>{slots.header?.()}</header>
            <n-dialog-provider>
              <main>{slots.default?.()}</main>
            </n-dialog-provider>
            <footer
              style={{
                backgroundColor:
                  props.bodyColor ?? customeStyleNow.value?.footerBg
              }}
            >
              {slots.footer?.()}
            </footer>
          </n-notification-provider>
        </n-message-provider>
      </n-config-provider>
    )
  }
})
