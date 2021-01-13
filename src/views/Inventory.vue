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

<script>
import VInventoryInstruments from '@/components/inventoryComponents/VInventoryInstruments'
import VInventoryBows from '@/components/inventoryComponents/bows/VInventoryBows'
import VInventoryStrings from '@/components/inventoryComponents/strings/VInventoryStrings'
import VInventoryOther from '@/components/inventoryComponents/other/VInventoryOther'

export default {
  components: {VInventoryInstruments, VInventoryBows, VInventoryStrings, VInventoryOther},
  name: 'Inventory',
  data() {
    return {
      tab: 'v-inventory-instruments',
    }
  },
}
</script>

<style scoped>

</style>
