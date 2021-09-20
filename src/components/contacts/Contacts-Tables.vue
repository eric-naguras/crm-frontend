<template>
  <q-table
    dense
    :grid="$q.screen.xs"
    :rows="rows"
    :columns="dealersColumns"
    row-key="name"
    :filter="filter"
    :loading="loading"
    @row-click="rowClicked"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="secondary" />
    </template>
    <template v-slot:top-right>
      <q-input dense debounce="300" v-model="filter" placeholder="Search"> </q-input>
    </template>
    <template v-slot:append>
      <q-icon name="search" />
    </template>
  </q-table>
</template>

<script>
  import { defineComponent, inject, ref, onMounted, computed } from 'vue'
  import { useQuasar } from 'quasar'
  export default defineComponent({
    name: 'Contacts-Tables',
    props: ['tab'],
    setup(props) {
      const $q = useQuasar()
      const store = inject('store')
      let filter = ref('')
      let loading = ref(false)

      onMounted(async () => {
        console.log('Component Contacts-Tables: onMounted. Tab:', props.tab)
        loading.value = true
        await store.contacts.methods.getContacts()
        loading.value = false
        console.log(`Component Contacts-Tables: Tab: ${props.tab}. Got contacts, result:`, store.contacts.state.contacts)
      })

      const rowClicked = (evt, row, index) => {
        console.log(`Component Contacts-Tables: Tab: ${props.tab}. Row clicked`, evt, row, index)
        store.contacts.methods.toggleTable(row.type)
        store.contacts.methods.setId(row.type, row._id)
        console.log(`Component Contacts-Tables: Tab: ${props.tab}. Setting toggleTable to ${row.type}`)
      }

      const dealersColumns = [
        { name: 'name', required: true, align: 'left', label: 'Name', field: 'name', sortable: true },
        { name: 'city', required: true, align: 'left', label: 'City', field: 'city', sortable: true },
        { name: 'county', required: true, align: 'left', label: 'County', field: 'county', sortable: true },
        { name: 'country', required: true, align: 'left', label: 'Country', field: 'country', sortable: true },
        { name: 'phone', required: true, align: 'left', label: 'Phone', field: 'phone', sortable: true }
      ]
      if ($q.screen.xs) {
        dealersColumns.splice(2)
      }

      const rows = computed({
        get() {
          let result = []
          if (props.tab === 'dealers') {
            result = store.contacts.getters.dealers()
          }
          if (props.tab === 'venues') {
            result = store.contacts.getters.venues()
          }
          if (props.tab === 'groups') {
            result = store.contacts.getters.groups()
          }
          return result
        }
      })

      return {
        rows,
        dealersColumns,
        filter,
        loading,
        rowClicked
      }
    }
  })
</script>
