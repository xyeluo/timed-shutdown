import type { SelectOption } from 'naive-ui'

const createOptoins = (parms: Array<any[]>): SelectOption[] => {
  return parms.map((option) => ({ label: option[0], value: option[1] }))
}

export const useTypeOptions = () => {
  const types = [
    ['关机', 'shutdown'],
    ['重启', 'reboot'],
    ['休眠', 'dormancy']
  ]
  return createOptoins(types)
}

type Labels = {
  once: '仅一次'
  daily: '每天'
  weekly: '每周'
  monthly: '每月'
}
export type CycleType = keyof Labels
interface CycleOption extends SelectOption {
  label: Labels[CycleType]
  value: CycleType
}
export const useCycleOptions = (): CycleOption[] => {
  const cycle = [
    ['仅一次', 'once'],
    ['每天', 'daily'],
    ['每周', 'weekly'],
    ['每月', 'monthly']
  ]
  return createOptoins(cycle) as CycleOption[]
}

export const useCycleWeeklyOptions = () => {
  const weekly = [
    ['日', 'sun'],
    ['一', 'mon'],
    ['二', 'tue'],
    ['三', 'wed'],
    ['四', 'thu'],
    ['五', 'fri'],
    ['六', 'sat']
  ]
  return createOptoins(
    weekly.map((w) => {
      return [`星期${w[0]}`, w[1]]
    })
  )
}

export const useFirstType = () => {
  const first = useTypeOptions()
  return first[0].value
}

export const useFirstCycle = () => {
  const first = useCycleOptions()
  return first[0].value
}
