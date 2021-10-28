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
          <td class="flex justify-end">
            <input type="number"
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
import { BarLoader } from "@saeris/vue-spinners";
import VSaveButton from "@/components/UI/buttons/VSaveButton.vue";
import VCloseFormButton from "@/components/UI/buttons/VCloseFormButton.vue";
import { updateBows } from "@/services/bows";
import { GenericOutcome } from "@/util/commonTypes";
import Component, { mixins } from "vue-class-component";
import ComputedBows from "@/mixins/computedBows";
import { Bow } from "@/util/bowTypes";

@Component({
  components: { VCloseFormButton, VSaveButton, BarLoader },
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
  }
})
export default class VUpdateBowsForm extends mixins(ComputedBows) {
  public bows!: Bow[];
  public updateText!: string;
  public submitPath!: string;
  items: { [id: string]: number } = {};
  loading = false;

  created(): void {
    this.initializeItems();
  }

  initializeItems(): void {
    for (const bow of this.bows) {
      if (bow.id) {
        this.items[bow.id] = 0;
      }
    }
  }

  async handleSubmit(): Promise<void> {
    const updated: { id: string, amount: number }[] = [];
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
  }
}
</script>

<style scoped>

</style>
