<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useLiveQuery } from '@/composables/useLiveQuery'
import { db } from '@/lib/db/dexie'
import { bedsRepo, plantingsRepo } from '@/repositories'
import { PLANTS, getPlant } from '@/data/plants'
import { useUiStore } from '@/stores/ui'
import { useProgressStore } from '@/stores/progress'
import { safe } from '@/utils/safe'
import { defaultWateringDays, areCompanions, areAntagonists } from '@/utils/growth'
import { analyzeBed, suggestCompanions } from '@/utils/companionBed'
import { familyConcentration } from '@/utils/rotation'
import { isOverdue, isDueToday } from '@/utils/date'
import { useReminders } from '@/composables/useReminders'
import { normalize } from '@/utils/text'
import type { GardenBed } from '@/types/models'

const route = useRoute()
const router = useRouter()
const ui = useUiStore()
const progress = useProgressStore()

const id = computed(() => route.params.id as string)
const bed = useLiveQuery(() => db.beds.get(id.value), undefined)
const reminders = useReminders()

// célula selecionada
const selectedKey = ref<string | null>(null)
const showPicker = ref(false)
const query = ref('')

function cellKey(r: number, c: number) {
  return `${r}-${c}`
}
function cellAt(b: GardenBed, r: number, c: number) {
  return b.cells[cellKey(r, c)]
}

function plantingDue(plantingId?: string): boolean {
  if (!plantingId) return false
  return reminders.value.some(
    (rem) => rem.plantingId === plantingId && !rem.done && (isOverdue(rem.dueAt) || isDueToday(rem.dueAt)),
  )
}

function tapCell(r: number, c: number) {
  selectedKey.value = cellKey(r, c)
}

const selectedCell = computed(() =>
  bed.value && selectedKey.value ? bed.value.cells[selectedKey.value] : undefined,
)

const pickerResults = computed(() => {
  const q = normalize(query.value.trim())
  return PLANTS.filter((p) => !q || normalize(p.name).includes(q)).slice(0, 40)
})

// Otimizador de consociação: plantas distintas do canteiro → análise + sugestões.
const bedPlants = computed(() => {
  if (!bed.value) return []
  const slugs = [...new Set(Object.values(bed.value.cells).map((c) => c.plantSlug))]
  return slugs.map((s) => getPlant(s)).filter((p): p is NonNullable<typeof p> => !!p)
})
const bedAnalysis = computed(() => analyzeBed(bedPlants.value))
const bedSuggestions = computed(() => suggestCompanions(bedPlants.value, PLANTS, 4))

// Rotação: famílias botânicas concentradas (contadas por lugar ocupado, não por espécie).
const bedFamilyConcentration = computed(() => {
  if (!bed.value) return []
  const families = Object.values(bed.value.cells)
    .map((c) => getPlant(c.plantSlug)?.family)
    .filter((f): f is string => !!f)
  return familyConcentration(families)
})

function neighborFeedback(key: string, slug: string): { good: string[]; bad: string[] } {
  if (!bed.value) return { good: [], bad: [] }
  const plant = getPlant(slug)
  if (!plant) return { good: [], bad: [] }
  const [r, c] = key.split('-').map(Number)
  const neighbors = [`${r - 1}-${c}`, `${r + 1}-${c}`, `${r}-${c - 1}`, `${r}-${c + 1}`]
  const good: string[] = []
  const bad: string[] = []
  for (const nk of neighbors) {
    const cell = bed.value.cells[nk]
    if (!cell) continue
    const np = getPlant(cell.plantSlug)
    if (!np) continue
    if (areCompanions(plant, np)) good.push(np.name)
    if (areAntagonists(plant, np)) bad.push(np.name)
  }
  return { good, bad }
}

