<template>
  <div class="max-w-4xl m-5 shadow p-3 rounded">
    <v-instrument-form v-if="newInstrumentNumber"></v-instrument-form>
    <v-new-number v-else></v-new-number>
  </div>
</template>

<script>
import VInstrumentForm from '@/components/createComponents/VInstrumentForm'
import VNewNumber from '@/components/createComponents/VNewNumber'
import { mapState } from 'vuex'

export default {
  name: 'New',
  components: { VInstrumentForm, VNewNumber },
  data() {
    return {
      createdInstrument: null,
    }
  },
  computed: mapState(['newInstrumentNumber']),
}
</script>

<style scoped>

</style>
