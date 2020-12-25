<template>
  <div>
    <h4 class="text-xl mb-2 font-bold">Add Strings</h4>
    <v-update-strings-form
      submit-path="strings/add"
      :strings="strings"
      update-text="Added"
      @close="$emit('close')"
      @updated="$emit('updated', $event)"></v-update-strings-form>
  </div>
</template>

<script>
import VUpdateStringsForm from '@/components/inventoryComponents/strings/VUpdateStringsForm'

export default {
  name: 'VAddStrings',
  components: { VUpdateStringsForm },
  props: {
    strings: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped>

</style>
