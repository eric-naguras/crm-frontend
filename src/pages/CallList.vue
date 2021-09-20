<template>
  <q-page padding class="bg-light-gray">
   <q-table
    dense
    :grid="$q.screen.xs"
    :rows="rows"
    :columns="callsColumns"
    row-key="_id"
    :filter="filter"
    :loading="loading"
    :wrap-cells="true"
    @row-click="rowClicked"
    :rows-per-page-options="[10, 20, 50, 0]"
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
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            size="sm"
            color="accent"
            round
            dense
            @click="props.expand = !props.expand"
            :icon="props.expand ? 'remove' : 'add'"
          />
        </q-td>
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="q-pl-md text-left text-italic">{{ props.row.notes }}</div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
  </q-page>
</template>

<script>
  import { defineComponent, inject, ref, onMounted, computed } from 'vue'
  import { useQuasar, date } from 'quasar'
  export default defineComponent({
    name: 'CallsListPage',
    setup() {
      const $q = useQuasar()
      const store = inject('store')
      const { formatDate } = date
      let filter = ref('')
      let loading = ref(false)

      onMounted(async () => {
        console.log('Page CallsList: onMounted')
        loading.value = true
        await store.calls.methods.getCalls()
        loading.value = false
        console.log('Page CallsList: got calls, result:', store.calls.state.calls)
      })

      const callsColumns = [
        {
          name: 'date',
          required: true,
          align: 'left',
          label: 'Called Date',
          field: 'date',
          sortable: true,
          format: (val) => formatDate(val, 'YYYY/MM/DD HH:mm')
        },
        {
          name: 'callBackDate',
          required: true,
          align: 'left',
          label: 'Callback Date',
          field: 'callBack',
          sortable: true,
          format: (val) => formatDate(val, 'YYYY/MM/DD HH:mm')
        },
        { name: 'caller', required: true, align: 'left', label: 'Caller', field: 'caller', sortable: true },
        { name: 'callee', required: true, align: 'left', label: 'Called with', field: 'callee', sortable: true },
        { name: 'status', required: true, align: 'left', label: 'Status', field: 'status', sortable: true }
      ]
      if ($q.screen.xs) {
        dealersColumns.splice(2)
      }

      const rows = computed({
        get() {
          return store.calls.state.calls
        }
      })

      const rowClicked = (evt, row, index) => {
        console.log('Page CallsList: Row clicked', evt, row, index)
      }

      return {
        rows,
        callsColumns,
        filter,
        loading,
        rowClicked
      }
    }
  })
</script>
