import type { Task } from '@cmn/types'

interface Preload {
  // utools
  dbStorageSave<T>(data: T): Promise<void>
  dbStorageRead(): Promise<Task[]>

  // taskXml
  createTask(task: Task): Promise<any>
  deleteTask(name: string): Promise<any>
  deleteTaskXML(): Promise<void>
}

declare global {
  interface Window {
    preload: Preload
  }
  var preload: Preload
}
