<template>
  <button
    type="button"
    @click.prevent="$emit('click')"
    class="inline-flex items-center font-bold mx-1 appearance-none bg-purple-600 text-white px-3 py-1 shadow rounded hover:bg-purple-800 hover:shadow-lg"
    :class="center && 'justify-center'"
  >
    <span class="inline-flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
      </svg>
      Move
    </span>
  </button>
</template>
<script>
export default {
  name: "v-move-button",
  props: {
    center: {
      type: Boolean,
      default: false,
    }
  },
};
</script>