async function assignPlant(slug: string) {
  if (!selectedKey.value) return
  const key = selectedKey.value
  await safe(() => bedsRepo.setCell(id.value, key, { plantSlug: slug }))
  showPicker.value = false
  query.value = ''
  const fb = neighborFeedback(key, slug)
  if (fb.bad.length) ui.toast(`⚠️ Má vizinhança com ${fb.bad.join(', ')}`, 'info')
  else if (fb.good.length) ui.toast(`✓ Boa vizinhança com ${fb.good.join(', ')} 🌿`)
  else ui.toast('Plantado no plano 🌱')
}

async function clearCell() {
  if (!selectedKey.value) return
  await safe(() => bedsRepo.clearCell(id.value, selectedKey.value!))
  selectedKey.value = null
}

// "Espelho": ligar a célula a uma planta acompanhada na horta
async function trackInGarden() {
  if (!selectedKey.value || !selectedCell.value) return
  const plant = getPlant(selectedCell.value.plantSlug)
  if (!plant) return
  const waterEvery = defaultWateringDays(plant.waterNeed)
  const planting = await plantingsRepo.create({
    plantSlug: plant.slug,
    nickname: `${plant.name} (${bed.value?.name})`,
    location: bed.value?.name ?? 'horta',
    wateringEveryDays: waterEvery,
  })
  await bedsRepo.setCell(id.value, selectedKey.value, {
    plantSlug: plant.slug,
    plantingId: planting.id,
  })
  progress.touchStreak()
  ui.toast('A acompanhar na horta 🌿')
}

// edição do espaço
const showEdit = ref(false)
const editName = ref('')
const editRows = ref(3)
const editCols = ref(4)
function openEdit() {
  if (!bed.value) return
  editName.value = bed.value.name
  editRows.value = bed.value.rows
  editCols.value = bed.value.cols
  showEdit.value = true
}
async function saveEdit() {
  await safe(() =>
    bedsRepo.update(id.value, {
      name: editName.value.trim() || 'Espaço',
      rows: Math.max(1, Math.min(12, editRows.value)),
      cols: Math.max(1, Math.min(12, editCols.value)),
    }),
  )
  showEdit.value = false
}
async function removeBed() {
  if (confirm('Apagar este espaço do plano? (as plantas acompanhadas na horta mantêm-se)')) {
    await bedsRepo.remove(id.value)
    router.push('/jardim/plano')
  }
}
</script>

