<template>
  <div class="max-w-4xl shadow p-3 m-5" :class="flash ? 'bg-green-300' : 'bg-white'">
    <h4 class="text-gray-800 font-bold text-xl mb-1">Retrieve Multiple Instruments</h4>
    <form @submit.prevent="onSubmit" autocomplete="off">
      <label for="number" class="text-sm text-gray-800 mb-2">Instrument Number</label>
      <div class="flex items-start justify-between mt-2 mb-1">
        <div class="border-b focus-within:border-purple-300 border-gray-800 w-24 flex-grow flex items-center space-between">
          <input type="text"
                 name="number"
                 id="number"
                 class="appearance-none bg-transparent border-none w-full text-gray-800 mr-1 py-1 leading-tight focus:outline-none"
                 v-model="currentNumber"
                 @keydown.enter.prevent=""
                 @keyup.enter.prevent="onAdd"
          >
          <button class="appearance-none" title="Scan Barcode" @click.prevent="scanner = true">
            <font-awesome-icon icon="barcode" class="mx-2"></font-awesome-icon>
          </button>
        </div>
        <button @click.prevent="onAdd" class="appearance-none rounded ml-4 text-white font-bold px-4 py-1"
                :class="currentNumber.length === 0 ? 'bg-gray-600' : 'bg-purple-600 hover:shadow hover:bg-purple-800'"
                :disabled="currentNumber.length === 0"
        >
          Add
        </button>
      </div>
      <v-scanner @detected="detected" v-if="scanner" @close="scanner = false"></v-scanner>
      <div class="flex justify-around"><h4 class="text-xl font-bold">Instruments to Retrieve</h4></div>
        <transition-group name="tag" tag="div" class="flex flex-wrap mx-auto max-w-xl" mode="out-in">
          <button v-for="instrument in instruments"
                  @click.prevent="remove(instrument)"
                  :key="instrument"
                  class="bg-purple-300 flex m-1 justify-between items-center rounded-full px-4 py-2 shadow hover:shadow-lg hover:bg-red-300"
                  title="Click to remove">
          <span class="block mr-1">{{ instrument }}</span>
          <font-awesome-icon icon="trash"></font-awesome-icon>
        </button>
        </transition-group>
      <v-spinner v-if="loading" line-fg-color="#805ad5"></v-spinner>
      <div v-else class="flex justify-end w-full mt-5">
        <button class="bg-red-600 mx-2 px-8 text-white py-2 shadow hover:bg-red-800 hover:shadow-lg rounded font-bold"
                type="reset"
                @click.prevent="instruments = []">Clear
        </button>
        <button class="bg-purple-600 ml-2 px-8 font-bold text-white py-2 shadow hover:bg-purple-800 hover:shadow-lg rounded"
                type="submit">Retrieve
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import VScanner from '@/components/UI/VScanner'
import { API } from 'aws-amplify'

export default {
  name: 'Retrieve',
  components: { VScanner },
  data() {
    return {
      instruments: [],
      currentNumber: '',
      scanner: false,
      loading: false,
      flash: false,
    }
  },
  methods: {
    async onSubmit() {
      if (this.instruments.length < 1) {
        this.$toasted.error('No Instruments to retrieve', { duration: 2000 })
        return
      }
      try {
        this.loading = true
        const response = await API.post('instrument-inventory', 'retrieve-multiple', {
          body: {
            numbers: this.instruments,
          },
        })
        this.instruments = []
        this.loading = false
        if (response.instrumentsUpdated.length > 0) {
          this.$toasted.success(`Succesfully retrieved ${response.instrumentsUpdated.join(', ')}`, { duration: 4000 })
        }
        if (response.instrumentsFailed.length > 0) {
          this.$toasted.error(`Failed to retrieve ${response.instrumentsFailed.join(', ')}`)
        }
        console.log(response.instrumentsFailed)
      } catch (e) {
        this.loading = false
        this.$toasted.error(e.response.data, { duration: 2000 })
      }
    },
    onAdd() {
      if (this.currentNumber.match(/\w?\d+-\d+/)){
        this.instruments.push(this.currentNumber)
        this.currentNumber = ''
      } else {
        this.$toasted.error("Invalid Instrument number", {duration: 1000})
      }
    },
    detected(result) {
      if (!this.instruments.includes(result.codeResult.code)) {
        this.instruments.push(result.codeResult.code)
        this.flash = true
        setTimeout(() => this.flash = false, 300);
      }
    },
    remove(instrument) {
      this.instruments = this.instruments.filter(item => item !== instrument)
    },
  },
}
</script>

<style scoped>

.tag-enter-active {
  transition: opacity 0.5s;
}

.tag-enter {
  opacity: 0;
}

</style>
