<template>
  <div class="flex justify-end mt-4 mb-2" v-if="loading">
    <bar-loader class="w-40 mr-2" color="#7c3aed"></bar-loader>
  </div>
  <div class="flex w-full justify-end" v-else>
    <slot></slot>
  </div>
</template>
<script>
import { BarLoader } from "@saeris/vue-spinners";

export default {
  name: "v-loading-buttons",
  components: { BarLoader },
  props: {
    loading: {},
  },
};
</script>
