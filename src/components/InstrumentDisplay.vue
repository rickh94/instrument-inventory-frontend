<template>
<!--  <div class="fixed w-full h-full top-0 left-0 flex items-center justify-center" v-if="$store.state.currentInstrument">-->
<!--    <div class="absolute w-full h-full bg-gray-900 opacity-50 z-10" @click="clearCurrentInstrument"></div>-->

<!--    <div class="p-3 shadow bg-white opacity-100 z-50 flex flex-col rounded max-w-lg">-->
  <v-modal v-if="$store.state.currentInstrument" @close="clearCurrentInstrument">
      <div class="flex justify-between mb-4">
        <h6 class="text-xl font-bold text-gray-900">
          {{ $store.state.currentInstrument.size }} {{ $store.state.currentInstrument.type }} {{
          $store.state.currentInstrument.number }}
        </h6>
        <button class="appearance-none text-white bg-red-600 px-2 rounded shadow hover:bg-red-800 hover:shadow-lg text-sm" @click="clearCurrentInstrument">Close</button>
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Size: </span>{{ $store.state.currentInstrument.size }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Location: </span>{{ $store.state.currentInstrument.location }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Assigned To: </span>{{ $store.state.currentInstrument.assignedTo }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Maintenance Notes: </span>{{
        $store.state.currentInstrument.maintenanceNotes }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Condition Notes: </span>{{
        $store.state.currentInstrument.conditionNotes }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Condition: </span>{{ $store.state.currentInstrument.condition }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Quality: </span>{{ $store.state.currentInstrument.quality }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Gifted To Student: </span>{{ $store.state.currentInstrument.gifted ?
        'Yes' : 'No' }}
      </div>
      <div v-if="$store.state.currentInstrument.history">
        <span class="font-bold text-gray-700 mb-2">History: </span>{{ $store.state.currentInstrument.history.join(', ')
        }}
      </div>
      <div class="flex justify-start mt-2 flex-row-reverse">
        <button class="mx-1 appearance-none bg-yellow-600 text-white px-4 py-1 shadow rounded hover:bg-yellow-800 hover:shadow-lg"
                @click="console.log('clicked')">Edit
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
    </v-modal>
<!--    </div>-->
<!--  </div>-->
</template>
<script>
  import {mapMutations} from 'vuex'
  import VModal from '@/components/VModal'
  export default {
    name: 'InstrumentDisplay',
    components: { VModal },
    methods: {
      ...mapMutations(['clearCurrentInstrument']),
    }
  }
</script>
