import type { Task } from '@cmn/types'

type PartPlan = { name: string; state: boolean }
interface Preload {
  // utools
  dbStorageSave<T>(data: T): Promise<void>
  dbStorageRead(): Promise<Task[]>

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
  clearJobs(): Promise<void>
}
interface NoticePreload {
  createTask(task: Task): void
}

declare global {
  interface Window {
    preload: Preload
    noticePreload: NoticePreload
  }
  var preload: Preload
  var noticePreload: NoticePreload
}
