<template>
  <span v-html="content" @click="toggle"/>
</template>

<script>
  import { defineComponent, ref, computed } from 'vue'
  export default defineComponent({
    name: 'Contacts-EditForm',
    props: ['text', 'length'],
    setup(props) {
      let expand = ref(false)

      const toggle = () => {
        console.log(`Toggeling ${expand.value} to ${!expand.value}`);
        expand.value = !expand.value
      }

      let content = computed({
        get() {
          if (props.text.length <= props.length) {
            return props.text
          }
          if (expand.value) {
            return `${props.text} <span style="color:purple;cursor:pointer;text-decoration:underline;font-weight:bold;">[ less ]</span>`
          }
          const result = `${props.text.substr(
            0,
            props.length
          )}... <span style="color:purple;cursor:pointer;text-decoration:underline;font-weight:bold;">[ more ]</span>`
          return result
        }
      })
      return {
        content,
        expand,
        toggle
      }
    }
  })
</script>

