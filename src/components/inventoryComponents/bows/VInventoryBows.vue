<template>
  <div>
    <div class="flex h-20 w-full items-center justify-center" v-if="loading">
      <propagate-loader color="#7c3aed"></propagate-loader>
    </div>
    <div v-else class="flex items-start flex-wrap justify-around mt-4">
      <v-bows-table :bows="violinBows" instrument="Violin"></v-bows-table>
      <v-bows-table :bows="violaBows" instrument="Viola"></v-bows-table>
      <v-bows-table :bows="celloBows" instrument="Cello"></v-bows-table>
      <v-bows-table :bows="bassBows" instrument="Bass"></v-bows-table>
    </div>
    <div class="flex justify-around max-w-lg mx-auto mt-2">
      <v-create-button @click="formComponent = 'v-create-bow'" item="Bow" />
      <!--        class="bg-gradient-to-tr from-purple-600 to-purple-400 hover:from-purple-800  py-2 px-3 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white font-bold inline-flex items-center">-->
      <v-use-button  @click="formComponent = 'v-use-bows'" item="Bows" />
      <v-add-button @click="formComponent = 'v-add-bows'" item="Bows" />
    </div>
    <v-modal v-if="formComponent" @close="formComponent = null" width-class="max-w-lg">
      <div :is="formComponent" @close="formComponent = null" @updated="handleUpdate" :bows="bows"></div>
    </v-modal>
  </div>
</template>

<script>
import VBowsTable from "@/components/inventoryComponents/bows/VBowsTable";
import { API } from "aws-amplify";
import computedBows from "@/mixins/computedBows";
import checkAdmin from "@/mixins/checkAdmin";
import { PropagateLoader } from "@saeris/vue-spinners";
import VCreateButton from "@/components/UI/buttons/VCreateButton";
import VUseButton from "@/components/UI/buttons/VUseButton";
import VAddButton from "@/components/UI/buttons/VAddButton";


// Webstorm stop removing my components!
// VAddBows: () => import("@/components/inventoryComponents/bows/VAddBows"),
//   VUseBows: () => import("@/components/inventoryComponents/bows/VUseBows"),
//   VCreateBow: () => import("@/components/inventoryComponents/bows/VCreateBow"),

export default {
  name: "VInventoryBows",
  components: {
    VAddButton,
    VUseButton,
    VCreateButton,
    VModal: () => import("@/components/UI/VModal.vue"),
    VAddBows: () => import("@/components/inventoryComponents/bows/VAddBows"),
    VUseBows: () => import("@/components/inventoryComponents/bows/VUseBows"),
    VCreateBow: () => import("@/components/inventoryComponents/bows/VCreateBow"),
    VBowsTable,
    PropagateLoader,
  },
  mixins: [computedBows, checkAdmin],
  data() {
    return {
      bows: [],
      formComponent: null,
      loading: false,
    };
  },
  async created() {
    try {
      this.loading = true;
      const response = await API.get("instrument-inventory", "bows", {});
      this.bows = response.bows;
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
    handleUpdate({ updatedIds, updatedItems }) {
      this.loading = true;
      this.bows = [...this.bows.filter(({ id }) => !updatedIds.includes(id)), ...updatedItems];
      this.loading = false;
    },
  },
};

</script>

