<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex flex-wrap items-start sm:flex-row justify-around">
      <table class="table table-auto mx-4">
        <thead>
        <tr class="border-b border-black text-xl">
          <th class="pr-4">Violin</th>
          <th>{{ updateText }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in violinBows" :key="item.id">
          <td class="pr-4">{{ item.size }}</td>
          <td class="flex justify-end"><input
            type="number"
            :name="`${item.id}-updates`"
            :id="`${item.id}-updates`"
            class="w-12 border-b border-gray-800"
            min="0"
            v-model="items[item.id]"
          ></td>
        </tr>
        </tbody>
      </table>
      <table class="table table-auto mx-4">
        <thead>
        <tr class="border-b border-black text-xl">
          <th class="pr-4">Viola</th>
          <th>{{ updateText }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in violaBows" :key="item.id">
          <td class="pr-4">{{ item.size }}</td>
          <td class="flex justify-end"><input type="number"
                                              :name="`${item.id}-updates`"
                                              :id="`${item.id}-updates`"
                                              class="w-12 border-b border-gray-800"
                                              min="0"
                                              v-model="items[item.id]"
          ></td>
        </tr>
        </tbody>
      </table>
      <table class="table table-auto mx-4">
        <thead>
        <tr class="border-b border-black text-xl">
          <th class="pr-4">Cello</th>
          <th>{{ updateText }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in celloBows" :key="item.id">
          <td class="pr-4">{{ item.size }}</td>
          <td class="flex justify-end"><input type="number"
                                              :name="`${item.id}-updates`"
                                              :id="`${item.id}-updates`"
                                              class="w-12 border-b border-gray-800"
                                              min="0"
                                              v-model="items[item.id]"
          ></td>
        </tr>
        </tbody>
      </table>
      <table class="table table-auto mx-4">
        <thead>
        <tr class="border-b border-black text-xl">
          <th class="pr-4">Bass</th>
          <th>{{ updateText }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in bassBows" :key="item.id">
          <td class="pr-4">{{ item.size }}</td>
          <td class="flex justify-end"><input type="number"
                                              :name="`${item.id}-updates`"
                                              :id="`${item.id}-updates`"
                                              class="w-12 border-b border-gray-800"
                                              min="0"
                                              v-model="items[item.id]"
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

import computedBows from "@/mixins/computedBows";
import { BarLoader } from "@saeris/vue-spinners";
import VSaveButton from "@/components/UI/buttons/VSaveButton.vue";
import VCloseFormButton from "@/components/UI/buttons/VCloseFormButton.vue";
import { updateBows } from "@/services/bows";
import { GenericOutcome } from "@/util/commonTypes";

export default Vue.extend({
  name: "VUpdateBowsForm",
  components: { VCloseFormButton, VSaveButton, BarLoader },
  mixins: [computedBows],
  props: {
    bows: {
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
  data() {
    return {
      items: {},
      loading: false
    };
  },
  created() {
    this.initializeItems();
  },
  methods: {
    async handleSubmit() {
      const updated = [];
      for (const [id, amount] of Object.entries(this.items)) {
        if (amount && amount !== 0) {
          updated.push({
            id, amount
          });
        }
      }
      this.loading = true;
      const [outcome, updatedIds, updatedItems, failed, message] = await updateBows(updated, this.submitPath);
      this.loading = false;

      switch (outcome) {
        case GenericOutcome.Ok:
          this.$emit("updated", { updatedIds, updatedItems });
          if (failed.length > 0) {
            this.$toasted.error(`Updates failed: ${failed.join(", ")}`, { duration: 2000 });
          }
          this.$emit("close");
          break;
        case GenericOutcome.Err:
          this.$toasted.error(message, { duration: 2000 });
          break;
        default:
          this.$toasted.error("Something went wrong", { duration: 2000 });
      }
    },
    initializeItems() {
      for (const bow of this.bows) {
        this.items[bow.id] = 0;
      }
    },
    handleUpdate(id, e) {
      this.items[id] = parseInt(e.target.value);
    }
  }
});
</script>

<style scoped>

</style>
