<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'md' | 'sm'
    block?: boolean
    disabled?: boolean
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', size: 'md', block: false, disabled: false, type: 'button' },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
    :class="[
      block ? 'w-full' : '',
      size === 'md' ? 'px-5 py-3 text-base' : 'px-3.5 py-2 text-sm',
      variant === 'primary' ? 'bg-green-500 text-white hover:bg-green-600' : '',
      variant === 'secondary'
        ? 'border border-green-500 text-green-700 dark:text-green-300 bg-transparent hover:bg-green-50 dark:hover:bg-green-900/30'
        : '',
      variant === 'ghost' ? 'text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-dark-surface2' : '',
      variant === 'danger' ? 'bg-error text-white hover:opacity-90' : '',
    ]"
  >
    <slot />
  </button>
</template>
