<script setup lang="ts">
import { useRouter } from 'vue-router'
defineProps<{ title: string; subtitle?: string; back?: boolean }>()
const router = useRouter()
function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}
</script>

<template>
  <header class="px-4 pt-6 pb-3 safe-top">
    <button
      v-if="back"
      class="mb-2 inline-flex items-center gap-1 text-sm font-medium text-neutral-500 dark:text-neutral-400"
      @click="goBack"
    >
      <span aria-hidden="true">←</span> Voltar
    </button>
    <div class="flex items-end justify-between gap-2">
      <div>
        <h1 class="font-display text-2xl font-bold text-neutral-900 dark:text-neutral-100">{{ title }}</h1>
        <p v-if="subtitle" class="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">{{ subtitle }}</p>
      </div>
      <slot name="actions" />
    </div>
  </header>
</template>
