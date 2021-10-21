<template>
  <button
    type="button"
    @click.prevent="$emit('click')"
    class="inline-flex items-center font-bold mx-1 appearance-none bg-blue-600 text-white px-3 py-1 shadow rounded hover:bg-blue-800 hover:shadow-lg"
    :class="center && 'justify-center'"
  >
    <span class="inline-flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
      </svg>
      Assign
    </span>
  </button>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "v-assign-button",
  props: {
    center: {
      type: Boolean,
      default: false,
    }
  },
});
</script>
