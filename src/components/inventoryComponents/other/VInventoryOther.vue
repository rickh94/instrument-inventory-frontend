<template>
  <div>
    <div class="flex h-20 w-full items-center justify-center" v-if="loading">
      <propagate-loader color="#7c3aed"></propagate-loader>
    </div>
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
      <v-create-button @click="formComponent = 'v-create-item'" item="Item" />
      <v-use-button @click="formComponent = 'v-use-items'" item="Items" />
      <v-add-button @click="formComponent = 'v-add-items'" item="Items" />
    </div>
    <v-modal v-if="formComponent" @close="formComponent = null" width-class="max-w-lg">
      <div :is="formComponent" @updated="handleUpdate" :items="items" @close="formComponent = null"></div>
    </v-modal>
    <v-modal v-if="displayItem" @close="displayItem = null" width-class="max-w-lg">
      <VItemDisplay :display-item="displayItem" @close="displayItem = null" @updated="handleUpdate"/>
    </v-modal>
  </div>
</template>

<script>
import checkAdmin from "@/mixins/checkAdmin";
import { API } from "aws-amplify";
import { PropagateLoader } from "@saeris/vue-spinners";
import VCreateButton from "@/components/UI/buttons/VCreateButton";
import VUseButton from "@/components/UI/buttons/VUseButton";
import VAddButton from "@/components/UI/buttons/VAddButton";

export default {
  name: "VInventoryOther",
  components: {
    VAddButton,
    VUseButton,
    VCreateButton,
    VItemDisplay: () => import("@/components/inventoryComponents/other/VItemDisplay.vue"),
    VModal: () => import("@/components/UI/VModal.vue"),
    VAddItems: () => import("@/components/inventoryComponents/other/VAddItems.vue"),
    VUseItems: () => import("@/components/inventoryComponents/other/VUseItems.vue"),
    VCreateItem: () => import("@/components/inventoryComponents/other/VCreateItem.vue"),
    PropagateLoader,
  },
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
    handleUpdate({ updatedIds, updatedItems, replaceDisplay =  false }) {
      this.loading = true;
      this.items = [...this.items.filter(({ id }) => !updatedIds.includes(id)), ...updatedItems];
      this.loading = false;
      if (replaceDisplay) {
        this.displayItem = updatedItems[0];
      }
    },
  },
};
</script>

