import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ProgressState } from '@/types/models'
import { getMeta, setMeta } from '@/lib/db/meta'
import { todayKey } from '@/utils/date'
import { applyActivity } from '@/utils/streak'
import { ACHIEVEMENTS } from '@/data/achievements'

// Factory (não constante partilhada): garante arrays novos a cada uso, senão
// `completedLessons`/`achievements` seriam partilhados por referência e poluíam-se.
function defaultProgress(): ProgressState {
  return {
    xp: 0,
    streak: 0,
    lastActiveDay: '',
    completedLessons: [],
    achievements: [],
    freezes: 1,
    freezeRefillAt: '',
  }
}

const LEVELS = [
  { name: 'Semente', min: 0 },
  { name: 'Rebento', min: 60 },
  { name: 'Plântula', min: 150 },
  { name: 'Hortelão', min: 350 },
  { name: 'Mestre-Hortelão', min: 700 },
]

export const useProgressStore = defineStore('progress', () => {
  const state = ref<ProgressState>(defaultProgress())
  const loaded = ref(false)

  async function load() {
    state.value = { ...defaultProgress(), ...(await getMeta<ProgressState>('progress', defaultProgress())) }
    loaded.value = true
  }

  watch(
    state,
    (v) => {
      if (loaded.value) setMeta('progress', v)
    },
    { deep: true },
  )

  const level = computed(() => {
    let current = LEVELS[0]
    for (const l of LEVELS) if (state.value.xp >= l.min) current = l
    return current
  })

  const nextLevel = computed(() => LEVELS.find((l) => l.min > state.value.xp) ?? null)

  function touchStreak() {
    const today = todayKey()
    const next = applyActivity(
      {
        streak: state.value.streak,
        lastActiveDay: state.value.lastActiveDay,
        freezes: state.value.freezes,
        freezeRefillAt: state.value.freezeRefillAt,
      },
      today,
    )
    state.value.streak = next.streak
    state.value.lastActiveDay = next.lastActiveDay
    state.value.freezes = next.freezes
    state.value.freezeRefillAt = next.freezeRefillAt
  }

  function addXp(amount: number) {
    state.value.xp += amount
    touchStreak()
  }

  function completeLesson(lessonId: string, xp: number) {
    if (state.value.completedLessons.includes(lessonId)) return false
    state.value.completedLessons.push(lessonId)
    addXp(xp)
    return true
  }

  function hasAchievement(code: string) {
    return state.value.achievements.some((a) => a.code === code)
  }

  function unlock(code: string): boolean {
    if (hasAchievement(code)) return false
    if (!ACHIEVEMENTS.some((a) => a.code === code)) return false
    state.value.achievements.push({ code, unlockedAt: new Date().toISOString() })
    return true
  }

  return {
    state,
    loaded,
    load,
    level,
    nextLevel,
    addXp,
    touchStreak,
    completeLesson,
    hasAchievement,
    unlock,
  }
})
