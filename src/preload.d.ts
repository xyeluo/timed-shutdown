import type { Task, Plan } from '@cmn/types'

type PartPlan = { name: string; state: boolean }
type DBName = 'plans' | 'skipPlans' | 'settings'
interface Preload {
  // utools
  dbStorageSave<T>(dbName: DBName, data: T): Promise<void>
  dbStorageRead(dbName: DBName): Promise<Task[]>

  // win
  createTask(task: Task): Promise<any>
  deleteTask(name: string): Promise<any>
  deleteTaskXML(): Promise<void>
  switchState(partPlan: PartPlan): Promise<any>
  runPlan(name: string): Promise<any>
  openRemote(): Promise<any>

  // preload
  addNotice(notice: Task): Promise<void>
  switchNoticeState(partPlan: PartPlan): Promise<void>
  deleteNotice(name: string): Promise<void>
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
