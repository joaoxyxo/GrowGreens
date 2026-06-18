<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { GLOSSARY } from '@/data/glossary'

const query = ref('')
function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}
const results = computed(() => {
  const q = normalize(query.value.trim())
  return GLOSSARY.filter((t) => !q || normalize(t.term + ' ' + t.definition).includes(q))
})
</script>

<template>
  <div>
    <PageHeader title="Glossário" subtitle="Palavras da horta, em linguagem simples" back />
    <div class="px-4 pb-10">
      <input
        v-model="query"
        type="search"
        placeholder="Procurar palavra…"
        class="mb-4 w-full rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div class="space-y-2">
        <AppCard v-for="t in results" :key="t.term">
          <div class="flex gap-3">
            <span class="text-2xl" aria-hidden="true">{{ t.emoji }}</span>
            <div>
              <p class="font-semibold">{{ t.term }}</p>
              <p class="text-sm text-neutral-600 dark:text-neutral-300">{{ t.definition }}</p>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>
