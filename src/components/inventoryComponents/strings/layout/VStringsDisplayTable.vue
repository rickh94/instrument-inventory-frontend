<template>
  <v-strings-base-table :strings="strings" :instrument="instrument">
    <template v-slot:default="slotProps">
      <span>{{ slotProps.item | getStringInfo }}</span>
    </template>
  </v-strings-base-table>
</template>

<script>
import stringTableMixin from "@/mixins/stringTableMixin";
import VStringsBaseTable from "@/components/inventoryComponents/strings/layout/VStringsBaseTable";

export default {
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
    getStringInfo: function(string) {
      if (string === undefined) {
        return "0";
      }
      return `${string.count}`;
    }
  }
};
</script>

<style scoped>

</style>
