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
export type Cycle = keyof Labels
interface CycleOption extends SelectOption {
  label: Labels[Cycle]
  value: Cycle
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
