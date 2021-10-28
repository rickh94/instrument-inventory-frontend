<template>
  <div :class="flash ? 'bg-green-300' : 'bg-white'">
    <h4 class="text-gray-800 font-bold text-xl mb-1">Move Instruments</h4>
    <form @submit.prevent="onSubmit" autocomplete="off">
      <v-form-control label="Location">
        <v-autocomplete :completion-options="acOptions.locations" v-model="location" required></v-autocomplete>
      </v-form-control>
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
        <button @click.prevent="onAdd"
                class="appearance-none rounded ml-4 text-white font-bold px-2 py-1 inline-flex items-center"
                :class="currentNumber.length === 0 ? 'bg-gray-600' : 'bg-purple-600 hover:shadow hover:bg-purple-800'"
                :disabled="currentNumber.length === 0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clip-rule="evenodd" />
          </svg>
          Add
        </button>
      </div>
      <v-scanner @detected="detected" v-if="scanner" @close="scanner = false"></v-scanner>
      <div class="my-2 max-w-xl mx-auto" v-show="this.instrumentNumbers.length > 0"><h4 class="text-xl font-bold">
        Instruments to Move</h4></div>
      <transition-group name="tag" tag="div" class="flex flex-wrap mx-auto max-w-xl" mode="out-in">
        <button v-for="instrument in instrumentNumbers"
                @click.prevent="remove(instrument)"
                :key="instrument"
                class="bg-purple-300 flex m-1 justify-between items-center rounded-full px-4 py-2 shadow-sm hover:shadow hover:bg-red-300"
                title="Click to remove">
          <span class="block mr-1">{{ instrument }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
          </svg>
        </button>
      </transition-group>
      <div class="flex justify-end mt-4 mb-2" v-if="loading">
        <bar-loader class="w-56 mr-2" color="#7c3aed"></bar-loader>
      </div>
      <div v-else class="flex justify-end w-full mt-5">
        <button class="bg-red-600 mx-2 px-3 text-white py-2 shadow hover:bg-red-800 hover:shadow-lg rounded font-bold inline-flex items-center"
                type="reset"
                @click.prevent="instrumentNumbers = []">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                  clip-rule="evenodd" />
          </svg>
          Clear
        </button>
        <button class="bg-purple-600 ml-2 px-3 font-bold text-white py-2 shadow hover:bg-purple-800 hover:shadow-lg rounded inline-flex items-center"
                type="submit">
          <svg xmlns="http://www.w3.org/2000/svg"
               class="h-6 w-6 mr-1"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Move
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import Component, { mixins } from "vue-class-component";
import { BarLoader } from "@saeris/vue-spinners";
import { GenericOutcome } from "@/util/commonTypes";
import VFormControl from "@/components/UI/VFormControl.vue";
import VAutocomplete from "@/components/UI/VAutocomplete.vue";
import acOptions from "@/mixins/acOptions";
import { moveMultiple } from "@/services/move";

enum AddOutcomes {
  Added = "ADDED",
  Invalid = "INVALID",
  Duplicate = "DUPLICATE"
}


@Component({
  components: { VAutocomplete, VFormControl, VScanner: () => import("@/components/UI/VScanner.vue"), BarLoader },
})
export default class Move extends mixins(acOptions) {
  instrumentNumbers: string[] = [];
  currentNumber = "";
  scanner = false;
  loading = false;
  flash = false;
  location = "";

  async created(): Promise<void> {
    await this.getACOptions();
  }

  async onSubmit(): Promise<void> {
    if (this.instrumentNumbers.length < 1) {
      this.$toasted.error("No Instruments to move", { duration: 2000 });
      return;
    }

    this.loading = true;
    const [outcome, result] = await moveMultiple(this.instrumentNumbers, this.location);
    this.loading = false;

    switch (outcome) {
      case GenericOutcome.Ok:
        this.handleUpdated(result.instrumentsUpdated);
        this.handleFailed(result.instrumentsFailed);
        break;
      case GenericOutcome.Err:
        this.$toasted.error(`Error: ${result}`, { duration: 2000 });
        console.error(result);
        break;
      default:
        this.$toasted.error("Something went wrong", { duration: 1000 });
    }
  }

  handleUpdated(updatedNumbers: string[]): void {
    if (updatedNumbers.length > 0) {
      this.$toasted.success(`Successfully moved ${updatedNumbers.join(", ")}`, { duration: 4000 });
    }
  }

  handleFailed(failedNumbers: string[]): void {
    if (failedNumbers.length > 0) {
      this.$toasted.success(`Failed to move ${failedNumbers.join(", ")}`, { duration: 4000 });
    }
  }

  onAdd(): void {
    switch (this.doAdd(this.currentNumber)) {
      case AddOutcomes.Added:
        this.currentNumber = "";
        break;
      case AddOutcomes.Duplicate:
        this.currentNumber = "";
        this.$toasted.info("Instrument already added", { duration: 900 });
        break;
      case AddOutcomes.Invalid:
        this.$toasted.error("Invalid Instrument number", { duration: 1000 });
        break;
      default:
        this.$toasted.error("Something went wrong", { duration: 1000 });
    }
  }

  detected(result: { codeResult: { code: string } }): void {
    switch (this.doAdd(result.codeResult.code)) {
      case AddOutcomes.Added:
        this.doFlash();
        break;
      case AddOutcomes.Duplicate:
      case AddOutcomes.Invalid:
        break;
      default:
        this.$toasted.error("Something went wrong", { duration: 1000 });
    }
  }

  remove(instrument: string): void {
    this.instrumentNumbers = this.instrumentNumbers.filter(item => item !== instrument);
  }

  doFlash(timeout = 300): void {
    this.flash = true;
    setTimeout(() => this.flash = false, timeout);
  }

  doAdd(number: string): AddOutcomes {
    if (!number.match(/\w*\d*-\d+/)) {
      return AddOutcomes.Invalid;
    }
    if (this.instrumentNumbers.includes(number)) {
      return AddOutcomes.Duplicate;
    }
    this.instrumentNumbers.push(number);
    return AddOutcomes.Added;
  }
}
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>

.tag-enter-active {
  transition: opacity 0.5s;
}

.tag-enter {
  opacity: 0;
}

</style>
