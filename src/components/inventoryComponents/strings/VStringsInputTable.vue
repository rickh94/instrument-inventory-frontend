<template>
  <table class="table table-auto mx-4">
    <thead>
    <tr class="border-b border-black text-xl">
      <th class="pr-4">{{ instrument }}</th>
      <th class="px-4 text-center" v-for="size in sizes" :key="size">{{ size }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(stringList, stringName) in stringsByStringBySize" :key="stringName">
      <td class="text-center pr-4">{{ stringName }}</td>
      <td v-for="size in sizes" :key="`${stringName}-${size}`"
      >
        <input v-if="stringList[size]"
               type="number"
               :name="`${stringList[size].id}-updates`"
               :id="`${stringList[size].id}-updates`"
               class="w-12 border-b border-gray-800"
               min="0"
               :value="items[stringList[size].id]"
               @change="handleChange(stringList[size].id, $event.target.value)"
        >
        <span v-else title="You need to create this string type"></span>
      </td>
    </tr>
    </tbody>
  </table>

</template>

<script>
import stringTableMixin from "@/mixins/stringTableMixin";

export default {
  name: "VStringsInputTable",
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
      required: true,
    }
  },
  methods: {
    handleChange(id, value) {
      this.$emit("change", { id, value });
    }
  }
};
</script>

<style scoped>

</style>
