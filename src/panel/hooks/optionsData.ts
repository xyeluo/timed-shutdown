import type { SelectOption } from 'naive-ui'

const createOptoins = (parms: Array<any[]>): SelectOption[] => {
  return parms.map((option) => ({ label: option[0], value: option[1] }))
}

type PlanLabels = {
  shutdown: '关机'
  reboot: '重启'
  dormancy: '休眠'
}
export type PlanValue = keyof PlanLabels

interface PlanOption extends SelectOption {
  label: PlanLabels[PlanValue]
  value: PlanValue
}
export const usePlanOptions = (): PlanOption[] => {
  const types = [
    ['关机', 'shutdown'],
    ['重启', 'reboot'],
    ['休眠', 'dormancy']
  ]
  return createOptoins(types) as PlanOption[]
}

type CycleLabels = {
  once: '仅一次'
  daily: '每天'
  weekly: '每周'
  monthly: '每月'
}
export type CycleValue = keyof CycleLabels
interface CycleOption extends SelectOption {
  label: CycleLabels[CycleValue]
  value: CycleValue
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
  const all = usePlanOptions()
  return all[0].value
}

export const useFirstCycle = () => {
  const all = useCycleOptions()
  return all[0].value
}
