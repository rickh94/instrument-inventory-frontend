<template>
  <div class="flex flex-col m-2 border border-purple-300 p-2 w-full cursor-pointer"
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
