<template>
  <v-modal @close="$emit('close')" width-class="sm:max-w-lg">
    <h6 class="text-xl font-bold text-gray-900">Not Found</h6>
    <p class="text-gray-900">Could not find instrument {{ number }}. Would you like to create a new
      instrument?</p>
    <div class="flex justify-end mt-2 flex-row">
      <v-close-form-button @close="$emit('close')" />
      <button class="flex items-center font-bold mx-1 appearance-none bg-green-600 text-white px-3 py-1 shadow rounded hover:bg-green-800 hover:shadow-lg"
              @click="beginCreateInstrument">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
          <path fill-rule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clip-rule="evenodd" />
        </svg>
        Create
      </button>
    </div>
  </v-modal>
</template>
<script lang="ts">
import VCloseFormButton from "@/components/UI/buttons/VCloseFormButton.vue";
import VModal from "@/components/UI/VModal.vue";
import { mapMutations } from "vuex";
import Vue from "vue";

export default Vue.extend({
  name: "v-not-found-modal",
  components: { VModal, VCloseFormButton },
  props: {
    number: {
      type: String,
      required: false
    }
  },
  methods: {
    ...mapMutations(["setNewInstrumentNumber"]),
    beginCreateInstrument(): void {
      this.setNewInstrumentNumber(this.number);
      this.$router.push("/new");
    }
  }
});
</script>
