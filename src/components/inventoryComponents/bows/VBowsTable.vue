<template>
<table class="table table-auto mx-4">
  <thead>
  <tr class="border-b border-black text-xl">
    <th class="pr-4">{{ instrument }}</th>
    <th>Count</th>
  </tr>
  </thead>
  <tbody>
  <tr v-for="bow in bows" :key="bow.id">
    <td>{{ bow.size }}</td>
    <td>{{ bow.count }}</td>
  </tr>
  </tbody>
</table>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
name: "VBowsTable",
  props: {
    bows: {
      type: Array,
      required: true,
    },
    instrument: {
      type: String,
      required: true,
    }
  },
})
</script>

<style scoped>

</style>
