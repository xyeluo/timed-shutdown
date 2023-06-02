
export interface Preload {
  execCmd(command:string): Promise<any>
  dbStorageSave(data): void
  dbStorageRead(): Promise<any>
}
