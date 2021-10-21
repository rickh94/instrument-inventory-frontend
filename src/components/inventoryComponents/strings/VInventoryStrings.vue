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
      <v-create-button @click="formComponent = 'v-create-string'" item="String" />
      <v-use-button @click="formComponent = 'v-use-strings'" item="Strings" />
      <v-add-button @click="formComponent = 'v-add-strings'" item="Strings" />
    </div>
    <v-modal v-if="formComponent" @close="formComponent = null" width-class="max-w-lg">
      <!--suppress HtmlUnknownAttribute -->
      <div
        :is="formComponent"
        @close="formComponent = null"
        @updated="handleUpdate"
        :strings="strings"
      >
      </div>
    </v-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VStringsTable from "@/components/inventoryComponents/strings/layout/VStringsDisplayTable.vue";
import computedStrings from "@/mixins/computedStrings.js";
import checkAdmin from "@/mixins/checkAdmin";
import { PropagateLoader } from "@saeris/vue-spinners";
import VCreateButton from "@/components/UI/buttons/VCreateButton.vue";
import VUseButton from "@/components/UI/buttons/VUseButton.vue";
import VAddButton from "@/components/UI/buttons/VAddButton.vue";
import { WithLoading } from "@/util/componentTypes";
import { InstrumentString } from "@/util/stringTypes";
import { getStrings } from "@/services/stringInventory";
import { GenericOutcome } from "@/util/commonTypes";

interface ComponentState extends WithLoading {
  strings: InstrumentString[],
  formComponent: string | null
}

// noinspection JSUnusedGlobalSymbols
export default Vue.extend({
  name: "VInventoryStrings",
  components: {
    VAddButton,
    VUseButton,
    VCreateButton,
    VModal: () => import("@/components/UI/VModal.vue"),
    VStringsTable,
    VCreateString: () => import("@/components/inventoryComponents/strings/functions/VCreateString.vue"),
    VUseStrings: () => import("@/components/inventoryComponents/strings/functions/VUseStrings.vue"),
    VAddStrings: () => import("@/components/inventoryComponents/strings/functions/VAddStrings.vue"),
    PropagateLoader
  },
  mixins: [computedStrings, checkAdmin],
  data(): ComponentState {
    return {
      strings: [],
      loading: false,
      formComponent: null
    };
  },
  async created(): Promise<void> {
    const [outcome, strings, message] = await getStrings();
    switch (outcome) {
      case GenericOutcome.Ok:
        this.strings = strings;
        break;
      case GenericOutcome.Err:
        this.$toasted.error(message, { duration: 2000 });
        break;
      default:
        this.$toasted.error("Something went wrong", { duration: 1000 });
    }
  },
  methods: {
    handleUpdate({ updatedIds, updatedItems }: { updatedIds: string[], updatedItems: InstrumentString[] }) {
      this.loading = true;
      this.strings = [...this.strings.filter(({ id }) => id && !updatedIds.includes(id)), ...updatedItems];
      this.loading = false;
    }
  }
});
</script>

<style scoped>

</style>
