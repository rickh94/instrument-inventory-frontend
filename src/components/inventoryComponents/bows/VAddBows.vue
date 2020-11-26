<template>
  <div>
    <h4 class="text-xl mb-2 font-bold">Add Bows</h4>
    <v-update-bows-form
      submit-path="bows/add"
      :bows="bows"
      update-text="Added"
      @close="$emit('close')"
      @updated="$emit('updated', $event)"></v-update-bows-form>
  </div>
</template>

<script>
import VUpdateBowsForm from '@/components/inventoryComponents/bows/VUpdateBowsForm'

export default {
  name: 'VAddBows',
  components: { VUpdateBowsForm },
  props: {
    bows: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped>

</style>
