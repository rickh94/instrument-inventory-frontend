<template>
  <div>
    <h4 class="text-xl mb-2 font-bold">Use Bows</h4>
    <v-update-bows-form
      :bows="bows"
      update-text="Used"
      submit-path="bows/use"
      @close="$emit('close')"
      @updated="$emit('updated', $event)"></v-update-bows-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import VUpdateBowsForm from '@/components/inventoryComponents/bows/VUpdateBowsForm.vue'

export default Vue.extend({
  name: 'VUseBows',
  components: { VUpdateBowsForm },
  props: {
    bows: {
      type: Array,
      required: true,
    },
  },
})
</script>

<style scoped>

</style>
