<template>
  <div class="w-full">
    <div class="m-5 shadow p-3 h-auto">
      <label for="number" class="text-gray-800 font-bold text-xl mb-1">Instrument Number or Student Name</label>
      <div class="flex items-start justify-between mt-2 mb-1">
        <div class="border-b focus-within:border-purple-300 border-gray-800 w-24 flex-grow flex items-center space-between">
          <input type="text"
                 name="number"
                 id="number"
                 class="appearance-none bg-transparent border-none w-full text-gray-800 mr-1 py-1 leading-tight focus:outline-none"
                 v-model="searchTerm"
                 @keyup.enter="onSubmit"
          >
          <button class="appearance-none" title="Scan Barcode" @click="scanner = true">
            <font-awesome-icon icon="barcode" class="mx-2"></font-awesome-icon>
          </button>
          <v-spinner v-if="loading" line-fg-color="#805ad5"></v-spinner>
          <button v-else @click="onSubmit"
                  class="appearance-none ml-4 text-white font-bold px-4 py-1"
                  :class="searchTerm.length === 0 ? 'bg-gray-600' : 'bg-purple-600 hover:shadow hover:bg-purple-800'"
                  :disabled="searchTerm.length === 0"
          >
            Submit
          </button>
        </div>
      </div>
      <v-scanner @detected="detected" v-if="scanner" @close="scanner = false"></v-scanner>
    </div>
    <multiple-results v-show="searchResults.length > 1" />
    <v-modal v-if="showNotFound" @close="showNotFound = false" width-class="sm:max-w-lg">
      <h6 class="text-xl font-bold text-gray-900">Not Found</h6>
      <p class="text-gray-900">Could not find instrument {{ searchTerm }}. Would you like to create a new
        instrument?</p>
      <div class="flex justify-end mt-2 flex-row">
        <button class="mx-1 appearance-none bg-red-600 text-white px-4 py-1 shadow rounded hover:bg-red-800 hover:shadow-lg"
                @click="showNotFound = false">
          Close
        </button>
        <button class="mx-1 appearance-none bg-green-600 text-white px-4 py-1 shadow rounded hover:bg-green-800 hover:shadow-lg"
                @click="beginCreateInstrument">Create
        </button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import VScanner from '@/components/VScanner'
import { API } from 'aws-amplify'
import { mapMutations, mapState } from 'vuex'
import MultipleResults from '@/components/MultipleResults'
import VModal from '@/components/VModal'

function getPath(input) {
  // This regex will match the instrument number format and search for an instrument number.
  // If it does not match, it is assumed to be a name and searches in assigned and history.
  return input.match(/\w?\d+-\d+/) ? 'search/number' : 'search/assigned-history'
}

export default {
  name: 'Home',
  components: { VModal, MultipleResults, VScanner },
  data() {
    return {
      scanner: false,
      searchTerm: '',
      showNotFound: false,
      dialogOptions: {},
      loading: false,
    }
  },
  methods: {
    ...mapMutations(['setSearchResults', 'setCurrentInstrument', 'setNewInstrumentNumber']),
    detected(result) {
      if (result.codeResult.code !== this.searchTerm) {
        this.searchTerm = result.codeResult.code
        this.scanner = false
      }
      this.onSubmit()
    },
    async onSubmit() {
      const path = getPath(this.searchTerm)
      try {
        this.loading = true
        const response = await API.post('instrument-inventory', path, { body: { term: this.searchTerm } })
        this.loading = false
        this.setSearchResults(response.filter(item => !item.archived))
        if (this.searchResults.length === 1) {
          this.$toasted.info('Instrument Found', { duration: 2000 })
          this.showDialog = true
          this.setCurrentInstrument(this.searchResults[0])
        } else {
          this.$toasted.info('Multiple Instruments Found', { duration: 2000 })
        }
      } catch (e) {
        this.loading = false
        if (e.response.status === 404) {
          if (path === 'search/number') {
            this.showNotFound = true
          } else {
            // TODO: configure toasted so it doesn't suck
            this.$toasted.error(`Could not find instrument assigned to ${this.searchTerm}`, { duration: 2000 })
          }
        } else {
          this.$toasted.error(`Error: ${e.response.data}`, { duration: 2000 })
        }
      }
    },
    beginCreateInstrument() {
      this.setNewInstrumentNumber(this.searchTerm)
      this.$router.push('/new')
    },
  },
  computed: mapState(['searchResults']),
}
</script>

