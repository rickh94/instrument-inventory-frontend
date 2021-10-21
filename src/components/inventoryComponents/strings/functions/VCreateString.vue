<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex">
      <h4 class="text-xl text-gray-900 font-bold mb-2">Create New String Type</h4>
    </div>
    <v-form-control label="Instrument Type" label-for="type">
      <v-autocomplete required id="type" v-model="data.type" :completion-options="acOptions.types"></v-autocomplete>
    </v-form-control>
    <v-form-control label="Size" label-for="size">
      <v-autocomplete required id="size" v-model="data.size" :completion-options="acOptions.sizes"></v-autocomplete>
    </v-form-control>
    <v-form-control label="String" label-for="string">
      <v-autocomplete required
                      id="string"
                      v-model="data.instrumentString"
                      :completion-options="acOptions.strings"></v-autocomplete>
    </v-form-control>
    <v-form-control label="Count" label-for="count">
      <input id="count"
             name="count"
             min="0"
             v-model="data.count"
             type="number"
             class="appearance-none bg-transparent border-none w-16 text-gray-900 py-1 leading-tight"
      >
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
import VAutocomplete from "@/components/UI/VAutocomplete.vue";
import { BarLoader } from "@saeris/vue-spinners";
import VCancelButton from "@/components/UI/buttons/VCancelButton.vue";
import VSaveButton from "@/components/UI/buttons/VSaveButton.vue";
import acOptions from "@/mixins/acOptions";
import { WithLoading } from "@/util/componentTypes";
import { createString } from "@/services/stringInventory";
import { GenericOutcome } from "@/util/commonTypes";

interface ComponentState extends WithLoading {
  data: {
    type: string,
    size: string,
    count: string,
    instrumentString: string,
  };
}

export default Vue.extend({
  name: "VCreateBow",
  components: { VSaveButton, VCancelButton, VAutocomplete, VFormControl, BarLoader },
  mixins: [acOptions],
  data() {
    return {
      loading: false,
      data: {
        type: "",
        size: "",
        count: "0",
        instrumentString: ""
      }
    };
  },
  async created(): Promise<void> {
    const error = await this.getACOptions();
    if (error) {
      this.$toasted.error(error);
    }
  },
  methods: {
    handleCancel(): void {
      this.data = { type: "", size: "", count: "", instrumentString: "" };
      this.$emit("close");
    },
    async handleSubmit(): Promise<void> {
      this.loading = true;
      // eslint-disable
      const [outcome, newString, message] = await createString({ string: this.data.instrumentString, ...this.data });
      this.loading = false;
      switch (outcome) {
        case GenericOutcome.Ok:
          if (newString !== null) {
            this.$emit("updated", { updatedIds: [newString.id], updatedItems: [newString] });
            this.$toasted.success(message, { duration: 2000 });
            this.$emit("close");
          } else {
            this.$toasted.error("Something went wrong", { duration: 2000 });
          }
          break;
        case GenericOutcome.Err:
          this.$toasted.error(message);
          break;
        default:
          this.$toasted.error("Something went wrong", { duration: 2000 });
      }
    }
  }
});
</script>

