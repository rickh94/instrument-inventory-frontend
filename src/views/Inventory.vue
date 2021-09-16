<template>
  <div class="mx-4 mb-20 mt-4 shadow p-4">
    <div class="flex items-end justify-center">
      <button class="appearance-none text-lg border-b px-4 py-1 font-bold  hover:text-purple-500"
              :class="tab === 'v-inventory-instruments' ? 'border-purple-600 text-purple-600' : 'border-gray-800 text-gray-800'"
              @click="tab = 'v-inventory-instruments'">
        Instruments
      </button>
      <button class="appearance-none text-lg border-b px-4 py-1 font-bold hover:text-purple-500"
              :class="tab === 'v-inventory-bows' ? 'border-purple-600 text-purple-600' : 'border-gray-800 text-gray-800'"
              @click="tab = 'v-inventory-bows'">
        Bows
      </button>
      <button class="appearance-none text-lg border-b px-4 py-1 font-bold hover:text-purple-500"
              :class="tab === 'v-inventory-strings' ? 'border-purple-600 text-purple-600' : 'border-gray-800 text-gray-800'"
              @click="tab = 'v-inventory-strings'">
        Strings
      </button>
      <button class="appearance-none text-lg border-b px-4 py-1 font-bold hover:text-purple-500"
              :class="tab === 'v-inventory-other' ? 'border-purple-600 text-purple-600' : 'border-gray-800 text-gray-800'"
              @click="tab = 'v-inventory-other'">
        Other
      </button>
    </div>
    <div :is="tab"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

interface ComponentState {
  tab: string,
}

// noinspection JSUnusedGlobalSymbols
export default Vue.extend({
  components: {
    VInventoryInstruments: () => import("@/components/inventoryComponents/VInventoryInstruments.vue"),
    VInventoryBows: () => import("@/components/inventoryComponents/bows/VInventoryBows.vue"),
    VInventoryStrings: () => import("@/components/inventoryComponents/strings/VInventoryStrings.vue"),
    VInventoryOther: () => import("@/components/inventoryComponents/other/VInventoryOther.vue")
  },
  name: "Inventory",
  data(): ComponentState {
    return {
      tab: "v-inventory-instruments"
    };
  }
});
</script>

<style scoped>

</style>
