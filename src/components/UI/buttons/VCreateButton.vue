<template>
  <button
    class="bg-purple-600 py-2 px-3 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white font-bold inline-flex items-center"
    @click.prevent="$emit('click')" v-if="isAdmin"
    type="button"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fill-rule="evenodd"
            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
            clip-rule="evenodd" />
    </svg>
    Create {{ item }}
  </button>
</template>
<script lang="ts">
import Vue from "vue";
import checkAdmin from "@/mixins/checkAdmin";

export default Vue.extend({
  name: "v-create-button",
  mixins: [checkAdmin],
  props: {
    item: {
      type: String,
      required: true
    }
  }
});
</script>
