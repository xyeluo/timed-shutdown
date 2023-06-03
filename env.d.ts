/// <reference types="vite/client" />

import { Preload } from './src/utools/preload.d.ts'

declare global {
  interface Window {
    preload: Preload
  }
  declare const preload: Preload
}
