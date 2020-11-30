<template>
  <div class="max-w-4xl m-5 shadow p-3">
    <h4 class="text-xl font-bold text-gray-900">Sign Out Instrument</h4>
    <form @submit.prevent="onSubmit">
      <v-form-control label="Instrument Number" label-for="number">
        <div class="flex items-center">
          <input type="text"
                 class="appearance-none bg-transparent border-none w-full mr-1 py-1 leading-tight focus:outline-none"
                 v-model="number"
          >
          <button class="appearance-none mr-2" title="Scan Barcode" @click="scanner = true">
            <font-awesome-icon icon="barcode"></font-awesome-icon>
          </button>
        </div>
      </v-form-control>
      <v-scanner v-if="scanner" @close="scanner = false" @detected="detected"></v-scanner>
      <v-form-control label="Assigned To" label-for="assigned-to">
        <input type="text"
               v-model="assignedTo"
               class="appearance-none bg-transparent border-none w-full py-1 leading-tight focus:outline-none">
      </v-form-control>
      <v-form-control label="Location" label-for="location">
        <v-autocomplete id="location" :options="locations" v-model="location"></v-autocomplete>
      </v-form-control>
      <v-spinner v-if="loading" line-fg-color="#805ad5"></v-spinner>
      <div v-else class="flex justify-around mt-5">
        <button @click.prevent="clear"
                type="reset"
                class="mx-2 bg-yellow-600 w-full md:w-auto px-8 text-white py-2 shadow hover:bg-yellow-800 hover:shadow-lg rounded">
          Clear
        </button>
        <button class="bg-purple-600 px-8 text-white py-2 shadow hover:bg-purple-800 hover:shadow-lg rounded mx-2"
                type="submit">Submit
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import VAutocomplete from '@/components/UI/VAutocomplete'
import VFormControl from '@/components/UI/VFormControl'
import VScanner from '@/components/UI/VScanner'
import { mapMutations, mapState } from 'vuex'
import { API } from 'aws-amplify'

export default {
  name: 'v-sign-out-single',
  components: { VAutocomplete, VFormControl, VScanner },
  async created() {
    if (this.currentInstrument) {
      this.number = this.currentInstrument.number
      this.clearCurrentInstrument()
    }
    if (this.locations.length === 0) {
      try {
        this.loading = true
        const { locations } = await API.get('instrument-inventory', 'schema/ac-options', {})
        this.loading = false
        this.locations = locations
      } catch (e) {
        console.error(e)
        this.$toasted.error(`Error: ${e.response.data}`)
      }
    }
  },
  data() {
    return {
      number: '',
      assignedTo: '',
      location: '',
      scanner: false,
      locations: [],
      loading: false,
    }
  },
  methods: {
    ...mapMutations(['clearCurrentInstrument', 'updateCurrentInstrument']),
    async onSubmit() {
      try {
        const { number, assignedTo, location } = this
        if (number.length === 0 || assignedTo.length === 0 || location.length === 0) {
          this.$toasted.error('Missing information', { duration: 2000 })
          return
        }
        this.loading = true
        const response = await API.post('instrument-inventory', 'sign-out', {
          body: {
            number, assignedTo, location,
          },
        })
        this.$toasted.success(response.message, { duration: 2000 })
        this.clear()
        this.updateCurrentInstrument(response.item)
        this.loading = false
      } catch (e) {
        this.$toasted.error(`Error: ${e.response.data}`, { duration: 2000 })
        console.error(e)
        this.loading = false
      }
    },
    detected(result) {
      if (result.codeResult.code !== this.number) {
        this.number = result.codeResult.code
        this.scanner = false
      }
      this.onSubmit()
    },
    clear() {
      this.number = ''
      this.location = ''
      this.assignedTo = ''
    },
  },
  computed: mapState(['currentInstrument']),
}
</script>
