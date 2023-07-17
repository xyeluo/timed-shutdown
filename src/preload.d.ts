import type { Task, Plan, Settings } from '@cmn/types'

type PartPlan = { name: string; state: boolean }
type DBName = 'plans' | 'skipPlans' | 'settings'
interface Preload {
  // utools
  dbStorageSave<T>(dbName: DBName, data: T): Promise<void>
  dbStorageRead<T extends DBName>(
    dbName: T
  ): Promise<T extends 'settings' ? Settings : Task[]>

  // win
  createTask(task: Task): Promise<any>
  deleteTask(name: string): Promise<any>
  deleteTaskXML(): Promise<void>
  switchState(partPlan: PartPlan): Promise<any>
  runPlan(name: string): Promise<any>
  openRemote(): Promise<any>

  // preload
  addNotice(notice: Task): Promise<string>
  switchNoticeState(partPlan: PartPlan): Promise<void>
  deleteNotice(name: string): Promise<void>
  clearNotices(): Promise<void>
}
interface NoticePreload {
  createTask(task: Task): void
  stopPlan(task: Task | Plan): void
}

declare global {
  interface Window {
    preload: Preload
    noticePreload: NoticePreload
  }
  var preload: Preload
  var noticePreload: NoticePreload
}
