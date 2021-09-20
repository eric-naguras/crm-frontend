<template>
  <div class="gt-sm">
    <div class="row q-mb-sm justify-end action-icons-large">
      <action-icon icon="map" label="MAP" @click.stop="store.general.methods.notYet('Show map')" />
      <action-icon icon="edit" label="EDIT" @click.stop="store.general.methods.notYet('Edit dealership')" />
      <action-icon icon="arrow_back" label="BACK" @click="showTable" />
    </div>
  </div>

  <div class="lt-md">
    <div class="row q-mb-sm justify-around">
      <action-icon icon="map" label="MAP" />
      <action-icon icon="edit" label="EDIT" />
      <action-icon icon="call" label="CALL" />
      <action-icon icon="email" label="EMAIL" />
      <action-icon icon="arrow_back" label="BACK" @click="showTable" />
    </div>
  </div>

  <div class="row q-pa-xs">
    <div class="col-12 col-md-3"><span class="q-mr-sm text-weight-bold">Name:</span> {{ contact.name }}</div>
    <div class="col-12 col-md-3">
      <span class="q-mr-sm text-weight-bold">Email:</span>
      <span class="email-hover" @click.stop="store.general.methods.notYet('Send email to dealer')">
        {{ contact.email }}
        <q-tooltip class="bg-purple text-body2"> Click to send email </q-tooltip>
      </span>
    </div>
    <div class="col-12 col-md-3">
      <span class="q-mr-sm text-weight-bold">Phone:</span>
      <span class="email-hover" @click.stop="makeCall(contact.name, contact.phone, 'main')">
        {{ contact.phone }}
        <q-tooltip class="bg-purple text-body2"> Click to call </q-tooltip>
      </span>
    </div>
    <div class="col-12 col-md-3"><span class="q-mr-sm text-weight-bold">City:</span> {{ contact.city }}</div>
  </div>
  <div class="row q-pa-xs">
    <div class="col-12 col-md-3"><span class="q-mr-sm text-weight-bold">Address:</span> {{ contact.address }}</div>
    <div class="col-12 col-md-3"><span class="q-mr-sm text-weight-bold">County:</span> {{ contact.county }}</div>
    <div class="col-12 col-md-3"><span class="q-mr-sm text-weight-bold">Zip:</span> {{ contact.zip }}</div>
    <div class="col-12 col-md-3"><span class="q-mr-sm text-weight-bold">Country:</span> {{ contact.country }}</div>
  </div>
  <div class="row q-pa-xs">
    <div class="col-12 col-md-6">
      <span class="q-mr-sm text-weight-bold">Website:</span
      ><a :href="contact.website" target="_blank" class="email-hover">{{ contact.website }}</a>
    </div>
  </div>
  <div class="row q-pa-xs">
    <div class="col-12"><span class="q-mr-sm text-weight-bold">Notes:</span><notes :length="100" :text="contact.notes" /></div>
  </div>
  <hr />

  <transition name="fade">
    <div v-if="store.contacts.state.showSubContacts">
      <span class="text-italic text-bold" v-if="tab === 'dealers'"
        >Click on a contact row to create a proposal or booking, click on phone number to create a call record.</span
      >
      <div
        v-for="subcnt in contact.contacts"
        :key="subcnt.email"
        class="q-pa-sm q-mt-sm bg-purple-1"
        @click="subContactClicked(subcnt)"
      >
        <div class="row q-mb-xs relative-position">
          <q-btn
            size="xs"
            round
            color="purple"
            icon="edit"
            class="small-edit-btn"
            @click.stop="store.general.methods.notYet('Edit Contact')"
          />
          <div class="col-12 col-md-3">
            <span class="q-mr-sm text-weight-bold">Name:</span> {{ subcnt.firstName }} {{ subcnt.lastName }}
          </div>
          <div class="col-12 col-md-4">
            <span class="q-mr-sm text-weight-bold">Email:</span>
            <span class="email-hover" @click.stop="store.general.methods.notYet('Send email to contact')">
              {{ subcnt.email }}
              <q-tooltip class="bg-purple text-body2"> Click to send email </q-tooltip>
            </span>
          </div>
          <div class="col-12 col-md-2">
            <span class="q-mr-sm text-weight-bold">Phone:</span>
            <span class="email-hover" @click.stop="makeCall(`${subcnt.firstName} ${subcnt.lastName}`, subcnt.phone, 'sub')">
              {{ subcnt.phone }}
              <q-tooltip class="bg-purple text-body2"> Click to call </q-tooltip>
            </span>
          </div>
          <div class="col-12 col-md-3"><span class="q-mr-sm text-weight-bold">Position:</span> {{ subcnt.position }}</div>
        </div>
        <div class="row q-mb-xs">
          <div class="col-12 col-md-3">
            <span class="q-mr-sm text-weight-bold">Birthdate:</span> {{ dateFormat(subcnt.birthday) }}
          </div>
          <div class="col-12 col-md-9">
            <span class="q-mr-sm text-weight-bold">Notes:</span> <notes :length="60" :text="subcnt.notes" />
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Call Section -->
  <div class="shadow-2" v-if="store.calls.state.showCallsRecord">
    <call-record :ongoingCall="ongoingCall" :callingTab="tab" />
  </div>

  <div class="" v-if="store.bookings.state.showBookingsEdit">
    <bookings :callingTab="tab" :contact="bookingContact" />
  </div>

  <q-tabs
    v-model="contactTabs"
    dense
    class="text-purple"
    active-color="secondary"
    indicator-color="secondary"
    align="left"
    narrow-indicator
  >
    <q-tab name="calls" label="Calls" />
    <q-tab name="proposals" label="Proposals" />
    <q-tab name="bookings" label="Bookings" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="contactTabs" animated>
    <q-tab-panel name="calls">
      <div v-if="tab === 'dealers'">
        <calls-list :id="contact._id" :tab="contactTabs" />
      </div>
      <div v-else>Not yet implemented</div>
    </q-tab-panel>

    <q-tab-panel name="proposals">
      <div v-if="tab === 'dealers'">
        <proposals-list :id="contact._id" tab="proposals" />
      </div>
      <div v-else>Not yet implemented</div>
    </q-tab-panel>

    <q-tab-panel name="bookings">
      <div v-if="tab === 'dealers'">
        <calls-list :id="null" tab="bookings" />
      </div>
      <div v-else>Not yet implemented</div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
  import { defineComponent, inject, computed, ref, reactive, onMounted, onUnmounted } from 'vue'
  import { date } from 'quasar'
  import Notes from '../Notes-field.vue'
  import ActionIcon from '../ActionIcon.vue'
  import CallRecord from '../calls/CallRecord.vue'
  import CallsList from '../calls/CallsList.vue'
  import ProposalsList from '../bookings/ProposalsList.vue'
  import Bookings from '../bookings/BookingsEdit.vue'
  export default defineComponent({
    name: 'Contacts-EditForm',
    props: ['tab', 'id'],
    components: { Notes, ActionIcon, CallRecord, CallsList, Bookings, ProposalsList },
    setup(props) {
      const { formatDate } = date
      const store = inject('store')
      let contactTabs = ref('calls')
      let ongoingCall = ref({})
      const bookingContact = reactive({})

      onMounted(async () => {
        console.log(`Contacts-EditForm mounted`)
        // store.bookings.methods.toggleBookingsEdit(false)
        // store.contacts.methods.toggleShowSubContacts(true)
        // store.calls.methods.toggleshowCallsRecord(false)
      })

      onUnmounted(() => {
        console.log(`Contacts-EditForm unmounted`)
        store.bookings.methods.toggleBookingsEdit(false)
        store.contacts.methods.toggleShowSubContacts(true)
        store.calls.methods.toggleshowCallsRecord(false)
      })

      const contact = computed({
        get() {
          return store.contacts.getters.getById(props.id)
        }
      })

      const showTable = () => {
        store.contacts.methods.toggleTable(props.tab)
      }

      const dateFormat = (datum) => {
        return formatDate(datum, 'MMM-DD-YYYY')
      }

      const isEven = (index) => {
        return index % 2
      }

      const panelExit = (event) => {
        console.log('Panel Exited', event)
      }

      const makeCall = (name, number, type) => {
        console.log(`Making call to ${name} using ${number}`)
        store.contacts.methods.toggleShowSubContacts(false)
        store.calls.methods.toggleshowCallsRecord(true)
        ongoingCall.value.type = 'dealer'
        ongoingCall.value.name = contact.value.name
        ongoingCall.value.date = Date.now()
        ongoingCall.value.caller = `${store.users.state.account.firstName} ${store.users.state.account.lastName}`.trim()
        ongoingCall.value.callee = type === 'sub' ? name : null
        ongoingCall.value.id = contact.value._id
      }

      const subContactClicked = (row) => {
        if (props.tab === 'dealers') {
          console.log(`Subcontact row clicked`, row)
          store.bookings.methods.toggleBookingsEdit(true)
          store.contacts.methods.toggleShowSubContacts(false)
          store.calls.methods.toggleshowCallsRecord(false)
          Object.assign(bookingContact, contact.value)
          bookingContact.subContact = row
          console.log(bookingContact)
          console.log(bookingContact.subContact)
        }
      }

      return {
        store,
        contactTabs,
        isEven,
        showTable,
        contact,
        dateFormat,
        makeCall,
        ongoingCall,
        subContactClicked,
        bookingContact,
        panelExit
      }
    }
  })
</script>

<style lang="scss" scoped>
  .action-icons-large {
    position: fixed;
    top: 59px;
    right: 5px;
  }
  .even {
    background-color: $green-1;
  }
  // .odd {
  //   background-color: $lime-1;
  // }
  .small-edit-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
  .call-parent {
    display: none;
    padding: 10px;
    background-color: white;
    border: 3px solid $green-14;
    width: 250px;
    position: fixed;
    top: 126px;
    right: 14px;
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.5);
    // transform: translateX(-50%) rotate(-45deg) skew(-20deg, -20deg);
  }
  .call-context:hover {
    background-color: $green-4;
  }
  .email-hover {
    color: green;
    cursor: pointer;
    text-decoration: underline;
    font-weight: bold;
  }
  .fade-enter-active,
  .fade-leave-active {
    // transition: opacity 0.5s ease;
    transform: translateX(0);
    transition: all 0.4s linear;
  }

  .fade-enter-from,
  .fade-leave-to {
    // opacity: 0;
    transform: translateX(100%);
  }
</style>
