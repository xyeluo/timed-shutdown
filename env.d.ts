/// <reference types="vite/client" />

import utools from 'utools-api-types'
declare global {
  interface UToolsApi {
    showNotification(body: string, clickFeatureCode?: string): void
  }
}
