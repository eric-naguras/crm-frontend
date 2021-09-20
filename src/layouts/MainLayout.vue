<template>
  <q-layout view="lHh Lpr lFf" container class="my-container shadow-2 rounded-borders">
    <q-header elevated>
      <q-toolbar class="bg-green">
        <q-btn flat dense round class="lt-md" icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>CRM</q-toolbar-title>

        <div class="desktop-only gt-sm" style="width: 600px">
          <div class="flex justify-between items-center">
            <q-btn :class="{ active: store.general.state.activeClass === 'home' }" flat dense label="Home" to="/" />
            <q-btn
              :class="{ active: store.general.state.activeClass === 'contacts' }"
              flat
              dense
              label="Contacts"
              to="/contacts"
            />
            <q-btn
              :class="{ active: store.general.state.activeClass === 'callslist' }"
              flat
              dense
              label="Call List"
              to="/callslist"
            />
            <q-btn
              :class="{ active: store.general.state.activeClass === 'bookings' }"
              flat
              dense
              label="Bookings"
              to="/bookings"
            />
            <q-btn :class="{ active: store.general.state.activeClass === 'emails' }" flat dense label="Emails" to="/emails" />
            <q-btn
              v-if="state.account.role === 'admin'"
              :class="{ active: store.general.state.activeClass === 'admin' }"
              flat
              dense
              label="Admin"
              to="/admin"
            />
          </div>
        </div>
        <div class="q-ml-xl" v-if="state.account.isLoggedIn">
          Welcome {{ state.account.firstName }}
          <q-btn class="gt-sm q-ml-xs text-grey-10" flat dense label="Logout" @click="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list class="q-mt-lg">
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Logout</q-item-label>
            <q-item-label caption> Logout of the CRM system </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
  import EssentialLink from 'components/EssentialLink.vue'
  import { defineComponent, inject, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'

  export default defineComponent({
    name: 'MainLayout',

    components: {
      EssentialLink
    },

    setup() {
      const router = useRouter()
      const leftDrawerOpen = ref(false)
      const store = inject('store')

      let linksList = computed({
        get() {
          let list = [
            {
              title: 'Home',
              caption: 'Home page',
              icon: 'home',
              link: '/'
            },
            {
              title: 'Contacts',
              caption: 'Dealerships, Venues and Groups',
              icon: 'supervisor_account',
              link: '/#/contacts'
            },
            {
              title: 'Call List',
              caption: 'List with calls to make',
              icon: 'view_list',
              link: '/#/callslist'
            },
            {
              title: 'Bookings',
              caption: 'Booked Venues',
              icon: 'today',
              link: '/#/bookings'
            },
            {
              title: 'Emails',
              caption: 'All Email Correspondence',
              icon: 'email',
              link: '/#/emails'
            },
            {
              title: 'Admin',
              caption: 'Administrative Tasks',
              icon: 'admin_panel_settings',
              link: '/#/admin'
            }
          ]
          if (store.users.state.account.role !== 'admin') {
            return list.filter((t) => t.title !== 'Admin')
          } else {
            return list
          }
        }
      })

      const logout = () => {
        store.users.methods.logout()
        router.push({ path: '/' })
      }

      return {
        store,
        logout,
        state: store.users.state,
        essentialLinks: linksList,
        leftDrawerOpen,
        toggleLeftDrawer() {
          leftDrawerOpen.value = !leftDrawerOpen.value
        }
      }
    }
  })
</script>

<style lang="scss" scoped>
  .active {
    background-color: $purple-10;
    padding: 2px 10px;
    // Add round corners
  }
  @media screen and (min-width: 1024px) {
    .my-container {
      width: 1200px;
      height: 99vh;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 1023px) {
    .my-container {
      width: 100vw;
      height: 100vh;
    }
  }
</style>
