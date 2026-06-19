import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { safe } from '@/utils/safe'

describe('safe', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('devolve o resultado quando corre bem', async () => {
    expect(await safe(async () => 42)).toBe(42)
  })

  it('devolve undefined e loga quando lança', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const r = await safe(async () => {
      throw new Error('falhou')
    })
    expect(r).toBeUndefined()
    expect(err).toHaveBeenCalled()
    err.mockRestore()
  })
})
