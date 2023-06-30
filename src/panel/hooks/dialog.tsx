import type {
  DialogApiInjection,
  DialogOptions
} from 'naive-ui/es/dialog/src/DialogProvider'
import type { PropType, VNodeChild } from 'vue'

let dialog: DialogApiInjection
export const useRegisteDlg = () => {
  dialog = useDialog()
}

const Text = defineComponent({
  props: {
    text: Object as PropType<VNodeChild | string>
  },
  setup(props) {
    return () => (
      <p style={{ fontSize: '16px', lineHeight: '28px' }}>&nbsp;{props.text}</p>
    )
  }
})

interface Dlg {
  title?: string
  text: VNodeChild | string
  okFn: (e: MouseEvent) => unknown
}

const useDlg = (options: DialogOptions, okFn: (e: MouseEvent) => unknown) =>
  dialog.create({
    positiveText: '取消',
    negativeText: '确定',
    positiveButtonProps: {
      color: '#f56c6c'
    },
    closable: false,
    autoFocus: false,
    onNegativeClick: okFn,
    ...options
  })

export const useErrorDlg = (options: Dlg) =>
  useDlg(
    {
      title: options.title,
      content: () => <Text text={options.text} />,
      type: 'error'
    },
    options.okFn
  )

export const useWarningDlg = (options: Dlg) =>
  useDlg(
    {
      title: () => <Text text={options.text} />,
      type: 'warning'
    },
    options.okFn
  )
