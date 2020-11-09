<template>
  <v-modal v-if="currentInstrument" @close="editing = false; clearCurrentInstrument()" :width-class="editing ? 'sm:max-w-xl' : 'sm:max-w-lg'">
    <div class="rounded w-full sm:max-w-2xl" v-if="editing">
      <v-instrument-form
                         @editSuccess="editing = false"
                         @cancel="editing = false"
                         class="max-h-screen overflow-auto overflow-x-hidden rounded"></v-instrument-form>
    </div>
    <div v-else class="w-full">
      <div class="flex justify-between mb-4">
        <h6 class="text-xl font-bold text-gray-900">
          {{ currentInstrument.size }} {{ currentInstrument.type }} {{
            currentInstrument.number }}
        </h6>
        <button class="appearance-none text-white bg-red-600 px-2 rounded shadow hover:bg-red-800 hover:shadow-lg text-sm"
                @click="clearCurrentInstrument">Close
        </button>
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Size: </span>{{ currentInstrument.size }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Location: </span>{{ currentInstrument.location }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Assigned To: </span>{{ currentInstrument.assignedTo }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Maintenance Notes: </span>{{
          currentInstrument.maintenanceNotes }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Condition Notes: </span>{{
          currentInstrument.conditionNotes }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Condition: </span>{{ currentInstrument.condition }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Quality: </span>{{ currentInstrument.quality }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Gifted To Student: </span>{{ currentInstrument.gifted ?
        'Yes' : 'No' }}
      </div>
      <div v-if="currentInstrument.history">
        <span class="font-bold text-gray-700 mb-2">History: </span>{{ currentInstrument.history.join(', ')
        }}
      </div>
      <div class="font-bold text-gray-700" v-else>
        No Instrument History
      </div>
      <div class="flex justify-start mt-2 flex-row-reverse">
        <button class="mx-1 appearance-none bg-yellow-600 text-white px-4 py-1 shadow rounded hover:bg-yellow-800 hover:shadow-lg"
                @click="editing = true">Edit
        </button>
        <button class="mx-1 appearance-none bg-blue-600 text-white px-4 py-1 shadow rounded hover:bg-blue-800 hover:shadow-lg">
          Sign Out
        </button>
        <button class="mx-1 appearance-none bg-green-600 text-white px-4 py-1 shadow rounded hover:bg-green-800 hover:shadow-lg">
          Retrieve
        </button>
        <button class="mx-1 appearance-none bg-red-600 text-white px-4 py-1 shadow rounded hover:bg-red-800 hover:shadow-lg">
          Delete
        </button>
      </div>
    </div>
  </v-modal>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import VModal from '@/components/VModal'
import VInstrumentForm from '@/components/VInstrumentForm'

export default {
  name: 'InstrumentDisplay',
  data() {
    return {
      editing: false,
    }
  },
  components: { VInstrumentForm, VModal },
  methods: {
    ...mapMutations(['clearCurrentInstrument']),
  },
  computed: mapState(['currentInstrument']),
}
</script>
