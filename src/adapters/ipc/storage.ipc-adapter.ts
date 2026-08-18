function getStorageApi() {
  return window.electronAPI?.storage
}

export const storageIpc = {
  get: async <T>(key: string): Promise<T | null> => {
    const result = await getStorageApi()?.get(key)
    return (result as T) ?? null
  },
  set: async (key: string, value: unknown) => {
    return getStorageApi()?.set(key, value)
  },
  delete: async (key: string) => {
    return getStorageApi()?.delete(key)
  }
}
