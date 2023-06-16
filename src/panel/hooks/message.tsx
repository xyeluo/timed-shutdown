import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { RenderMessageProps } from 'naive-ui/es/message/src/types'

// type msgType = keyof MessageApiInjection
let message: MessageApiInjection
export const useRegisteMsg = () => {
  message = useMessage()
}

type messageType = 'success' | 'error'
interface AlertOptions {
  type: messageType
  bgColor?: string
}
const Alert = (options: AlertOptions) => {
  return (props: RenderMessageProps) => (
    <n-alert
      type={options.type}
      v-slots={{
        default: () => props.content
      }}
      style={{
        maxWidth: 'calc(100vw - 50px)',
        width: '480px',
        backgroundColor: options.bgColor
      }}
      closable={props.closable}
    />
  )
}

export const useSuccessMsg = (msg: string, option?: Object) => {
  const { success } = message
  success(msg, {
    render: Alert({ type: 'success', bgColor: '#f0f9eb' }),
    closable: true,
    duration: 60000,
    ...option
  })
}

export const useErrorMsg = (msg: string, option?: Object) => {
  const { error } = message
  error(msg, {
    render: Alert({ type: 'error', bgColor: '#fef0f0' }),
    closable: true,
    duration: 60000,
    ...option
  })
}
