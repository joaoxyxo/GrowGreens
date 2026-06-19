<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useLiveQuery } from '@/composables/useLiveQuery'
import { db } from '@/lib/db/dexie'
import { plantingsRepo, journalRepo, remindersRepo } from '@/repositories'
import { getPlant } from '@/data/plants'
import { useProgressStore } from '@/stores/progress'
import { useUiStore } from '@/stores/ui'
import { daysSince, fmtDate, isOverdue, isDueToday } from '@/utils/date'
import { estimateStage } from '@/utils/growth'
import { compressImage } from '@/utils/image'
import { safe } from '@/utils/safe'
import type { JournalEntry, JournalEventType, Reminder } from '@/types/models'

const route = useRoute()
const router = useRouter()
const progress = useProgressStore()
const ui = useUiStore()

const id = computed(() => route.params.id as string)
const planting = useLiveQuery(() => db.plantings.get(id.value), undefined)
const entries = useLiveQuery(
  () => db.journal.where('plantingId').equals(id.value).reverse().sortBy('createdAt'),
  [] as JournalEntry[],
)
const plant = computed(() => (planting.value ? getPlant(planting.value.plantSlug) : undefined))

const reminders = useLiveQuery(
  () => db.reminders.where('plantingId').equals(id.value).toArray(),
  [] as Reminder[],
)
const dueReminders = computed(() =>
  reminders.value.filter((r) => !r.done && (isOverdue(r.dueAt) || isDueToday(r.dueAt))),
)
const phase = computed(() => {
  if (!planting.value || !plant.value) return null
  return estimateStage(plant.value, daysSince(planting.value.sownAt))
})

async function doneReminder(rid: string) {
  await safe(() => remindersRepo.complete(rid))
  progress.touchStreak()
  ui.toast('Feito! 🌿')
}

// Edição da planta
const showEdit = ref(false)
const editNick = ref('')
const editLoc = ref('varanda')
const editWater = ref(3)
function openEdit() {
  if (!planting.value) return
  editNick.value = planting.value.nickname
  editLoc.value = planting.value.location || 'varanda'
  editWater.value = planting.value.wateringEveryDays
  showEdit.value = true
}
async function saveEdit() {
  await safe(() =>
    plantingsRepo.update(id.value, {
      nickname: editNick.value.trim() || plant.value!.name,
      location: editLoc.value,
      wateringEveryDays: editWater.value,
    }),
  )
  showEdit.value = false
  ui.toast('Planta atualizada')
}

// Object URLs para fotos
const photoUrls = ref<Record<string, string>>({})
watchEffect((onCleanup) => {
  const urls: Record<string, string> = {}
  for (const e of entries.value) {
    if (e.photo) urls[e.id] = URL.createObjectURL(e.photo)
  }
  photoUrls.value = urls
  onCleanup(() => Object.values(urls).forEach((u) => URL.revokeObjectURL(u)))
})

const note = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const pendingPhoto = ref<Blob | null>(null)
const pendingPhotoUrl = ref<string | null>(null)

function pickPhoto() {
  fileInput.value?.click()
}
async function onPhoto(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) {
    const blob = await compressImage(f)
    pendingPhoto.value = blob
    pendingPhotoUrl.value = URL.createObjectURL(blob)
  }
}

const eventLabels: Record<JournalEventType, string> = {
  nota: '📝 Nota',
  rega: '💧 Rega',
  aduba: '🌱 Adubo',
  transplante: '🪴 Transplante',
  colheita: '🧺 Colheita',
  foto: '📸 Foto',
}

async function quick(type: JournalEventType, label: string) {
  await journalRepo.add({ plantingId: id.value, type, note: label })
  progress.touchStreak()
  ui.toast('Registado! 🌿')
}

async function addEntry() {
  if (!note.value.trim() && !pendingPhoto.value) return
  await journalRepo.add({
    plantingId: id.value,
    type: pendingPhoto.value ? 'foto' : 'nota',
    note: note.value.trim(),
    photo: pendingPhoto.value ?? undefined,
  })
  progress.addXp(5)
  const total = (await db.journal.count()) ?? 0
  if (total >= 10 && progress.unlock('diarista')) ui.toast('Conquista: Diarista 📸')
  note.value = ''
  pendingPhoto.value = null
  pendingPhotoUrl.value = null
  ui.toast('Entrada guardada · +5 XP')
}

async function markHarvested() {
  await plantingsRepo.update(id.value, { status: 'colhida' })
  await journalRepo.add({ plantingId: id.value, type: 'colheita', note: 'Colhida! 🧺' })
  ui.toast('Boa colheita! 🧺')
  router.push('/jardim')
}

async function markLost() {
  await plantingsRepo.update(id.value, { status: 'perdida' })
  ui.toast('Acontece a toda a gente 🌱 Não desistas — tenta o rabanete, é à prova de falha!')
  router.push('/planta/rabanete')
}

async function removePlanting() {
  if (confirm('Remover esta planta e o seu diário?')) {
    await plantingsRepo.remove(id.value)
    router.push('/jardim')
  }
}

// Fotos do diário, em tira (linha do tempo visual)
const photoEntries = computed(() => entries.value.filter((e) => e.photo).slice().reverse())
</script>

