<template>
  <q-item :class="{ active_sidebar: isActiveClass }" clickable tag="a" :href="link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
  import { defineComponent, inject, computed } from 'vue'

  export default defineComponent({
    name: 'EssentialLink',
    props: {
      title: {
        type: String,
        required: true
      },

      caption: {
        type: String,
        default: ''
      },

      link: {
        type: String,
        default: '#'
      },

      icon: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      const store = inject('store')

      const isActiveClass = computed({
        get() {
          if (store.general.state.activeClass === 'home' && props.link === '/') {
            return true
          }
          return props.link.includes(store.general.state.activeClass)
        }
      })

      return {
        isActiveClass
      }
    }
  })
</script>

<style lang="scss" scoped>
  .active_sidebar {
    background-color: $green-3;
    // Add round corners
  }
</style>
