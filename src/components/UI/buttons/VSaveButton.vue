<template>
  <button type="submit"
          class="bg-purple-600 px-3 py-2 text-white shadow rounded hover:bg-purple-800 hover:shadow-lg flex items-center font-bold">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
    </svg>
    Save
  </button>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "v-save-button",
});
</script>
