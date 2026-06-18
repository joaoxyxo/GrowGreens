import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  kind: 'success' | 'info' | 'error'
}

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const needsRefresh = ref(false)
  let counter = 0

  function toast(message: string, kind: Toast['kind'] = 'success') {
    const id = ++counter
    toasts.value.push({ id, message, kind })
    setTimeout(() => dismiss(id), 3200)
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, needsRefresh, toast, dismiss }
})
