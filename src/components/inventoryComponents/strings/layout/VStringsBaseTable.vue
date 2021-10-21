<template>
  <table class="table table-auto mx-4">
    <thead>
    <tr class="border-b border-black text-xl">
      <th class="pr-4">{{ instrument }}</th>
      <th v-for="size in sizes" :key="size" class="px-2 text-center">{{ size }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(stringList, stringName) in stringsByStringBySize" :key="stringName">
      <td class="text-center pr-4">{{ stringName }}</td>
      <td v-for="size in sizes" :key="`${stringName}-${size}`" class="text-center">
        <slot :item="stringList[size]"></slot>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from "vue";

import stringTableMixin from "@/mixins/stringTableMixin";

export default Vue.extend({
  name: "VStringsBaseTable",
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
  }
});
</script>

<style scoped>

</style>
