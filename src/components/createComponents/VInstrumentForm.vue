<template>
  <div class="w-full">
    <div class="flex justify-between mb-2">
      <h4 v-if="mode === 'creating'" class="text-2xl font-bold text-gray-800">Create {{ newInstrumentNumber }}</h4>
      <h4 v-else-if="mode === 'editing'" class="text-2xl font-bold text-gray-800">Edit {{ data.number }}</h4>
      <h4 v-else class="text-2xl font-bold text-red-800">Invalid Mode</h4>
    </div>
    <form @submit.prevent="onSubmit">
      <v-form-control label="Size" label-for="size">
        <v-autocomplete id="size" v-model="data.size" :completion-options="acOptions.sizes"></v-autocomplete>
      </v-form-control>
      <v-form-control label="Type" label-for="type">
        <v-autocomplete id="type" v-model="data.type" :completion-options="acOptions.types"></v-autocomplete>
      </v-form-control>
      <v-form-control label="Location" label-for="location">
        <v-autocomplete id="location"
                        :completion-options="acOptions.locations"
                        v-model="data.location"></v-autocomplete>
      </v-form-control>
      <v-form-control label="Assigned To" label-for="assigned-to">
        <input type="text"
               name="assigned-to"
               v-model="data.assignedTo"
               id="assigned-to"
               class="appearance-none bg-transparent border-none text-gray-900 focus:text-purple-800 w-full py-1 leading-tight">
      </v-form-control>
      <v-form-control label="Notes" label-for="condition-notes">
      <textarea
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
      <div class="w-full flex justify-end mt-4 mb-2" v-if="loading">
        <bar-loader class="w-56 mx-2" color="#7c3aed"></bar-loader>
      </div>
      <div v-else class="flex justify-end w-full mt-5">
        <v-cancel-button v-if="mode === 'editing'" @cancel="$emit('cancel')" />
        <button v-else
                class="font-bold inline-flex items-center mx-2 bg-red-600 px-3 text-white py-2 shadow hover:bg-red-800 hover:shadow-lg rounded"
                @click="clearNewInstrumentNumber()">
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                  clip-rule="evenodd" />
          </svg>
          Change Number
        </button>
        <button
          class="inline-flex items-center font-bold bg-purple-600 px-3 text-white py-2 shadow hover:bg-purple-800 hover:shadow-lg rounded mx-2"
          type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
          </svg>
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import VAutocomplete from "@/components/UI/VAutocomplete.vue";
import { mapMutations, mapState } from "vuex";
import VFormControl from "@/components/UI/VFormControl.vue";
import { BarLoader } from "@saeris/vue-spinners";
import acOptions from "@/mixins/acOptions";
import VCancelButton from "@/components/UI/buttons/VCancelButton.vue";
import { createInstrument } from "@/services/createInstrument";
import { GenericOutcome, Instrument } from "@/util/commonTypes";
import { editInstrument } from "@/services/updateInstrument";
import Component, { mixins } from "vue-class-component";

interface FormData {
  size: string,
  type: string,
  location: string,
  assignedTo?: string,
  maintenanceNotes?: string,
  conditionNotes?: string,
  condition?: number,
  quality?: number,
  id?: string
  number?: string,
}

@Component({
  components: { VCancelButton, VFormControl, VAutocomplete, BarLoader },
  methods: mapMutations(["clearNewInstrumentNumber", "setCurrentInstrument", "updateCurrentInstrument"]),
  computed: mapState(["newInstrumentNumber", "currentInstrument"])
})
export default class VInstrumentForm extends mixins(acOptions) {
  mode: "creating" | "editing" = "creating";
  loading = false;
  data: FormData = {
    size: "",
    type: "",
    location: "Storage",
    assignedTo: "",
    maintenanceNotes: "",
    conditionNotes: "",
    condition: 5,
    quality: 5
  };

  // mutations
  clearNewInstrumentNumber!: () => void;
  setCurrentInstrument!: (any) => void;
  updateCurrentInstrument!: (any) => void;

