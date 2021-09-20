import { reactive, readonly } from 'vue'
import { api } from 'src/boot/axios'
import users from './users'

const state = reactive({
  bookings: [],
  proposals: [],
  showBookingsEdit: false,
  proposalTemplates: [
    { value: 'pDefault', label: 'Default template for proposals' },
    { value: 'pWilliams', label: 'Special proposal template for Williams Landrover' },
    { value: 'pXMas2021', label: 'Christmas promotion proposal template' },
    { value: 'pLloyd', label: 'Special proposal template for David Lloyd venues' }
  ],
  bookingsTemplates: [
    { value: 'bDefault', label: 'Default template for bookings' },
    { value: 'bWilliams', label: 'Special booking template for Williams Landrover' },
    { value: 'bXMas2021', label: 'Christmas promotion booking template' },
    { value: 'bLloyd', label: 'Special booking template for David Lloyd venues' }
  ]
})

// Methods can be used like vuex mutations and/or actions
const methods = {
  async getBookingsForId(id) {
    const headers = {
      Authorization: users.state.account.token
    }
    if (id) {
      console.log('Store - Bookings: getting bookings for id', id)
      const response = await api.get(`/api/bookings/${id}`, { headers })
      console.log('Store - Bookings: got getBookingsForId response', response.data.result)
      state.bookings = response.data.result
    } else {
      console.log('Store - Bookings: getting all bookings.')
      const response = await api.get(`/api/bookings`, { headers })
      console.log('Store - Bookings: got getBookingsForId response', response.data.result)
      state.bookings = response.data.result
    }
    return Promise.resolve(false)
  },
  async getProposalsForId(id) {
    const headers = {
      Authorization: users.state.account.token
    }
    let proposals
    if (id) {
      console.log('Store - Bookings: getting proposals for id', id)
      const response = await api.get(`/api/proposals/${id}`, { headers })
      console.log('Store - Bookings: got getProposalsForId response', response.data.result)
      proposals = [...response.data.result]
    } else {
      console.log('Store - Bookings: getting all proposals.')
      const response = await api.get(`/api/proposals`, { headers })
      console.log('Store - Bookings: got getProposalsForId response', response.data.result)
      proposals = [...response.data.result]
    }
    for (var proposal of proposals) {
      if (proposal.venues.length > 1) {
        proposal.nrOfCars = proposal.venues.reduce((previous, current) => previous.nrOfCars + current.nrOfCars)
        proposal.earliestDate = proposal.venues.reduce((p, c) => Math.min(p.startDate, c.startDate))
        proposal.nrOfVenues = proposal.venues.length
      } else {
        proposal.nrOfCars = proposal.venues[0].nrOfCars
        proposal.earliestDate = proposal.venues[0].startDate
        proposal.nrOfVenues = proposal.venues.length
      }
    }
    state.proposals = proposals
    return Promise.resolve(false)
  },
  toggleBookingsEdit(show) {
    if (show === undefined) {
      state.showBookingsEdit = !state.showBookingsEdit
      return
    }
    if (show) {
      state.showBookingsEdit = true
    } else {
      state.showBookingsEdit = false
    }
  },
  async saveBooking(booking) {
    const headers = {
      Authorization: users.state.account.token
    }
    // Fixup bookings before storage
    for (var venue of booking.venues) {
      for (var car of venue.cars) {
        delete car.key
      }
    }
    const newVenues = booking.venues.map((venue) => {
      return {
        _id: venue.id,
        name: venue.name,
        cars: venue.cars,
        nrOfCars: venue.nrOfCars,
        venueContact: {
          name: `${venue.venueContact.firstName} ${venue.venueContact.lastName}`,
          phone: venue.venueContact.phone,
          email: venue.venueContact.email
        },
        notes: venue.notes,
        startDate: new Date(`${venue.startDate}`).valueOf(),
        endDate: new Date(`${venue.endDate}`).valueOf(),
        commission: venue.commission
      }
    })
    const fixedBooking = Object.assign({}, booking)
    fixedBooking.venues = newVenues
    state.bookings.push(fixedBooking)
    const response = await api.post('/api/bookings', { booking: fixedBooking }, { headers })
    console.log('Store - Bookings: got saveBooking response', response.data.result)
  }
}

const getters = {
}

export default {
  state: readonly(state),
  methods,
  getters
}
