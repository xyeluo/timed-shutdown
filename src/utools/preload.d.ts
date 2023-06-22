import { Task } from '@cmn/types'

interface Preload {
  // common
  execCmd(command: string): Promise<any>
  dbStorageSave(data): void
  dbStorageRead(): Promise<any>

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
