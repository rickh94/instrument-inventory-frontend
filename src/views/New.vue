<template>
  <div class="max-w-4xl">
    <div class="m-5 shadow p-3 rounded">
      <v-instrument-form v-if="newInstrumentNumber"></v-instrument-form>
      <v-new-number v-else></v-new-number>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "New",
  components: {
    VInstrumentForm: () => import("@/components/createComponents/VInstrumentForm.vue"),
    VNewNumber: () => import("@/components/createComponents/VNewNumber.vue")
  },
  data() {
    return {
      createdInstrument: null
    };
  },
  computed: mapState(["newInstrumentNumber"])
};
</script>

<style scoped>

</style>
