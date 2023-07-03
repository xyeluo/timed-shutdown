export default defineComponent({
  setup() {
    const notification = useNotification()
    const notify = () => {
      notification.info({
        content: '说点啥呢',
        meta: '想不出来',
        // duration: 2500,
        keepAliveOnHover: true
      })
    }
    onMounted(() => {
      notify()
    })
  }
})
