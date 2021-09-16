<template>
  <div class="m-5 shadow p-3" v-show="searchResults.length > 1">
    <h4 class="text-xl mb-1 font-bold text-gray-800">Multiple Instruments Found</h4>
    <div class="flex flex-col mt-2 mr-2">
      <v-instrument-card v-for="instrument in searchResults"
                         :instrument="instrument"
                         :key="instrument.id"
      ></v-instrument-card>
    </div>
  </div>
</template>
<script lang="ts">
import { mapMutations, mapState } from "vuex";
import VInstrumentCard from "@/components/VInstrumentCard.vue";
import Vue from "vue";
import { Instrument } from "@/util/commonTypes";

export default Vue.extend({
  name: "MultipleResults",
  components: { VInstrumentCard },
  props: {
    showArchived: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    select(instrument: Instrument): void {
      this.setCurrentInstrument(instrument);
    },
    ...mapMutations(["setCurrentInstrument", "clearCurrentInstrument"]),
  },
  computed: {
    ...mapState(["searchResults"]),
  },
});
</script>
