import { changeTheme, type themeType } from '@panel/components/Page';
export default defineComponent({
  name: "PlanPanel",
  setup() {
    let selectedTheme = ref<themeType>('light')
    const themesData = [
      { txt: '白天', value: 'light' },
      { txt: '黑夜', value: 'dark' },
    ]
    watch<themeType>(selectedTheme, (nValue) => {
      changeTheme(nValue)
    })

    return () => (
      <>
        <h2>PlanPanel</h2>
        {themesData.map((theme) => {
          return (
            <label for={theme.value}>
              <input type="radio" v-model={selectedTheme.value} name="theme" value={theme.value} id={theme.value} />
              {theme.txt}
            </label>
          )
        })}
      </>
    )
  }
})