import type { SelectOption } from 'naive-ui'

const createOptoins = (parms: Array<any[]>): SelectOption[] => {
  return parms.map((option) => ({ label: option[0], value: option[1] }))
}

type PlanLabels = {
  shutdown: '关机'
  reboot: '重启'
  dormancy: '休眠'
}

export type PlanKey = keyof PlanLabels

export interface PlanOption extends SelectOption {
  label: PlanLabels[PlanKey]
  value: PlanKey
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
export type CycleKey = keyof CycleLabels
export interface CycleOption extends SelectOption {
  label: CycleLabels[CycleKey]
  value: CycleKey
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

type otherDateLabels = {
  sunday: '日'
  monday: '一'
  tuesday: '二'
  wednesday: '三'
  thursday: '四'
  friday: '五'
  saturday: '六'
}
export type otherDateKey = keyof otherDateLabels
export interface OtherDateOption extends SelectOption {
  label: otherDateLabels[otherDateKey]
  value: otherDateKey
}
export const useCycleWeeklyOptions = () => {
  const weekly = [
    ['日', 'sunday'],
    ['一', 'monday'],
    ['二', 'tuesday'],
    ['三', 'wednesday'],
    ['四', 'thursday'],
    ['五', 'friday'],
    ['六', 'saturday']
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