  // state
  newInstrumentNumber!: string;
  currentInstrument!: Instrument | undefined | null;

  async created(): Promise<void> {
    if (this.newInstrumentNumber.length > 0) {
      this.mode = "creating";
      switch (this.newInstrumentNumber[0]) {
        case "C":
          this.data.type = "Cello";
          this.guessSize(1);
          break;
        case "V":
          this.data.type = "Viola";
          this.guessSize(1);
          break;
        case "B":
          this.data.type = "Bass";
          this.guessSize(1);
          break;
        case "K":
          this.data.type = "Keyboard";
          this.data.size = "N/A";
          break;
        case "D":
          this.data.type = "Drum";
          this.data.size = "N/A";
          break;
        case "O":
          this.data.type = "Orff Instrument";
          this.data.size = "N/A";
          break;
        default:
          this.data.type = "Violin";
          this.guessSize(0);
          break;
      }
      this.data.conditionNotes = `Tagged in on ${(new Date()).toLocaleDateString()}`;
    } else if (this.currentInstrument) {
      this.mode = "editing";
      this.data = { ...this.currentInstrument };
    } else {
      this.$toasted.error("Error: must have either current instrument or new instrument", { duration: 2000 });
    }
    const error = await this.getACOptions();
    if (error) {
      this.$toasted.error(error, { duration: 2000 });
    }
  }

  async onSubmit(): Promise<void> {
    this.loading = true;
    if (this.mode === "creating") {
      await this.submitCreate();
    } else if (this.mode === "editing") {
      await this.submitEdit();
    }
  }

  async submitCreate(): Promise<void> {
    const [outcome, message, instrument] = await createInstrument({ ...this.data, number: this.newInstrumentNumber });
    this.loading = false;
    switch (outcome) {
      case GenericOutcome.Ok:
        this.$toasted.info(message, { duration: 2000 });
        this.clearNewInstrumentNumber();
        this.setCurrentInstrument(instrument);
        break;
      case GenericOutcome.Err:
        this.$toasted.error(message, { duration: 2000 });
        break;
      default:
        this.$toasted.error("Something went wrong", { duration: 2000 });
    }
  }

  async submitEdit(): Promise<void> {
    if (!this.data.id) {
      this.$toasted.error("Cannot edit instrument without ID");
      return;
    }
    if (!this.data.number) {
      this.$toasted.error("Cannot edit instrument without number");
      return;
    }
    // what a dumb hack to make typescript shut up. Something about guards and
    // accessing properties explicitly?
    const [outcome, message, updatedInstrument] = await editInstrument(this.data.id, {
      ...this.data,
      number: this.data.number
    });
    this.loading = false;
    switch (outcome) {
      case GenericOutcome.Ok:
        this.updateCurrentInstrument(updatedInstrument);
        this.$emit("editSuccess", updatedInstrument);
        this.$toasted.info(message);
        break;
      case GenericOutcome.Err:
        this.$toasted.error(`Error: ${message}`, { duration: 2000 });
        break;
      default:
        this.$toasted.error("Something went wrong", { duration: 2000 });
    }
  }

  guessSize(idx: number): void {
    // get the size portion of the inventory number to predict the size of the instrument.
    const sizeNum = this.newInstrumentNumber.substr(idx).split("-")[0];
    switch (sizeNum) {
      case "1":
        this.data.size = "4/4";
        break;
      case "2":
        this.data.size = "1/2";
        break;
      case "3":
        this.data.size = "3/4";
        break;
      case "4":
        this.data.size = "1/4";
        break;
      case "8":
        this.data.size = "1/8";
        break;
      case "10":
        this.data.size = "1/10";
        break;
      case "16":
        this.data.size = "1/16";
        break;
      case "11":
        this.data.size = "11\"";
        break;
      case "12":
        this.data.size = "12\"";
        break;
      case "13":
        this.data.size = "13\"";
        break;
      case "14":
        this.data.size = "14\"";
        break;
      case "15":
        this.data.size = "15\"";
        break;
      default:
        this.data.size = "";
    }
  }
}

</script>

