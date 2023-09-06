/// <reference types="vite/client" />
import type { Task } from '@cmn/types'
import utools from 'utools-api-types'
declare global {
  interface Window {
    createTask(task: Task): Promise<any>
    switchState(task: Task): Promise<any>
    updateNextRunTime(parms: { name: string; nextRun: string }): void
    // notice
    receiveNotice(task: Task): void
  }
  interface UToolsApi {
    showNotification(body: string, clickFeatureCode?: string): void
  }
}
