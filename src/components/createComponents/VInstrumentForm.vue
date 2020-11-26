<template>
  <div class="w-full">
    <div class="flex justify-between mb-2">
      <h4 v-if="mode === 'creating'" class="text-2xl font-bold text-gray-800">Create {{ newInstrumentNumber }}</h4>
      <h4 v-else-if="mode === 'editing'" class="text-2xl font-bold text-gray-800">Edit {{ data.number }}</h4>
      <h4 v-else class="text-2xl font-bold text-red-800">Invalid Mode</h4>
      <button v-if="mode === 'creating'"
              class="font-bold text-purple-600 hover:underline text-lg"
              @click="clearNewInstrumentNumber()">Change
        Number
      </button>
    </div>
    <form @submit.prevent="onSubmit">
      <v-form-control label="Size" label-for="size">
        <v-autocomplete id="size" v-model="data.size" :options="sizes"></v-autocomplete>
      </v-form-control>
      <v-form-control label="Type" label-for="type">
        <v-autocomplete id="type" v-model="data.type" :options="types"></v-autocomplete>
      </v-form-control>
      <v-form-control label="Location" label-for="location">
        <v-autocomplete id="location" :options="locations" v-model="data.location"></v-autocomplete>
      </v-form-control>
      <v-form-control label="Assigned To" label-for="assigned-to">
        <input type="text"
               name="assigned-to"
               v-model="data.assignedTo"
               id="assigned-to"
               class="appearance-none bg-transparent border-none text-gray-900 focus:text-purple-800 w-full py-1 leading-tight">
      </v-form-control>
      <v-form-control label="Maintenance Notes" label-for="maintenance-notes">
      <textarea name="maintenance-notes"
                id="maintenance-notes"
                v-model="data.maintenanceNotes"
                class="appearance-none bg-transparent border-none w-full text-gray-900 focus:text-purple-800 py-1 leading-tight"></textarea>
      </v-form-control>
      <v-form-control label="Condition Notes" label-for="condition-notes">
      <textarea name="condition-notes"
                id="condition-notes"
                v-model="data.conditionNotes"
                class="appearance-none bg-transparent border-none w-full text-gray-900 focus:text-purple-800 py-1 leading-tight"></textarea>
      </v-form-control>
      <v-form-control label="Condition" label-for="condition">
        <div>
          <input type="number"
                 name="condition"
                 id="condition"
                 min="1"
                 max="5"
                 v-model="data.condition"
                 class="appearance-none bg-transparent border-none w-16 text-gray-900 py-1 leading-tight"> / 5
        </div>
      </v-form-control>
      <v-form-control label="Quality" label-for="quality">
        <div>
          <input type="number"
                 name="quality"
                 id="quality"
                 min="1"
                 max="5"
                 v-model="data.quality"
                 class="appearance-none bg-transparent border-none w-16 text-gray-900 py-1 leading-tight"> / 5
        </div>
      </v-form-control>
      <v-spinner v-if="loading" line-fg-color="#805ad5"></v-spinner>
      <div v-else class="flex justify-around w-full mt-5">
        <button v-if="mode === 'editing'"
                @click="$emit('cancel')"
                class="mx-2 bg-yellow-600 w-full md:w-auto px-8 text-white py-2 shadow hover:bg-yellow-800 hover:shadow-lg rounded"
        >Cancel
        </button>
        <button
          class="bg-purple-600 w-full md:w-auto px-8 text-white py-2 shadow hover:bg-purple-800 hover:shadow-lg rounded mx-2"
          type="submit">Save
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { API } from 'aws-amplify'
import VAutocomplete from '@/components/UI/VAutocomplete'
import { mapMutations, mapState } from 'vuex'
import VFormControl from '@/components/UI/VFormControl'

export default {
  name: 'VInstrumentForm',
  components: { VFormControl, VAutocomplete },
  data() {
    return {
      mode: 'creating',
      locations: [],
      types: [],
      sizes: [],
      loading: false,
      data: {
        size: '',
        type: '',
        location: 'Storage',
        assignedTo: '',
        maintenanceNotes: '',
        conditionNotes: '',
        condition: 5,
        quality: 5,
      },
    }
  },
  async created() {
    console.log(this.newInstrumentNumber.length)
    if (this.newInstrumentNumber.length > 0) {
      this.mode = 'creating'
      if (this.newInstrumentNumber[0] === 'C') {
        this.data.type = 'Cello'
        this.guessSize(1)
      } else if (this.newInstrumentNumber[0] === 'V') {
        this.data.type = 'Viola'
        this.guessSize(1)
      } else if (this.newInstrumentNumber[0] === 'B') {
        this.data.type = 'Bass'
        this.guessSize(1)
      } else {
        this.data.type = 'Violin'
        this.guessSize(0)
      }
      this.data.conditionNotes = `Tagged in on ${(new Date()).toLocaleDateString()}`
    } else if (this.currentInstrument) {
      this.mode = 'editing'
      this.data = { ...this.currentInstrument }
    } else {
      this.$toasted.error('Error: must have either current instrument or new instrument', { duration: 2000 })
    }
    if (this.locations.length === 0) {
      try {
        const { locations, types, sizes } = await API.get('instrument-inventory', 'schema/ac-options', {})
        this.locations = locations
        this.types = types
        this.sizes = sizes
      } catch (e) {
        this.$toasted.error(`Error ${e.response.data}`, { duration: 2000 })
      }
    }
  },
  methods: {
    ...mapMutations(['clearNewInstrumentNumber', 'setCurrentInstrument', 'updateCurrentInstrument']),
    async onSubmit() {
      this.loading = true
      if (this.mode === 'creating') {
        await this.submitCreate()
      } else if (this.mode === 'editing') {
        await this.submitEdit()
      }
    },
    async submitCreate() {
      try {
        const response = await API.post('instrument-inventory', 'instruments', {
          body: {
            ...this.data,
            number: this.newInstrumentNumber,
          },
        })
        this.loading = false
        this.$toasted.info(`Instrument ${response.item.number} created`, { duration: 2000 })
        this.clearNewInstrumentNumber()
        this.setCurrentInstrument(response.item)
        // this.$emit('instrumentCreated', response)
      } catch (e) {
        this.$toasted.info(e.response.data, { duration: 2000 })
      }
    },
    async submitEdit() {
      try {
        const response = await API.put('instrument-inventory', `instruments/${this.data.id}`, {
          body: {
            ...this.data,
          },
        })
        this.updateCurrentInstrument(response.item)
        this.$emit('editSuccess', response.item)
      } catch (e) {
        console.error(e)
        this.$toasted.show(`Error: ${e.response.data}`)
      }
    },
    guessSize(idx) {
      // get the size portion of the inventory number to predict the size of the instrument.
      const sizeNum = this.newInstrumentNumber.substr(idx).split('-')[0]
      switch (sizeNum) {
        case '1':
          this.data.size = '4/4'
          break
        case '2':
          this.data.size = '1/2'
          break
        case '3':
          this.data.size = '3/4'
          break
        case '4':
          this.data.size = '4/4'
          break
        case '8':
          this.data.size = '1/8'
          break
        case '10':
          this.data.size = '1/10'
          break
        case '16':
          this.data.size = '1/16'
          break
        case '11':
          this.data.size = '11"'
          break
        case '12':
          this.data.size = '12"'
          break
        case '13':
          this.data.size = '13"'
          break
        case '14':
          this.data.size = '14"'
          break
        case '15':
          this.data.size = '15"'
          break
        default:
          this.data.size = ''
      }
    },
  },
  computed: mapState(['newInstrumentNumber', 'currentInstrument']),
}
</script>

