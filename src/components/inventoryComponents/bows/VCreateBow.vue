<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex">
      <h4 class="text-xl text-gray-900 font-bold mb-2">Create New Bow Type</h4>
    </div>
    <v-form-control label="Instrument Type" label-for="type">
      <v-autocomplete id="type" v-model="data.type" :completion-options="acOptions.types"></v-autocomplete>
    </v-form-control>
    <v-form-control label="Size" label-for="size">
      <v-autocomplete id="size" v-model="data.size" :completion-options="acOptions.sizes"></v-autocomplete>
    </v-form-control>
    <v-form-control label="Count" label-for="count">
      <input id="count"
             name="count"
             min="0"
             v-model="data.count"
             type="number"
             class="appearance-none bg-transparent border-none w-16 text-gray-900 py-1 leading-tight">
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

import VFormControl from "@/components/UI/VFormControl.vue";
import VAutocomplete from "@/components/UI/VAutocomplete.vue";
import { BarLoader } from "@saeris/vue-spinners";
import VCancelButton from "@/components/UI/buttons/VCancelButton.vue";
import VSaveButton from "@/components/UI/buttons/VSaveButton.vue";
import acOptions from "@/mixins/acOptions";
import { createBow } from "@/services/bows";
import { GenericOutcome } from "@/util/commonTypes";
import Component, { mixins } from "vue-class-component";

@Component({
  components: { VSaveButton, VCancelButton, VAutocomplete, VFormControl, BarLoader }
})
export default class VCreateBow extends mixins(acOptions) {
  loading = false;
  data = {
    type: "",
    size: "",
    count: ""
  };

  async created(): Promise<void> {
    await this.getACOptions();
  }

  handleCancel(): void {
    this.data = { type: "", size: "", count: "" };
    this.$emit("close");
  }

  async handleSubmit(): Promise<void> {
    this.loading = true;
    const [outcome, message, updatedBow] = await createBow(this.data.type, this.data.size, parseInt(this.data.count));
    this.loading = false;
    switch (outcome) {
      case GenericOutcome.Ok:
        if (updatedBow) {
          this.$emit("updated", { updatedIds: [updatedBow.id], updatedItems: [updatedBow] });
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
  }
}
</script>

