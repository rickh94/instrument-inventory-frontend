<template>
  <div>
    <h4 class="text-xl mb-2 font-bold">Use Strings</h4>
    <v-update-strings-form
      :strings="strings"
      update-text="Used"
      submit-path="strings/use"
      @close="$emit('close')"
      @updated="$emit('updated', $event)"></v-update-strings-form>
  </div>
</template>

<script>
import VUpdateStringsForm from '@/components/inventoryComponents/strings/layout/VUpdateStringsForm'

export default {
  name: 'VUseStrings',
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
