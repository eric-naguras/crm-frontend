<template>
  <div class="relative-position" v-if="callingTab==='dealers'">
    <q-btn size="sm" round color="purple" icon="cancel" class="small-edit-btn" @click="closeCallRecord" />
    <div class="row q-pa-md">
      <div class="col-12 col-md-5">
        <div class="row">
          {{ callSentence }}
        </div>
        <div class="row">
          <div class="text-weight-bold">notes:</div>
          <textarea class="full-width" rows="5" v-model="notes" />
        </div>
      </div>
      <div class="col-12 col-md-7">
        <div class="call-details">
          <q-select
            label="Call Result"
            transition-show="scale"
            transition-hide="scale"
            filled
            v-model="callResult"
            :options="callOptions"
            class="q-mt-sm"
          />
          <div class="row justify-between">
            <q-input filled v-model="callBackDate" label="Calback Date" class="q-mt-sm"> </q-input>
            <q-btn icon="event" round color="green" size="md" style="height: 40px; width: 40px" class="q-mt-md">
              <q-popup-proxy @before-show="updateProxyDate" transition-show="scale" transition-hide="scale">
                <q-date v-model="proxyDate">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="green" flat v-close-popup />
                    <q-btn label="OK" color="green" flat @click="saveDate" v-close-popup />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
            <q-input filled v-model="callBackTime" label="Calback Time" class="q-mt-sm"> </q-input>
            <q-btn icon="schedule" round color="green" size="md" style="height: 40px; width: 40px" class="q-mt-md">
              <q-popup-proxy @before-show="updateProxyTime" transition-show="scale" transition-hide="scale">
                <q-time v-model="proxyTime" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" @click="saveTime" color="green" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-btn>
          </div>
          <div class="row justify-end">
            <q-btn class="q-ma-sm" color="green-10" @click="saveCall">Save Call</q-btn>
            <q-btn class="q-ma-sm" color="green-6" @click="saveCall = true">Create Proposal</q-btn>
            <q-btn class="q-ma-sm" color="green-8" @click="saveCall">Create Booking</q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="relative-position" v-else>
    <q-btn size="sm" round color="purple" icon="cancel" class="small-edit-btn" @click="closeCallRecord" />
    <h5>Call records for Venues and Groups not yet implemented</h5>
  </div>
</template>

<script>
  import { defineComponent, inject, ref, onMounted, computed } from 'vue'
  import { date } from 'quasar'
  export default defineComponent({
    name: 'CallRecord',
    props: ['ongoingCall', 'callingTab'],
    setup(props) {
      const { formatDate, addToDate } = date
      const store = inject('store')
      const notes = ref('')
      let callResult = ref('')
      const newDate = formatDate(Date.now(), 'MMM-DD-YYYY')
      const newTime = formatDate(Date.now(), 'HH:mm').toString()
      let callBackDate = ref('')
      const proxyDate = ref(newDate)
      let callBackTime = ref()
      const proxyTime = ref(newTime)
      const callOptions = ref([
        'Not interested - never',
        'Not interested - now',
        'Interested - call back',
        'Interested - send proposal',
        'Proposal discussion',
        'Booking discussion',
        'Booking sent',
        'Booking confirmed'
      ])

      const saveCall = () => {
        const call = {
          date: props.ongoingCall.date,
          caller: props.ongoingCall.caller,
          callee: props.ongoingCall.callee,
          callType: props.ongoingCall.type,
          contactId: props.ongoingCall.id,
          status: callResult.value,
          callBackDate: callBackDate.value,
          callBackTime: callBackTime.value,
          notes: notes.value
        }
        console.log('Component CallRecord - saveCall', call)
        store.calls.methods.saveCall(call)
        store.calls.methods.toggleshowCallsRecord(false)
        store.contacts.methods.toggleShowSubContacts(true)
      }

      const closeCallRecord = () => {
        store.contacts.methods.toggleShowSubContacts(true)
        store.calls.methods.toggleshowCallsRecord(false)
      }

      const updateProxyDate = () => {
        proxyDate.value = newDate
        console.log(`[Update Proxy Date] ProxyDate: ${proxyDate.value}. ProxyTime: ${proxyTime.value}`)
      }

      const updateProxyTime = () => {
        proxyTime.value = newTime
        console.log(`[Update Proxy Time] ProxyDate: ${proxyDate.value}. ProxyTime: ${proxyTime.value}`)
      }

      const saveDate = () => {
        // TODO check if date is in the future
        callBackDate.value = proxyDate.value
        // proxyTime.value = proxyDate.value
        console.log(`[Save Date] ProxyDate: ${proxyDate.value}. ProxyTime: ${proxyTime.value}`)
      }

      const saveTime = () => {
        // TODO check if date is in the future
        callBackTime.value = proxyTime.value.substr(11)
        console.log(`[Save Time] ProxyDate: ${proxyDate.value}. ProxyTime: ${callBackTime.value}`)
      }

      const callSentence = computed({
        get() {
          let s = `${props.ongoingCall.caller} calling ${props.ongoingCall.name}`
          if (props.ongoingCall.callee) {
            s += ` and talking with ${props.ongoingCall.callee}`
          }
          return s
        }
      })

      return {
        store,
        callOptions,
        notes,
        callResult,
        callSentence,
        callBackDate,
        proxyDate,
        updateProxyDate,
        updateProxyTime,
        saveDate,
        saveTime,
        callBackTime,
        proxyTime,
        saveCall,
        closeCallRecord
      }
    }
  })
</script>

<style lang="scss" scoped>
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
