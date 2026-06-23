<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import StatChip from '@/components/ui/StatChip.vue'
import { COURSE_UNITS, LESSONS_BY_ID, LESSONS } from '@/data/course'
import { useProgressStore } from '@/stores/progress'

const progress = useProgressStore()

const done = computed(() => new Set(progress.state.completedLessons))
const overall = computed(() => Math.round((done.value.size / LESSONS.length) * 100))

function lessonState(_unitIndex: number, lessonId: string): 'done' | 'current' | 'locked' {
  if (done.value.has(lessonId)) return 'done'
  // primeira lição não concluída em ordem é a "atual"
  for (const u of COURSE_UNITS) {
    for (const lid of u.lessonIds) {
      if (!done.value.has(lid)) return lid === lessonId ? 'current' : 'locked'
    }
  }
  return 'locked'
}
</script>

<template>
  <div>
    <PageHeader title="Curso" subtitle="Aprende a cultivar, passo a passo">
      <template #actions>
        <StatChip icon="⭐" :value="progress.state.xp" tone="sun" />
      </template>
    </PageHeader>

    <div class="px-4 pb-10">
      <div class="mb-5">
        <div class="mb-1 flex justify-between text-sm">
          <span class="text-neutral-500 dark:text-neutral-400">Progresso do curso</span>
          <span class="font-semibold">{{ overall }}%</span>
        </div>
        <ProgressBar :value="overall" />
      </div>

      <RouterLink v-if="done.size >= 2" to="/curso/revisao" class="mb-6 block">
        <div class="flex items-center gap-3 rounded-2xl border border-sun-400/40 bg-sun-400/10 px-4 py-3">
          <span class="text-2xl" aria-hidden="true">🧠</span>
          <div class="flex-1">
            <p class="font-semibold text-sm">Revisão rápida</p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Relembra o que aprendeste e ganha XP.
            </p>
          </div>
          <span class="text-neutral-400" aria-hidden="true">→</span>
        </div>
      </RouterLink>

      <div v-for="(unit, ui) in COURSE_UNITS" :key="unit.id" class="mb-7">
        <div class="mb-3 flex items-center gap-2">
          <span class="text-2xl" aria-hidden="true">{{ unit.emoji }}</span>
          <div>
            <h2 class="font-display font-bold">{{ unit.title }}</h2>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ unit.description }}</p>
          </div>
        </div>

        <div class="space-y-2 pl-2">
          <component
            :is="lessonState(ui, lid) === 'locked' ? 'div' : 'RouterLink'"
            v-for="lid in unit.lessonIds"
            :key="lid"
            :to="lessonState(ui, lid) === 'locked' ? undefined : `/curso/licao/${lid}`"
            class="flex items-center gap-3 rounded-2xl border px-4 py-3 transition"
            :class="[
              lessonState(ui, lid) === 'done' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : '',
              lessonState(ui, lid) === 'current'
                ? 'border-green-500 ring-2 ring-green-500/30 bg-white dark:bg-dark-surface'
                : '',
              lessonState(ui, lid) === 'locked'
                ? 'border-neutral-200 dark:border-dark-surface2 opacity-50'
                : 'border-neutral-200 dark:border-dark-surface2',
            ]"
          >
            <span
              class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
              :class="
                lessonState(ui, lid) === 'done'
                  ? 'bg-green-500 text-white'
                  : 'bg-neutral-100 dark:bg-dark-surface2 text-neutral-500'
              "
            >
              <span v-if="lessonState(ui, lid) === 'done'">✓</span>
              <span v-else-if="lessonState(ui, lid) === 'locked'">🔒</span>
              <span v-else>▶</span>
            </span>
            <span class="flex-1">
              <span class="block text-sm font-medium">{{ LESSONS_BY_ID[lid].title }}</span>
              <span class="block text-xs text-neutral-500 dark:text-neutral-400">{{
                LESSONS_BY_ID[lid].subtitle
              }}</span>
            </span>
            <span class="text-xs font-semibold text-sun-500">+{{ LESSONS_BY_ID[lid].xp }}</span>
          </component>
        </div>
      </div>
    </div>
  </div>
</template>
