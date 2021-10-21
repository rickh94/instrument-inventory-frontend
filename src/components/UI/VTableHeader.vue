<template>
  <th class="px-4 py-2 cursor-pointer font-bold border-b border-black text-left"
      @click.prevent="$emit('changeSort', sortName)">
    <span class="inline-flex items-center">
      <slot></slot>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"
           v-if="sortName === sortBy && sortDirection === 1"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"
           v-if="sortName === sortBy && sortDirection === -1"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </span>
  </th>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "VTableHeader",
  props: {
    sortName: {
      type: String,
      required: true
    },
    sortBy: {
      type: String,
      default: ""
    },
    sortDirection: {
      type: Number,
      default: 0
    }
  }
});
</script>

<style scoped>

</style>
