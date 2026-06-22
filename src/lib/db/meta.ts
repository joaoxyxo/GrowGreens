import { db } from './dexie'

export async function getMeta<T>(key: string, fallback: T): Promise<T> {
  const record = await db.meta.get(key)
  return record ? (record.value as T) : fallback
}

export async function setMeta<T>(key: string, value: T): Promise<void> {
  // Desreferencia proxies reativos do Vue para um objeto simples: o algoritmo de
  // clonagem estruturada do IndexedDB não consegue clonar um Proxy reativo
  // (settings/progress são guardados a partir do estado das stores Pinia).
  const plain = value !== null && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value
  await db.meta.put({ key, value: plain })
}
