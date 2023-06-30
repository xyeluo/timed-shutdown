import type { Task } from '@cmn/types'

interface Preload {
  // utools
  dbStorageSave<T>(data: T): Promise<void>
  dbStorageRead(): Promise<Task[]>

  // win
  createTask(task: Task): Promise<any>
  deleteTask(name: string): Promise<any>
  deleteTaskXML(): Promise<void>
  switchState(aboutPlan: { name: string; state: boolean }): Promise<any>
  runPlan(name: string): Promise<any>
}

declare global {
  interface Window {
    preload: Preload
  }
  var preload: Preload
}
