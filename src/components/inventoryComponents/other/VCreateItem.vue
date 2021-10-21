<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex">
      <h4 class="text-xl text-gray-900 font-bold mb-2">Create New Item Type</h4>
    </div>
    <v-form-control label="Name" label-for="name">
      <input id="name"
             name="name"
             v-model="data.name"
             type="text"
             class="appearance-none bg-transparent border-none text-gray-900 py-1 leading-tight"
      >
    </v-form-control>
    <v-form-control label="Count" label-for="count">
      <input id="count"
             name="name"
             v-model="data.count"
             type="number"
             class="appearance-none bg-transparent border-none text-gray-900 py-1 leading-tight w-16"
      >
    </v-form-control>
    <v-form-control label="Notes" label-for="notes">
      <textarea id="notes"
                v-model="data.notes"
                class="appearance-none bg-transparent border-none text-gray-900 leading-tight w-full"
      ></textarea>
    </v-form-control>
    <div class="flex justify-end mt-4 mb-2" v-if="loading">
      <bar-loader class="w-40 mr-2" color="#7c3aed"></bar-loader>
    </div>
    <div v-else class="flex justify-end">
      <v-cancel-button @cancel="handleCancel" />
      <v-save-button />
    </div>
  </form>

</template>

<script lang="ts">
import Vue from "vue";

import VFormControl from "@/components/UI/VFormControl.vue";
import { BarLoader } from "@saeris/vue-spinners";
import errorHandler from "@/mixins/errorHandler";
import VCancelButton from "@/components/UI/buttons/VCancelButton.vue";
import VSaveButton from "@/components/UI/buttons/VSaveButton.vue";
import { WithLoading } from "@/util/componentTypes";
import { GenericOutcome, OtherItem } from "@/util/commonTypes";
import { createItem } from "@/services/otherItems";

interface ComponentState extends WithLoading {
  data: OtherItem,
}

export default Vue.extend({
  name: "VCreateItem",
  components: { VSaveButton, VCancelButton, VFormControl, BarLoader },
  mixins: [errorHandler],
  data() {
    return {
      data: {
        name: "",
        count: 0,
        num_out: 0,
        signed_out_to: [],
        notes: ""
      },
      loading: false
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      const [outcome, message, newItem] = await createItem(this.data);
      this.loading = false;
      switch (outcome) {
        case GenericOutcome.Ok:
          if (newItem) {
            this.$emit("updated", { updatedIds: [newItem.id], updatedItems: [newItem] });
            this.$toasted.success(message, { duration: 2000 });
            this.$emit("close");
          } else {
            this.$toasted.error("Something went wrong", { duration: 2000 });
          }
          break;
        case GenericOutcome.Err:
          this.$toasted.error(message, { duration: 2000 });
          break;
        default:
          this.$toasted.error("Something went wrong", { duration: 2000 });
      }
    },
    handleCancel() {
      this.data = { name: "", count: 0, num_out: 0, signed_out_to: [], notes: "" };
      this.$emit("close");
    }
  }
});
</script>

<style scoped>

</style>
