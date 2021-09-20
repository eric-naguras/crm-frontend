<template>
  <q-page padding class="bg-light-gray">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="secondary"
      indicator-color="secondary"
      align="left"
      narrow-indicator
    >
      <q-tab name="dealers" label="Dealerships" />
      <q-tab name="venues" label="Venues" />
      <q-tab name="groups" label="groups" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="dealers">
        <contacts-tables v-if="store.contacts.state.showTableDealer" :tab="tab" />
        <contacts-edit v-if="store.contacts.state.showEditDealer" :tab="tab" :id="store.contacts.state.lastDealerId" />
      </q-tab-panel>

      <q-tab-panel name="venues">
        <contacts-tables v-if="store.contacts.state.showTableVenue" :tab="tab" />
        <contacts-edit v-if="store.contacts.state.showEditVenue" :tab="tab" :id="store.contacts.state.lastVenueId"/>
      </q-tab-panel>

      <q-tab-panel name="groups">
        <contacts-tables v-if="store.contacts.state.showTableGroup" :tab="tab" />
        <contacts-edit v-if="store.contacts.state.showEditGroup" :tab="tab" :id="store.contacts.state.lastGroupId"/>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
  import { defineComponent, inject, ref, onMounted, computed } from 'vue'
  import ContactsTables from '../components/contacts/Contacts-Tables.vue'
  import ContactsEdit from '../components/contacts/Contacts-EditForm.vue'
  export default defineComponent({
    name: 'Contacts',
    components: {
      ContactsTables,
      ContactsEdit
    },
    setup() {
      const store = inject('store')
      let tab = ref('dealers')

      return {
        tab,
        store
      }
    }
  })
</script>
