<template>
  <div class="border-b border-gray-600 text-gray-800 focus-within:border-purple-600 mb-2 focus-within:text-purple-600 flex flex-col">
    <label v-if="label" :for="labelFor" class="text-sm">{{ label }}</label>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "v-form-control",
  props: {
    label: {
      type: String
    },
    labelFor: {
      type: String
    }
  }
});
</script>
