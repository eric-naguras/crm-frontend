<template>
  <div>
    <div class="q-px-xs"><q-btn size="md" round color="green" :icon="icon" /></div>
    <div class="text-center text-weight-bold text-green">{{label}}</div>
  </div>
</template>

<script>
  import { defineComponent, inject, computed } from 'vue'
  export default defineComponent({
    name: 'ActionIcon',
    props: ['icon', 'label'],
    setup() {}
  })
</script>
