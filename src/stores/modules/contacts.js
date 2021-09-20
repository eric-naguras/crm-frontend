import { reactive, readonly } from 'vue'
import { api } from 'src/boot/axios'
import users from './users'

const state = reactive({
  contacts: [],
  lastDealerId: '',
  lastVenueId: '',
  lastGroupId: '',
  showTableDealer: true,
  showEditDealer: false,
  showTableVenue: true,
  showEditVenue: false,
  showTableGroup: true,
  showEditGroup: false,
  showSubContacts: true
})

// Methods can be used like vuex mutations and/or actions
const methods = {
  async getContacts() {
    const headers = {
      Authorization: users.state.account.token
    }
    const response = await api.get('/api/contacts', { headers })
    console.log('Store - Contacts: got getContacts response', response.data.result)
    state.contacts = response.data.result
    return Promise.resolve(false)
  },
  toggleTable(type) {
    if (type === 'dealers') {
      state.showTableDealer = !state.showTableDealer
      state.showEditDealer = !state.showEditDealer
    } else if (type === 'venues') {
      state.showTableVenue = !state.showTableVenue
      state.showEditVenue = !state.showEditVenue
    } else if (type === 'groups') {
      state.showTableGroup = !state.showTableGroup
      state.showEditGroup = !state.showEditGroup
    }
  },
  toggleShowSubContacts(show) {
    if (show === undefined) {
      state.showSubContacts = !state.showSubContacts
      return
    }
    if (show) {
      state.showSubContacts = true
    } else {
      state.showSubContacts = false
    }
  },
  setId(type, id) {
    if (type === 'dealers') {
      state.lastDealerId = id
    } else if (type === 'venues') {
      state.lastVenueId = id
    } else if (type === 'groups') {
      state.lastGroupId = id
    }
  }
}

// Use getters for adding filters or calculations to state properties
const getters = {
  dealers() {
    const d = state.contacts.filter((d) => d.type === 'dealers')
    return d
  },
  venues() {
    const venues = state.contacts.filter((d) => d.type === 'venues')
    for (const venue of venues) {
      if (venue.group) {
        const group = state.contacts.find(g => g.group === venue.group && g.type === 'groups')
        venue.commission = group.commission
      }
    }
    return venues
  },
  venueContacts(venueId) {
    if (venueId) {
      return state.contacts.find((v) => v._id === venueId).contacts
    } else {
      return []
    }
  },
  groups() {
    return state.contacts.filter((d) => d.type === 'groups')
  },
  getById(id) {
    return state.contacts.find((c) => c._id === id)
  },
  getPhoneNumbers(id) {
    console.log('Store Contacts: Getting phonenumbers for', id)
    let result = []
    const company = getters.getById(id)
    result.push({ name: 'Company', phone: company.phone })
    for (const contact of company.contacts) {
      result.push({ name: `${contact.firstName.substr(0, 1)} ${contact.lastName}`, phone: contact.phone })
    }
    return result
  }
}

export default {
  state: readonly(state),
  methods,
  getters
}
