import { reactive, readonly } from 'vue'

const state = reactive({
  activeClass: 'contacts'
})
const methods = {
  setActiveClass(activeClass) {
    console.log('Store General: Received active class', activeClass)
    activeClass = activeClass === '/' ? '/home' : activeClass
    state.activeClass = activeClass.substr(1)
    console.log('Store General: Set active class to', state.activeClass)
  },
  notYet(name) {
    alert(`${name} function not yet implemented`)
  }
}

export default {
  state: readonly(state),
  methods
}
