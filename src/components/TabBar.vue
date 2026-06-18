<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const tabs = [
  { to: '/', label: 'Início', icon: '🏠' },
  { to: '/jardim', label: 'Horta', icon: '🌱' },
  { to: '/curso', label: 'Curso', icon: '📚' },
  { to: '/calendario', label: 'Calendário', icon: '🗓️' },
  { to: '/perfil', label: 'Perfil', icon: '👤' },
]

const activeTo = computed(() => {
  const p = route.path
  if (p === '/') return '/'
  if (p.startsWith('/jardim') || p.startsWith('/catalogo') || p.startsWith('/planta')) return '/jardim'
  if (p.startsWith('/curso')) return '/curso'
  if (p.startsWith('/calendario')) return '/calendario'
  if (p.startsWith('/perfil') || p.startsWith('/saude') || p.startsWith('/legal')) return '/perfil'
  return p
})
</script>

<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-40 border-t border-neutral-200 dark:border-dark-surface2 bg-white/90 dark:bg-dark-bg/90 backdrop-blur safe-bottom"
    aria-label="Navegação principal"
  >
    <ul class="mx-auto flex max-w-2xl items-stretch justify-around">
      <li v-for="tab in tabs" :key="tab.to" class="flex-1">
        <RouterLink
          :to="tab.to"
          class="flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition"
          :class="
            activeTo === tab.to
              ? 'text-green-600 dark:text-green-400'
              : 'text-neutral-500 dark:text-neutral-400'
          "
        >
          <span class="text-xl leading-none" aria-hidden="true">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
