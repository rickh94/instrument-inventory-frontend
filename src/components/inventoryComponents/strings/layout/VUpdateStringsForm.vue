<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex flex-wrap items-start sm:flex-row justify-around overflow-auto">
      <v-strings-input-table
        instrument="Violin"
        :strings="violinStrings"
        :items="items"
        @change="handleChange"
      ></v-strings-input-table>
      <v-strings-input-table
        instrument="Viola"
        :strings="violaStrings"
        :items="items"
        @change="handleChange"
      ></v-strings-input-table>
      <v-strings-input-table
        instrument="Cello"
        :strings="celloStrings"
        :items="items"
        @change="handleChange"
      ></v-strings-input-table>
      <v-strings-input-table
        instrument="Bass"
        :strings="bassStrings"
        :items="items"
        @change="handleChange"
      ></v-strings-input-table>
    </div>
    <div class="flex justify-end mt-4 mb-2" v-if="loading">
      <bar-loader class="w-40 mr-2" color="#7c3aed"></bar-loader>
    </div>
    <div v-else class="flex justify-end mt-4">
      <v-close-form-button @close="$emit('close')" />
      <v-save-button />
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue";

import { API } from "aws-amplify";
import computedStrings from "@/mixins/computedStrings";
import VStringsInputTable from "@/components/inventoryComponents/strings/layout/VStringsInputTable.vue";
import { BarLoader } from "@saeris/vue-spinners";
import VSaveButton from "@/components/UI/buttons/VSaveButton.vue";
import VCloseFormButton from "@/components/UI/buttons/VCloseFormButton.vue";
import { WithLoading } from "@/util/componentTypes";
import { updateStrings } from "@/services/stringInventory";
import { GenericOutcome } from "@/util/commonTypes";

interface ComponentState extends WithLoading {
  items: Record<string, number>,
}

export default Vue.extend({
  name: "VUpdateStringsForm",
  components: { VCloseFormButton, VSaveButton, VStringsInputTable, BarLoader },
  mixins: [computedStrings],
  props: {
    strings: {
      type: Array,
      required: true
    },
    updateText: {
      type: String,
      required: true
    },
    submitPath: {
      type: String,
      required: true
    }
  },
  data(): ComponentState {
    return {
      items: {},
      loading: false
    };
  },
  created(): void {
    this.initializeItems();
  },
  methods: {
    async handleSubmit() {
      const updates = [];
      for (const [id, amount] of Object.entries(this.items)) {
        if (amount !== 0) {
          updates.push({
            id, amount
          });
        }
      }
      this.loading = true;
      // eslint-disable
      const [outcome, updatedIds, updatedItems, message] = await updateStrings(this.submitPath, updates);
      this.loading = false;
      switch (outcome) {
        case GenericOutcome.Ok:
          this.$emit("updated", { updatedIds, updatedItems });
          if (message.length > 0) {
            this.$toasted.error(message);
          }
          this.$emit("close");
          break;
        case GenericOutcome.Err:
          this.$toasted.error(message);
          break;
        default:
          this.$toasted.error("Something went wrong", { duration: 2000 });
      }
    },
    initializeItems() {
      for (const item of this.strings) {
        this.items[item.id] = 0;
      }
    },
    handleChange({ id, value }) {
      this.items[id] = value;
    }
  }
});
</script>

