<template>
  <div>
    <h4 class="text-xl mb-2 font-bold">Use Items</h4>
    <v-update-multiple-items-form
      :items="items"
      update-text="Used"
      submit-path="other/use"
      @close="$emit('close')"
      @updated="$emit('updated', $event)"
    ></v-update-multiple-items-form>
  </div>

</template>

<script lang="ts">
import Vue from "vue";

import VUpdateMultipleItemsForm from "@/components/inventoryComponents/other/VUpdateMultipleItemsForm.vue";

export default Vue.extend({
  name: "VUseItems",
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
