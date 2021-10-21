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
      <v-use-button @click="formComponent = 'v-use-bows'" item="Bows" />
      <v-add-button @click="formComponent = 'v-add-bows'" item="Bows" />
    </div>
    <v-modal v-if="formComponent" @close="formComponent = null" width-class="max-w-lg">
      <div :is="formComponent" @close="formComponent = null" @updated="handleUpdate" :bows="bows"></div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import VBowsTable from "@/components/inventoryComponents/bows/VBowsTable";
import computedBows from "@/mixins/computedBows";
import checkAdmin from "@/mixins/checkAdmin";
import { PropagateLoader } from "@saeris/vue-spinners";
import VCreateButton from "@/components/UI/buttons/VCreateButton";
import VUseButton from "@/components/UI/buttons/VUseButton";
import VAddButton from "@/components/UI/buttons/VAddButton";
import { WithLoading } from "@/util/componentTypes";
import { getBows } from "@/services/bows";
import { GenericOutcome } from "@/util/commonTypes";


// Webstorm stop removing my components!
// VAddBows: () => import("@/components/inventoryComponents/bows/VAddBows"),
//   VUseBows: () => import("@/components/inventoryComponents/bows/VUseBows"),
//   VCreateBow: () => import("@/components/inventoryComponents/bows/VCreateBow"),

interface ComponentState extends WithLoading {
  bows: { id: string, count: string }[],
  formComponent: "v-create-bow" | "v-add-bows" | "v-use-bows" | null
}

export default Vue.extend({
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
    PropagateLoader
  },
  mixins: [computedBows, checkAdmin],
  data(): ComponentState {
    return {
      bows: [],
      formComponent: null,
      loading: false
    };
  },
  async created() {
    this.loading = true;
    const [outcome, bows, message] = await getBows();
    this.loading = false;
    switch (outcome) {
      case GenericOutcome.Ok:
        this.bows = bows;
        break;
      case GenericOutcome.Err:
        this.$toasted.error(message);
        break;
      default:
        this.$toasted.error("Something went wrong", { duration: 2000 });
    }
  },
  methods: {
    handleUpdate({ updatedIds, updatedItems }) {
      this.loading = true;
      this.bows = [...this.bows.filter(({ id }) => !updatedIds.includes(id)), ...updatedItems];
      this.loading = false;
    }
  }
});

</script>

