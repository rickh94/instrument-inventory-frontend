<template>
  <v-strings-base-table :strings="strings" :instrument="instrument">
    <template v-slot:default="slotProps">
      <input
        v-if="slotProps.item"
        type="number"
        :name="`${slotProps.item.id}-updates`"
        :id="`${slotProps.item.id}-updates`"
        class="w-12 border-b border-gray-800"
        min="0"
        :value="items[slotProps.item.id]"
        @change="handleChange(slotProps.item.id, $event.target.value)"
      >
      <span v-else title="You need to create this string type"></span>
    </template>
  </v-strings-base-table>

</template>

<script lang="ts">
import stringTableMixin from "@/mixins/stringTableMixin.js";
import VStringsBaseTable from "@/components/inventoryComponents/strings/layout/VStringsBaseTable.vue";
import Vue from "vue";

export default Vue.extend({
  name: "VStringsInputTable",
  components: { VStringsBaseTable },
  mixins: [stringTableMixin],
  props: {
    instrument: {
      type: String,
      required: true
    },
    strings: {
      type: Array,
      required: true
    },
    items: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleChange(id: string, value: number): void {
      this.$emit("change", { id, value });
    }
  }
});
</script>

<style scoped>

</style>
