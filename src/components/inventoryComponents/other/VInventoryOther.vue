<template>
  <div>
    <v-spinner v-if="loading" line-fg-color="$805ad5" class="my-2"></v-spinner>
    <div class="flex items-start justify-around flex-wrap mt-4" v-else>
      <table class="table table-auto mx-4">
        <thead>
        <tr class="border-b border-black text-xl">
          <th class="pr-4">Name</th>
          <th class="pr-4">Total Count</th>
          <th class="pr-4">Signed out</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items" :key="item.id">
          <td class="cursor-pointer" @click="displayItem = item">{{ item.name }}</td>
          <td>{{ item.count }}</td>
          <td>{{ item.num_out }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-around max-w-lg mx-auto mt-2">
      <div class="flex justify-around max-w-lg mx-auto mt-2">
        <button class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white mr-2"
                @click.prevent="formComponent = 'v-create-item'" v-if="isAdmin">
          Create Item
        </button>
        <button @click.prevent="formComponent = 'v-use-items'"
                class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white mr-2">
          Use Items
        </button>
        <button @click.prevent="formComponent = 'v-add-items'"
                class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white">
          Add Items
        </button>
      </div>
    </div>
    <v-modal v-if="formComponent" @close="formComponent = null" width-class="max-w-lg">
      <div :is="formComponent" @updated="handleUpdate" :items="items" @close="formComponent = null"></div>
    </v-modal>
    <v-modal v-if="displayItem" @close="displayItem = null" width-class="max-w-lg">
      <VItemDisplay :display-item="displayItem" />
    </v-modal>
  </div>
</template>

<script>
import checkAdmin from "@/mixins/checkAdmin";
import { API } from "aws-amplify";
import VModal from "@/components/UI/VModal";
import VItemDisplay from "@/components/inventoryComponents/other/VItemDisplay";
import VAddItems from "@/components/inventoryComponents/other/VAddItems";
import VUseItems from "@/components/inventoryComponents/other/VUseItems";
import VCreateItem from "@/components/inventoryComponents/other/VCreateItem";

export default {
  name: "VInventoryOther",
  components: { VItemDisplay, VModal, VAddItems, VUseItems, VCreateItem },
  mixins: [checkAdmin],
  data() {
    return {
      loading: false,
      items: [],
      formComponent: null,
      displayItem: null,
    };
  },
  async created() {
    try {
      this.loading = true;
      const response = await API.get("instrument-inventory", "other", {});
      this.items = response.items;
      this.loading = false;
    } catch (e) {
      this.loading = false;
      if (e.response) {
        this.$toasted.error(e.response.data, { duration: 2000 });
      } else {
        this.$toasted.error(e.toString(), { duration: 2000 });
        console.error(e);
      }
    }
  },
  methods: {
    handleUpdate({updatedIds, updatedItems}) {
      this.loading = true
      this.items = [...this.items.filter(({id}) => !updatedIds.includes(id)), ...updatedItems]
      this.loading = false
    }
  },
};
</script>

