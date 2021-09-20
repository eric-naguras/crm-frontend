import { reactive, readonly } from 'vue'
import { api } from 'src/boot/axios'
import { LocalStorage } from 'quasar'

const state = reactive({
  account: {
    isLoggedIn: false,
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    token: '',
    expiry: 0
  }
})

// Methods can be used like vuex mutations and/or actions
const methods = {
  logout() {
    console.log('Store - Users: logging out')
    LocalStorage.remove('loggedinUser')
    state.account = {
      isLoggedIn: false,
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      token: '',
      expiry: 0
    }
    //TODO Clear local storage
  },
  async login(email, password) {
    try {
      const response = await api.post('/login', { email, password })
      console.log('Store - Users: got login response', response.data)
      if (response.data.token) {
        LocalStorage.set('loggedinUser', response.data)
        state.account = {
          isLoggedIn: true,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token,
          expiry: response.data.expiry
        }
      }
    } catch (e) {
      console.error(e.message)
    }
  },

  setLoggedinUser(user) {
    state.account = {
      isLoggedIn: true,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: user.token,
      expiry: user.expiry
    }
  }
}

export default {
  state: readonly(state),
  methods
}
