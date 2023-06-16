// import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'

// type msgType = keyof MessageApiInjection

export const successMsg = () => {
  const { success } = useMessage()
  return (msg: string, option?: Object) => {
    success(msg, {
      render: (props) => (
        <n-alert
          type="success"
          v-slots={{
            default: () => props.content
          }}
          style={{
            maxWidth: 'calc(100vw - 50px)',
            width: '480px',
            backgroundColor: '#f0f9eb'
          }}
          closable={props.closable}
        />
      ),
      closable: true,
      duration: 3000,
      ...option
    })
  }
}
