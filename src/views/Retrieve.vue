<template>
  <div class="max-w-4xl">

    <div class="shadow p-3 m-5" :class="flash ? 'bg-green-300' : 'bg-white'">
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
          <button @click.prevent="onAdd" class="appearance-none rounded ml-4 text-white font-bold px-2 py-1 inline-flex items-center"
                  :class="currentNumber.length === 0 ? 'bg-gray-600' : 'bg-purple-600 hover:shadow hover:bg-purple-800'"
                  :disabled="currentNumber.length === 0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
            </svg>
            Add
          </button>
        </div>
        <v-scanner @detected="detected" v-if="scanner" @close="scanner = false"></v-scanner>
        <div class="my-2" v-show="this.instruments.length > 0"><h4 class="text-xl font-bold">Instruments to Retrieve</h4></div>
        <transition-group name="tag" tag="div" class="flex flex-wrap mx-auto max-w-xl" mode="out-in">
          <button v-for="instrument in instruments"
                  @click.prevent="remove(instrument)"
                  :key="instrument"
                  class="bg-purple-300 flex m-1 justify-between items-center rounded-full px-4 py-2 shadow-sm hover:shadow hover:bg-red-300"
                  title="Click to remove">
            <span class="block mr-1">{{ instrument }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </transition-group>
        <div class="flex justify-end mt-4 mb-2" v-if="loading">
          <bar-loader class="w-56 mr-2" color="#7c3aed"></bar-loader>
        </div>
        <div v-else class="flex justify-end w-full mt-5">
          <button class="bg-red-600 mx-2 px-3 text-white py-2 shadow hover:bg-red-800 hover:shadow-lg rounded font-bold inline-flex items-center"
                  type="reset"
                  @click.prevent="instruments = []">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
            </svg>
            Clear
          </button>
          <button class="bg-purple-600 ml-2 px-3 font-bold text-white py-2 shadow hover:bg-purple-800 hover:shadow-lg rounded inline-flex items-center"
                  type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
              <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
            </svg>
            Retrieve
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { API } from "aws-amplify";
import { BarLoader } from "@saeris/vue-spinners";

export default {
  name: "Retrieve",
  components: { VScanner: () => import("@/components/UI/VScanner"), BarLoader },
  data() {
    return {
      instruments: [],
      currentNumber: "",
      scanner: false,
      loading: false,
      flash: false
    };
  },
  methods: {
    async onSubmit() {
      if (this.instruments.length < 1) {
        this.$toasted.error("No Instruments to retrieve", { duration: 2000 });
        return;
      }
      try {
        this.loading = true;
        const response = await API.post("instrument-inventory", "retrieve-multiple", {
          body: {
            numbers: this.instruments
          }
        });
        this.instruments = [];
        this.loading = false;
        if (response.instrumentsUpdated.length > 0) {
          this.$toasted.success(`Succesfully retrieved ${response.instrumentsUpdated.join(", ")}`, { duration: 4000 });
        }
        if (response.instrumentsFailed.length > 0) {
          this.$toasted.error(`Failed to retrieve ${response.instrumentsFailed.join(", ")}`);
        }
        console.log(response.instrumentsFailed);
      } catch (e) {
        this.loading = false;
        this.$toasted.error(e.response.data, { duration: 2000 });
      }
    },
    onAdd() {
      if (this.currentNumber.match(/\w?\d+-\d+/)) {
        this.instruments.push(this.currentNumber);
        this.currentNumber = "";
      } else {
        this.$toasted.error("Invalid Instrument number", { duration: 1000 });
      }
    },
    detected(result) {
      if (!this.instruments.includes(result.codeResult.code)) {
        this.instruments.push(result.codeResult.code);
        this.flash = true;
        setTimeout(() => this.flash = false, 300);
      }
    },
    remove(instrument) {
      this.instruments = this.instruments.filter(item => item !== instrument);
    }
  }
};
</script>

<style scoped>

.tag-enter-active {
  transition: opacity 0.5s;
}

.tag-enter {
  opacity: 0;
}

</style>
