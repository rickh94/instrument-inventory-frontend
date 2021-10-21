<template>
  <v-strings-base-table :strings="strings" :instrument="instrument">
    <template v-slot:default="slotProps">
      <span>{{ slotProps.item | getStringInfo }}</span>
    </template>
  </v-strings-base-table>
</template>

<script lang="ts">
import stringTableMixin from "@/mixins/stringTableMixin.js";
import VStringsBaseTable from "@/components/inventoryComponents/strings/layout/VStringsBaseTable.vue";
import Vue from "vue";

export default Vue.extend({
  name: "VStringsDisplayTable",
  components: { VStringsBaseTable },
  mixins: [stringTableMixin],
  props: {
    strings: {
      type: Array,
      required: true
    },
    instrument: {
      type: String,
      required: true
    }
  },
  filters: {
    getStringInfo(instrumentString?: {count: number}) {
      if (instrumentString === undefined) {
        return "0";
      }
      return `${instrumentString.count}`;
    }
  }
});
</script>

<style scoped>

</style>
