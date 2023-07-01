import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type {
  MessageOptions,
  RenderMessageProps
} from 'naive-ui/es/message/src/types'
import type { AlertProps } from 'naive-ui'

let message: MessageApiInjection
export const useRegisteMsg = () => {
  message = useMessage()
}

type AlertType = 'success' | 'error' | 'warning'

type AlertThemeOverrides = NonNullable<AlertProps['themeOverrides']>
export const useAlertTheme = (): AlertThemeOverrides => {
  const success = {
    bgColor: '#f0f9eb',
    fontColor: '#67c23a'
  }
  const error = {
    bgColor: '#fef0f0',
    fontColor: '#f56c6c'
  }
  const warning = {
    bgColor: '#fdf6ec',
    fontColor: '#e6a23c'
  }
  return {
    padding: '8px 28px',
    iconMargin: '10px 8px 0 12px',
    closeMargin: '9px 8px 0 12px',
    iconSize: '19px',

    // success color
    colorSuccess: success.bgColor,
    contentTextColorSuccess: success.fontColor,
    iconColorSuccess: success.fontColor,

    // error color
    colorError: error.bgColor,
    contentTextColorError: error.fontColor,
    iconColorError: error.fontColor,

    // warning color
    colorWarning: warning.bgColor,
    contentTextColorWarning: warning.fontColor,
    iconColorWarning: warning.fontColor
  }
}

const Alert = (type: AlertType) => (props: RenderMessageProps) =>
  (
    <n-alert
      type={type}
      v-slots={{
        default: () => props.content
      }}
      style={{
        maxWidth: 'calc(100vw - 60px)',
        minHeight: '39px'
      }}
      closable={props.closable}
    />
  )

const useMsg = (options: MessageOptions, msg: string): void => {
  message.create(msg, {
    closable: true,
    render: Alert(options.type as AlertType),
    keepAliveOnHover: true,
    ...options
  })
}
export const useSuccessMsg = (msg: string, options?: MessageOptions) =>
  useMsg({ type: 'success', ...options }, msg)

export const useErrorMsg = (msg: string, options?: MessageOptions) =>
  useMsg({ type: 'error', duration: 8000, ...options }, msg)

export const useWarningMsg = (msg: string, options?: MessageOptions) =>
  useMsg({ type: 'warning', duration: 6000, ...options }, msg)
