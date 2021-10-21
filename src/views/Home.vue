<template>
  <div class="max-w-3xl">
    <v-instrument-search-box
      :with-scanner="true"
      :with-archive-option="true"
      title="Instrument Number or Student Name"
      @notFound="handleNotFound"
      wrapper-class="m-5 shadow p-3"
    />
    <multiple-results v-if="searchResults.length > 1" />
    <v-not-found-modal
      :number="notFoundNumber"
      v-if="showNotFound"
      @close="showNotFound = false; notFoundNumber = ''"
    />
  </div>
</template>

<!--suppress ES6CheckImport -->
<script lang="ts">
import Vue from "vue";
import { mapMutations, mapState } from "vuex";
import checkAdmin from "@/mixins/checkAdmin";
import VInstrumentSearchBox from "@/components/VInstrumentSearchBox.vue";
import VNotFoundModal from "@/components/VNotFoundModal.vue";

interface ComponentState {
  showNotFound: boolean,
  notFoundNumber: string,
}

// noinspection JSUnusedGlobalSymbols
export default Vue.extend({
  name: "Home",
  components: {
    VNotFoundModal,
    VInstrumentSearchBox,
    MultipleResults: () => import("@/components/MultipleResults.vue")
  },
  mixins: [checkAdmin],
  data(): ComponentState {
    return {
      notFoundNumber: "",
      showNotFound: false
    };
  },
  methods: {
    ...mapMutations(["setSearchResults", "setCurrentInstrument"]),
    handleNotFound({ detail }) {
      this.showNotFound = true;
      this.notFoundNumber = detail;
    }
  },
  computed: mapState(["searchResults"])
});
</script>

