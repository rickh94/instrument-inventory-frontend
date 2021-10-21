<template>
  <div>
    <h4 class="text-xl mv-2 font-bold">Add Items</h4>
    <v-update-multiple-items-form
      submit-path="other/add"
      :items="items"
      update-text="Added"
      @close="$emit('close')"
      @updated="$emit('updated', $event)"></v-update-multiple-items-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import VUpdateMultipleItemsForm from "@/components/inventoryComponents/other/VUpdateMultipleItemsForm.vue";

export default Vue.extend({
  name: "VAddItems",
  components: { VUpdateMultipleItemsForm },
  props: {
    items: {
      type: Array,
      required: true
    }
  }
});
</script>

<style scoped>

</style>
