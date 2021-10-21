<template>
  <div class="flex justify-end mt-4 mb-2" v-if="loading">
    <bar-loader :class="loaderClass" color="#7c3aed"></bar-loader>
  </div>
  <div :class="containerClass" v-else>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { BarLoader } from "@saeris/vue-spinners";

export default Vue.extend({
  name: "v-loading-buttons",
  components: { BarLoader },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    containerClass: {
      type: String,
      default: "flex w-full justify-end",
    },
    loaderClass: {
      type: String,
      default: "w-40 mr-2"
    }
  },
});
</script>
