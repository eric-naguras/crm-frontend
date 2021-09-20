<template>
  <q-page padding class="bg-light-gray">
    <q-table
    dense
    :grid="$q.screen.xs"
    :rows="rows"
    :columns="proposalsColumns"
    row-key="_id"
    :filter="filter"
    :loading="loading"
    :wrap-cells="true"
    :rows-per-page-options="[10, 20, 50, 0]"
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
    name: 'BookingsPage',
    setup() {
      const $q = useQuasar()
      const store = inject('store')
      const { formatDate } = date
      let filter = ref('')
      let loading = ref(false)

      onMounted(async () => {
        console.log('Components ProposalsList: onMounted')
        loading.value = true
        await store.bookings.methods.getProposalsForId()
        loading.value = false
        console.log('Components ProposalsList: got proposals, result:', store.bookings.state.proposals)
      })

      const proposalsColumns = [
        {
          name: 'date',
          required: true,
          align: 'left',
          label: 'Creation Date',
          field: 'dateCreated',
          sortable: true,
          format: (val) => formatDate(val, 'YYYY/MM/DD')
        },
        {
          name: 'date',
          required: true,
          align: 'left',
          label: 'Ealiest Display Date',
          field: 'earliestDate',
          sortable: true,
          format: (val) => formatDate(val, 'YYYY/MM/DD')
        },
        {
          name: 'dealerName',
          required: true,
          align: 'left',
          label: 'Dealer',
          field: 'dealerName',
          sortable: true,
        },
        { name: 'nrOfCars', required: true, align: 'left', label: 'Total Cars', field: 'nrOfCars', sortable: true },
        { name: 'nrOfVenues', required: true, align: 'left', label: 'Total Venues', field: 'nrOfVenues', sortable: true },
        { name: 'createdBy', required: true, align: 'left', label: 'Created by', field: 'createdBy', sortable: true },
        { name: 'template', required: true, align: 'left', label: 'Template', field: 'template', sortable: true }
      ]
      if ($q.screen.xs) {
        dealersColumns.splice(2)
      }

      const rows = computed({
        get() {
          return store.bookings.state.proposals
        }
      })

      const rowClicked = (evt, row, index) => {
        console.log('Component ProposalsList: Row clicked', evt, row, index)
      }

      return {
        rows,
        proposalsColumns,
        filter,
        loading,
        rowClicked
      }
    }
  })
</script>
