<template>
  <div class="max-w-4xl">
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
        </div>
        <button @click="onSubmit"
                class="appearance-none rounded ml-4 text-white font-bold"
                :class="searchTerm.length === 0 ? 'bg-gray-600' : 'bg-purple-600 hover:shadow hover:bg-purple-800'"
                :disabled="searchTerm.length === 0"
        >

          <pulse-loader v-if="loading" color="#fff" size="8" class="px-2 py-1"></pulse-loader>
          <span v-else class="inline-flex items-center px-2 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd" />
            </svg>
          Search
          </span>
        </button>
      </div>
      <div v-if="isAdmin">
        <label class="inline-flex items-center">
          <input type="checkbox" class="form-checkbox" v-model="showArchived">
          <span class="ml-2">Include Archived Instruments</span>
        </label>
      </div>
      <v-scanner @detected="detected" v-if="scanner" @close="scanner = false"></v-scanner>
    </div>
    <multiple-results v-show="searchResults.length > 1" />
    <v-modal v-if="showNotFound" @close="showNotFound = false" width-class="sm:max-w-lg">
      <h6 class="text-xl font-bold text-gray-900">Not Found</h6>
      <p class="text-gray-900">Could not find instrument {{ searchTerm }}. Would you like to create a new
        instrument?</p>
      <div class="flex justify-end mt-2 flex-row">
<!--        <button class="mx-1 appearance-none bg-red-600 text-white px-4 py-1 shadow rounded hover:bg-red-800 hover:shadow-lg"-->
<!--                @click="showNotFound = false">-->
<!--          Close-->
<!--        </button>-->
        <v-close-form-button @close="showNotFound = false" />
        <button class="flex items-center font-bold mx-1 appearance-none bg-green-600 text-white px-3 py-1 shadow rounded hover:bg-green-800 hover:shadow-lg"
                @click="beginCreateInstrument">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
          </svg>
          Create
        </button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import VScanner from "@/components/UI/VScanner";
import { API } from "aws-amplify";
import { mapMutations, mapState } from "vuex";
import checkAdmin from "@/mixins/checkAdmin";
import { PulseLoader } from "@saeris/vue-spinners";
import VCloseFormButton from "@/components/UI/buttons/VCloseFormButton";

function getPath(input) {
  // This regex will match the instrument number format and search for an instrument number.
  // If it does not match, it is assumed to be a name and searches in assigned and history.
  return input.match(/\w?\w?\d*-\d+/) ? "search/number" : "search/assigned-history";
}

export default {
  name: "Home",
  components: {
    VCloseFormButton,
    VModal: () => import("@/components/UI/VModal.vue"),
    MultipleResults: () => import("@/components/MultipleResults.vue"),
    VScanner,
    PulseLoader,
  },
  mixins: [checkAdmin],
  data() {
    return {
      scanner: false,
      searchTerm: "",
      showNotFound: false,
      dialogOptions: {},
      loading: false,
      showArchived: false,
    };
  },
  methods: {
    ...mapMutations(["setSearchResults", "setCurrentInstrument", "setNewInstrumentNumber"]),
    detected(result) {
      if (result.codeResult.code !== this.searchTerm) {
        this.searchTerm = result.codeResult.code;
        this.scanner = false;
        this.onSubmit();
      }
    },
    async onSubmit() {
      if (this.loading) {
        return;
      }
      const path = getPath(this.searchTerm);
      try {
        this.loading = true;
        const response = await API.post("instrument-inventory", path, { body: { term: this.searchTerm } });
        this.loading = false;
        if (path === "search/number" || this.showArchived) {
          this.setSearchResults(response);
        } else {
          this.setSearchResults(response.filter(item => !item.archived));
        }
        if (this.searchResults.length === 1) {
          this.$toasted.info("Instrument Found", { duration: 2000 });
          this.setCurrentInstrument(this.searchResults[0]);
        } else if (this.searchResults.length < 1) {
          this.$toasted.info("Only archived instruments found", {
            duration: 2000,
          });
        } else {
          this.$toasted.info("Multiple Instruments Found", { duration: 2000 });
        }
      } catch (e) {
        this.loading = false;
        if (e.response.status === 404) {
          if (path === "search/number") {
            this.showNotFound = true;
          } else {
            // TODO: configure toasted so it doesn't suck
            this.$toasted.error(`Could not find instrument assigned to ${this.searchTerm}`, { duration: 2000 });
          }
        } else {
          this.$toasted.error(`Error: ${e.response.data}`, { duration: 2000 });
        }
      }
    },
    beginCreateInstrument() {
      this.setNewInstrumentNumber(this.searchTerm);
      this.$router.push("/new");
    },
    showArchivedResults(results) {
      this.setSearchResults(results);
    },
  },
  computed: mapState(["searchResults"]),
};
</script>

