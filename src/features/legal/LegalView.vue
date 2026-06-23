<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import AppCard from '@/components/ui/AppCard.vue'
</script>

<template>
  <div>
    <PageHeader title="Privacidade e termos" back />
    <div class="px-4 pb-10 space-y-4">
      <AppCard>
        <h2 class="font-display font-bold mb-2">Privacidade (RGPD)</h2>
        <p class="text-sm text-neutral-600 dark:text-neutral-300">
          A GrowGreens funciona de forma local-first: os teus dados (plantas, diário, fotos, progresso) são
          guardados <strong>apenas no teu dispositivo</strong>, no armazenamento do navegador. Não recolhemos
          nem enviamos dados pessoais para servidores, e não usamos rastreadores de terceiros.
        </p>
        <p class="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
          A previsão meteorológica é obtida do IPMA (dados abertos públicos) com base na região que
          escolheste, sem identificação pessoal. Podes exportar ou apagar os teus dados a qualquer momento nas
          definições do perfil.
        </p>
      </AppCard>

      <AppCard>
        <h2 class="font-display font-bold mb-2">Termos de utilização</h2>
        <p class="text-sm text-neutral-600 dark:text-neutral-300">
          A GrowGreens é uma ferramenta educativa. A informação sobre cultivo e épocas é orientativa e pode
          variar com o microclima, a variedade e o ano. Usa o teu bom senso e adapta à tua realidade.
        </p>
      </AppCard>

      <AppCard>
        <h2 class="font-display font-bold mb-2">Aviso de saúde</h2>
        <p class="text-sm text-neutral-600 dark:text-neutral-300">
          A informação nutricional é educativa e baseada em evidência geral. Não substitui aconselhamento
          médico ou nutricional individual. Em caso de dúvida sobre a tua alimentação ou saúde, consulta um
          profissional.
        </p>
      </AppCard>

      <AppCard>
        <h2 class="font-display font-bold mb-2">Segurança das plantas</h2>
        <p class="text-sm text-neutral-600 dark:text-neutral-300">
          Algumas plantas (ou partes delas) são tóxicas para humanos ou animais. Verifica sempre as notas de
          segurança em cada ficha antes de consumir ou de deixar ao alcance de crianças e animais.
        </p>
      </AppCard>

      <p class="text-xs text-neutral-400 text-center">GrowGreens · versão de pré-lançamento</p>
    </div>
  </div>
</template>