<template>
  <div v-if="bed">
    <PageHeader :title="bed.name" :subtitle="`${bed.rows}×${bed.cols}`" back>
      <template #actions>
        <button class="text-sm font-medium text-green-600" @click="openEdit">Editar</button>
      </template>
    </PageHeader>

    <div class="px-4 pb-10">
      <p class="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
        Toca num lugar para plantar. Os lugares com 💧 precisam de rega.
      </p>

      <!-- Grelha -->
      <div class="overflow-x-auto no-scrollbar">
        <div
          class="grid gap-1.5 rounded-2xl bg-earth-100 dark:bg-earth-500/20 p-2"
          :style="{
            gridTemplateColumns: `repeat(${bed.cols}, minmax(56px, 1fr))`,
            minWidth: bed.cols > 6 ? `${bed.cols * 60}px` : 'auto',
          }"
        >
          <template v-for="r in bed.rows" :key="r">
            <button
              v-for="c in bed.cols"
              :key="`${r}-${c}`"
              class="relative aspect-square rounded-lg border text-2xl flex items-center justify-center transition"
              :class="
                cellAt(bed, r - 1, c - 1)
                  ? 'bg-green-100 dark:bg-green-900/30 border-green-400'
                  : 'bg-white/70 dark:bg-dark-surface/60 border-dashed border-neutral-300 dark:border-dark-surface2'
              "
              :aria-label="
                cellAt(bed, r - 1, c - 1)
                  ? `${getPlant(cellAt(bed, r - 1, c - 1)!.plantSlug)?.name ?? 'Planta'} (linha ${r}, coluna ${c})`
                  : `Célula vazia (linha ${r}, coluna ${c})`
              "
              @click="tapCell(r - 1, c - 1)"
            >
              <span v-if="cellAt(bed, r - 1, c - 1)" aria-hidden="true">
                {{ getPlant(cellAt(bed, r - 1, c - 1)!.plantSlug)?.emoji ?? '🌱' }}
              </span>
              <span v-else class="text-neutral-300 dark:text-neutral-600 text-base">＋</span>
              <span
                v-if="plantingDue(cellAt(bed, r - 1, c - 1)?.plantingId)"
                class="absolute -top-1 -right-1 text-xs"
                title="Precisa de rega"
                >💧</span
              >
            </button>
          </template>
        </div>
      </div>

      <p class="mt-3 text-sm text-neutral-500">
        {{ Object.keys(bed.cells).length }} de {{ bed.rows * bed.cols }} lugares ocupados.
      </p>

      <!-- Otimizador de consociação -->
      <section
        v-if="bedPlants.length >= 1"
        class="mt-6 rounded-2xl border border-neutral-200 dark:border-dark-surface2 p-4"
      >
        <h2 class="mb-2 font-display text-base font-bold">🤝 Vizinhança do canteiro</h2>

        <!-- Aviso de rotação: famílias concentradas -->
        <div
          v-if="bedFamilyConcentration.length"
          class="mb-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 p-3"
        >
          <p class="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">🔄 Rotação de culturas</p>
          <p class="text-sm text-neutral-700 dark:text-neutral-200">
            Tens
            <template v-for="(f, i) in bedFamilyConcentration" :key="f.family"
              ><strong>{{ f.count }} {{ f.family }}</strong
              ><span v-if="i < bedFamilyConcentration.length - 1">, </span></template
            >. Concentrar a mesma família botânica aumenta o risco de pragas e doenças do solo — varia as
            famílias e não as repitas neste espaço na próxima época.
          </p>
        </div>

        <div v-if="bedAnalysis.conflicts.length" class="mb-2">
          <p class="text-xs font-semibold text-error mb-1">✕ Más vizinhanças a evitar</p>
          <ul class="space-y-0.5">
            <li
              v-for="(c, i) in bedAnalysis.conflicts"
              :key="`c${i}`"
              class="text-sm text-neutral-700 dark:text-neutral-200"
            >
              {{ getPlant(c.a)?.name }} ✕ {{ getPlant(c.b)?.name }}
            </li>
          </ul>
        </div>

        <div v-if="bedAnalysis.synergies.length" class="mb-2">
          <p class="text-xs font-semibold text-green-600 mb-1">✓ Boas associações</p>
          <ul class="space-y-0.5">
            <li
              v-for="(s, i) in bedAnalysis.synergies"
              :key="`s${i}`"
              class="text-sm text-neutral-700 dark:text-neutral-200"
            >
              {{ getPlant(s.a)?.name }} + {{ getPlant(s.b)?.name }}
            </li>
          </ul>
        </div>

        <p
          v-if="!bedAnalysis.conflicts.length && !bedAnalysis.synergies.length"
          class="text-sm text-neutral-500"
        >
          Sem boas nem más associações conhecidas entre as plantas atuais.
        </p>

        <div
          v-if="bedSuggestions.length"
          class="mt-3 border-t border-neutral-100 dark:border-dark-surface2 pt-3"
        >
          <p class="text-xs font-semibold text-neutral-500 mb-1">Sugestões que combinam bem</p>
          <div class="flex flex-wrap gap-2">
            <RouterLink
              v-for="s in bedSuggestions"
              :key="s.slug"
              :to="`/planta/${s.slug}`"
              class="rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm text-green-700 dark:text-green-300"
            >
              {{ s.emoji }} {{ s.name }}
            </RouterLink>
          </div>
        </div>
      </section>

      <button class="mt-6 text-sm text-error underline" @click="removeBed">Apagar espaço</button>
    </div>

    <!-- Painel da célula selecionada -->
    <div
      v-if="selectedKey"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      @click.self="selectedKey = null"
    >
      <div class="w-full max-w-md rounded-t-2xl bg-white dark:bg-dark-surface p-5 safe-bottom">
        <template v-if="selectedCell">
          <div class="mb-3 flex items-center gap-3">
            <span class="text-3xl">{{ getPlant(selectedCell.plantSlug)?.emoji }}</span>
            <div>
              <p class="font-semibold">{{ getPlant(selectedCell.plantSlug)?.name }}</p>
              <p class="text-xs text-neutral-500">
                {{ selectedCell.plantingId ? 'A acompanhar na horta' : 'Apenas no plano' }}
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <RouterLink v-if="selectedCell.plantingId" :to="`/jardim/${selectedCell.plantingId}`">
              <BaseButton block variant="secondary" size="sm">Ver na horta →</BaseButton>
            </RouterLink>
            <BaseButton v-else size="sm" @click="trackInGarden">🌿 Acompanhar na horta</BaseButton>
            <RouterLink :to="`/planta/${selectedCell.plantSlug}`">
              <BaseButton block variant="ghost" size="sm">Ver ficha da planta</BaseButton>
            </RouterLink>
            <BaseButton variant="ghost" size="sm" @click="clearCell">Limpar lugar</BaseButton>
          </div>
        </template>
        <template v-else>
          <h3 class="font-display text-lg font-bold mb-3">Plantar aqui</h3>
          <BaseButton block @click="showPicker = true">Escolher planta</BaseButton>
          <BaseButton class="mt-2" block variant="ghost" size="sm" @click="selectedKey = null"
            >Cancelar</BaseButton
          >
        </template>
      </div>
    </div>

    <!-- Picker de planta -->
    <div v-if="showPicker" class="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-dark-bg">
      <div class="border-b border-neutral-200 dark:border-dark-surface2 p-4 safe-top">
        <div class="flex items-center gap-2">
          <button class="text-xl text-neutral-400" aria-label="Fechar" @click="showPicker = false">✕</button>
          <input
            v-model="query"
            type="search"
            placeholder="Procurar planta…"
            class="flex-1 rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="p in pickerResults"
            :key="p.slug"
            class="rounded-xl border border-neutral-200 dark:border-dark-surface2 p-3 text-center"
            @click="assignPlant(p.slug)"
          >
            <div class="text-2xl">{{ p.emoji }}</div>
            <div class="text-xs mt-1 truncate">{{ p.name }}</div>
          </button>
        </div>
      </div>
    </div>

    <!-- Editar espaço -->
    <div
      v-if="showEdit"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      @click.self="showEdit = false"
    >
      <div class="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white dark:bg-dark-surface p-5 safe-bottom">
        <h3 class="font-display text-lg font-bold mb-3">Editar espaço</h3>
        <label class="block text-sm font-medium mb-1">Nome</label>
        <input
          v-model="editName"
          class="mb-3 w-full rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div class="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Linhas: {{ editRows }}</label>
            <input v-model.number="editRows" type="range" min="1" max="10" class="w-full accent-green-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Colunas: {{ editCols }}</label>
            <input v-model.number="editCols" type="range" min="1" max="10" class="w-full accent-green-500" />
          </div>
        </div>
        <p class="mb-3 text-xs text-neutral-400">
          Reduzir o tamanho pode esconder lugares já plantados nas pontas.
        </p>
        <div class="flex gap-2">
          <BaseButton variant="ghost" size="sm" @click="showEdit = false">Cancelar</BaseButton>
          <BaseButton block @click="saveEdit">Guardar</BaseButton>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <PageHeader title="Espaço" back />
    <EmptyState emoji="🤔" title="Espaço não encontrado" />
  </div>
</template>
