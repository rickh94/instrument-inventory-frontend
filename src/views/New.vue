<template>
  <div>
    <v-new-form v-if="newInstrumentNumber"></v-new-form>
    <v-new-number v-else></v-new-number>
  </div>
</template>

<script>
import VNewForm from '@/components/VNewForm'
import VNewNumber from '@/components/VNewNumber'
import { mapState } from 'vuex'

export default {
  name: 'New',
  components: { VNewForm, VNewNumber },
  created() {
    console.log(this.$store.state.newInstrumentNumber)
  },
  computed: mapState(['newInstrumentNumber']),
}
</script>

<style scoped>

</style>
