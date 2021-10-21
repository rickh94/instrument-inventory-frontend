<template>
  <Skeleton :count="8"></Skeleton>
</template>

<script lang="ts">
import Vue from "vue";
import { Skeleton } from "vue-loading-skeleton";

export default Vue.extend({
  name: "VFormLoader",
  components: { Skeleton },
});
</script>

<style scoped>

</style>
