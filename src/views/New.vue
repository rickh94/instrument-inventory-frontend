<template>
  <div class="max-w-3xl">
    <div class="m-5 shadow p-3 rounded">
      <v-instrument-form v-if="newInstrumentNumber"></v-instrument-form>
      <v-new-number v-else></v-new-number>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";
import Vue from "vue";

// noinspection JSUnusedGlobalSymbols
export default Vue.extend({
  name: "New",
  components: {
    VInstrumentForm: () => import("@/components/createComponents/VInstrumentForm.vue"),
    VNewNumber: () => import("@/components/createComponents/VNewNumber.vue")
  },
  computed: mapState(["newInstrumentNumber"])
});
</script>

<style scoped>

</style>
