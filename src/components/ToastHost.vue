<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
const ui = useUiStore()
</script>

<template>
  <div
    class="fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none"
    aria-live="polite"
  >
    <TransitionGroup name="toast">
      <div
        v-for="t in ui.toasts"
        :key="t.id"
        class="pointer-events-auto rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg max-w-sm w-full text-center"
        :class="[
          t.kind === 'success' ? 'bg-green-600 text-white' : '',
          t.kind === 'info' ? 'bg-neutral-800 text-white' : '',
          t.kind === 'error' ? 'bg-error text-white' : '',
        ]"
      >
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
