<template>
  <q-page class="bg-light-gray row justify-center items-center">
    <div class="column">
      <div class="row justify-center">
        <h5 class="text-h5 q-ma-xs text-dark-gray text-uppercase">Please Login</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-form class="q-gutter-md" @submit="onSubmit">
            <q-card-section>
              <q-input square filled clearable v-model="email" type="email" label="email" />
              <q-input square filled clearable v-model="password" type="password" label="password" />
            </q-card-section>
            <q-card-actions class="q-px-md">
              <q-btn unelevated color="green" size="lg" class="full-width" label="Login" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>


<script>
  import { useRoute, useRouter } from 'vue-router'
  import { defineComponent, inject, ref } from 'vue'

  export default defineComponent({
    name: 'Login',
    setup() {
      const store = inject('store')
      const route = useRoute()
      const router = useRouter()
      console.log(route.query.next)

      let email = ref('')
      let password = ref('')

      const onSubmit = async () => {
        console.log('Submitting login', email.value, password.value)
        await store.users.methods.login(email.value, password.value)
        console.log('Page Login: got response from login')
        const loggedIn = store.users.state.account.isLoggedIn
        if (loggedIn) {
          if (route.query.next) {
            router.push({ path: route.query.next })
          }
        }
      }
      return {
        email,
        password,
        onSubmit,
      }
    }
  })
</script>
