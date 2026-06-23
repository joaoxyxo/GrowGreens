<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import AppCard from '@/components/ui/AppCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'
import { useLiveQuery } from '@/composables/useLiveQuery'
import { db } from '@/lib/db/dexie'
import { bedsRepo } from '@/repositories'
import { getPlant } from '@/data/plants'
import { useUiStore } from '@/stores/ui'
import type { BedKind, GardenBed } from '@/types/models'

const router = useRouter()
const ui = useUiStore()
const beds = useLiveQuery(() => db.beds.reverse().sortBy('updatedAt'), [] as GardenBed[])

const showCreate = ref(false)
const showShopping = ref(false)
const name = ref('')
const kind = ref<BedKind>('canteiro')
const rows = ref(3)
const cols = ref(4)

// Lista de compras derivada do plano
const shoppingList = computed(() => {
  const seeds = new Set<string>()
  const materials = new Set<string>()
  for (const bed of beds.value) {
    for (const cell of Object.values(bed.cells)) {
      const p = getPlant(cell.plantSlug)
      if (p) seeds.add(`Sementes de ${p.name.toLowerCase()}`)
    }
    if (bed.kind === 'vaso') materials.add('Vasos + pratos')
    if (bed.kind === 'canteiro') materials.add('Terra/composto para canteiro')
    if (bed.kind === 'tabuleiro') materials.add('Tabuleiros de sementeira')
    if (bed.kind === 'estufa') materials.add('Cobertura/estufim')
    materials.add('Substrato de sementeira')
    materials.add('Regador ou borrifador')
  }
  return { seeds: [...seeds], materials: [...materials] }
})

const kinds: { v: BedKind; label: string; emoji: string }[] = [
  { v: 'canteiro', label: 'Canteiro', emoji: '🟫' },
  { v: 'vaso', label: 'Vasos', emoji: '🪴' },
  { v: 'tabuleiro', label: 'Tabuleiro', emoji: '🟩' },
  { v: 'estufa', label: 'Estufa', emoji: '🏠' },
]

function open() {
  name.value = ''
  kind.value = 'canteiro'
  rows.value = 3
  cols.value = 4
  showCreate.value = true
}

async function create() {
  const bed = await bedsRepo.create({
    name: name.value.trim() || 'Novo espaço',
    kind: kind.value,
    rows: rows.value,
    cols: cols.value,
  })
  showCreate.value = false
  ui.toast('Espaço criado 🌱')
  router.push(`/jardim/plano/${bed.id}`)
}

function plantedCount(bed: GardenBed) {
  return Object.keys(bed.cells).length
}
function emojisOf(bed: GardenBed) {
  return [...new Set(Object.values(bed.cells).map((c) => getPlant(c.plantSlug)?.emoji ?? '🌱'))].slice(0, 6)
}
function kindMeta(k: BedKind) {
  return kinds.find((x) => x.v === k)!
}
</script>

<template>
  <div>
    <PageHeader title="Plano da horta" subtitle="O espelho digital do teu espaço" back>
      <template #actions>
        <BaseButton size="sm" @click="open">＋ Espaço</BaseButton>
      </template>
    </PageHeader>

    <div class="px-4 pb-10">
      <BaseButton
        v-if="beds.length"
        variant="secondary"
        size="sm"
        block
        class="mb-4"
        @click="showShopping = true"
      >
        🛒 Lista de compras do plano
      </BaseButton>

      <div v-if="beds.length" class="space-y-3">
        <RouterLink v-for="bed in beds" :key="bed.id" :to="`/jardim/plano/${bed.id}`">
          <AppCard>
            <div class="flex items-center gap-3">
              <span class="text-3xl" aria-hidden="true">{{ kindMeta(bed.kind).emoji }}</span>
              <div class="flex-1 min-w-0">
                <p class="font-semibold truncate">{{ bed.name }}</p>
                <p class="text-xs text-neutral-500 dark:text-neutral-400">
                  {{ kindMeta(bed.kind).label }} · {{ bed.rows }}×{{ bed.cols }}
                </p>
              </div>
              <div class="text-right">
                <div class="text-sm">{{ emojisOf(bed).join(' ') || '—' }}</div>
                <Badge tone="neutral">{{ plantedCount(bed) }} plantadas</Badge>
              </div>
            </div>
          </AppCard>
        </RouterLink>
      </div>

      <EmptyState
        v-else
        emoji="🗺️"
        title="Desenha o teu espaço"
        description="Cria um canteiro, um conjunto de vasos ou um tabuleiro e marca o que está plantado em cada lugar."
      >
        <BaseButton @click="open">Criar o primeiro espaço</BaseButton>
      </EmptyState>
    </div>

    <!-- Modal criar -->
    <div
      v-if="showCreate"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      @click.self="showCreate = false"
    >
      <div class="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white dark:bg-dark-surface p-5 safe-bottom">
        <h3 class="font-display text-lg font-bold mb-3">Novo espaço</h3>
        <label class="block text-sm font-medium mb-1">Nome</label>
        <input
          v-model="name"
          placeholder="Ex.: Canteiro da varanda"
          class="mb-3 w-full rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label class="block text-sm font-medium mb-1">Tipo</label>
        <div class="mb-3 grid grid-cols-4 gap-2">
          <button
            v-for="k in kinds"
            :key="k.v"
            class="rounded-xl border px-2 py-2 text-center text-xs transition"
            :class="
              kind === k.v
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-neutral-200 dark:border-dark-surface2'
            "
            @click="kind = k.v"
          >
            <div class="text-lg">{{ k.emoji }}</div>
            {{ k.label }}
          </button>
        </div>
        <div class="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Linhas: {{ rows }}</label>
            <input v-model.number="rows" type="range" min="1" max="10" class="w-full accent-green-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Colunas: {{ cols }}</label>
            <input v-model.number="cols" type="range" min="1" max="10" class="w-full accent-green-500" />
          </div>
        </div>
        <div class="flex gap-2">
          <BaseButton variant="ghost" size="sm" @click="showCreate = false">Cancelar</BaseButton>
          <BaseButton block @click="create">Criar</BaseButton>
        </div>
      </div>
    </div>

    <!-- Modal lista de compras -->
    <div
      v-if="showShopping"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      @click.self="showShopping = false"
    >
      <div
        class="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white dark:bg-dark-surface p-5 safe-bottom max-h-[80vh] overflow-y-auto"
      >
        <h3 class="font-display text-lg font-bold mb-3">🛒 Lista de compras</h3>
        <p class="text-xs font-semibold uppercase tracking-wide text-green-600 mb-1">Sementes</p>
        <ul class="mb-4 space-y-1 text-sm">
          <li v-for="s in shoppingList.seeds" :key="s" class="flex gap-2"><span>☐</span>{{ s }}</li>
          <li v-if="!shoppingList.seeds.length" class="text-neutral-400">
            Ainda não marcaste plantas no plano.
          </li>
        </ul>
        <p class="text-xs font-semibold uppercase tracking-wide text-green-600 mb-1">Material</p>
        <ul class="mb-4 space-y-1 text-sm">
          <li v-for="m in shoppingList.materials" :key="m" class="flex gap-2"><span>☐</span>{{ m }}</li>
        </ul>
        <BaseButton block size="sm" @click="showShopping = false">Fechar</BaseButton>
      </div>
    </div>
  </div>
</template>
