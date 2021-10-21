<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex flex-wrap items-start sm:flex-row justify-around">
      <table class="table table-auto mx-4">
        <thead>
        <tr class="border-b border-black text-xl">
          <th class="pr-4">Item</th>
          <th>{{ updateText }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items" :key="item.id">
          <td class="pr-4">{{ item.name }}</td>
          <td class="flex justify-end"><input
            type="number"
            :name="`${item.id}-updates`"
            :id="`${item.id}-updates`"
            class="w-12 border-b border-gray-800"
            min="0"
            v-model="itemsToUpdate[item.id]"
          ></td>
        </tr>
        </tbody>
      </table>
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

import errorHandler from "@/mixins/errorHandler.js";
import { BarLoader } from "@saeris/vue-spinners";
import VCloseFormButton from "@/components/UI/buttons/VCloseFormButton.vue";
import VSaveButton from "@/components/UI/buttons/VSaveButton.vue";
import { WithLoading } from "@/util/componentTypes";
import { updateMultipleItems } from "@/services/otherItems";
import { GenericOutcome } from "@/util/commonTypes";

interface ComponentState extends WithLoading {
  itemsToUpdate: { [itemId: string]: number },
}

export default Vue.extend({
  name: "VUpdateMultipleItemsForm",
  components: { VSaveButton, VCloseFormButton, BarLoader },
  mixins: [errorHandler],
  data(): ComponentState {
    return {
      itemsToUpdate: {},
      loading: false
    };
  },
  props: {
    items: {
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
  created() {
    this.initializeItems();
  },
  methods: {
    initializeItems() {
      for (const item of this.items) {
        this.itemsToUpdate[item.id] = 0;
      }
    },
    handleUpdate(id, e) {
      this.itemsToUpdate[id] = parseInt(e.target.value);
    },
    async handleSubmit() {
      const updated = [];
      for (const [id, amount] of Object.entries(this.itemsToUpdate)) {
        if (amount !== 0) {
          updated.push({ id, amount });
        }
      }

      this.loading = true;
      const [outcome, updatedIds, updatedItems, message] = await updateMultipleItems(updated, this.submitPath);
      this.loading = false;
      switch (outcome) {
        case GenericOutcome.Ok:
          this.$emit("updated", { updatedIds, updatedItems });
          if (message) {
            this.$toasted.error(message, { duration: 4000 });
          }
          this.$emit("close");
          break;
        case GenericOutcome.Err:
          if (message) {
            this.$toasted.error(message, { duration: 2000 });
          }
          break;
        default:
          this.$toasted.error("Something went wrong", { duration: 2000 });
      }
    }
  }
});
</script>

<style scoped>

</style>
