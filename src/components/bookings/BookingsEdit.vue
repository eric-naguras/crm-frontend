<template>
  <div class="relative-position" v-if="callingTab === 'dealers'">
    <div class="row q-pa-sm q-mr-md justify-between">
      <div class="col4">
        <div>
          <q-radio v-model="booking.type" val="proposal" label="Proposal" @update:model-value="booking.template = null" />
          <q-radio v-model="booking.type" val="booking" label="Booking" @update:model-value="booking.template = null" />
        </div>
        <div>
          <div class="q-ma-md">
            Created by: <span class="text-weight-bold">{{ booking.createdBy }}</span>
          </div>
          <div class="q-ma-md">
            Created for: <span class="text-weight-bold">{{ booking.createdFor }}</span>
          </div>
          <div class="q-ma-md">
            <q-checkbox left-label :label="`Include notes in ${booking.type}`" v-model="booking.includeNotes" />
          </div>
        </div>
      </div>

      <div class="col-8">
        <q-select
          label="Select Template"
          transition-show="scale"
          transition-hide="scale"
          clearable
          filled
          color="purple"
          v-model="booking.template"
          :options="booking.type === 'proposal' ? store.bookings.state.proposalTemplates : store.bookings.state.bookingsTemplates"
          class="q-mt-sm"
        />
        <q-input class="q-mt-sm" v-model="booking.notes" color="purple" filled type="textarea" label="Notes" />
      </div>
    </div>

    <div class="row q-mx-lg q-mt-sm">
      <div class="col-1 text-weight-bold text-h6">Venues</div>
      <div class="col-11">
        <q-table
          dense
          :grid="$q.screen.xs"
          wrap-cells
          :rows="booking.venues"
          row-key="key"
          :columns="venuesColumns"
          :hide-bottom="true"
        >
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
              <q-td>
                <q-btn size="sm" color="negative" round dense @click="removeVenue(props)" icon="remove" />
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%" class="q-pl-md text-weight-bold text-italic"
                >Notes: <span class="text-weight-regular text-italic">{{ props.row.notes }}</span></q-td
              >
            </q-tr>
            <q-tr v-if="props.expand && props.row.venueContact">
              <q-td class="q-pl-md text-weight-bold">Contact:</q-td>
            </q-tr>
            <q-tr v-if="props.expand && props.row.venueContact" :props="props">
              <q-td colspan="100%">
                <div class="row justify-between q-px-xl text-italic">
                  <div>{{ props.row.venueContact.firstName }}</div>
                  <div>{{ props.row.venueContact.lastName }}</div>
                  <div>{{ props.row.venueContact.phone }}</div>
                  <div>{{ props.row.venueContact.email }}</div>
                  <div>{{ props.row.venueContact.position }}</div>
                </div>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand">
              <q-td class="q-pl-md text-weight-bold">Cars:</q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props" v-for="car in props.row.cars" :key="car.brand + car.model + car.year">
              <q-td colspan="100%">
                <div class="row justify-between q-px-xl text-italic">
                  <div>{{ car.brand }}</div>
                  <div>{{ car.model }}</div>
                  <div>{{ car.year }}</div>
                  <div>{{ car.color }}</div>
                  <div>{{ car.price }}</div>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
    <div class="row justify-end q-pa-md">
      <div>
        <q-btn class="q-ml-md" label="Cancel" size="md" @click="closeBookingEdit" />
        <q-btn class="q-ml-md" label="Save" size="md" color="green-10" @click="saveBooking" />
        <q-btn class="q-ml-md" label="Email" size="md" color="green" @click.stop="store.general.methods.notYet('Email Proposal/Booking')" />
        <q-btn class="q-ml-md" label="Show PDF" size="md" color="green" @click.stop="store.general.methods.notYet('Show PDF')"/>
      </div>
    </div>
    <hr />
    <!-- New Venue, maybe make separate componentr -->
    <div v-if="showAddVenue">
      <div class="text-h6">Add Venue</div>
      <q-card>
        <q-card-section class="bg-lime-1">
          <!-- Select Venue and dates -->
          <div class="row">
            <div class="col-6">
              <q-select
                label="Select Venue"
                transition-show="scale"
                transition-hide="scale"
                clearable
                filled
                color="purple"
                v-model="venue.name"
                :options="allVenues"
                @update:model-value="venueSelected"
                class="q-mt-sm"
              />
            </div>
            <div class="col-2 text-center text-bold text-body1">
              <div :class="{ transparent: venue.startDate === 0 }">{{ venue.startDate }}</div>
              <q-btn icon="event" label="Start Date" color="purple" size="md" class="">
                <q-popup-proxy @before-show="updateProxyStart" transition-show="scale" transition-hide="scale">
                  <q-date v-model="proxyDateStart" :options="venueBlockDates">
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn label="Cancel" color="primary" flat v-close-popup />
                      <q-btn label="OK" color="primary" flat @click="saveStartDate" v-close-popup />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-btn>
            </div>
            <div class="col-2 text-center text-bold text-body1">
              <div :class="{ transparent: venue.endDate === 0 }">{{ venue.endDate }}</div>
              <q-btn icon="event" label="End Date" color="purple" size="md" class="">
                <q-popup-proxy @before-show="updateProxyEnd" transition-show="scale" transition-hide="scale">
                  <q-date v-model="proxyDateEnd" :options="venueBlockDates">
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn label="Cancel" color="primary" flat v-close-popup />
                      <q-btn label="OK" color="primary" flat @click="saveEndDate" v-close-popup />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-btn>
            </div>
          </div>
          <!-- Venue contact and commission -->
          <div class="row">
            <div class="col-6">
              <q-select
                label="Select Venue Contact"
                transition-show="scale"
                transition-hide="scale"
                clearable
                filled
                color="purple"
                v-model="venue.venueContact"
                :options="venueContacts"
                class="q-mt-sm"
              />
            </div>
            <div class="col2 q-ma-sm">
              <q-input v-model.number="venue.commission" color="purple" filled type="text" label="Commission" suffix="%" />
            </div>
          </div>
          <!-- Cars Table -->
          <div class="row justify-between">
            <div class="q-my-sm text-body1">Cars:</div>
            <div class="q-my-sm" style="width: 95%">
              <q-table dense :grid="$q.screen.xs" :rows="venue.cars" row-key="key" :columns="carsColumns" :hide-bottom="true">
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td v-for="col in props.cols" :key="col.name" :props="props">
                      {{ col.value }}
                    </q-td>
                    <q-td auto-width>
                      <q-btn size="sm" color="negative" round dense @click="removeCar(props)" icon="remove" />
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
          <!-- Cars Form -->
          <div class="row justify-between">
            <q-input filled color="purple" v-model="car.brand" label="Car Brand" />
            <q-input filled color="purple" v-model="car.model" label="Car Model" />
            <q-input filled color="purple" v-model="car.year" label="Car Year" />
            <q-input filled color="purple" v-model="car.color" label="Car Color" />
            <q-input filled color="purple" v-model="car.price" label="Car Price" />
          </div>
          <div class="row justify-end q-mt-sm">
            <div>
              <q-btn
                class=""
                label="add car"
                size="md"
                color="purple"
                style="height: 20px"
                :disable="canAddCar"
                @click="addCar"
              />
              <q-tooltip>{{ addCarBtnTooltipText }}</q-tooltip>
            </div>
          </div>
          <div class="row justify-between items-end">
            <div class="col-10">
              <q-input v-model="venue.notes" color="purple" filled type="textarea" label="Notes" cols="99" />
            </div>
            <div class="col-2 text-right">
              <q-btn class="q-mt-sm" label="cancel" size="md" style="height: 20px" @click="cancelVenue" />
              <div>
                <q-btn
                  class="q-mt-sm"
                  label="Add Venue"
                  size="md"
                  color="purple"
                  style="height: 20px"
                  :disable="canAddVenue"
                  @click="addVenue"
                />
                <q-tooltip>{{ addVenuBtnTooltipText }}</q-tooltip>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <div class="relative-position" v-else>
    <q-btn size="sm" round color="purple" icon="cancel" class="small-edit-btn" @click="closeBookingEdit" />
    <h5>Booking or Proposals for Venues and Groups not yet implemented</h5>
  </div>
