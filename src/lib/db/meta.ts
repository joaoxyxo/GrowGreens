import { db } from './dexie'

export async function getMeta<T>(key: string, fallback: T): Promise<T> {
  const record = await db.meta.get(key)
  return record ? (record.value as T) : fallback
}

export async function setMeta<T>(key: string, value: T): Promise<void> {
  await db.meta.put({ key, value })
}
