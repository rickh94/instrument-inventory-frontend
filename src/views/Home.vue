<template>
  <div class="w-full">
    <div class="m-5 shadow p-3 h-auto">
      <label for="number" class="text-gray-600 font-bold text-xl mb-1">Instrument Number or Student Name</label>
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
        </div>
      </div>
      <v-scanner @detected="detected" v-if="scanner" @close="scanner = false"></v-scanner>
    </div>
  </div>
</template>

<script>
import VScanner from '@/components/VScanner'

export default {
  name: 'Home',
  components: { VScanner },
  data() {
    return {
      scanner: false,
      searchTerm: '',
    }
  },
  methods: {
    detected(result) {
      if (result.codeResult.code !== this.searchTerm) {
        this.searchTerm = result.codeResult.code
        this.scanner = false
      }
      this.searchNumber()
    },
    searchNumber() {
      console.log('number', this.searchTerm)
    },
    searchName() {
      console.log('number', this.searchTerm)
    },
  },
}
</script>

<style>
</style>