</template>

<script>
  import { defineComponent, inject, ref, reactive, onMounted, computed } from 'vue'
  import { date } from 'quasar'
  export default defineComponent({
    name: 'BookingsEdit',
    props: ['contact', 'callingTab'],
    setup(props) {
      let keyCounter = 0
      const { formatDate, addToDate } = date
      const store = inject('store')
      const showAddVenue = ref(true)
      const venueContacts = ref([])
      const venue = ref({
        id: '',
        key: 0,
        name: '',
        cars: [],
        nrOfCars: 0,
        city: '',
        venueContact: '',
        notes: '',
        startDate: 0,
        endDate: 0,
        commission: 0
      })
      let car = ref({
        key: keyCounter++,
        brand: '',
        model: '',
        year: '',
        color: '',
        price: ''
      })
      const carsColumns = [
        { name: 'brand', required: true, align: 'left', label: 'Brand', field: 'brand', sortable: true },
        { name: 'model', required: true, align: 'left', label: 'Model', field: 'model', sortable: true },
        { name: 'year', required: true, align: 'left', label: 'Build Year', field: 'year', sortable: true },
        { name: 'color', required: true, align: 'left', label: 'Color', field: 'color', sortable: true },
        { name: 'price', required: true, align: 'left', label: 'Price', field: 'price', sortable: true }
      ]
      const venuesColumns = [
        { name: 'name', required: true, align: 'left', label: 'Name', field: 'name', sortable: true },
        { name: 'city', required: true, align: 'left', label: 'City', field: 'city', sortable: true },
        { name: 'county', required: true, align: 'left', label: 'County', field: 'county', sortable: true },
        { name: 'country', required: true, align: 'left', label: 'Country', field: 'country', sortable: true },
        { name: 'phone', required: true, align: 'left', label: 'Phone', field: 'phone', sortable: true },
        { name: 'startDate', required: true, align: 'left', label: 'Start Date', field: 'startDate', sortable: true },
        { name: 'endDate', required: true, align: 'left', label: 'End Date', field: 'endDate', sortable: true },
        { name: 'nrOfCars', required: true, align: 'left', label: 'Nr of Cars', field: 'nrOfCars', sortable: true }
      ]
      const today = formatDate(Date.now(), 'YYYY/MM/DD')
      const proxyDateStart = ref('')
      const proxyDateEnd = ref('')
      const venueBlockDates = [
        '2021/09/04',
        '2021/09/05',
        '2021/09/06',
        '2021/09/07',
        '2021/09/08',
        '2021/09/09',
        '2021/09/10',
        '2021/09/11',
        '2021/09/22',
        '2021/09/18',
        '2021/09/20',
        '2021/09/21',
        '2021/09/22',
        '2021/09/23',
        '2021/09/24'
      ]

      const booking = reactive({
        type: 'proposal',
        dealerId: props.contact._id,
        dealerName: props.contact.name,
        createdBy: `${store.users.state.account.firstName} ${store.users.state.account.lastName}`,
        createdFor: `${props.contact.subContact.firstName} ${props.contact.subContact.lastName}`,
        dateCreated: Date.now(),
        notes: '',
        venues: [],
        template: '',
        includeNotes: false
      })

      const canAddCar = computed({
        get() {
          return !(car && car.value.brand && car.value.brand.length > 0)
        }
      })

      const addCarBtnTooltipText = computed({
        get() {
          return car && car.value.brand && car.value.brand.length > 0 ? 'Add car to venue' : 'Please enter some car info'
        }
      })

      const canAddVenue = computed({
        get() {
          return !(venue.value && venue.value.id && venue.value.startDate && venue.value.endDate)
        }
      })

      const addVenuBtnTooltipText = computed({
        get() {
          return venue.value && venue.value.id && venue.value.startDate && venue.value.endDate
            ? 'Add venue to proposal'
            : 'Please enter dates for venue'
        }
      })

      const addCar = () => {
        const newCar = Object.assign({}, car.value)
        venue.value.cars.push(newCar)
        car.value = {}
      }

      const removeCar = (props) => {
        venue.value.cars.splice(props.rowIndex, 1)
      }

      const removeVenue = (props) => {
        booking.venues.splice(props.rowIndex, 1)
      }

      const cancelVenue = () => {}

      const addVenue = () => {
        console.log(venue.value)
        const newVenue = Object.assign({}, venue.value)
        newVenue.key = keyCounter++
        newVenue.cars = venue.value.cars
        if (venue.value.venueContact && venue.value.venueContact.value) {
          newVenue.venueContact = venue.value.venueContact.value || ''
        }
        newVenue.nrOfCars = venue.value.cars.length
        newVenue.city = venue.value.city
        booking.venues.push(newVenue)
        venue.value = {}
        console.log(booking)
      }

      const venueSelected = (val) => {
        venue.value.id = val.value._id
        venue.value.commission = val.value.commission || 0
        venue.value.name = val.value.name
        venue.value.city = val.value.city
        venue.value.county = val.value.county
        venue.value.country = val.value.country
        venue.value.phone = val.value.phone
        venue.value.cars = []
        // venue.value.name = store.contacts.state.contacts.find(v => v._id === venue.value.id).name
        venueContacts.value = store.contacts.getters.venueContacts(venue.value.id).map((contact) => {
          return { label: `${contact.firstName} ${contact.lastName}`, value: contact }
        })
      }

      const allVenues = store.contacts.getters.venues().map((venue) => {
        return { label: `${venue.name} - ${venue.city}, ${venue.county}, ${venue.country}`, value: venue }
      })

      const closeBookingEdit = () => {
        store.bookings.methods.toggleBookingsEdit(false)
        store.contacts.methods.toggleShowSubContacts(true)
      }

      const updateProxyStart = () => {
        proxyDateStart.value = today
      }

      const updateProxyEnd = () => {
        proxyDateEnd.value = today
      }

      const saveStartDate = () => {
        venue.value.startDate = proxyDateStart.value
      }

      const saveEndDate = () => {
        venue.value.endDate = proxyDateEnd.value
      }

      const saveBooking = () => {
        booking.template = booking.template.value
        console.log(booking)
        store.bookings.methods.saveBooking(booking)
      }

      return {
        store,
        booking,
        saveBooking,
        showAddVenue,
        venue,
        canAddVenue,
        car,
        canAddCar,
        carsColumns,
        addCar,
        allVenues,
        venueContacts,
        venueSelected,
        venueBlockDates,
        venuesColumns,
        closeBookingEdit,
        proxyDateStart,
        proxyDateEnd,
        updateProxyStart,
        updateProxyEnd,
        saveStartDate,
        saveEndDate,
        cancelVenue,
        addVenue,
        removeCar,
        removeVenue,
        addVenuBtnTooltipText,
        addCarBtnTooltipText
      }
    }
  })
</script>

<style lang="scss" scoped>
  .transparent {
    color: transparent;
  }
  @media screen and (min-width: 1024px) {
    .call-details {
      margin: 0 10px;
    }
    .small-edit-btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  @media screen and (max-width: 1023px) {
    .call-details {
      width: 100%;
    }
  }
</style>
