import type { Task, Plan } from '@cmn/types'

interface Preload {
  // utools
  dbStorageSave(data: Plan[]): Promise<void>
  dbStorageRead(): Promise<Plan[]>

  // taskXml
  createTask(task: Task): Promise<any>
  deleteTaskXML(): Promise<void>
}

declare global {
  interface Window {
    preload: Preload
  }
  var preload: Preload
}
