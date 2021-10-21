<template>
  <div :class="wrapperClass">
    <label for="number" class="text-gray-800 font-bold text-xl mb-1" v-if="title">{{ title }}</label>
    <div class="flex items-start justify-between mt-2 mb-1">
      <div class="border-b focus-within:border-purple-300 border-gray-800 w-24 flex-grow flex items-center space-between">
        <input type="text"
               name="number"
               id="number"
               class="appearance-none bg-transparent border-none w-full text-gray-800 mr-1 py-1 leading-tight focus:outline-none"
               v-model="searchTerm"
               @keyup.enter="onSubmit"
               ref="instrumentSearchBox"
        >
        <button class="appearance-none" title="Scan Barcode" @click="scanner = !scanner" v-if="withScanner">
          <font-awesome-icon icon="barcode" class="mx-2"></font-awesome-icon>
        </button>
      </div>
      <button @click="onSubmit"
              class="appearance-none rounded ml-4 text-white font-bold"
              :class="searchTerm.length === 0 ? 'bg-gray-600' : 'bg-purple-600 hover:shadow hover:bg-purple-800'"
              :disabled="searchTerm.length === 0"
      >
        <pulse-loader v-if="loading" color="#fff" :size="8" class="px-2 py-1"></pulse-loader>
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
    <div v-if="isAdmin && withArchiveOption">
      <label class="inline-flex items-center">
        <input type="checkbox" class="form-checkbox" v-model="showArchived">
        <span class="ml-2">Include Archived Instruments</span>
      </label>
    </div>
    <v-scanner @detected="detected" v-if="withScanner && scanner" @close="scanner = false"></v-scanner>
  </div>
</template>
<script lang="ts">
import { PulseLoader } from "@saeris/vue-spinners";
import checkAdmin from "@/mixins/checkAdmin";
import { CodeResult, WithLoading, WithScanner } from "@/util/componentTypes";
import { searchForInstrument, SearchOutcome } from "@/services/searchForInstrument";
import Vue from "vue";
import { mapMutations, mapState } from "vuex";

interface ComponentState extends WithScanner, WithLoading {
  searchTerm: string,
  showArchived: boolean,
}

export default Vue.extend({
  name: "v-instrument-search-box",
  mixins: [checkAdmin],
  components: {
    VScanner: () => import("@/components/UI/VScanner.vue"),
    PulseLoader
  },
  props: {
    withScanner: {
      type: Boolean,
      default: false
    },
    withArchiveOption: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: false,
    },
    focusOnCreated: {
      type: Boolean,
      default: false,
    },
    wrapperClass: {
      type: String,
      default: ""
    }
  },
  mounted() {
    if (this.focusOnCreated) {
      const box = this.$refs.instrumentSearchBox;
      box.focus();
    }
  },
  data(): ComponentState {
    return {
      searchTerm: "",
      loading: false,
      showArchived: false,
      scanner: false
    };
  },
  methods: {
    ...mapMutations(["setSearchResults", "setCurrentInstrument", "clearSearchResults"]),
    detected(result: CodeResult): void {
      if (result.codeResult.code !== this.searchTerm) {
        this.searchTerm = result.codeResult.code;
        this.scanner = false;
        this.onSubmit();
      }
    },
    async onSubmit(): Promise<void> {
      if (this.loading) {
        return;
      }
      this.loading = true;
      const [searchOutcome, result, message] = await searchForInstrument(this.searchTerm, this.showArchived);
      this.clearSearchResults();
      switch (searchOutcome) {
        case SearchOutcome.FoundOne:
          this.$emit("foundOne")
          this.$toasted.success(message, { duration: 1000 });
          this.setCurrentInstrument(result);
          break;
        case SearchOutcome.FoundMultiple:
          this.$emit("foundMultiple");
          this.$toasted.success(message, { duration: 1000 });
          this.setSearchResults(result);
          break;
        case SearchOutcome.FoundOnlyArchived:
          this.$toasted.info(message, { duration: 1000 });
          break;
        case SearchOutcome.NumberNotFound:
          this.$emit("notFound", { detail: this.searchTerm });
          break;
        case SearchOutcome.Err:
        case SearchOutcome.NameNotFound:
          this.$toasted.error(message, { duration: 2000 });
          break;
        default:
          this.$toasted.error("Something went wrong", { duration: 1000 });
          break;
      }
      this.loading = false;
    }
  },
  computed: mapState(["searchResults"])
});
</script>
