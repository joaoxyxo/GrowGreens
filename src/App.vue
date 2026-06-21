<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import ToastHost from '@/components/ToastHost.vue'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const ui = useUiStore()
const showTabBar = computed(() => !route.meta.hideTabBar)

function refresh() {
  window.location.reload()
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Skip-link: aparece ao navegar por teclado (Tab) -->
    <a
      href="#conteudo"
      class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-green-600 focus:px-4 focus:py-2 focus:text-white"
    >
      Saltar para o conteúdo
    </a>
    <ToastHost />

    <div
      v-if="ui.needsRefresh"
      class="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-2 bg-green-700 px-4 py-2 text-sm text-white"
    >
      <span>Nova versão disponível.</span>
      <button class="rounded-lg bg-white/20 px-3 py-1 font-semibold" @click="refresh">Recarregar</button>
    </div>

    <main id="conteudo" :class="showTabBar ? 'pb-24' : ''">
      <div class="mx-auto max-w-2xl">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>

    <TabBar v-if="showTabBar" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