<template>
  <div v-if="planting && plant">
    <PageHeader :title="planting.nickname" back />
    <input ref="fileInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onPhoto" />

    <div class="px-4 pb-10">
      <AppCard class="mb-4">
        <div class="flex items-center gap-3">
          <div class="text-4xl" aria-hidden="true">{{ plant.emoji }}</div>
          <div class="flex-1">
            <RouterLink :to="`/planta/${plant.slug}`" class="font-semibold text-green-700 dark:text-green-300">
              {{ plant.name }}
            </RouterLink>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Semeada {{ fmtDate(planting.sownAt) }} · dia {{ daysSince(planting.sownAt) }}
            </p>
          </div>
          <button class="text-sm font-medium text-green-600" @click="openEdit">Editar</button>
        </div>
        <!-- Fase de crescimento estimada -->
        <div v-if="phase" class="mt-3">
          <div class="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>Fase estimada</span>
            <span class="font-medium text-green-700 dark:text-green-300">{{ phase.label }}</span>
          </div>
          <div class="flex gap-1">
            <span
              v-for="i in phase.total"
              :key="i"
              class="h-1.5 flex-1 rounded-full"
              :class="i - 1 <= phase.index ? 'bg-green-500' : 'bg-neutral-200 dark:bg-dark-surface2'"
            />
          </div>
        </div>
      </AppCard>

      <!-- Lembretes pendentes -->
      <AppCard v-if="dueReminders.length" class="mb-4">
        <h2 class="mb-1 text-sm font-semibold text-sky-500">A fazer</h2>
        <div v-for="r in dueReminders" :key="r.id" class="flex items-center gap-2 py-1">
          <button
            class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-green-500 text-xs text-green-600"
            :aria-label="`Concluir ${r.label}`"
            @click="doneReminder(r.id)"
          >
            ✓
          </button>
          <span class="flex-1 text-sm">{{ r.label }}</span>
          <span v-if="isOverdue(r.dueAt)" class="text-xs text-error">atrasada</span>
        </div>
      </AppCard>

      <!-- Linha do tempo de fotos -->
      <div v-if="photoEntries.length" class="mb-4">
        <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">Evolução</p>
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          <div v-for="e in photoEntries" :key="e.id" class="flex-shrink-0 text-center">
            <img :src="photoUrls[e.id]" loading="lazy" class="h-20 w-20 rounded-xl object-cover" :alt="`Foto de ${fmtDate(e.createdAt)}`" />
            <p class="mt-0.5 text-[10px] text-neutral-400">{{ fmtDate(e.createdAt, 'd MMM') }}</p>
          </div>
        </div>
      </div>

      <!-- Ações rápidas -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <BaseButton variant="secondary" size="sm" @click="quick('rega', 'Reguei.')">💧 Reguei</BaseButton>
        <BaseButton variant="secondary" size="sm" @click="quick('aduba', 'Adubei.')">🌱 Adubei</BaseButton>
        <BaseButton variant="secondary" size="sm" @click="pickPhoto">📷 Foto</BaseButton>
      </div>

      <!-- Nova entrada -->
      <AppCard class="mb-4">
        <textarea
          v-model="note"
          rows="2"
          placeholder="Escreve uma nota sobre a tua planta…"
          class="w-full resize-none rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        ></textarea>
        <img v-if="pendingPhotoUrl" :src="pendingPhotoUrl" class="mt-2 h-32 w-full rounded-xl object-cover" alt="Pré-visualização" />
        <div class="mt-2 flex justify-end gap-2">
          <BaseButton variant="ghost" size="sm" @click="pickPhoto">📷 Anexar foto</BaseButton>
          <BaseButton size="sm" @click="addEntry">Guardar</BaseButton>
        </div>
      </AppCard>

      <!-- Diário -->
      <h2 class="mb-2 font-display text-lg font-bold">Diário</h2>
      <div v-if="entries.length" class="space-y-3">
        <div
          v-for="e in entries"
          :key="e.id"
          class="rounded-2xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface p-3"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">{{ eventLabels[e.type] }}</span>
            <span class="text-xs text-neutral-400">{{ fmtDate(e.createdAt, "d MMM · HH:mm") }}</span>
          </div>
          <p v-if="e.note" class="mt-1 text-sm text-neutral-700 dark:text-neutral-200">{{ e.note }}</p>
          <img
            v-if="photoUrls[e.id]"
            :src="photoUrls[e.id]"
            loading="lazy"
            class="mt-2 max-h-60 w-full rounded-xl object-cover"
            alt="Foto do diário"
          />
        </div>
      </div>
      <p v-else class="text-sm text-neutral-500 dark:text-neutral-400">
        Sem registos ainda. Usa os botões acima para começares o diário desta planta.
      </p>

      <!-- Fim -->
      <div class="mt-8 flex flex-col gap-2">
        <BaseButton variant="secondary" @click="markHarvested">🧺 Marcar como colhida</BaseButton>
        <BaseButton variant="ghost" @click="markLost">🥀 Perdi esta planta</BaseButton>
        <button class="text-sm text-error underline self-center" @click="removePlanting">Remover planta</button>
      </div>
    </div>

    <!-- Modal de edição -->
    <div
      v-if="showEdit"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      @click.self="showEdit = false"
    >
      <div class="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white dark:bg-dark-surface p-5 safe-bottom">
        <h3 class="font-display text-lg font-bold mb-3">Editar planta</h3>
        <label class="block text-sm font-medium mb-1">Nome</label>
        <input
          v-model="editNick"
          class="mb-3 w-full rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label class="block text-sm font-medium mb-1">Onde?</label>
        <select
          v-model="editLoc"
          class="mb-3 w-full rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="parapeito">Parapeito</option>
          <option value="varanda">Varanda</option>
          <option value="quintal">Quintal</option>
          <option value="interior">Interior</option>
        </select>
        <label class="block text-sm font-medium mb-1">Regar a cada {{ editWater }} dias</label>
        <input v-model.number="editWater" type="range" min="1" max="10" class="mb-4 w-full accent-green-500" />
        <div class="flex gap-2">
          <BaseButton variant="ghost" size="sm" @click="showEdit = false">Cancelar</BaseButton>
          <BaseButton block @click="saveEdit">Guardar</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
