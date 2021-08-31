<template>
  <div>
    <div class="flex h-20 w-full items-center justify-center" v-if="loading">
      <propagate-loader color="#7c3aed"></propagate-loader>
    </div>
    <div class="flex items-start flex-wrap justify-around mt-4" v-else>
      <v-strings-table :strings="violinStrings" instrument="Violin"></v-strings-table>
      <v-strings-table :strings="violaStrings" instrument="Viola"></v-strings-table>
      <v-strings-table :strings="celloStrings" instrument="Cello"></v-strings-table>
      <v-strings-table :strings="bassStrings" instrument="Bass"></v-strings-table>
    </div>
    <div class="flex justify-around max-w-lg mx-auto mt-2">
      <v-create-button @click="formComponent = 'v-create-string'" item="String"/>
      <v-use-button @click="formComponent = 'v-use-strings'" item="Strings"/>
      <v-add-button @click="formComponent = 'v-add-strings'" item="Strings"/>
    </div>
    <v-modal v-if="formComponent" @close="formComponent = null" width-class="max-w-lg">
      <div :is="formComponent" @close="formComponent = null" @updated="handleUpdate" :strings="strings"></div>
    </v-modal>
  </div>
</template>

<script>
import VStringsTable from "@/components/inventoryComponents/strings/layout/VStringsDisplayTable.vue";
import computedStrings from "@/mixins/computedStrings.js";
import checkAdmin from "@/mixins/checkAdmin.js";
import { API } from "aws-amplify";
import { PropagateLoader } from "@saeris/vue-spinners";
import VCreateButton from "@/components/UI/buttons/VCreateButton";
import VUseButton from "@/components/UI/buttons/VUseButton";
import VAddButton from "@/components/UI/buttons/VAddButton";

export default {
  name: "VInventoryStrings",
  components: {
    VAddButton,
    VUseButton,
    VCreateButton,
    VModal: () => import("@/components/UI/VModal"),
    VStringsTable,
    VCreateString: () => import("@/components/inventoryComponents/strings/functions/VCreateString.vue"),
    VUseStrings: () => import("@/components/inventoryComponents/strings/functions/VUseStrings.vue"),
    VAddStrings: () => import("@/components/inventoryComponents/strings/functions/VAddStrings.vue"),
    PropagateLoader
  },
  mixins: [computedStrings, checkAdmin],
  data() {
    return {
      strings: [],
      loading: false,
      formComponent: null
    };
  },
  async created() {
    try {
      this.loading = true;
      const response = await API.get("instrument-inventory", "strings", {});
      this.strings = response.strings;
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
      this.strings = [...this.strings.filter(({ id }) => !updatedIds.includes(id)), ...updatedItems];
      this.loading = false;
    }
  }
};
</script>

<style scoped>

</style>
