<template>
  <div class="group flex flex-col m-2 border border-purple-300 p-2 w-full cursor-pointer shadow-sm bg-gradient-to-b hover:from-purple-100 hover:to-white hover:shadow relative"
       @click.prevent="setCurrentInstrument(instrument)"
  >
    <div class="text-purple-800 font-bold">
      {{ instrument.size }} {{ instrument.type }} {{ instrument.number }}
    </div>
    <div v-if="instrument.assignedTo" class="text-gray-700">
      Assigned to {{ instrument.assignedTo }} at {{ instrument.location }}
    </div>
    <div class="text-gray-700" v-else>Unassigned at {{ instrument.location }}</div>
    <div class="text-gray-700">Condition: {{ instrument.condition }}, Quality: {{ instrument.quality }}</div>
    <div class="text-gray-500" v-if="instrument.history">{{ instrument.history | truncateHistory }}</div>
    <div class="text-gray-500" v-else>No History</div>
    <div class="absolute hidden group-hover:block bottom-0 right-0 mb-0 mr-2 text-gray-500">
      <span class="inline-flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
      </svg>
      View Instrument
      </span>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "VInstrumentCard",
  props: {
    instrument: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapMutations(["setCurrentInstrument"])
  },
  filters: {
    truncateHistory(history) {
      if (history.length > 3) {
        return history.slice(0, 3).join(", ") + ", ...";
      }
      return history.join(", ");
    }
  }
};
</script>

<style scoped>

</style>
