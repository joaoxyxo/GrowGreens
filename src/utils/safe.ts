import { useUiStore } from '@/stores/ui'

/**
 * Executa uma operação assíncrona, mostrando um toast de erro ao utilizador
 * em caso de falha (em vez de falhar silenciosamente na consola).
 */
export async function safe<T>(
  fn: () => Promise<T>,
  errorMessage = 'Algo correu mal. Tenta novamente.',
): Promise<T | undefined> {
  try {
    return await fn()
  } catch (e) {
    console.error('[safe]', e)
    try {
      useUiStore().toast(errorMessage, 'error')
    } catch {
      /* store pode não estar disponível em testes */
    }
    return undefined
  }
}
