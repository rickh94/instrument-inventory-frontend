<template>
  <div class="w-full">
    <div class="m-5 shadow p-3 h-auto">
      <label for="number" class="text-gray-800 font-bold text-xl mb-1">Instrument Number or Student Name</label>
      <div class="flex items-start justify-between mt-2 mb-1">
        <div class="border-b focus-within:border-purple-300 border-gray-800 w-24 flex-grow flex items-center space-between">
          <input type="text"
                 name="number"
                 id="number"
                 class="appearance-none bg-transparent border-none w-full text-gray-800 mr-3 py-1 leading-tight focus:outline-none"
                 v-model="searchTerm"
          >
          <button class="appearance-none" title="Scan Barcode" @click="scanner = true">
            <font-awesome-icon icon="barcode" class="mr-4"></font-awesome-icon>
          </button>
          <button @click="onSubmit"
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
    <multiple-results v-show="$store.state.searchResults.length > 1"/>
<!--  TODO: add not found options  -->
  </div>
</template>

<script>
  import VScanner from '@/components/VScanner'
  import { API } from 'aws-amplify'
  import { mapMutations } from 'vuex'
  import MultipleResults from '@/components/MultipleResults'

  function getPath(input) {
    // This regex will match the instrument number format and search for an instrument number.
    // If it does not match, it is assumed to be a name and searches in assigned and history.
    return input.match(/\w?\d+-\d+/) ? 'search/number' : 'search/assigned-history'
  }

  export default {
    name: 'Home',
    components: { MultipleResults, VScanner },
    data() {
      return {
        scanner: false,
        searchTerm: '',
        showNotFound: false,
        dialogOptions: {},
      }
    },
    methods: {
      ...mapMutations(['setSearchResults', 'setCurrentInstrument']),
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
          const response = await API.post('instrument-inventory', path, { body: { term: this.searchTerm } })
          this.setSearchResults(response)
          console.log(this.$store.state.searchResults)
          if (this.$store.state.searchResults.length === 1) {
            this.$toasted.show('Instrument Found')
            this.showDialog = true
            this.setCurrentInstrument(this.$store.state.searchResults[0])
          } else {
            this.$toasted.show('Multiple Instruments Found')
          }
        } catch (e) {
          console.log(e.response)
          if (e.response.status === 404) {
            this.showNotFound = true
          } else {
            this.$toasted.show(`Error: ${e.response.data}`)
          }
        }
      },
    },
  }
</script>

