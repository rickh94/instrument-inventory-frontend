<template>
  <div>
    <div class="flex flex-col md:flex-row items-center md:items-start flex-wrap justify-around mt-4">
      <v-bows-table :bows="violinBows" instrument="Violin"></v-bows-table>
      <v-bows-table :bows="violaBows" instrument="Viola"></v-bows-table>
      <v-bows-table :bows="celloBows" instrument="Cello"></v-bows-table>
      <v-bows-table :bows="bassBows" instrument="Bass"></v-bows-table>
    </div>
    <div class="flex justify-around max-w-lg mx-auto mt-2">
      <button class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white"
      @click.prevent="formComponent = 'v-create-bow'">
        Create Bow
      </button>
      <button class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white">
        Use Bows
      </button>
      <button class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white">
        Add Bows
      </button>
    </div>
    <v-modal v-if="formComponent" @close="formComponent = null" width-class="max-w-lg">
      <div :is="formComponent"></div>
    </v-modal>
  </div>
</template>

<script>
import VBowsTable from '@/components/VBowsTable'
import VCreateBow from '@/components/VCreateBow'
import { API } from 'aws-amplify'
import VModal from '@/components/VModal'

export default {
  name: 'VInventoryBows',
  components: { VModal, VBowsTable, VCreateBow },
  data() {
    return {
      bows: [],
      formComponent: null,
    }
  },
  async created() {
    try {
      const response = await API.get('instrument-inventory', 'bows', {})
      this.bows = response.bows
    } catch (e) {
      this.$toasted.error(e.response.data, { duration: 2000 })
    }
  },
  computed: {
    violinBows() {
      return this.bows.filter(item => item.type === 'Violin').sort(sortBowsBySize)
    },
    violaBows() {
      return this.bows.filter(item => item.type === 'Viola').sort(sortBowsBySize)
    },
    celloBows() {
      return this.bows.filter(item => item.type === 'Cello').sort(sortBowsBySize)
    },
    bassBows() {
      return this.bows.filter(item => item.type === 'Bass').sort(sortBowsBySize)
    },
  },
}

function sortBowsBySize(a, b) {
  if (a.size > b.size) {
    return -1
  }
  if (b.size > a.size) {
    return 1
  }
  return 0
}
</script>

<style scoped>

</style>
