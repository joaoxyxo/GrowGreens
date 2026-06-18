<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { NUTRIENT_GROUPS, HEALTH_DISCLAIMER } from '@/data/health'
</script>

<template>
  <div>
    <PageHeader title="Saúde & Nutrição" subtitle="O que ganhas ao cultivar e comer" back />
    <div class="px-4 pb-10">
      <div class="space-y-3">
        <RouterLink v-for="g in NUTRIENT_GROUPS" :key="g.code" :to="`/saude/${g.code}`">
          <AppCard>
            <div class="flex items-center gap-3">
              <span class="text-3xl" aria-hidden="true">{{ g.emoji }}</span>
              <div class="flex-1">
                <p class="font-semibold">{{ g.name }}</p>
                <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ g.whyGood[0] }}</p>
              </div>
              <span class="text-neutral-400" aria-hidden="true">→</span>
            </div>
          </AppCard>
        </RouterLink>
      </div>
      <p class="mt-6 text-xs text-neutral-400 dark:text-neutral-500">{{ HEALTH_DISCLAIMER }}</p>
    </div>
  </div>
</template>
