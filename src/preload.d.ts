import type { Task, Plan, Settings, PlanValue } from '@cmn/types'

type PartPlan = { name: string; state: boolean }

export type V1Store = {
  type: PlanValue
  name: string
  cycle: string
  day: string
  daysOfMonth: string[]
  weekly: string[]
  datetime: string
  autoDelete: boolean
  tempName: string
  status: boolean
}
type DBName = 'plans' | 'skipPlans' | 'settings' | 'v1Store'
type DBStorageRead = <T extends DBName>(
  dbName: T
) => T extends 'settings' ? Settings : T extends 'v1Store' ? V1Store[] : Task[]

interface Preload {
  // utools
  dbStorageSave<T>(dbName: DBName, data: T): Promise<void>
  dbStorageRead: DBStorageRead

  // win
  createTask(task: Task): Promise<any>
  deleteTask(name: string): Promise<any>
  deleteTaskXML(): Promise<void>
  switchState(partPlan: PartPlan): Promise<any>
  runPlan(name: string): Promise<any>
  openRemote(): Promise<any>

  // preload
  addNotice(notice: Task): Promise<string>
  switchNoticeState(partPlan: PartPlan): Promise<string | undefined>
  deleteNotice(name: string): Promise<void>
  clearNotices(): Promise<void>
  noticeError(error: string): void
  removeDBStore(v1: 'v1Store'): void
}

interface NoticePreload {
  //win
  createTask(task: Task): Promise<any>

  // noticePreload
  stopPlan(task: Task | Plan): Promise<any>
  closeWindow(): void

  //utools
  dbStorageRead: DBStorageRead
}

declare global {
  interface Window {
    preload: Preload
    noticePreload: NoticePreload
  }
  var preload: Preload
  var noticePreload: NoticePreload
}
