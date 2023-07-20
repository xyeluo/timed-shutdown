import type { Task, Plan, Settings } from '@cmn/types'

type PartPlan = { name: string; state: boolean }

type DBName = 'plans' | 'skipPlans' | 'settings'
type DBStorageRead = <T extends DBName>(
  dbName: T
) => T extends 'settings' ? Settings : Task[]

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
  switchNoticeState(partPlan: PartPlan): Promise<void>
  deleteNotice(name: string): Promise<void>
  clearNotices(): Promise<void>
  noticeError(error: string): void
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
