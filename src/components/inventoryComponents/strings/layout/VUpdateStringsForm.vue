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
import computedStrings from "@/mixins/computedStrings";
import VStringsInputTable from "@/components/inventoryComponents/strings/layout/VStringsInputTable.vue";
import { BarLoader } from "@saeris/vue-spinners";
import VSaveButton from "@/components/UI/buttons/VSaveButton.vue";
import VCloseFormButton from "@/components/UI/buttons/VCloseFormButton.vue";
import { updateStrings } from "@/services/stringInventory";
import { GenericOutcome } from "@/util/commonTypes";
import Component, { mixins } from "vue-class-component";
import { InstrumentString } from "@/util/stringTypes";


@Component({
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
  components: { VCloseFormButton, VSaveButton, VStringsInputTable, BarLoader },
})
export default class VUpdateStringsForm extends mixins(computedStrings) {
  public strings!: InstrumentString[];
  public updateText!: string;
  public submitPath!: string;

  items: {[id: string]: number} = {};
  loading = false;

  created(): void {
    this.initializeItems();
  }

  initializeItems(): void {
    for (const item of this.strings) {
      if (item.id) {
        this.items[item.id] = 0;
      }
    }
  }

  handleChange({ id, value }: {id: string, value: number}): void {
    this.items[id] = value;
  }

  async handleSubmit(): Promise<void> {
    const updates: { id: string, amount: number }[] = [];
    for (const [id, amount] of Object.entries(this.items)) {
      if (amount !== 0) {
        updates.push({
          id, amount
        });
      }
    }
    this.loading = true;
    const [outcome, updatedIds, updatedItems, message] = await updateStrings(this.submitPath, { string_updates: updates });
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
  }
}

</script>

