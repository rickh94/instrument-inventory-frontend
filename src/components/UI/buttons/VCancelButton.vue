<template>
  <button
    @click.prevent="$emit('cancel')"
    class="inline-flex items-center font-bold bg-yellow-600 px-3 mx-2 py-2 text-white shadow rounded hover:bg-yellow-800 hover:shadow-lg"
    type="reset"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
            clip-rule="evenodd" />
    </svg>
    Cancel
  </button>
</template>
<script>
export default {
  name: "v-cancel-button",
  props: {},
};
</script>
