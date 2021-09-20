import { reactive, readonly } from 'vue'
import { api } from 'src/boot/axios'
import users from './users'


const state = reactive({
  calls: [],
  showCallsRecord: false
})

const methods = {
  async getCalls(id) {
    const headers = {
      Authorization: users.state.account.token
    }
    if (id) {
      console.log('Store - Calls: getting calls for id', id)
      const response = await api.get(`/api/calls/${id}`, { headers })
      console.log('Store - Calls: got getCalls response', response.data.result)
      // for (const call of response.data.result) {
      //   call.callBack = new Date(`${call.callBackDate} ${call.callBackTime}`).valueOf()
      // }
      state.calls = response.data.result
    } else {
      console.log('Store - Calls: getting all calls.')
       const response = await api.get(`/api/calls`, { headers })
      console.log('Store - Calls: got getCalls response', response.data.result)
      state.calls = response.data.result
    }
    return Promise.resolve(false)
  },
  async saveCall(call) {
    const headers = {
      Authorization: users.state.account.token
    }
    call.callBack = new Date(`${call.callBackDate} ${call.callBackTime}`).valueOf()
    delete call.callBackDate
    delete call.callBackTime
    state.calls.push(call)
    const response = await api.post('/api/calls', { call }, { headers })
    console.log('Store - Contacts: got saveCall response', response.data.result)
  },
  toggleshowCallsRecord(show) {
    if (show === undefined) {
      state.showCallsRecord = !state.showCallsRecord
      return
    }
    if (show) {
      state.showCallsRecord = true
    } else {
      state.showCallsRecord = false
    }
  }
}

const getters = {
  // dealers() {
  //   const d = state.contacts.filter((d) => d.type === 'dealers')
  //   return d
  // },
}

export default {
  state: readonly(state),
  methods,
  getters
}
