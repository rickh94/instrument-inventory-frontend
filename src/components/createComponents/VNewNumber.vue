<template>
  <div>
    <label for="number" class="text-gray-800 font-bold text-xl mb-1">New Instrument Number</label>
    <div class="flex items-start justify-between mt-2 mb-1">
      <div class="border-b focus-within:border-purple-300 border-gray-800 w-24 flex-grow flex items-center space-between">
        <input type="text"
               name="number"
               id="number"
               class="appearance-none bg-transparent border-none w-full text-gray-800 mr-3 py-1 leading-tight focus:outline-none"
               v-model="number"
               @keyup.enter="onSubmit"
        >
        <button class="appearance-none" title="Scan Barcode" @click="scanner = true">
          <font-awesome-icon icon="barcode" class="mr-4"></font-awesome-icon>
        </button>
        <v-spinner v-if="loading" line-fg-color="#805ad5"></v-spinner>
        <button v-else @click="onSubmit"
                class="appearance-none ml-4 text-white font-bold px-4 py-1"
                :class="number.length === 0 ? 'bg-gray-600' : 'bg-purple-600 hover:shadow hover:bg-purple-800'"
                :disabled="number.length === 0"
        >
          Check
        </button>
      </div>
    </div>
    <v-scanner @detected="detected" v-if="scanner" @close="scanner = false"></v-scanner>
  </div>
</template>

<script>
import VScanner from '@/components/UI/VScanner'
import { API } from 'aws-amplify'
import { mapMutations } from 'vuex'

export default {
  components: { VScanner },
  name: 'VNewNumber',
  data() {
    return {
      number: '',
      scanner: false,
      loading: false,
    }
  },
  methods: {
    ...mapMutations(['setNewInstrumentNumber']),
    async onSubmit() {
      this.loading = true
      try {

        await API.post('instrument-inventory', 'search/number', { body: { term: this.number } })
        this.$toasted.info('This number is already taken', { duration: 2000 })
      } catch (e) {
        if (e.response.status === 404) {
          this.setNewInstrumentNumber(this.number)
        } else {
          this.$toasted.error('Error: Something has gone wrong', { duration: 2000 })
        }
      }
      this.loading = false
    },
    detected(result) {
      if (result.codeResult.code !== this.searchTerm) {
        this.searchTerm = result.codeResult.code
        this.scanner = false
      }
      this.onSubmit()
    },
  },
}
</script>

<style scoped>

</style>
