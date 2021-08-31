<template>
  <div class="max-w-4xl m-5 shadow p-3">
    <h4 class="text-xl font-bold text-gray-900 mb-1">Assign Instrument</h4>
    <form @submit.prevent="onSubmit">
      <v-form-control label="Instrument Number" label-for="number">
        <div class="flex items-center">
          <input type="text"
                 class="appearance-none bg-transparent border-none w-full mr-1 py-1 leading-tight focus:outline-none"
                 v-model="number"
          >
          <button class="appearance-none mr-2" title="Scan Barcode" @click.prevent="scanner = true">
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
      <div class="flex justify-end mt-4 mb-2" v-if="loading">
        <bar-loader class="w-56 mr-2" color="#7c3aed"></bar-loader>
      </div>
      <div v-else class="flex justify-end mt-5">
        <button @click.prevent="clear"
                type="reset"
                class="mx-2 bg-red-600 px-3 text-white  py-2 shadow hover:bg-red-800 hover:shadow-lg rounded inline-flex items-center font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
          </svg>
          Clear
        </button>
        <button class="bg-purple-600 px-4 text-white py-2  shadow hover:bg-purple-800 hover:shadow-lg rounded mx-2 inline-flex items-center font-bold"
                type="submit">

          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
          </svg>
          Assign
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import VAutocomplete from "@/components/UI/VAutocomplete";
import VFormControl from "@/components/UI/VFormControl";
import VScanner from "@/components/UI/VScanner";
import { mapMutations, mapState } from "vuex";
import { API } from "aws-amplify";
import { BarLoader } from "@saeris/vue-spinners";

export default {
  name: "v-sign-out-single",
  components: { VAutocomplete, VFormControl, VScanner, BarLoader },
  async created() {
    if (this.currentInstrument) {
      this.number = this.currentInstrument.number;
      this.clearCurrentInstrument();
    }
    if (this.locations.length === 0) {
      try {
        this.loading = true;
        const { locations } = await API.get("instrument-inventory", "schema/ac-options", {});
        this.loading = false;
        this.locations = locations;
      } catch (e) {
        this.loading = false;
        console.error(e);
        if (e.response.data) {
          this.$toasted.error(`Error: ${e.response.data}`);
        } else {
          this.$toasted.error(e.toString());
        }
      }
    }
  },
  data() {
    return {
      number: "",
      assignedTo: "",
      location: "",
      scanner: false,
      locations: [],
      loading: false
    };
  },
  methods: {
    ...mapMutations(["clearCurrentInstrument", "updateCurrentInstrument"]),
    async onSubmit() {
      try {
        const { number, assignedTo, location } = this;
        if (number.length === 0 || assignedTo.length === 0 || location.length === 0) {
          this.$toasted.error("Missing information", { duration: 2000 });
          return;
        }
        this.loading = true;
        const response = await API.post("instrument-inventory", "sign-out", {
          body: {
            number, assignedTo, location
          }
        });
        this.$toasted.success(response.message, { duration: 2000 });
        this.clear();
        this.updateCurrentInstrument(response.item);
        this.loading = false;
      } catch (e) {
        this.$toasted.error(`Error: ${e.response.data}`, { duration: 2000 });
        console.error(e);
        this.loading = false;
      }
    },
    detected(result) {
      if (result.codeResult.code !== this.number) {
        this.number = result.codeResult.code;
        this.scanner = false;
      }
      this.onSubmit();
    },
    clear() {
      this.number = "";
      this.location = "";
      this.assignedTo = "";
    }
  },
  computed: mapState(["currentInstrument"])
};
</script>
