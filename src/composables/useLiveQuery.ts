import { liveQuery } from 'dexie'
import { ref, onScopeDispose, type Ref } from 'vue'

/**
 * Liga uma query Dexie a um ref reativo do Vue.
 * Atualiza-se automaticamente sempre que os dados mudam.
 */
export function useLiveQuery<T>(querier: () => Promise<T>, initial: T): Ref<T> {
  const value = ref(initial) as Ref<T>
  const subscription = liveQuery(querier).subscribe({
    next: (result) => {
      value.value = result
    },
    error: (err) => {
      console.error('[useLiveQuery]', err)
    },
  })
  onScopeDispose(() => subscription.unsubscribe())
  return value
}
