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
      </div>
      <button @click="onSubmit"
              class="appearance-none rounded ml-4 text-white font-bold"
              :class="number.length === 0 ? 'bg-gray-600' : 'bg-purple-600 hover:shadow hover:bg-purple-800'"
              :disabled="number.length === 0"
      >
        <pulse-loader v-if="loading" color="#fff" size="8" class="px-3 py-1"></pulse-loader>
        <span v-else class="inline-flex items-center pl-2 pr-3 py-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
          </svg>
          Check
        </span>
      </button>
    </div>
    <v-scanner @detected="detected" v-if="scanner" @close="scanner = false"></v-scanner>
    <div class="mt-4">
      <h2 class="text-gray-800 text-xl mb-1">
        <em class="italic">or</em>
        <strong class="font-bold">
          Get Next Number
        </strong>
      </h2>
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mt-2 mb-1">
        <v-form-control label="Size" label-for="size">
          <v-autocomplete id="size" v-model="nextSize" :completion-options="acOptions.sizes"></v-autocomplete>
        </v-form-control>
        <v-form-control label="Type" label-for="type">
          <v-autocomplete id="type" v-model="nextType" :completion-options="acOptions.types"></v-autocomplete>
        </v-form-control>
        <button class="mx-auto flex items-center sm:mx-1 sm:inline-flex appearance-none rounded mb-2 text-white font-bold px-3 py-1"
                @click.prevent="getNumber"
                :class="(nextSize && nextType) ? 'bg-purple-600 hover:shadow hover:bg-purple-800' : 'bg-gray-600'"
                :disabled="!(nextSize && nextType)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2h-1.528A6 6 0 004 9.528V4z" />
            <path fill-rule="evenodd"
                  d="M8 10a4 4 0 00-3.446 6.032l-1.261 1.26a1 1 0 101.414 1.415l1.261-1.261A4 4 0 108 10zm-2 4a2 2 0 114 0 2 2 0 01-4 0z"
                  clip-rule="evenodd" />
          </svg>
          Get Number
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import VScanner from "@/components/UI/VScanner";
import { mapMutations } from "vuex";
import { PulseLoader } from "@saeris/vue-spinners";
import VFormControl from "@/components/UI/VFormControl";
import VAutocomplete from "@/components/UI/VAutocomplete";
import acOptions from "@/mixins/acOptions";
import { WithLoading, WithScanner } from "@/util/componentTypes";
import { checkNewNumber, DoesInstrumentExist, getNextNumber } from "@/services/getInstruments";
import { GenericOutcome } from "@/util/commonTypes";

interface ComponentState extends WithLoading, WithScanner {
  number: string,
  nextSize: string,
  nextType: string,
}

export default Vue.extend({
  components: { VAutocomplete, VFormControl, VScanner, PulseLoader },
  mixins: [acOptions],
  name: "VNewNumber",
  data(): ComponentState {
    return {
      number: "",
      scanner: false,
      loading: false,
      nextSize: "",
      nextType: ""
    };
  },
  async created() {
    const error = await this.getACOptions();
    if (error) {
      this.$toasted.error(error, { duration: 2000 });
    }
  },
  methods: {
    ...mapMutations(["setNewInstrumentNumber"]),
    async onSubmit() {
      // this guards against click the enabled button that is showing the
      // loading animation
      if (this.loading) {
        return;
      }
      const [exists, message] = await checkNewNumber(this.number);
      this.loading = false;

      switch (exists) {
        case DoesInstrumentExist.Yes:
          this.$toasted.info(message, { duration: 2000 });
          this.number = "";
          break;
        case DoesInstrumentExist.No:
          this.$toasted.info(message, { duration: 2000 });
          this.setNewInstrumentNumber(this.number);
          break;
        case DoesInstrumentExist.Err:
          this.$toasted.error(message, { duration: 2000 });
          break;
        default:
          this.$toasted.error("Something went wrong", { duration: 2000 });
      }
    },
    detected(result) {
      if (result.codeResult.code !== this.number) {
        this.number = result.codeResult.code;
        this.scanner = false;
        this.onSubmit();
      }
    },
    async getNumber() {
      this.loading = true;
      const [outcome, nextNumber, message] = await getNextNumber(this.nextType, this.nextSize);
      switch (outcome) {
        case GenericOutcome.Ok:
          this.setNewInstrumentNumber(nextNumber);
          this.$toasted.success(message, { duration: 1000 });
          break;
        case GenericOutcome.Err:
          this.$toasted.error(message, { duration: 2000 });
          this.nextSize = "";
          this.nextType = "";
          break;
        default:
          this.$toasted.error("Something went wrong", { duration: 2000 });
      }
    }
  }
});
</script>

<style scoped>

</style>
